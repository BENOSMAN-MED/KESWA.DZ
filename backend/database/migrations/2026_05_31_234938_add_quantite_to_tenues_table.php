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
        Schema::table('tenues', function (Blueprint $table) {
            $table->unsignedTinyInteger('quantite')->default(1)->after('couleurs');
        });
    }

    public function down(): void
    {
        Schema::table('tenues', function (Blueprint $table) {
            $table->dropColumn('quantite');
        });
    }
};
