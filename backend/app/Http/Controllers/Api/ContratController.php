<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    // GET /reservations/{reservation}/contrat
    public function show(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        if ($reservation->locataire_id !== $user->id && $reservation->tenue->utilisateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $contrat = $reservation->contrat;

        if (!$contrat) {
            return response()->json(['message' => 'Aucun contrat pour cette réservation.'], 404);
        }

        $contrat->load(['proprietaire:id,nom,telephone', 'locataire:id,nom,telephone', 'reservation.tenue']);

        return response()->json($contrat);
    }

    // PUT /contrats/{contrat}/etat-retour
    public function noterEtatRetour(Request $request, Contrat $contrat)
    {
        $user = $request->user();

        if ($contrat->proprietaire_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'etat_tenue_retour' => 'required|string|max:200',
        ]);

        $contrat->update([
            'etat_tenue_retour' => $data['etat_tenue_retour'],
            'statut'            => 'termine',
        ]);

        return response()->json($contrat);
    }
}
