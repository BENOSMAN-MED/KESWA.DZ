<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::table('parametres')->whereIn('cle', ['commission_boutique', 'commission_investisseur'])->exists();
        if (!$exists) {
            DB::table('parametres')->insert([
                ['cle' => 'commission_boutique',     'valeur' => '15', 'created_at' => now(), 'updated_at' => now()],
                ['cle' => 'commission_investisseur', 'valeur' => '19', 'created_at' => now(), 'updated_at' => now()],
                ['cle' => 'frais_service',           'valeur' => '250', 'created_at' => now(), 'updated_at' => now()],
                ['cle' => 'frais_livraison',         'valeur' => '250', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    public function down(): void
    {
        DB::table('parametres')->whereIn('cle', [
            'commission_boutique', 'commission_investisseur', 'frais_service', 'frais_livraison',
        ])->delete();
    }
};
