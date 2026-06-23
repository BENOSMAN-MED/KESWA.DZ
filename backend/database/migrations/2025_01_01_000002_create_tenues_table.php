<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('titre', 100);
            $table->enum('type', ['Chedda', 'Caftan', 'Burnous', 'Gandoura', 'Karakou', 'Autre']);
            $table->string('taille', 10);
            $table->text('description')->nullable();
            $table->decimal('prix_jour', 10, 2);
            $table->decimal('caution', 10, 2)->default(0.00);
            $table->enum('statut', ['disponible', 'louee', 'inactif'])->default('disponible');
            $table->string('wilaya', 60)->nullable();
            $table->string('ville', 60)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenues');
    }
};
