<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Mirrors the complaint table's revoke/edit-once support: the referrer
     * can withdraw their own referral (soft delete, not a hard delete —
     * same archived_at convention the prefect's own reject already uses)
     * and can edit it exactly once before it's acted upon.
     */
    public function up(): void
    {
        Schema::table('referral', function (Blueprint $table) {
            $table->dateTime('revoked_at')->nullable()->after('rejected_at');
            $table->dateTime('edited_at')->nullable()->after('revoked_at');
        });

        DB::statement("ALTER TABLE referral MODIFY referral_status ENUM('pending', 'rejected', 'approved', 'revoked') DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("UPDATE referral SET referral_status = 'rejected' WHERE referral_status = 'revoked'");
        DB::statement("ALTER TABLE referral MODIFY referral_status ENUM('pending', 'rejected', 'approved') DEFAULT 'pending'");

        Schema::table('referral', function (Blueprint $table) {
            $table->dropColumn(['revoked_at', 'edited_at']);
        });
    }
};
