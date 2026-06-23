<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Reservation;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function payer(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        if ($reservation->locataire_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($reservation->statut !== 'confirme') {
            return response()->json(['message' => 'Cette réservation ne peut plus être payée.'], 422);
        }

        $paiementExistant = Paiement::where('reservation_id', $reservation->id)
            ->whereIn('statut', ['en_attente', 'valide'])
            ->exists();

        if ($paiementExistant) {
            return response()->json(['message' => 'Un paiement est déjà en cours ou validé pour cette réservation.'], 422);
        }

        $data = $request->validate([
            'mode'          => 'required|in:barid_mobile,ccp,cib',
            'numero_compte' => 'required|string|min:4|max:100',
            'recu_photo'    => 'required|image|max:5120',
        ]);

        $recuChemin = $request->file('recu_photo')->store('recus', 'public');
        $ref = strtoupper('KSW-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid()), 0, 8)));

        $paiement = Paiement::create([
            'reservation_id'  => $reservation->id,
            'ref_transaction' => $ref,
            'montant'         => $reservation->montant_total,
            'mode'            => $data['mode'],
            'statut'          => 'en_attente',
            'recu_photo'      => $recuChemin,
            'numero_compte'   => $data['numero_compte'],
        ]);

        return response()->json([
            'message'     => 'Paiement effectué avec succès. En attente de validation.',
            'reference'   => $ref,
            'paiement'    => $paiement,
            'reservation' => $reservation->fresh(),
        ], 201);
    }

    public function statut(Request $request, Reservation $reservation)
    {
        $user = $request->user();
        $estLocataire    = $reservation->locataire_id === $user->id;
        $estProprietaire = $reservation->tenue?->utilisateur_id === $user->id;

        if (!$estLocataire && !$estProprietaire && $user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return response()->json([
            'paiement' => $reservation->paiement,
        ]);
    }
}
