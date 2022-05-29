<?php

namespace App\Services\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use App\Exports\ReportExport;

interface ReportServiceContract
{
    public function index(array $conditions): LengthAwarePaginator;
    public function getReportFile(array $conditions): ReportExport;
    public function getReportName(): string;
}
