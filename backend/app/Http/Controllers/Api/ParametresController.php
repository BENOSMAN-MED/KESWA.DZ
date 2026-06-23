<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ParametresController extends Controller
{
    // Public — accessible sans authentification
    public function index()
    {
        $params = DB::table('parametres')->get();
        $result = [];
        foreach ($params as $p) {
            $result[$p->cle] = $p->valeur;
        }
        return response()->json($result);
    }

    // Admin seulement
    public function modifier(Request $request)
    {
        $data = $request->validate([
            'site_nom'        => 'sometimes|string|max:100',
            'site_slogan'     => 'sometimes|string|max:200',
            'contact_adresse' => 'sometimes|string|max:200',
            'contact_tel'     => 'sometimes|string|max:30',
            'contact_email'   => 'sometimes|email|max:100',
            'commission_pct'  => 'sometimes|numeric|min:0|max:50',
            'facebook_url'    => 'sometimes|string|max:200',
            'instagram_url'   => 'sometimes|string|max:200',
            // Contenu page d'accueil
            'hero_titre'      => 'sometimes|string|max:300',
            'hero_badge'      => 'sometimes|string|max:200',
            'prix_livraison'  => 'sometimes|string|max:20',
            // Section sécurité
            'sec1_titre'      => 'sometimes|string|max:100',
            'sec1_desc'       => 'sometimes|string|max:500',
            'sec2_titre'      => 'sometimes|string|max:100',
            'sec2_desc'       => 'sometimes|string|max:500',
            'sec3_titre'      => 'sometimes|string|max:100',
            'sec3_desc'       => 'sometimes|string|max:500',
            'sec4_titre'      => 'sometimes|string|max:100',
            'sec4_desc'       => 'sometimes|string|max:500',
            // Comment ça marche — Locataire
            'loc1_titre'      => 'sometimes|string|max:100',
            'loc1_desc'       => 'sometimes|string|max:500',
            'loc2_titre'      => 'sometimes|string|max:100',
            'loc2_desc'       => 'sometimes|string|max:500',
            'loc3_titre'      => 'sometimes|string|max:100',
            'loc3_desc'       => 'sometimes|string|max:500',
            'loc4_titre'      => 'sometimes|string|max:100',
            'loc4_desc'       => 'sometimes|string|max:500',
            // Comment ça marche — Propriétaire
            'pro1_titre'      => 'sometimes|string|max:100',
            'pro1_desc'       => 'sometimes|string|max:500',
            'pro2_titre'      => 'sometimes|string|max:100',
            'pro2_desc'       => 'sometimes|string|max:500',
            'pro3_titre'      => 'sometimes|string|max:100',
            'pro3_desc'       => 'sometimes|string|max:500',
            'pro4_titre'      => 'sometimes|string|max:100',
            'pro4_desc'       => 'sometimes|string|max:500',
        ]);

        foreach ($data as $cle => $valeur) {
            DB::table('parametres')->updateOrInsert(
                ['cle' => $cle],
                ['valeur' => $valeur, 'updated_at' => now()]
            );
        }

        return response()->json(['message' => 'Paramètres mis à jour avec succès.']);
    }
}
