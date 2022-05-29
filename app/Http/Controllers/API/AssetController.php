<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssetIndexRequest;
use App\Http\Resources\CategoryResource;
use App\Services\Contracts\CategoryServiceContract;
use Illuminate\Http\Request;
use App\Http\Requests\AssetStoreRequest;
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use App\Services\Contracts\AssetServiceContract;
use Illuminate\Http\Response;
use App\Http\Requests\AssetUpdateRequest;

class AssetController extends Controller
{
    protected $assetService;
    protected $categoryService;

    public function __construct(AssetServiceContract $assetService, CategoryServiceContract $categoryService)
    {
        $this->assetService = $assetService;
        $this->categoryService = $categoryService;
    }

    public function index(AssetIndexRequest $request)
    {
        if ($request->has('meta')) {
            return $this->getMetaData();
        }

        $conditions = $request->validated();

        $assets = $this->assetService->index($conditions);
        return AssetResource::collection($assets);
    }

    public function getMetaData()
    {
        $categories = $this->categoryService->index(null);
        $states = $this->assetService->getAllStates();

        return response([
            "categories" => new CategoryResource($categories),
            "states" => $states
        ]);
    }

    public function show(Asset $asset)
    {
        $asset = $this->assetService->show($asset);

        return response([
            'asset' => new AssetResource($asset)
        ], Response::HTTP_OK);
    }

    public function store(AssetStoreRequest $request)
    {
        $data = $request->validated();
        $location_id = $request->user()->location_id;

        $asset = $this->assetService->store(array_merge(
            $data,
            ['location_id' => $location_id]
        ));

        return response([
            'message' => 'Created asset successfully',
            'asset' => new AssetResource($asset)
        ], Response::HTTP_CREATED);
    }

    public function update(AssetUpdateRequest $request, Asset $asset)
    {
        $data = $request->validated();
        $this->assetService->update($asset, $data);

        return response([
            'message' => 'Edited asset successfully',
            'asset' => new AssetResource($asset)
        ], Response::HTTP_OK);
    }

    public function destroy(Asset $asset, Request $request)
    {
        if ($request->has('confirm')) {
            $this->assetService->makeSureCanDelete($asset);

            return response([
                'message' => 'Can delete this asset'
            ], Response::HTTP_OK);
        }

        $this->assetService->destroy($asset);

        return response([
            'message' => 'Deleted asset successfully'
        ], Response::HTTP_OK);
    }
}
