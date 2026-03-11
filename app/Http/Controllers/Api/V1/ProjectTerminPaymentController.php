<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\Projects\UpdateTerminPayment;
use App\Formatters\JsonResponseFormatter;
use App\Models\Project;
use App\Models\ProjectTerminPayment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

final class ProjectTerminPaymentController extends Controller
{
    public function update(Request $request, Project $project, ProjectTerminPayment $termin, UpdateTerminPayment $updateTermin): \Illuminate\Http\JsonResponse
    {
        // Ensure termin belongs to project
        abort_if($termin->project_id !== $project->id, 404);

        $validated = $request->validate([
            'is_verified' => ['nullable', 'boolean'],
            'proof_file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'], // 5MB
        ]);

        $termin = $updateTermin->handle($termin, $validated, $request->user()->id);

        return JsonResponseFormatter::success(
            $termin,
            'Payment termin updated successfully'
        );
    }
}
