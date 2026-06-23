<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convertit l'enum type en varchar pour accepter tous les types de tenues
        DB::statement("ALTER TABLE tenues MODIFY `type` VARCHAR(60) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tenues MODIFY `type` ENUM('Chedda','Caftan','Burnous','Gandoura','Karakou','Autre') NOT NULL");
    }
};
