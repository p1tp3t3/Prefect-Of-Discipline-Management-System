<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * ViolationController and the report/analytics queries have referenced
 * complaint.offense_issued_at for a while (e.g. resolving a complaint into
 * a violation sets it, violation reports order/filter by it) but no
 * migration ever created the column — every one of those call sites threw
 * "Unknown column 'offense_issued_at'" the moment it actually ran.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dateTime('offense_issued_at')->nullable()->after('confirmed_at');
        });

        // Backfill existing rows so historical violation reports/analytics
        // aren't left with a null date for already-resolved complaints.
        DB::table('complaint')
            ->whereNull('offense_issued_at')
            ->update(['offense_issued_at' => DB::raw('created_at')]);
    }

    public function down(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dropColumn('offense_issued_at');
        });
    }
};
