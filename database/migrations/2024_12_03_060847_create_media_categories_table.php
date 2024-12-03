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
        Schema::create('media_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('media_file_category', function (Blueprint $table) {
            $table->foreignId('media_file_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['media_file_id', 'media_category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_categories');
    }
};
