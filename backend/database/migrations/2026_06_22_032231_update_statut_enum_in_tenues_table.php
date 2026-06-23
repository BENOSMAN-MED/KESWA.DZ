<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE tenues MODIFY COLUMN statut ENUM('disponible','louee','inactif','en_attente','en_maintenance') NOT NULL DEFAULT 'disponible'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE tenues MODIFY COLUMN statut ENUM('disponible','louee','inactif') NOT NULL DEFAULT 'disponible'");
    }
};
