<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;
use App\Models\Tenue;
use App\Models\PhotoTenue;

class KasewaSeedeur extends Seeder
{
    public function run(): void
    {
        // ─── Rôles Spatie ────────────────────────────────────────
        $roleAdmin       = Role::firstOrCreate(['name' => 'admin',        'guard_name' => 'web']);
        $roleProprietaire= Role::firstOrCreate(['name' => 'proprietaire', 'guard_name' => 'web']);
        $roleLocataire   = Role::firstOrCreate(['name' => 'locataire',    'guard_name' => 'web']);

        // ─── Utilisateurs ────────────────────────────────────────
        $admin = Utilisateur::firstOrCreate(
            ['email' => 'admin@kasewa.dz'],
            [
                'nom'                 => 'Admin KASEWA',
                'password'            => Hash::make('Benos1'),
                'role'                => 'admin',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0555000000',
            ]
        );

        $fatima = Utilisateur::firstOrCreate(
            ['email' => 'fatima@kasewa.dz'],
            [
                'nom'                 => 'Fatima Benali',
                'password'            => Hash::make('Benos2'),
                'role'                => 'proprietaire',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0661234567',
                'wilaya'              => 'Tlemcen',
            ]
        );

        $khadija = Utilisateur::firstOrCreate(
            ['email' => 'khadija@kasewa.dz'],
            [
                'nom'                 => 'Khadija Medjber',
                'password'            => Hash::make('Benos3'),
                'role'                => 'proprietaire',
                'type_proprietaire'   => 'boutique',
                'nom_boutique'        => 'Maison Medjber',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0551122334',
                'wilaya'              => 'Alger',
            ]
        );

        $samira = Utilisateur::firstOrCreate(
            ['email' => 'samira@kasewa.dz'],
            [
                'nom'                 => 'Samira Ouali',
                'password'            => Hash::make('Benos4'),
                'role'                => 'proprietaire',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0699887766',
                'wilaya'              => 'Oran',
            ]
        );

        $amina = Utilisateur::firstOrCreate(
            ['email' => 'amina@kasewa.dz'],
            [
                'nom'                 => 'Amina Khelif',
                'password'            => Hash::make('Benos5'),
                'role'                => 'locataire',
                'verifie'             => true,
                'statut_verification' => 'verifie',
                'telephone'           => '0771234567',
                'wilaya'              => 'Tlemcen',
            ]
        );

        // ─── Tenues ──────────────────────────────────────────────
        $catalogue = [
            // ── Fatima (Tlemcen) ─────────────────────────────────
            [
                'proprietaire' => $fatima,
                'titre'       => 'Chedda Tlemcénienne Brodée Or',
                'type'        => 'Chedda',
                'taille'      => 'M',
                'tailles'     => ['XS','S','M','L'],
                'couleurs'    => ['Blanc', 'Or'],
                'quantite'    => 2,
                'description' => 'Chedda authentique brodée à la main, disponible pour mariage et fiançailles. Ensemble complet avec coiffe et bijoux. Travail artisanal de Tlemcen. Inclut : qamis, jupe, veste et voile.',
                'prix_jour'   => 5000,
                'caution'     => 15000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Chedda de Fiançailles Argentée',
                'type'        => 'Chedda',
                'taille'      => 'S',
                'tailles'     => ['XS','S','M'],
                'couleurs'    => ['Argent', 'Blanc'],
                'quantite'    => 1,
                'description' => 'Chedda de fiançailles en tissus argent et blanc. Broderies fines faites à la main par des artisanes de Tlemcen. Parure complète avec bijoux inclus.',
                'prix_jour'   => 4500,
                'caution'     => 13000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Karakou Tlemcénien Rouge & Or',
                'type'        => 'Karakou',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Rouge', 'Or'],
                'quantite'    => 1,
                'description' => 'Karakou Tlemcénien authentique rouge avec broderies or. Veste en velours avec manches à l\'andalouse. Idéal pour henné et soirées de mariage.',
                'prix_jour'   => 3800,
                'caution'     => 11000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Burnous Tlemcénien Homme Blanc',
                'type'        => 'Burnous',
                'taille'      => 'L',
                'tailles'     => ['M','L','XL','XXL'],
                'couleurs'    => ['Blanc', 'Beige'],
                'quantite'    => 3,
                'description' => 'Burnous blanc traditionnel pour homme, idéal pour mariages et cérémonies religieuses. Tissu de qualité supérieure, laine fine travaillée. Disponible en plusieurs tailles.',
                'prix_jour'   => 2000,
                'caution'     => 6000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Haïk Tlemcénien Traditionnel',
                'type'        => 'Haïk',
                'taille'      => 'Unique',
                'tailles'     => ['Unique'],
                'couleurs'    => ['Blanc'],
                'quantite'    => 2,
                'description' => 'Haïk tlemcénien blanc en mousseline de soie. Tenue de sortie traditionnelle des femmes de Tlemcen. Drapé élégant idéal pour cérémonies et fêtes familiales.',
                'prix_jour'   => 1500,
                'caution'     => 4000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],

            // ── Khadija (Alger) ──────────────────────────────────
            [
                'proprietaire' => $khadija,
                'titre'       => 'Caftan Marocain Luxe Brodé',
                'type'        => 'Caftan',
                'taille'      => 'L',
                'tailles'     => ['S','M','L','XL'],
                'couleurs'    => ['Bordeaux', 'Or'],
                'quantite'    => 2,
                'description' => 'Caftan en velours et soie avec broderies raffinées, idéal pour cérémonies et henné. Couleur bordeaux et or. Pièce unique de la Maison Medjber.',
                'prix_jour'   => 4200,
                'caution'     => 12000,
                'wilaya'      => 'Alger',
                'ville'       => 'Alger Centre',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Karakou Algérois Classique Noir',
                'type'        => 'Karakou',
                'taille'      => 'S',
                'tailles'     => ['XS','S','M','L'],
                'couleurs'    => ['Noir', 'Or'],
                'quantite'    => 1,
                'description' => 'Karakou Algérois authentique avec takchita assortie. Broderie filé or sur fond noir. Parfait pour soirées et mariages. Création exclusive Maison Medjber.',
                'prix_jour'   => 3500,
                'caution'     => 10000,
                'wilaya'      => 'Alger',
                'ville'       => 'Bab El Oued',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Robe Kabyle Festive Colorée',
                'type'        => 'Robe Kabyle',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Bleu', 'Rouge', 'Or'],
                'quantite'    => 2,
                'description' => 'Robe kabyle festive avec tablier brodé main et bijoux kabyles. Couleurs vives traditionnelles. Idéale pour Yennayer et fêtes familiales kabyles.',
                'prix_jour'   => 2800,
                'caution'     => 8000,
                'wilaya'      => 'Alger',
                'ville'       => 'Dar El Beïda',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Costume Chaâbi Homme Alger',
                'type'        => 'Costume Chaâbi',
                'taille'      => 'L',
                'tailles'     => ['M','L','XL','XXL'],
                'couleurs'    => ['Blanc', 'Marron'],
                'quantite'    => 2,
                'description' => 'Costume chaâbi algérois complet : sarouel, qamis long et gilet brodé. Idéal pour fêtes de mariage, soirées musicales chaâbi et cérémonies familiales.',
                'prix_jour'   => 2200,
                'caution'     => 7000,
                'wilaya'      => 'Alger',
                'ville'       => 'El Harrach',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Djellaba Femme Luxe Algérienne',
                'type'        => 'Djellaba',
                'taille'      => 'M',
                'tailles'     => ['XS','S','M','L','XL'],
                'couleurs'    => ['Rose', 'Parme', 'Or'],
                'quantite'    => 3,
                'description' => 'Djellaba algérienne haut de gamme en soie naturelle avec broderies sur col et manches. Légère et élégante, parfaite pour célébrations et fêtes familiales.',
                'prix_jour'   => 1800,
                'caution'     => 5500,
                'wilaya'      => 'Alger',
                'ville'       => 'Hydra',
            ],

            // ── Samira (Oran) ────────────────────────────────────
            [
                'proprietaire' => $samira,
                'titre'       => 'Gandoura Oranaise Brodée Soie',
                'type'        => 'Gandoura',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Turquoise', 'Or'],
                'quantite'    => 1,
                'description' => 'Gandoura oranaise en soie naturelle avec broderies dorées. Style spécifique à l\'Oranie. Idéale pour fêtes de mariage et cérémonies de circoncision.',
                'prix_jour'   => 2500,
                'caution'     => 7500,
                'wilaya'      => 'Oran',
                'ville'       => 'Oran',
            ],
            [
                'proprietaire' => $samira,
                'titre'       => 'Caftan Oranais Vert Émeraude',
                'type'        => 'Caftan',
                'taille'      => 'L',
                'tailles'     => ['M','L','XL'],
                'couleurs'    => ['Vert émeraude', 'Or'],
                'quantite'    => 1,
                'description' => 'Caftan de style oranais en brocart vert émeraude avec passementerie or. Tenue de mariée ou de cérémonie, avec ceinture assortie. Travail fait main.',
                'prix_jour'   => 3800,
                'caution'     => 11000,
                'wilaya'      => 'Oran',
                'ville'       => 'Bir El Djir',
            ],
            [
                'proprietaire' => $samira,
                'titre'       => 'Burnous Homme Oran Festif',
                'type'        => 'Burnous',
                'taille'      => 'XL',
                'tailles'     => ['L','XL','XXL'],
                'couleurs'    => ['Blanc cassé', 'Beige'],
                'quantite'    => 2,
                'description' => 'Burnous homme blanc cassé d\'Oran, tissu épais de qualité supérieure. Idéal pour mariages, Aïd et cérémonies religieuses. Grande disponibilité.',
                'prix_jour'   => 1800,
                'caution'     => 5000,
                'wilaya'      => 'Oran',
                'ville'       => 'Oran',
            ],
            [
                'proprietaire' => $samira,
                'titre'       => 'Robe Chaouie Aurès Traditionnelle',
                'type'        => 'Robe Chaouie',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Rouge', 'Noir', 'Or'],
                'quantite'    => 1,
                'description' => 'Robe chaouie authentique des Aurès, broderies faites main en fils d\'or et rouge. Avec parure de bijoux berbères incluse (collier, bracelets, fibule).',
                'prix_jour'   => 3200,
                'caution'     => 9000,
                'wilaya'      => 'Oran',
                'ville'       => 'Oran',
            ],
            [
                'proprietaire' => $samira,
                'titre'       => 'Qamis Homme Mariage Blanc Brodé',
                'type'        => 'Qamis',
                'taille'      => 'L',
                'tailles'     => ['M','L','XL','XXL'],
                'couleurs'    => ['Blanc'],
                'quantite'    => 3,
                'description' => 'Qamis de mariage pour homme, coton égyptien premium avec broderies au col. Très apprécié pour les mariages algériens traditionnels. Coupé et cousu main.',
                'prix_jour'   => 1200,
                'caution'     => 3500,
                'wilaya'      => 'Oran',
                'ville'       => 'Es Senia',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Gandoura Kabyle Brodée Tizi Ouzou',
                'type'        => 'Gandoura',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Bleu', 'Rouge', 'Jaune'],
                'quantite'    => 1,
                'description' => 'Gandoura kabyle traditionnelle avec broderie couleur rouge et jaune. Idéale pour fêtes familiales, Yennayer et anniversaires de mariage kabyle. Authentique.',
                'prix_jour'   => 2500,
                'caution'     => 8000,
                'wilaya'      => 'Tizi Ouzou',
                'ville'       => 'Tizi Ouzou',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Takchita Constantine Violette',
                'type'        => 'Takchita',
                'taille'      => 'M',
                'tailles'     => ['XS','S','M','L'],
                'couleurs'    => ['Violet', 'Argent'],
                'quantite'    => 1,
                'description' => 'Takchita constantinoise en organza violette avec sous-robe argentée. Broderies punto en fil argent. Parfaite pour henné et soirées de mariage. Style Constantine.',
                'prix_jour'   => 3200,
                'caution'     => 9500,
                'wilaya'      => 'Constantine',
                'ville'       => 'Constantine',
            ],
            [
                'proprietaire' => $samira,
                'titre'       => 'Ensemble Nuptial Sétif Doré',
                'type'        => 'Chedda',
                'taille'      => 'L',
                'tailles'     => ['S','M','L','XL'],
                'couleurs'    => ['Doré', 'Ivoire'],
                'quantite'    => 1,
                'description' => 'Ensemble nuptial complet style Sétif : robe principale, veste brodée, ceinture et coiffe. Dorures fines, travail artisanal. Idéal pour le premier jour de mariage.',
                'prix_jour'   => 4800,
                'caution'     => 14000,
                'wilaya'      => 'Sétif',
                'ville'       => 'Sétif',
            ],
            [
                'proprietaire' => $fatima,
                'titre'       => 'Blousa Algéroise Festive Rose',
                'type'        => 'Blousa',
                'taille'      => 'S',
                'tailles'     => ['XS','S','M','L'],
                'couleurs'    => ['Rose', 'Or'],
                'quantite'    => 2,
                'description' => 'Blousa algéroise traditionnelle en satin rose avec broderies or et sequins. Tenue de fête légère et élégante. Se porte pour le henné, les fêtes de mariage et l\'Aïd.',
                'prix_jour'   => 1600,
                'caution'     => 5000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
            [
                'proprietaire' => $khadija,
                'titre'       => 'Keswa El Kbira Tlemcen Complète',
                'type'        => 'Keswa El Kbira',
                'taille'      => 'M',
                'tailles'     => ['S','M','L'],
                'couleurs'    => ['Bleu royal', 'Or'],
                'quantite'    => 1,
                'description' => 'Keswa el kbira tlemcénienne complète classée patrimoine UNESCO : velours bleu royal avec broderies or, brocart, ceinture or et châle. Pièce de collection rarissime.',
                'prix_jour'   => 8000,
                'caution'     => 25000,
                'wilaya'      => 'Tlemcen',
                'ville'       => 'Tlemcen',
            ],
        ];

        $typePhotoMap = [
            'Chedda'      => 'tenues/chedda.jpg',
            'Karakou'     => 'tenues/karakou_boutique.jpg',
            'Caftan'      => 'tenues/caftan_demo.jpg',
            'Keswa'       => 'tenues/chedda.jpg',
            'Takchita'    => 'tenues/chedda.jpg',
            'Ensemble'    => 'tenues/chedda.jpg',
            'Burnous'     => 'tenues/robes-soiree.jpg',
            'Haïk'        => 'tenues/blouza.jpg',
            'Blousa'      => 'tenues/blouza.jpg',
            'Blouza'      => 'tenues/blouza.jpg',
            'Djellaba'    => 'tenues/blouza.jpg',
            'Gandoura'    => 'tenues/chaouie.jpg',
            'Chaouie'     => 'tenues/chaouie.jpg',
            'Robe'        => 'tenues/robes-soiree.jpg',
            'Costume'     => 'tenues/robes-soiree.jpg',
            'Qamis'       => 'tenues/robes-soiree.jpg',
        ];

        foreach ($catalogue as $data) {
            $proprietaire = $data['proprietaire'];
            unset($data['proprietaire']);

            $tenue = Tenue::firstOrCreate(
                [
                    'utilisateur_id' => $proprietaire->id,
                    'titre'          => $data['titre'],
                ],
                array_merge($data, [
                    'utilisateur_id' => $proprietaire->id,
                    'statut'         => 'disponible',
                ])
            );

            // Ajouter une photo si elle n'existe pas encore
            if ($tenue->photos()->count() === 0) {
                $chemin = 'tenues/chedda.jpg';
                foreach ($typePhotoMap as $mot => $photo) {
                    if (stripos($data['type'] ?? '', $mot) !== false || stripos($data['titre'], $mot) !== false) {
                        $chemin = $photo;
                        break;
                    }
                }
                PhotoTenue::create(['tenue_id' => $tenue->id, 'chemin' => $chemin, 'principale' => true]);
            }
        }

        $this->command->info('✅ Données KASEWA créées avec succès !');
        $this->command->info('📧 Admin     : admin@kasewa.dz / Admin123!');
        $this->command->info('📧 Propriét.1: fatima@kasewa.dz / Password123!');
        $this->command->info('📧 Propriét.2: khadija@kasewa.dz / Password123!');
        $this->command->info('📧 Propriét.3: samira@kasewa.dz / Password123!');
        $this->command->info('📧 Locataire : amina@kasewa.dz / Password123!');
        $this->command->info('🎯 ' . \App\Models\Tenue::where('statut', 'disponible')->count() . ' tenues disponibles dans le catalogue');
    }
}
