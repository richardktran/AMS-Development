<?php

namespace App\Http\Controllers\API;

use App\Exports\ReportExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReportIndexRequest;
use App\Services\Contracts\ReportServiceContract;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Response;
use Carbon\Carbon;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportServiceContract $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(ReportIndexRequest $request)
    {
        $conditions = $request->validated();

        $report = $this->reportService->index($conditions);

        return response(
            $report,
            Response::HTTP_OK
        );
    }

    public function export(ReportIndexRequest $request)
    {
        $conditions = $request->validated();
        $exportReport = $this->reportService->getReportFile($conditions);
        $fileName = $this->reportService->getReportName();

        return Excel::download($exportReport, $fileName);
    }
}
