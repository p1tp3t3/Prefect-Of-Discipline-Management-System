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
        Schema::create('csv_import_row_results', function (Blueprint $table) {
            $table->id();
            $table->string('batch_id');
            $table->unsignedInteger('row_index');
            $table->string('id_number')->nullable();
            $table->string('full_name')->nullable();
            $table->enum('status', ['success', 'error']);
            $table->text('message')->nullable();
            $table->json('export_data')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('batch_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('csv_import_row_results');
    }
};
