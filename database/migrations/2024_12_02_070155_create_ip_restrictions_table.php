<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ip_restrictions', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address');
            $table->string('type'); // whitelist or blacklist
            $table->string('reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('ip_address');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ip_restrictions');
    }
};
