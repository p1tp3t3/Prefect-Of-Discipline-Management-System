<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dateTime('revoked_at')->nullable()->after('rejected_at');
        });

        DB::statement("ALTER TABLE complaint MODIFY complaint_status ENUM('rejected', 'pending', 'ongoing', 'resolved', 'revoked') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE complaint SET complaint_status = 'rejected' WHERE complaint_status = 'revoked'");
        DB::statement("ALTER TABLE complaint MODIFY complaint_status ENUM('rejected', 'pending', 'ongoing', 'resolved') DEFAULT 'pending'");

        Schema::table('complaint', function (Blueprint $table) {
            $table->dropColumn('revoked_at');
        });
    }
};
