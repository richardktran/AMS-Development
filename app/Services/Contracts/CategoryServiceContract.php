<?php

namespace App\Services\Contracts;

use App\Models\Category;
use Illuminate\Support\Collection;

interface CategoryServiceContract
{
    public function store($data);
    public function find($category_id): Category;
    public function show(Category $category): Category;
    public function index(?array $condition): Collection;
}
