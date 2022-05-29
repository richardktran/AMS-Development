<?php

namespace App\Services\Business;

use App\Exceptions\ForbiddenException;
use App\Models\Assignment;
use App\Models\Returning;
use App\Models\Asset;
use App\Services\Contracts\ReturningServiceContract;
use App\Services\Utils\CheckAssignment;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use App\Services\Utils\CheckLocation;
use App\Services\Utils\CheckReturning;
use Carbon\Carbon;

class ReturningService implements ReturningServiceContract
{
    protected $returnModel;
    protected $assignmentService;
    protected $assetService;

    public function __construct(
        Returning $returnModel,
        AssignmentService $assignmentService,
        AssetService $assetService
    ) {
        $this->returnModel = $returnModel;
        $this->assignmentService = $assignmentService;
        $this->assetService = $assetService;
    }

    public function index($conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $states = $conditions->get('states');
        $date = $conditions->get('date');
        $sort_type = $conditions->get('sort_type');
        $sort_value = $conditions->get('sort_value') ?? 'asc';
        $search = $conditions->get('search');

        $auth_user = request()->user();
        $auth_location_id = $auth_user->location_id;

        $returnModel = $this->returnModel
            ->select(
                'returnings.*',
                'assignments.assign_date',
                'assets.asset_name',
                'assets.asset_code',
                'requested_user.username as requested_by_username',
                'accepted_user.username as accepted_by_username'
            )
            ->where('assignments.location_id', $auth_location_id)
            ->join('assignments', 'assignments.id', '=', "returnings.assignment_id")
            ->join('assets', 'assets.id', '=', "assignments.asset_id")
            ->join('users as requested_user', 'returnings.requested_by', '=', "requested_user.id")
            ->leftJoin('users as accepted_user', 'returnings.accepted_by', '=', 'accepted_user.id');

        if (!empty($date)) {
            $returnModel->where('returnings.returned_date', $date);
        }

        if (!empty($states)) {
            $returnModel->whereIn('returnings.state_key', $states);
        }

        if ($search !== null) {
            $search = strtoupper($search);
            $returnModel->where(function ($q) use ($search) {
                return $q->where(DB::raw('UPPER(assets.asset_name)'), 'like', "%$search%")
                    ->orWhere(DB::raw('UPPER(assets.asset_code)'), 'like', "%$search%")
                    ->orWhere(DB::raw('UPPER(requested_user.username)'), 'like', "%$search%");
            });
        }

        switch ($sort_type) {
            case 'asset_code':
            case 'asset_name':
            case 'assign_date':
                $returnModel->orderBy($sort_type, $sort_value);
                break;

            case 'returned_date':
                $returnModel->orderByRaw("returned_date $sort_value nulls last");
                break;

            case 'state_name':
                $returnModel->orderBy('state_key', $sort_value);
                break;

            case 'accepted_by_username':
                $returnModel->orderByRaw("accepted_user.username $sort_value nulls last");
                break;

            case 'requested_by_username':
                $returnModel->orderBy('requested_user.username', $sort_value);
                break;

            case 'id':
            default:
                $returnModel->orderBy('returnings.id', $sort_value);
                break;
        }

        return $returnModel->paginate($per_page);
    }

    public function getAllStates(): Collection
    {
        $collection = collect(Returning::STATE_NAMES);

        return $collection->map(function ($name, $key) {
            return [
                "state_key" => $key,
                "state_name" => $name
            ];
        })->values();
    }

    public function store(Assignment $assignment): Returning
    {
        $user = request()->user();

        if ($user->is_admin == false && $assignment->assigned_to != $user->id) {
            throw new ForbiddenException("You don't have permission to create returning request for this assignment");
        }

        CheckAssignment::makeSureStateIs(
            $assignment,
            Assignment::ACCEPTED,
            'You can only return on ACCEPTED assignment'
        );

        $return = $this->returnModel->create([
            'assignment_id' => $assignment->id,
            'requested_by' => request()->user()->id
        ]);

        $assignment->update([
            'state_key' => Assignment::WAITING_FOR_RETURNING
        ]);

        return $return;
    }

    public function complete(Returning $returning): bool
    {
        self::makeSureCanResponse($returning);

        $returning->update([
            'state_key' => Returning::COMPLETED,
            'returned_date' => Carbon::today(),
            'accepted_by' => request()->user()->id
        ]);

        $this->assignmentService->destroy($returning->assignment);

        return true;
    }

    public function cancel(Returning $returning): bool
    {
        self::makeSureCanResponse($returning);

        $this->assignmentService->updateState($returning->assignment, Assignment::ACCEPTED);

        return $returning->delete();
    }

    public static function makeSureCanResponse(Returning $returning)
    {
        CheckReturning::makeSureStateIs(
            $returning,
            Returning::WAITING_FOR_RETURNING,
            "You can't do any action in return request not in Waiting state"
        );

        CheckLocation::makeCheck($returning->assignment);
    }
}
