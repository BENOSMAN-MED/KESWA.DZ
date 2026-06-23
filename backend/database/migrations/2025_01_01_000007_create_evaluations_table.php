<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->foreignId('auteur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->tinyInteger('note')->unsigned(); // 1 à 5
            $table->text('commentaire')->nullable();
            $table->enum('auteur_type', ['proprietaire', 'locataire']);
            $table->enum('statut', ['visible', 'masque'])->default('visible');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
