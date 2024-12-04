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
        Schema::create('blog_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->nullable()->constrained('blog_posts')->onDelete('cascade');
            $table->boolean('notify_new_posts')->default(true);
            $table->boolean('notify_comments')->default(true);
            $table->boolean('notify_updates')->default(true);
            $table->timestamps();

            // A user can only subscribe once to general posts or a specific post
            $table->unique(['user_id', 'post_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_subscriptions');
    }
};
