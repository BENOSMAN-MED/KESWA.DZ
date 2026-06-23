<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos_tenue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenue_id')->constrained('tenues')->onDelete('cascade');
            $table->string('chemin');
            $table->boolean('principale')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photos_tenue');
    }
};
