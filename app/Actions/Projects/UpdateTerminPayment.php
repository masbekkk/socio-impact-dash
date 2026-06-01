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

            // Handle text fields
            if (array_key_exists('nomor_surat', $data)) {
                $updateData['nomor_surat'] = $data['nomor_surat'];
            }
            if (array_key_exists('tertuju', $data)) {
                $updateData['tertuju'] = $data['tertuju'];
            }

            // Handle Verification
            if (isset($data['is_verified'])) {
                $updateData['verified_by'] = $data['is_verified'] ? $userId : null;
            }

            // Handle Billing Document Upload
            if (isset($data['billing_file']) && $data['billing_file'] instanceof UploadedFile) {
                if ($termin->billing_document) {
                    $this->fileUploadService->deleteFile($termin->billing_document);
                }

                $meta = $this->fileUploadService->uploadFile(
                    $data['billing_file'],
                    "projects/{$termin->project_id}/termins/{$termin->id}"
                );

                $updateData['billing_document'] = $meta['path'];
            }

            // Handle Proof of Payment Upload
            if (isset($data['proof_file']) && $data['proof_file'] instanceof UploadedFile) {
                if ($termin->proof_payment) {
                    $this->fileUploadService->deleteFile($termin->proof_payment);
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
