<?php

namespace App\Services\Business;

use App\Helper\Str;
use App\Models\Assignment;
use App\Models\Role;
use App\Models\User;
use App\Services\Contracts\UserServiceContract;
use App\Services\Utils\CheckLocation;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Routing\Exception\InvalidParameterException;

class UserService implements UserServiceContract
{
    protected $user;
    protected $assignmentModel;

    private $is_updated_assignment = false;

    public function __construct(User $userModel, Assignment $assignmentModel)
    {
        $this->userModel = $userModel;
        $this->assignmentModel = $assignmentModel;
    }

    public function index($conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $filter = $conditions->get('filter');
        $sort_type = $conditions->get('sort_type');
        $sort_value = $conditions->get('sort_value') ?? 'asc';
        $search = $conditions->get('search');

        $auth_user = request()->user();
        $auth_location_id = $auth_user->location_id;
        $auth_user_id = $auth_user->id;

        $users = $this->userModel
            ->where('location_id', $auth_location_id)
            ->where('id', '!=', $auth_user_id);

        if ($filter != null && count($filter) > 0) {
            $users->whereIn('role_id', $filter);
        }

        switch ($sort_type) {
            case 'staff_code':
            case 'username':
            case 'joined_date':
                $users->orderBy($sort_type, $sort_value);
                break;
            case 'full_name':
                $users->orderBy('first_name', $sort_value)->orderBy('last_name', $sort_value);
                break;
            case 'type':
                $users->addSelect([
                    'role_name' => Role::select('role_name')
                        ->whereColumn('id', 'users.role_id')
                        ->limit(1),
                ]);
                $users->orderBy('role_name', $sort_value);
                break;
            default:
                $users->orderBy('staff_code', 'desc');
                break;
        }


        if ($search !== null) {
            $search = strtoupper($search);
            $users->where(function ($q) use ($search) {
                return $q
                    ->where(DB::raw("UPPER(concat(first_name, ' ', last_name))"), 'like', "%$search%")
                    ->orWhere('staff_code', 'like', "%$search%");
            });
        }

        return $users->paginate($per_page);
    }

    public function show($user): User
    {
        CheckLocation::makeCheck($user);

        return $user;
    }

    public function update(User $user, $data): bool
    {
        CheckLocation::makeCheck($user);

        $data = collect($data);

        if ($data->has('password')) {
            $data = $data->merge([
                'password' => Hash::make($data['password'])
            ]);
        }

        if ($data->has('role_id')) {
            $this->destroyChangeStaffToken($user, $data);
        }

        if ($data->has('joined_date')) {
            $this->updateOldAssignmentAssignDate($user, $data['joined_date']);
        }

        $user->update($data->all());

        return true;
    }

    private function destroyChangeStaffToken(User $user, $data)
    {
        if ($user->role_id != $data['role_id']) {
            foreach ($user->tokens as $token) {
                $token->revoke();
            }
        }
    }

    public function find($user_id): User
    {
        $user = $this->userModel->findOrFail($user_id);

        return $user;
    }

    public function store($data): User
    {
        $dob = Carbon::parse($data['birthday']);

        $first_name = Str::standardizedString($data['first_name']);

        $last_name = Str::standardizedString($data['last_name']);

        $base_username = $this->createBaseUsername($first_name, $last_name);

        $user = User::create(
            [
                "first_name" => $first_name,
                "last_name" => $last_name,
                "base_username" => $base_username,
                "birthday" => $data['birthday'],
                "joined_date" => $data['joined_date'],
                "role_id" => $data['role_id'],
                "location_id" => $data['location_id'],
                "gender" => $data['gender']
            ]
        );

        $id = $user->id;

        $username = $this->createNewUserName($first_name, $last_name, $id);

        $staff_code = $this->createNewStaffCode($id);

        $password = Hash::make($this->generatePassword($username, $dob));

        $user->update(["staff_code" => $staff_code, "username" => $username, "password" => $password]);

        return $user;
    }

    protected function createBaseUsername(string $first_name, string $last_name): string
    {
        $first_name = str_replace(' ', '', strtolower($first_name));

        $last_name = strtolower($last_name);

        $words_of_last_name = explode(" ", $last_name);

        $acronym = "";

        foreach ($words_of_last_name as $word) {
            $acronym .= substr($word, 0, 1);
        }

        return $first_name . $acronym;
    }

    protected function createNewUserName(string $first_name, string $last_name, int $id): string
    {
        $username = static::createBaseUsername($first_name, $last_name);

        $count_duplicate_name = $this->userModel->where('base_username', $username)->where('id', '<', $id)->count();

        if ($count_duplicate_name > 0) {
            $username .= $count_duplicate_name;
        }

        return $username;
    }

    protected function createNewStaffCode(int $id): string
    {
        return sprintf('SD%04d', $id);
    }

    protected function generatePassword(string $username, Carbon $birthday): string
    {
        $part_of_password = $birthday->format('dmY');
        $password = $username . '@' . $part_of_password;

        return $password;
    }

    public function makeSureNotOwnAssignment(User $user)
    {
        $check = $user->availableAssignments()->exists();

        if ($check) {
            throw new InvalidParameterException(
                'There are valid assignments belonging to this user!',
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function disableUser(User $user): User
    {
        CheckLocation::makeCheck($user);

        $this->makeSureNotOwnAssignment($user);

        $user = $this->find($user->id);
        if ($user) {
            $is_user_deleted = $user->delete();
            if (!$is_user_deleted) {
                throw new InvalidParameterException(
                    'There is an error when you disable this user!',
                    Response::HTTP_INTERNAL_SERVER_ERROR
                );
            }
        }

        return $user;
    }

    public function isUserCanDisable(User $user): bool
    {
        $this->makeSureNotOwnAssignment($user);

        return true;
    }

    public function updateOldAssignmentAssignDate(User $user, $new_date): void
    {
        $assignment_will_update = $this->assignmentModel
            ->where('assigned_to', '=', $user->id)
            ->where('assign_date', '<', $new_date);

        if ($assignment_will_update->count() > 0) {
            $assignment_will_update->update(['assign_date' => $new_date]);
            $this->is_updated_assignment = true;
        }
    }

    public function isUpdatedAssignment(): bool
    {
        return $this->is_updated_assignment;
    }
}
