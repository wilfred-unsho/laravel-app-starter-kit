<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('role_template_permissions', function (Blueprint $table) {
            $table->foreignId('role_template_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->primary(['role_template_id', 'permission_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('role_template_permissions');
    }
};
