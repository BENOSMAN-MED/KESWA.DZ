<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Reservation;
use App\Models\Tenue;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function parTenue(Tenue $tenue)
    {
        $evaluations = Evaluation::whereHas('reservation', function ($q) use ($tenue) {
            $q->where('tenue_id', $tenue->id);
        })
        ->where('statut', 'visible')
        ->with('auteur:id,nom,photo_profil')
        ->latest()
        ->get()
        ->map(fn($e) => [
            'id'          => $e->id,
            'note'        => $e->note,
            'commentaire' => $e->commentaire,
            'auteur_type' => $e->auteur_type,
            'auteur_nom'  => $e->auteur->nom ?? 'Anonyme',
            'created_at'  => $e->created_at,
        ]);

        $moyenne = $evaluations->avg('note') ?? 0;

        return response()->json([
            'evaluations' => $evaluations,
            'moyenne'     => round($moyenne, 1),
            'total'       => $evaluations->count(),
        ]);
    }

    public function store(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        $data = $request->validate([
            'note'        => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string|max:500',
        ]);

        $isLocataire    = $reservation->locataire_id === $user->id;
        $isProprietaire = $reservation->tenue?->utilisateur_id === $user->id;

        if (!$isLocataire && !$isProprietaire) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($reservation->statut !== 'termine') {
            return response()->json(['message' => 'Vous ne pouvez évaluer qu\'une location terminée.'], 422);
        }

        $auteurType = $isLocataire ? 'locataire' : 'proprietaire';

        $dejaEvalue = Evaluation::where('reservation_id', $reservation->id)
            ->where('auteur_id', $user->id)
            ->exists();

        if ($dejaEvalue) {
            return response()->json(['message' => 'Vous avez déjà évalué cette location.'], 422);
        }

        $evaluation = Evaluation::create([
            'reservation_id' => $reservation->id,
            'auteur_id'      => $user->id,
            'note'           => $data['note'],
            'commentaire'    => $data['commentaire'] ?? null,
            'auteur_type'    => $auteurType,
        ]);

        return response()->json($evaluation, 201);
    }
}
