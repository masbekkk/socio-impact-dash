<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\ProjectTerminPayment;
use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final readonly class UpdateTerminPayment
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(ProjectTerminPayment $termin, array $data, int $userId): ProjectTerminPayment
    {
        return DB::transaction(function () use ($termin, $data, $userId) {
            $updateData = [];

            // Handle Verification
            if (isset($data['is_verified'])) {
                $updateData['verified_by'] = $data['is_verified'] ? $userId : null;
            }

            // Handle Proof of Payment Upload
            if (isset($data['proof_file']) && $data['proof_file'] instanceof UploadedFile) {
                // If replacing existing proof?
                if ($termin->proof_payment) {
                    // Optionally delete old file
                }

                $meta = $this->fileUploadService->uploadFile(
                    $data['proof_file'],
                    "projects/{$termin->project_id}/termins/{$termin->id}"
                );

                $updateData['proof_payment'] = $meta['path'];
            }

            if ($updateData !== []) {
                $termin->update($updateData);
            }

            return $termin->refresh();
        });
    }
}
