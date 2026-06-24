<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;

class KasewaProdSeedeur extends Seeder
{
    public function run(): void
    {
        // Compte admin uniquement
        Utilisateur::firstOrCreate(
            ['email' => 'admin@kasewa.dz'],
            [
                'nom'                 => 'Admin KASEWA',
                'password'            => Hash::make('Admin123!'),
                'role'                => 'admin',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0555000000',
            ]
        );
    }
}
