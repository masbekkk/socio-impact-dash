<?php

declare(strict_types=1);

namespace App\Http\Requests\Divisions;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateDivisionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array{code: array<int, string>, names: array<int, string>, 'names.*.name': array<int, string>, 'names.*.description': array<int, string|null>}
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:255',
                'unique:division_codes,code,'.$this->route('division'),
            ],
            'name' => ['required', 'string', 'max:255'],
            'names' => ['required', 'array', 'min:1'],
            'names.*.name' => ['required', 'string', 'max:255'],
            'names.*.description' => ['nullable', 'string'],
        ];
    }
}
