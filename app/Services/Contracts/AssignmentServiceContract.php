<?php

namespace App\Services\Contracts;

use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AssignmentServiceContract
{
    public function index(array $conditions): LengthAwarePaginator;
    public function show(Assignment $asset): Assignment;
    public function getAllStates(): Collection;
    public function update(Assignment $assignment, $data): bool;
    public function store($data): Assignment;
    public function destroy(Assignment $assignment): bool;
    public function myAssignments(array $conditions): LengthAwarePaginator;
    public function find(int $id): Assignment;
    public function response(Assignment $assignment, $data): bool;
    public function getMaxDate(): Carbon;
    public function isUpdatedAssignDate(): bool;
    public function updateState(Assignment $assignment, $state): bool;
}
