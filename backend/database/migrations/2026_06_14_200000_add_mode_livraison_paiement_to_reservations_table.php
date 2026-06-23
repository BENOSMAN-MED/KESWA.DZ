<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->enum('mode_livraison', ['point_retrait', 'domicile'])->default('point_retrait')->after('avec_essayage');
            $table->enum('mode_paiement',  ['sur_place', 'en_ligne'])->default('sur_place')->after('mode_livraison');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['mode_livraison', 'mode_paiement']);
        });
    }
};
