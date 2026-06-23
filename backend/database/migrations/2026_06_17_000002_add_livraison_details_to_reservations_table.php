<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // Adresse exacte de livraison (obligatoire si mode_livraison = domicile)
            $table->text('adresse_livraison')->nullable()->after('mode_paiement');

            // Tailles choisies avec quantités ex: {"M":1,"XXL":1}
            $table->json('tailles_choisies')->nullable()->after('adresse_livraison');

            // Nombre total d'unités commandées (somme des quantités par taille)
            $table->unsignedTinyInteger('quantite_demandee')->default(1)->after('tailles_choisies');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['adresse_livraison', 'tailles_choisies', 'quantite_demandee']);
        });
    }
};
