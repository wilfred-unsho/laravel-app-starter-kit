<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('role_templates', function (Blueprint $table) {
            $table->string('category')->after('description')->nullable();
            $table->json('tags')->after('category')->nullable();
            $table->json('metadata')->after('permissions')->nullable();
        });
    }

    public function down()
    {
        Schema::table('role_templates', function (Blueprint $table) {
            $table->dropColumn(['category', 'tags', 'metadata']);
        });
    }
};
