<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateLeaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $leaveCode = $this->route('leaf') ?? $this->route('leave');
        
        $leave = \App\Models\Leave::where('code', $leaveCode)->first();

        if (!$leave) {
            return false;
        }

        return $leave->user_id === $this->user()->id && 
               in_array($leave->status, [\App\Enums\LeaveStatus::Revision, \App\Enums\LeaveStatus::Revised], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', \Illuminate\Validation\Rule::enum(\App\Enums\LeaveType::class)],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
            'replacement_pic_id' => ['required', 'integer', 'exists:users,id'],
            'phone' => ['required', 'string', 'max:20'],
            'destination' => ['nullable', 'string', 'max:255'],
            'lokasi' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date', 'before_or_equal:end_date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:2000'],
            'approver_head_id' => [
                'nullable',
                \Illuminate\Validation\Rule::requiredIf(fn () => $this->user()?->hasRole('pegawai')),
                'exists:users,id'
            ],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
