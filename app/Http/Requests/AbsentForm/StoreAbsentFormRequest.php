<?php

namespace App\Http\Requests\AbsentForm;

use Illuminate\Foundation\Http\FormRequest;

class StoreAbsentFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'reason' => 'required|array|min:1',
            'evidence' => 'required|array|min:1',
            'evidence.*' => 'file|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
