<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\CloseProject;
use App\Formatters\JsonResponseFormatter;
use App\Http\Resources\V1\Project\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProjectClosingController extends Controller
{
    public function close(Request $request, Project $project, CloseProject $closeProject): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'actual_budget' => ['required', 'numeric', 'min:0'],
            'documents' => ['nullable', 'array'],
            'documents.*.type' => ['required', 'string'],
            'documents.*.file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB
        ]);

        $project = $closeProject->handle($project, $validated, $request->user()->id);

        return JsonResponseFormatter::success(
            new ProjectResource($project),
            'Project closed successfully'
        );
    }
}
