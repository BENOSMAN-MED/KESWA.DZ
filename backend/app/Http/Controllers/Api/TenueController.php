<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenue;
use App\Models\PhotoTenue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TenueController extends Controller
{
    public function index(Request $request)
    {
        /** @var Builder $query */
        $query = Tenue::query()->where(['statut' => 'disponible']);
        $query->with(['photoPrincipale', 'proprietaire:id,nom,score_rep']);
        $query->withCount('evaluations as nombre_evaluations');
        $query->withAvg('evaluations as note_moyenne', 'note');

        if ($request->type) {
            $query->where(['type' => $request->type]);
        }
        if ($request->taille) {
            $query->where(['taille' => $request->taille]);
        }
        if ($request->wilaya) {
            $query->where(['wilaya' => $request->wilaya]);
        }
        if ($request->prix_max) {
            $query->where([['prix_jour', '<=', $request->prix_max]]);
        }

        return response()->json($query->paginate(12));
    }

    public function show(Tenue $tenue)
    {
        $tenue->load(['photos', 'proprietaire:id,nom,score_rep,verifie,type_proprietaire,nom_boutique,adresse_boutique']);
        return response()->json($tenue);
    }

    public function store(Request $request)
    {
        if ($request->user()->statut_verification !== 'verifie') {
            return response()->json([
                'message' => 'Votre profil doit être vérifié par l\'admin avant de publier une annonce.',
                'statut_verification' => $request->user()->statut_verification,
            ], 403);
        }

        $data = $request->validate([
            'titre'       => 'required|string|max:100',
            'type'        => 'required|string|max:60',
            'taille'      => 'nullable|string|max:10',
            'tailles'     => 'nullable|string',
            'couleurs'    => 'nullable|string',
            'quantite'              => 'nullable|integer|min:1|max:20',
            'quantites_par_taille'  => 'nullable|array',
            'quantites_par_taille.*'=> 'integer|min:0|max:20',
            'description' => 'nullable|string',
            'prix_jour'   => 'required|numeric|min:100',
            'caution'     => 'nullable|numeric|min:0',
            'wilaya'      => 'nullable|string|max:60',
            'ville'       => 'nullable|string|max:60',
            'photos'      => 'nullable|array|max:8',
            'photos.*'    => 'image|max:2048',
        ]);

        $taillesArr  = $data['tailles']  ? array_filter(array_map('trim', explode(',', $data['tailles'])))  : null;
        $couleursArr = $data['couleurs'] ? array_filter(array_map('trim', explode(',', $data['couleurs']))) : null;

        $tenue = Tenue::create([
            'utilisateur_id' => $request->user()->id,
            'titre'          => $data['titre'],
            'type'           => $data['type'],
            'taille'         => $taillesArr ? $taillesArr[array_key_first($taillesArr)] : ($data['taille'] ?? 'Unique'),
            'tailles'        => $taillesArr  ? array_values($taillesArr)  : null,
            'couleurs'       => $couleursArr ? array_values($couleursArr) : null,
            'description'    => $data['description'] ?? null,
            'prix_jour'      => $data['prix_jour'],
            'caution'        => $data['caution'] ?? 0,
            'wilaya'         => $data['wilaya'] ?? null,
            'ville'          => $data['ville']  ?? null,
            'quantite'              => $data['quantite'] ?? 1,
            'quantites_par_taille'  => $data['quantites_par_taille'] ?? null,
            'statut'                => 'en_attente',
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $i => $photo) {
                $chemin = $photo->store('tenues');
                PhotoTenue::create([
                    'tenue_id'   => $tenue->id,
                    'chemin'     => $chemin,
                    'principale' => $i === 0,
                ]);
            }
        }

        return response()->json($tenue->load('photos'), 201);
    }

    public function update(Request $request, Tenue $tenue)
    {
        if ($tenue->utilisateur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'titre'       => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'prix_jour'   => 'sometimes|numeric|min:100',
            'caution'     => 'nullable|numeric|min:0',
            'statut'               => 'sometimes|in:disponible,inactif,en_maintenance',
            'wilaya'               => 'nullable|string|max:60',
            'ville'                => 'nullable|string|max:60',
            'quantites_par_taille' => 'sometimes|nullable|array',
        ]);

        if (isset($data['statut']) && $data['statut'] === 'disponible' && $tenue->statut === 'en_attente') {
            return response()->json(['message' => 'Cette annonce est en attente de validation par l\'administrateur.'], 403);
        }

        $tenue->update($data);

        return response()->json($tenue);
    }

    public function destroy(Request $request, Tenue $tenue)
    {
        if ($tenue->utilisateur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        $tenue->delete();
        return response()->json(['message' => 'Annonce supprimée.']);
    }

    public function mesTenues(Request $request)
    {
        /** @var Builder $q */
        $q = Tenue::query()->where(['utilisateur_id' => $request->user()->id]);
        $q->with(['photos' => fn($q) => $q->orderBy('principale', 'desc')->limit(1)]);
        $tenues = $q->paginate(10);

        return response()->json($tenues);
    }

    public function datesBloquees(Tenue $tenue)
    {
        return response()->json($tenue->datesBloquees());
    }

    public function verifierDispo(Request $request, Tenue $tenue)
    {
        $request->validate([
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin'   => 'required|date|after:date_debut',
        ]);

        $stock = $tenue->stockDisponible($request->date_debut, $request->date_fin);

        return response()->json([
            'disponible'       => $stock > 0,
            'stock_disponible' => $stock,
            'quantite_totale'  => $tenue->quantite ?? 1,
        ]);
    }
}
