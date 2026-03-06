<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\LeaveType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreLeaveRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::enum(LeaveType::class)],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'replacement_pic_id' => ['required', 'integer', 'exists:users,id'],
            'phone' => ['required', 'string', 'max:20'],
            'destination' => ['nullable', 'string', 'max:255'],
            'lokasi' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
