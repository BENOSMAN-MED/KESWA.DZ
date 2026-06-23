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
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('recu_photo')->nullable()->after('statut');
            $table->string('numero_compte', 50)->nullable()->after('recu_photo');
        });

        Schema::table('litiges', function (Blueprint $table) {
            $table->string('photo_probleme')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropColumn(['recu_photo', 'numero_compte']);
        });
        Schema::table('litiges', function (Blueprint $table) {
            $table->dropColumn('photo_probleme');
        });
    }
};
