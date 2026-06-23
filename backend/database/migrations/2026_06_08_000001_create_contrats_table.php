<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('proprietaire_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('locataire_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamp('date_signature')->nullable();
            $table->text('conditions');
            $table->string('etat_tenue_depart', 200)->nullable();
            $table->string('etat_tenue_retour', 200)->nullable();
            $table->enum('statut', ['actif', 'termine', 'annule'])->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
