<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Messenger-style edit: message.body always holds the CURRENT text;
     * every time it's edited, the text it had right before the edit is
     * archived into message_edit so both sides can look back at prior
     * versions instead of the history just being overwritten.
     */
    public function up(): void
    {
        Schema::table('message', function (Blueprint $table) {
            $table->dateTime('edited_at')->nullable()->after('unsent_at');
        });

        Schema::create('message_edit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained('message')->cascadeOnDelete()->cascadeOnUpdate();
            $table->text('body');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_edit');

        Schema::table('message', function (Blueprint $table) {
            $table->dropColumn('edited_at');
        });
    }
};
