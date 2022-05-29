<?php

namespace App\Services\Business;

use App\Models\Asset;
use App\Models\Assignment;
use App\Models\User;
use App\Services\Contracts\AssetServiceContract;
use App\Services\Contracts\AssignmentServiceContract;
use App\Services\Contracts\UserServiceContract;
use App\Services\Utils\CheckAsset;
use App\Services\Utils\CheckAssignment;
use App\Services\Utils\CheckLocation;
use App\Services\Utils\CheckUser;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Symfony\Component\Routing\Exception\InvalidParameterException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;

class AssignmentService implements AssignmentServiceContract
{
    protected $assignmentModel;
    protected $userService;
    protected $assetService;

    private $max_date;
    private $is_updated_assign_date = false;

    public function __construct(
        Assignment $assignmentModel,
        UserServiceContract $userService,
        AssetServiceContract $assetService
    ) {
        $this->assignmentModel = $assignmentModel;
        $this->userService = $userService;
        $this->assetService = $assetService;
    }

    public function index($conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $states = $conditions->get('states');
        $date = $conditions->get('date');
        $sort_type = $conditions->get('sort_type') ?? 'id';
        $sort_value = $conditions->get('sort_value') ?? 'asc';
        $search = $conditions->get('search');

        $auth_user = request()->user();
        $auth_location_id = $auth_user->location_id;

        $assignments = $this->assignmentModel
            ->select('assignments.*', 'assets.asset_name', 'assets.asset_code', 'users.username')
            ->where('assignments.location_id', $auth_location_id)
            ->join('assets', 'assets.id', '=', "asset_id")
            ->join('users', 'users.id', '=', 'assigned_to');

        if (!empty($date)) {
            $assignments->where('assign_date', $date);
        }

        if (!empty($states)) {
            $assignments->whereIn('assignments.state_key', $states);
        }

        if ($search !== null) {
            $search = strtoupper($search);
            $assignments->where(function ($q) use ($search) {
                return $q->where(DB::raw('UPPER(asset_name)'), 'like', "%$search%")
                    ->orWhere(DB::raw('UPPER(asset_code)'), 'like', "%$search%")
                    ->orWhere(DB::raw('UPPER(username)'), 'like', "%$search%");
            });
        }

        $assignments = static::sortBuilder($sort_type, $sort_value, $assignments);

        return $assignments->paginate($per_page);
    }

    public function show(Assignment $assignment): Assignment
    {
        return $assignment;
    }

    public function getAllStates(): Collection
    {
        $collection = collect(Assignment::STATE_NAMES);

        return $collection->map(function ($name, $key) {
            return [
                "state_key" => $key,
                "state_name" => $name
            ];
        })->values();
    }

    public function update(Assignment $assignment, $data): bool
    {
        $will_assign_user = $this->userService->find($data['assigned_to']);
        $will_assign_asset = $this->assetService->find($data['asset_id']);

        $this->max_date = max([
            $assignment->assign_date,
            $will_assign_user->joined_date,
            $will_assign_asset->installed_date
        ]);

        if ($assignment->assign_date->lt($this->max_date)) {
            $this->is_updated_assign_date = true;
        }

        CheckLocation::makeCheck($will_assign_user);

        CheckAssignment::makeSureStateIs(
            $assignment,
            Assignment::WAITING_FOR_ACCEPTANCE,
            "You can't do any actions on an assignment which has been responded by user"
        );

        CheckUser::makeSureNotIsMyself($will_assign_user);

        if ($assignment->asset_id != $data['asset_id']) {
            CheckLocation::makeCheck($will_assign_asset);

            CheckAsset::makeSureStateIs(
                $will_assign_asset,
                Asset::AVAILABLE,
                "You can't create an assignment with asset has not been available"
            );

            $assignment->asset->update(['state_key' => Asset::AVAILABLE]);
            $will_assign_asset->update(['state_key' => Asset::ASSIGNED]);
        }

        $result = $assignment->update(array_merge(
            $data,
            ['assign_date' => $this->max_date]
        ));

        $assignment->refresh();

        return $result;
    }

    public function store($data): Assignment
    {
        $will_assign_user = $this->userService->find($data['assigned_to']);
        $will_assign_asset = $this->assetService->find($data['asset_id']);

        static::makeSureReadyForAssignment($will_assign_user, $will_assign_asset);

        $assignment = $this->assignmentModel->create($data);
        $this->assetService->update($will_assign_asset, ["state_key" => Asset::ASSIGNED]);

        return $assignment;
    }

