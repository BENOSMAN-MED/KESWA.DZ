<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('reservations')->onDelete('cascade');
            $table->string('ref_transaction')->nullable()->unique();
            $table->decimal('montant', 10, 2);
            $table->enum('mode', ['barid_mobile', 'ccp', 'cib', 'virement', 'especes'])->default('especes');
            $table->enum('statut', ['en_attente', 'valide', 'rembourse', 'echoue'])->default('en_attente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
