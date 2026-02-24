<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Reimbursement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class ReimbursementDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'original_name' => $this->original_name,
            'path' => $this->path,
            'mime' => $this->mime,
            'size' => $this->size,
            'uploaded_by' => $this->uploaded_by,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
