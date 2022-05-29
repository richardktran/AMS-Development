<?php

namespace App\Services\Business;

use App\Models\Asset;
use App\Models\Category;
use App\Services\Contracts\AssetServiceContract;
use App\Services\Contracts\CategoryServiceContract;
use App\Services\Utils\CheckAsset;
use App\Services\Utils\CheckLocation;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class AssetService implements AssetServiceContract
{
    protected $assetModel;
    protected $categoryService;

    public function __construct(Asset $assetModel, CategoryServiceContract $categoryService)
    {
        $this->assetModel = $assetModel;
        $this->categoryService = $categoryService;
    }

    public function index(?array $conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $states = $conditions->get('states');
        $categories = $conditions->get('categories');
        $sort_type = $conditions->get('sort_type');
        $sort_value = $conditions->get('sort_value') ?? 'asc';
        $search = $conditions->get('search');

        $auth_user = request()->user();
        $auth_location_id = $auth_user->location_id;


        $assets = $this->assetModel
            ->with('category')
            ->select('assets.*')
            ->where('assets.location_id', $auth_location_id);

        if (!empty($states)) {
            $assets->whereIn('state_key', $states);
        }

        if (!empty($categories)) {
            $assets->whereIn('category_id', $categories);
        }

        if ($search !== null) {
            $search = strtoupper($search);
            $assets->where(function ($q) use ($search) {
                return $q->where(DB::raw('UPPER(asset_name)'), 'like', "%$search%")
                    ->orWhere('asset_code', 'like', "%$search%");
            });
        }

        switch ($sort_type) {
            case 'category_name':
                $assets->join('categories', 'assets.category_id', '=', 'categories.id');
                $assets->orderBy('categories.category_name', $sort_value);
                break;

            case 'state_name':
                $assets->orderBy('state_key', $sort_value);
                break;

            case 'asset_code':
            case 'asset_name':
                $assets->orderBy($sort_type, $sort_value);
                break;

            default:
                $assets->orderBy('id', 'desc');
                break;
        }

        return $assets->paginate($per_page);
    }

    public function find($asset_id): Asset
    {
        try {
            return $this->assetModel->findOrFail($asset_id);
        } catch (Exception $e) {
            throw new InvalidParameterException(
                "Asset not found",
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function show(Asset $asset): Asset
    {
        CheckLocation::makeCheck($asset);

        return $asset;
    }


    public function store($data): Asset
    {
        $data = collect($data);

        $category = $this->categoryService->find($data->get('category_id'));
        CheckLocation::makeCheck($category);

        $asset = $this->assetModel->create($data->toArray());

        $asset_code = $this->createNewAssetCode($data['category_id'], $asset->id);
        $asset->update(['asset_code' => $asset_code]);

        return $asset;
    }

    public function update(Asset $asset, $data): bool
    {
        $data = collect($data);

        CheckAsset::makeSureStateIsNot(
            $asset,
            Asset::ASSIGNED,
            "You can't do any actions on an asset has been assigned"
        );

        return $asset->update($data->toArray());
    }

    public function destroy(Asset $asset): bool
    {
        $this->makeSureCanDelete($asset);

        return $asset->delete();
    }

    private function createNewAssetCode($category_id, $id)
    {
        $category_prefix = Category::find($category_id)->category_prefix;
        return sprintf('%s%06d', $category_prefix, $id);
    }

    public function makeSureCanDelete(Asset $asset): void
    {
        CheckLocation::makeCheck($asset);

        CheckAsset::makeSureStateIsNot(
            $asset,
            Asset::ASSIGNED,
            "You can't do any actions on an asset has been assigned"
        );

        CheckAsset::makeSureNeverHasAssign(
            $asset,
            "Cannot delete the asset because it belongs to one or more historical assignments"
        );
    }

    public function getAllStates(): Collection
    {
        return collect(Asset::STATE_NAMES)->map(function ($value, $key) {
            return [
                'state_key' => $key,
                'state_name' => $value
            ];
        })->values();
    }

    public function updateState(Asset $asset, $state): bool
    {
        CheckLocation::makeCheck($asset);

        return $asset->update(['state_key' => $state]);
    }
}
