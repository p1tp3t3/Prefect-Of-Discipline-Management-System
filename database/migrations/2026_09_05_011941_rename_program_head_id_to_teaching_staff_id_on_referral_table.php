<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * program_head_id was a misnomer — the referrer on a referral is any
     * teaching staff member (faculty included), not only program heads.
     */
    public function up(): void
    {
        Schema::table('referral', function (Blueprint $table) {
            $table->renameColumn('program_head_id', 'teaching_staff_id');
        });
    }

    public function down(): void
    {
        Schema::table('referral', function (Blueprint $table) {
            $table->renameColumn('teaching_staff_id', 'program_head_id');
        });
    }
};
