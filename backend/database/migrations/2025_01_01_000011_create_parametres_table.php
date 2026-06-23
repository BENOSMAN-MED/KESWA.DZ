<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parametres', function (Blueprint $table) {
            $table->string('cle')->primary();
            $table->text('valeur')->nullable();
            $table->timestamps();
        });

        // Valeurs par défaut
        $defaults = [
            ['cle' => 'site_nom',        'valeur' => 'Keswa.dz'],
            ['cle' => 'site_slogan',     'valeur' => 'La première marketplace de tenues traditionnelles algériennes'],
            ['cle' => 'contact_adresse', 'valeur' => 'Tlemcen, Algérie'],
            ['cle' => 'contact_tel',     'valeur' => '+213 555 000 000'],
            ['cle' => 'contact_email',   'valeur' => 'contact@keswa.dz'],
            ['cle' => 'commission_pct',  'valeur' => '15'],
            ['cle' => 'facebook_url',    'valeur' => '#'],
            ['cle' => 'instagram_url',   'valeur' => '#'],
        ];

        foreach ($defaults as $param) {
            DB::table('parametres')->insert(array_merge($param, [
                'created_at' => now(), 'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('parametres');
    }
};
