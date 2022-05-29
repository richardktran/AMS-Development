<?php

namespace App\Services\Business;

use App\Models\Asset;
use App\Services\Contracts\CategoryServiceContract;
use App\Models\Category;
use App\Services\Utils\CheckLocation;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class CategoryService implements CategoryServiceContract
{
    protected $categoryModel;

    public function __construct(Category $categoryModel, Asset $assetModel)
    {
        $this->categoryModel = $categoryModel;
        $this->assetModel = $assetModel;
    }

    public function store($data)
    {
        return $this->categoryModel->create(
            [
                "category_prefix" => strtoupper($data['category_prefix']),
                "category_name" => ucfirst($data['category_name']),
                "location_id" => request()->user()->location_id
            ]
        );
    }

    public function index(?array $condition): Collection
    {
        $auth_user = request()->user();
        $auth_location_id = $auth_user->location_id;

        return $this->categoryModel
            ->where('categories.location_id', $auth_location_id)
            ->orderBy('category_name')
            ->get();
    }

    public function show(Category $category): Category
    {
        CheckLocation::makeCheck($category);

        return $category;
    }

    public function find($category_id): Category
    {
        try {
            return $this->categoryModel->findOrFail($category_id);
        } catch (Exception $e) {
            throw new InvalidParameterException(
                "Category not found",
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
