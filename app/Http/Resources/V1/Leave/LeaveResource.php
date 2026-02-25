<?php

declare(strict_types=1);

namespace App\Http\Resources\V1\Leave;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class LeaveResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'code'             => $this->code,
            'type'             => $this->type,
            'status'           => $this->status,
            'start_date'       => $this->start_date?->toDateString(),
            'end_date'         => $this->end_date?->toDateString(),
            'phone'            => $this->phone,
            'destination'      => $this->destination,
            'lokasi'           => $this->lokasi,
            'reason'           => $this->reason,
            'attachment_path'  => $this->attachment_path,
            'project'          => $this->whenLoaded('project', fn () => [
                'id'   => $this->project->id,
                'code' => $this->project->code,
                'name' => $this->project->name,
            ]),
            'replacement_pic'  => $this->whenLoaded('replacementPic', fn () => $this->replacementPic?->only(['id', 'name', 'email'])),
            'user'             => $this->whenLoaded('user', fn () => $this->user->only(['id', 'name', 'email'])),
            'approvals'        => $this->whenLoaded('approvals', fn () => $this->approvals->map(fn ($a) => [
                'id'          => $a->id,
                'role'        => $a->role,
                'status'      => $a->status,
                'notes'       => $a->notes,
                'approved_at' => $a->approved_at?->toIso8601String(),
                'approver'    => $a->approver ? $a->approver->only(['id', 'name', 'email']) : null,
            ])),
            'created_at'       => $this->created_at?->toIso8601String(),
            'updated_at'       => $this->updated_at?->toIso8601String(),
        ];
    }
}
