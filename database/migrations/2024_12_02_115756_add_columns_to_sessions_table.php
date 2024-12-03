<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
//        Schema::create('sessions', function (Blueprint $table) {
//            $table->string('id')->primary();
//            $table->foreignId('user_id')->nullable()->index();
//            $table->string('ip_address', 45)->nullable();
//            $table->text('user_agent')->nullable();
//            $table->longText('payload');
//            $table->integer('last_activity')->index();
//            $table->string('device_type')->nullable();
//            $table->string('platform')->nullable();
//            $table->string('browser')->nullable();
//            $table->string('location')->nullable();
//            $table->boolean('is_current')->default(false);
//        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->string('device_type')->nullable();
            $table->string('platform')->nullable();
            $table->string('browser')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_current')->default(false);
        });
    }

    public function down(): void
    {
        //Schema::dropIfExists('sessions');
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn('device_type');
            $table->dropColumn('platform');
            $table->dropColumn('browser');
            $table->dropColumn('location');
            $table->dropColumn('is_current');
        });
    }
};