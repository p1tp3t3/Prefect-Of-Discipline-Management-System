<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|integer|exists:notification,id',
            'action' => 'required|in:accept,decline',
            'appointment_id' => 'nullable|integer|exists:appointment,id',
            'reason' => 'nullable|string',
        ];
    }
}
