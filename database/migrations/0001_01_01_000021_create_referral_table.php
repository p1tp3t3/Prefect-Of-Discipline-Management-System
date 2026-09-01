<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('referral', function (Blueprint $table) {
            $table->id();
            $table->string('referral_number')->unique();
            $table->foreignId('program_head_id')->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->longText('reason_description');
            $table->enum('referral_status', ['pending', 'rejected', 'approved'])->default('pending');
            $table->longText('rejected_reason')->nullable();
            $table->tinyInteger('send_to_guidance')->nullable();
            $table->dateTime('rejected_at')->nullable();
            $table->dateTime('confirmed_at')->nullable();
            $table->dateTime('archived_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral');
    }
};
