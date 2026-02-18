<?php

declare(strict_types=1);

namespace App\Actions\Projects;

use App\Models\ProjectTerminPayment;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class UpdateTerminPayment
{
    public function __construct(protected FileUploadService $fileUploadService)
    {
    }

    public function handle(ProjectTerminPayment $termin, array $data, int $userId): ProjectTerminPayment
    {
        return DB::transaction(function () use ($termin, $data, $userId) {
            $updateData = [];

            // Handle Verification
            if (isset($data['is_verified']) && $data['is_verified']) {
                $updateData['verified_by'] = $userId; // Assuming logged in user is verifying
                // verified_at is not in migration, so maybe just verified_by is enough to indicate verification?
                // Migration limits: nominal, due_date, notes, verified_by, proof_payment.
                // So setting verified_by means it's verified.
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

            if (!empty($updateData)) {
                $termin->update($updateData);
            }

            return $termin->refresh();
        });
    }
}
