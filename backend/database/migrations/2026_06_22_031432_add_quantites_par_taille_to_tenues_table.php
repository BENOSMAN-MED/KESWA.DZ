<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenues', function (Blueprint $table) {
            $table->json('quantites_par_taille')->nullable()->after('quantite');
        });
    }

    public function down(): void
    {
        Schema::table('tenues', function (Blueprint $table) {
            $table->dropColumn('quantites_par_taille');
        });
    }
};
