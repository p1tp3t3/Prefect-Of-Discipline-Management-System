<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * "Unsend" is a soft delete (body kept, just hidden) rather than a
     * real row delete — so reply_to references from the other side stay
     * intact and can render an "unsent" placeholder instead of breaking.
     */
    public function up(): void
    {
        Schema::table('message', function (Blueprint $table) {
            $table->dateTime('unsent_at')->nullable()->after('body');
        });
    }

    public function down(): void
    {
        Schema::table('message', function (Blueprint $table) {
            $table->dropColumn('unsent_at');
        });
    }
};
