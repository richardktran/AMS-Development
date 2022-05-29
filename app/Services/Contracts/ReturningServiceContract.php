<?php

namespace App\Services\Contracts;

use App\Models\Assignment;
use App\Models\Returning;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ReturningServiceContract
{
    public function index(array $conditions): LengthAwarePaginator;
    public function getAllStates(): Collection;
    public function store(Assignment $assignment): Returning;
    public function complete(Returning $returning): bool;
    public function cancel(Returning $returning): bool;
}