    public function destroy(Assignment $assignment): bool
    {
        CheckLocation::makeCheck($assignment);
        static::makeSureCanDelete($assignment);

        $is_deleted_assign = $assignment->delete();
        $assignment->asset->update(["state_key" => Asset::AVAILABLE]);

        return $is_deleted_assign;
    }

    private static function makeSureCanDelete(Assignment $assignment)
    {
        if (!in_array($assignment->state_key, Assignment::getCanDeleteStates())) {
            throw new InvalidParameterException(
                "You can't delete this assignment",
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    private static function makeSureReadyForAssignment(User $will_assign_user, Asset $will_assign_asset)
    {
        CheckLocation::makeCheck([$will_assign_user, $will_assign_asset]);

        CheckAsset::makeSureStateIs(
            $will_assign_asset,
            Asset::AVAILABLE,
            "You can't create an assignment with asset has not been available"
        );

        CheckUser::makeSureNotIsMyself($will_assign_user);
    }

    public function myAssignments($conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $sort_type = $conditions->get('sort_type') ?? 'id';
        $sort_value = $conditions->get('sort_value') ?? 'asc';

        $auth_user = request()->user();
        $auth_user_id = $auth_user->id;

        $assignments = $this->assignmentModel
            ->select(
                'assignments.*',
                'assets.asset_name',
                'assets.asset_code',
                'users.username',
                'categories.category_name'
            )
            ->with('asset.category', 'assignedToUser', 'assignedByUser')
            ->join('assets', 'assets.id', '=', "asset_id")
            ->join('users', 'users.id', '=', 'assigned_to')
            ->join('categories', 'categories.id', '=', 'assets.category_id')
            ->where('assigned_to', $auth_user_id)
            ->where('assign_date', '<=', DB::raw('CURRENT_DATE'))
            ->whereIn('assignments.state_key', Assignment::getStatesDisplayOnHome());

        $assignments = static::sortBuilder($sort_type, $sort_value, $assignments);

        return $assignments->paginate($per_page);
    }

    private static function sortBuilder(string $sort_type, string $sort_value, $query)
    {
        switch ($sort_type) {
            case 'asset_code':
            case 'asset_name':
            case 'assign_date':
            case 'category_name':
                $query->orderBy($sort_type, $sort_value);
                break;

            case 'state_name':
                $query->orderBy('state_key', $sort_value);
                break;

            case 'to_username':
                $query->join('users as assign_to', 'assignments.assigned_to', '=', 'assign_to.id');
                $query->orderBy('assign_to.username', $sort_value);
                break;

            case 'by_username':
                $query->join('users as assign_by', 'assignments.assigned_by', '=', 'assign_by.id');
                $query->orderBy('assign_by.username', $sort_value);
                break;

            case 'id':
            default:
                $query->orderBy('assignments.id', $sort_value);
                break;
        }

        return $query;
    }

    public function find(int $id): Assignment
    {
        try {
            return $this->assignmentModel->findOrFail($id);
        } catch (Exception $e) {
            throw new InvalidParameterException(
                'Assigment not found',
                Response::HTTP_NOT_FOUND
            );
        }
    }

    public function response(Assignment $assignment, $data): bool
    {
        CheckLocation::makeCheck($assignment);

        CheckAssignment::makeSureOwnAssignment($assignment);

        CheckAssignment::makeSureStateIs(
            $assignment,
            Assignment::WAITING_FOR_ACCEPTANCE,
            "You can't response assignment which not is waiting for response"
        );

        switch ($data['state_key']) {
            case Assignment::DECLINED:
                $assignment->update([
                    "state_key" => Assignment::DECLINED,
                ]);
                $this->assetService->updateState(
                    $assignment->asset,
                    Asset::AVAILABLE
                );
                break;
            case Assignment::ACCEPTED:
                $assignment->update([
                    "state_key" => Assignment::ACCEPTED,
                    "assign_date" => Carbon::today()
                ]);
                break;
        }
        return true;
    }

    public function getMaxDate(): Carbon
    {
        return $this->max_date;
    }

    public function isUpdatedAssignDate(): bool
    {
        return $this->is_updated_assign_date;
    }

    public function updateState(Assignment $assignment, $state): bool
    {
        CheckLocation::makeCheck($assignment);

        return $assignment->update(['state_key' => $state]);
    }
}
