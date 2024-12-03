<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('role_template_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_template_id')->constrained()->onDelete('cascade');
            $table->string('version');
            $table->json('data');
            $table->text('changelog')->nullable();
            $table->timestamps();

            $table->unique(['role_template_id', 'version']);
        });

        Schema::table('role_templates', function (Blueprint $table) {
            $table->string('version')->default('1.0')->after('is_active');
            $table->string('latest_version')->default('1.0')->after('version');
        });
    }

    public function down()
    {
        Schema::dropIfExists('role_template_versions');

        Schema::table('role_templates', function (Blueprint $table) {
            $table->dropColumn(['version', 'latest_version']);
        });
    }
};
