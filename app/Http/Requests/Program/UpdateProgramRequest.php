<?php

namespace App\Http\Requests\Program;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgramRequest extends FormRequest
{
    /**
     * Route already gates this to super_admin via the 'role' middleware.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => 'required|integer|exists:program,id',
            'name' => 'required|string',
            'description' => 'required|string',
            'color' => 'required',
            'logo' => 'nullable|image|max:2048',
        ];
    }
}
