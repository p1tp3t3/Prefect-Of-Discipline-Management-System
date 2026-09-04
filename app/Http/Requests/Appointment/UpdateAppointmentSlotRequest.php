<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_from' => 'required|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
            'slot' => 'required|integer|min:0',
        ];
    }
}
