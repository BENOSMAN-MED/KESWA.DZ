<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $messages = Message::with(['expediteur:id,nom,photo_profil', 'destinataire:id,nom,photo_profil'])
            ->where('expediteur_id', $userId)
            ->orWhere('destinataire_id', $userId)
            ->latest()
            ->paginate(20);

        return response()->json($messages);
    }

    public function conversation(Request $request, int $autreUserId)
    {
        $userId = $request->user()->id;

        $messages = Message::with(['expediteur:id,nom,photo_profil', 'destinataire:id,nom,photo_profil'])
            ->where(function ($q) use ($userId, $autreUserId) {
                $q->where('expediteur_id', $userId)->where('destinataire_id', $autreUserId);
            })
            ->orWhere(function ($q) use ($userId, $autreUserId) {
                $q->where('expediteur_id', $autreUserId)->where('destinataire_id', $userId);
            })
            ->latest()
            ->paginate(50);

        Message::where('expediteur_id', $autreUserId)
            ->where('destinataire_id', $userId)
            ->update(['lu' => true]);

        return response()->json($messages);
    }

    public function utilisateur(int $userId)
    {
        $user = \App\Models\Utilisateur::select('id', 'nom', 'photo_profil', 'type_proprietaire', 'nom_boutique')
            ->findOrFail($userId);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'destinataire_id' => 'required|exists:utilisateurs,id',
            'reservation_id'  => 'nullable|exists:reservations,id',
            'contenu'         => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'expediteur_id'   => $request->user()->id,
            'destinataire_id' => $data['destinataire_id'],
            'reservation_id'  => $data['reservation_id'] ?? null,
            'contenu'         => $data['contenu'],
        ]);

        return response()->json($message->load('expediteur:id,nom,photo_profil'), 201);
    }
}
