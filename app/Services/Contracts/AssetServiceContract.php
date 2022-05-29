<?php

namespace App\Services\Contracts;

use App\Models\Asset;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AssetServiceContract
{
    public function index(?array $conditions): LengthAwarePaginator;
    public function find(int $asset_id): Asset;
    public function show(Asset $asset): Asset;
    public function store($data): Asset;
    public function update(Asset $asset, $data): bool;
    public function updateState(Asset $asset, $state): bool;
    public function destroy(Asset $asset): bool;
    public function makeSureCanDelete(Asset $asset): void;
    public function getAllStates(): Collection;
}
