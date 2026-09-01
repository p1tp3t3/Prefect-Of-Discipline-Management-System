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
        Schema::create('complaint', function (Blueprint $table) {
            $table->id();
            $table->string('complaint_number')->unique();
            $table->integer('case_number')->nullable();
            $table->string('complainant_name')->nullable();
            $table->foreignId('complainant_id')->nullable()->constrained('users')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('incident_id')->nullable()->constrained('violation')->nullOnDelete()->cascadeOnUpdate();
            $table->text('complaint_description');
            $table->longText('complaint_evidences')->nullable();
            $table->longText('rejected_reason')->nullable();
            $table->dateTime('rejected_at')->nullable();
            $table->dateTime('confirmed_at')->nullable();
            $table->enum('complaint_status', ['rejected', 'pending', 'ongoing', 'resolved'])->default('pending');
            $table->dateTime('resolved_at')->nullable();
            $table->dateTime('archived_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaint');
    }
};
