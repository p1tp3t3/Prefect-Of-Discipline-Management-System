<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One complaint can have 2+ complainees, but the prefect's narrative of
     * what happened is a single account of the incident — this moves the
     * summary from per-complainee (complaint_subject.incident_summary) to
     * once per complaint, so resolving a multi-student complaint no longer
     * asks for a separate write-up per student.
     */
    public function up(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->text('incident_summary')->nullable()->after('complaint_description');
        });
    }

    public function down(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dropColumn('incident_summary');
        });
    }
};
