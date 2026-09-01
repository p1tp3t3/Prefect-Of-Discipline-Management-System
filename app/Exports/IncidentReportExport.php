<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\StringValueBinder;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class IncidentReportExport extends StringValueBinder implements
    FromCollection,
    WithEvents,
    WithCustomStartCell,
    WithMapping,
    WithTitle,
    WithHeadings,
    WithCustomValueBinder,
    WithStyles,
    WithDrawings
{
    protected $records;
    protected $title;
    protected $individual;
    protected $user;

    public function __construct(Collection $records, string $title = 'Incident Report', bool $individual = false, $user = null)
    {
        $this->records   = $records;
        $this->title     = $title;
        $this->individual = $individual;
        $this->user       = $user;
    }

    public function collection()
    {
        return $this->records;
    }

    /** HEADERS */
    public function headings(): array
    {
        $data = ['#'];

        if ($this->individual) {
            return request('type') === 'incident'
                ? array_merge($data, ['Complainant Name', 'Incident Reported', 'Date/Time'])
                : array_merge($data, ['Violation', 'Status', 'Date/Time']);
        }

        $data = ['#', 'Student ID', 'Name', 'Program'];

        return request('type') === 'incident'
            ? array_merge($data, ['Complainant Name', 'Incident Reported', 'Date/Time'])
            : array_merge($data, ['Violation', 'Status', 'Date/Time']);
    }

    /** MAP ROWS BASED ON KEYS */
    public function map($record): array
    {
        if ($this->individual) {
            $data = [$record['i'] ?? '—'];

            return request('type') === 'incident'
                ? array_merge($data, [
                    $record['complainant_name'] ?? '—',
                    $record['incident'] ?? '—',
                    isset($record['date_time']) ? Carbon::parse($record['date_time'])->format('F j, Y g:i A') : '—',
                ])
                : array_merge($data, [
                    $record['violation'] ?? '—',
                    $record['status'] ?? '—',
                    isset($record['date_time']) ? Carbon::parse($record['date_time'])->format('F j, Y g:i A') : '—',
                ]);
        }

        $data = [
            $record['i'] ?? '—',
            $record['student_id'] ?? '—',
            $record['name'] ?? '—',
            $record['program'] ?? '—',
        ];

        return request('type') === 'incident'
            ? array_merge($data, [
                $record['complainant_name'] ?? '—',
                $record['incident'] ?? '—',
                isset($record['date_time']) ? Carbon::parse($record['date_time'])->format('F j, Y g:i A') : '—',
            ])
            : array_merge($data, [
                $record['violation'] ?? '—',
                $record['status'] ?? '—',
                isset($record['date_time']) ? Carbon::parse($record['date_time'])->format('F j, Y g:i A') : '—',
            ]);
    }

    public function startCell(): string
    {
        return 'A8';
    }

    public function title(): string
    {
        return $this->title;
    }

    /** SHEET STYLES */
    public function styles(Worksheet $sheet)
    {
        if ($this->individual && !is_null($this->user)) {
            $name =  $this->user['first_name'] . ' ' . $this->user['middle_name'] . ' ' . $this->user['last_name'];

            $sheet->setCellValue('A2', 'User ID:');
            $sheet->setCellValue('B2', $this->user['id'] ?? 'N/A');

            $sheet->setCellValue('A3', 'Name:');
            $sheet->setCellValue('B3', $name ?? 'N/A');

            $sheet->setCellValue('A4', 'Program:');
            $sheet->setCellValue('B4', $this->user['student']['program']['name'] ?? 'N/A');

            $sheet->setCellValue('A5', 'Civil Status:');
            $sheet->setCellValue('B5', ucfirst($this->user['civil_status'] ?? 'N/A'));

            $sheet->getStyle('A2:A5')->getFont()->setBold(true);

            $sheet->mergeCells('A7:D7');
        }

        // Auto-size columns A-F
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        return [];
    }

    /** AFTER-SHEET EVENTS */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $sheet = $event->sheet->getDelegate();

                $columnCount = $this->individual ? 4 : 8;
                $lastColumn  = chr(ord('A') + $columnCount - 1);

                // Title Row
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->setCellValue('A1', $this->title);
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

                // Auto-size all columns
                foreach (range('A', $lastColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }

    /** DRAW USER PROFILE PICTURE */
    public function drawings()
    {
        if (!$this->individual || empty($this->user['profile_picture'])) {
            return [];
        }

        $picturePath = "profile-pictures/" . $this->user['profile_picture'];

        if (!Storage::disk('public')->exists($picturePath)) {
            return [];
        }

        $imagePath = Storage::disk('public')->path($picturePath);

        $drawing = new Drawing();
        $drawing->setName('Profile Picture');
        $drawing->setDescription('User profile picture');
        $drawing->setPath($imagePath);
        $drawing->setHeight(90);
        $drawing->setCoordinates('E2');
        $drawing->setOffsetX(10);
        $drawing->setOffsetY(5);

        return [$drawing];
    }
}
