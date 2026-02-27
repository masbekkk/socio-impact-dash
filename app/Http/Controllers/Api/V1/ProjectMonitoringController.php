<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\StoreProjectMonitoring;
use App\Formatters\JsonResponseFormatter;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProjectMonitoringController extends Controller
{
    public function store(Request $request, Project $project, StoreProjectMonitoring $storeMonitoring): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'report_date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB
        ]);

        $monitoring = $storeMonitoring->handle($project, $validated, $request->user()->id);

        return JsonResponseFormatter::success(
            $monitoring,
            'Monitoring report submitted successfully',
            201
        );
    }
}
