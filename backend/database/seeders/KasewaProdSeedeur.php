<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;
use Spatie\Permission\Models\Role;

class KasewaProdSeedeur extends Seeder
{
    public function run(): void
    {
        // Rôles
        Role::firstOrCreate(['name' => 'admin',        'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'proprietaire', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'locataire',    'guard_name' => 'web']);

        // Compte admin uniquement
        $admin = Utilisateur::firstOrCreate(
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

        $admin->syncRoles(['admin']);
    }
}
