<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('role_template_versions', function (Blueprint $table) {
            $table->boolean('is_archived')->default(false)->after('changelog');
            $table->timestamp('archived_at')->nullable()->after('is_archived');
            $table->string('archive_reason')->nullable()->after('archived_at');
        });
    }

    public function down()
    {
        Schema::table('role_template_versions', function (Blueprint $table) {
            $table->dropColumn(['is_archived', 'archived_at', 'archive_reason']);
        });
    }
};
