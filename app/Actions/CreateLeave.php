<?php

declare(strict_types=1);

namespace App\Actions;

use App\Enums\LeaveStatus;
use App\Models\Leave;
use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final readonly class CreateLeave
{
    public function __construct(private FileUploadService $fileUploadService) {}

    public function handle(array $data, int $userId): Leave
    {
        return DB::transaction(function () use ($data, $userId): Leave {
            $leave = Leave::create([
                'code'               => $this->generateUniqueCode(),
                'user_id'            => $userId,
                'project_id'         => $data['project_id'] ?? null,
                'replacement_pic_id' => $data['replacement_pic_id'] ?? null,
                'phone'              => $data['phone'] ?? null,
                'destination'        => $data['destination'] ?? null,
                'lokasi'             => $data['lokasi'] ?? null,
                'type'               => $data['type'],
                'status'             => LeaveStatus::Submitted,
                'start_date'         => $data['start_date'],
                'end_date'           => $data['end_date'],
                'reason'             => $data['reason'] ?? null,
                'attachment_path'    => $this->storeAttachment($data['attachment'] ?? null, $userId),
            ]);

            return $leave->load(['user', 'project', 'replacementPic']);
        });
    }

    private function generateUniqueCode(): string
    {
        $year = date('Y');
        $prefix = "LV-{$year}-";

        $lastLeave = Leave::where('code', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($lastLeave) {
            $lastNumber = (int) str_replace($prefix, '', $lastLeave->code);
            $nextNumber = $lastNumber + 1;
        }

        return $prefix . str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    private function storeAttachment(?UploadedFile $file, int $userId): ?string
    {
        if ($file === null) {
            return null;
        }

        return $this->fileUploadService->uploadFile($file, "leaves/{$userId}/attachments")['path'];
    }
}
