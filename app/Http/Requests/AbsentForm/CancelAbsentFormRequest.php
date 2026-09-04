<?php

namespace App\Http\Requests\AbsentForm;

use Illuminate\Foundation\Http\FormRequest;

class CancelAbsentFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => 'nullable|string',
        ];
    }
}
