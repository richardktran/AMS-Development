<?php

namespace App\Exports;

use App\Services\Contracts\ReportServiceContract;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;

class ReportExport implements FromCollection, WithHeadings, WithStrictNullComparison
{
    protected $report;


    public function __construct($report)
    {
        $this->report = $report;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Category',
            'Total',
            'Assigned',
            'Available',
            'Not Available',
            'Waiting for recycling',
            'Recycled'
        ];
    }

    public function collection()
    {
        return $this->report;
    }
}
