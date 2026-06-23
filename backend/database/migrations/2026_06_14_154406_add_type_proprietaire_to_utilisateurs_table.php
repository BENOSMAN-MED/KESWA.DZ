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
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->enum('type_proprietaire', ['investisseur', 'boutique'])->nullable()->after('role');
            $table->string('nom_boutique', 100)->nullable()->after('type_proprietaire');
            $table->string('adresse_boutique', 255)->nullable()->after('nom_boutique');
        });
    }

    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropColumn(['type_proprietaire', 'nom_boutique', 'adresse_boutique']);
        });
    }
};
