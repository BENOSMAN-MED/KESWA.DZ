<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 60);
            $table->string('email', 120)->unique();
            $table->string('password');
            $table->string('telephone', 15)->nullable();
            $table->enum('role', ['proprietaire', 'locataire', 'admin'])->default('locataire');
            $table->decimal('score_rep', 3, 2)->default(0.00);
            $table->boolean('verifie')->default(false);
            $table->string('photo_profil')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
