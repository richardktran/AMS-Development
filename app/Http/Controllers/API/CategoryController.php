<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStore;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\Contracts\CategoryServiceContract;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryServiceContract $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->index(null);

        return CategoryResource::collection($categories);
    }

    public function show(Category $category)
    {
        $category = $this->categoryService->show($category);

        return response([
            'category' => new CategoryResource($category)
        ], Response::HTTP_OK);
    }

    public function store(CategoryStore $request)
    {
        $validated_request = $request->validated();

        $category = $this->categoryService->store($validated_request);

        return response([
            "message" => "Created category successfully",
            "category" => new CategoryResource($category)
        ], Response::HTTP_CREATED);
    }
}
