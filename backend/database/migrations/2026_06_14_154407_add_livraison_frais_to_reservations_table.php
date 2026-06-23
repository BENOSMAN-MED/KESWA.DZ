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
        Schema::table('reservations', function (Blueprint $table) {
            // Livraison
            $table->boolean('avec_livraison')->default(false)->after('montant_total');
            $table->decimal('frais_livraison', 10, 2)->default(0)->after('avec_livraison');
            $table->boolean('avec_retour')->default(false)->after('frais_livraison');
            $table->decimal('frais_retour', 10, 2)->default(0)->after('avec_retour');
            // Frais de service (250 DA, exonéré après 2 locations)
            $table->decimal('frais_service', 10, 2)->default(250)->after('frais_retour');
            // Essayage boutique
            $table->boolean('avec_essayage')->default(false)->after('frais_service');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['avec_livraison', 'frais_livraison', 'avec_retour', 'frais_retour', 'frais_service', 'avec_essayage']);
        });
    }
};
