<?php

namespace App\Services\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserServiceContract
{
    public function disableUser(User $user): User;
    public function isUserCanDisable(User $user): bool;
    public function find(int $user_id): User;
    public function show(User $user): User;
    public function index(array $conditions): LengthAwarePaginator;
    public function store($data): User;
    public function update(User $user, $data): bool;
    public function isUpdatedAssignment(): bool;
}
