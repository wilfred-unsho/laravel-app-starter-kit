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
        Schema::create('spam_ips', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address');
            $table->text('reason')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('spam_emails', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->text('reason')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('spam_patterns', function (Blueprint $table) {
            $table->id();
            $table->string('pattern');
            $table->string('type'); // word, url, email_pattern
            $table->integer('score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spam_ips');
        Schema::dropIfExists('spam_emails');
        Schema::dropIfExists('spam_patterns');
    }
};
