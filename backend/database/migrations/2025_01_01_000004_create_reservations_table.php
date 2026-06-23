<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('locataire_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('tenue_id')->constrained('tenues')->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('nb_jours')->virtualAs('DATEDIFF(date_fin, date_debut) + 1');
            $table->decimal('montant_total', 10, 2);
            $table->enum('statut', ['demande', 'confirme', 'en_cours', 'termine', 'annule'])->default('demande');
            $table->text('note_locataire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
