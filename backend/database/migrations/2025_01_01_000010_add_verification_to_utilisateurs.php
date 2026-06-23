<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->string('cin_numero', 20)->nullable()->after('verifie');
            $table->string('cin_photo_recto')->nullable()->after('cin_numero');
            $table->string('cin_photo_verso')->nullable()->after('cin_photo_recto');
            $table->string('selfie_photo')->nullable()->after('cin_photo_verso');
            $table->string('wilaya', 60)->nullable()->after('selfie_photo');
            $table->enum('statut_verification', ['non_soumis', 'en_attente', 'verifie', 'rejete'])
                  ->default('non_soumis')->after('wilaya');
            $table->text('motif_rejet')->nullable()->after('statut_verification');
        });
    }

    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn([
                'cin_numero', 'cin_photo_recto', 'cin_photo_verso',
                'selfie_photo', 'wilaya', 'statut_verification', 'motif_rejet'
            ]);
        });
    }
};
