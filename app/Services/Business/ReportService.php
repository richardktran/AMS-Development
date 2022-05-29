<?php

namespace App\Services\Business;

use App\Models\Asset;
use App\Models\Category;
use App\Services\Contracts\ReportServiceContract;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;
use Carbon\Carbon;

class ReportService implements ReportServiceContract
{
    protected $categoryModel;

    public function __construct(Category $categoryModel)
    {
        $this->categoryModel = $categoryModel;
    }

    private function getReportBuilder($conditions)
    {
        $conditions = collect($conditions);
        $sort_type = $conditions->get('sort_type') ?? 'id';
        $sort_value = $conditions->get('sort_value') ?? 'asc';

        $location_id = request()->user()->location_id;

        $report = $this->categoryModel->select('categories.id', 'categories.category_name')
            ->addSelect(DB::raw('COUNT(assets.id) AS total'))
            ->leftJoin('assets', 'categories.id', '=', 'assets.category_id')
            ->where('categories.location_id', $location_id)
            ->groupBy('categories.id');

        $collection = collect(Asset::STATE_NAMES);

        $collection->map(function ($name, $key) use ($report) {
            $report = $report
                ->addSelect(
                    DB::raw('SUM((CASE WHEN assets.state_key = \'' . $key . '\' THEN 1 ELSE 0 END)) AS ' . $key)
                );
        });

        switch ($sort_type) {
            case 'category_name':
            case 'total':
            case 'available':
            case 'not_available':
            case 'assigned':
            case 'waiting_for_recycling':
            case 'recycled':
                $report->orderBy($sort_type, $sort_value);
                break;
            case 'id':
            default:
                $report->orderBy('categories.id', $sort_value);
                break;
        }
        return $report;
    }

    public function index($conditions): LengthAwarePaginator
    {
        $conditions = collect($conditions);

        $per_page = $conditions->get('per_page') ?? 20;
        $report = $this->getReportBuilder($conditions);
        return $report->paginate($per_page);
    }

    public function getReportFile($conditions): ReportExport
    {
        $report = $this->getReportBuilder($conditions);
        $report = collect($report->get());
        return new ReportExport($report);
    }

    public function getReportName(): string
    {
        $currentDate = Carbon::today()->format('d_m_Y');
        $fileName = 'Report_AssetManagement_' . $currentDate . '.xlsx';
        return $fileName;
    }
}
