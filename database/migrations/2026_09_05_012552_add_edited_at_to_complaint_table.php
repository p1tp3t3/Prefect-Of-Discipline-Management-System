<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tracks whether the complainant has already used their one allowed
     * edit on this complaint — null means never edited, set means the
     * one-time edit is used up.
     */
    public function up(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dateTime('edited_at')->nullable()->after('revoked_at');
        });
    }

    public function down(): void
    {
        Schema::table('complaint', function (Blueprint $table) {
            $table->dropColumn('edited_at');
        });
    }
};
