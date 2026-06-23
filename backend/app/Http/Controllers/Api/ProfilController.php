<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function modifier(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'sometimes|string|max:60',
            'telephone'  => 'sometimes|string|max:15',
            'wilaya'     => 'sometimes|string|max:60',
            'rib_barid'  => 'sometimes|nullable|string|size:20|regex:/^[0-9]{20}$/',
        ]);

        $request->user()->update($data);

        return response()->json($request->user()->fresh());
    }

    public function soumettreVerification(Request $request)
    {
        $user = $request->user();

        if ($user->statut_verification === 'en_attente') {
            return response()->json([
                'message' => 'Votre demande est déjà en cours d\'examen. Veuillez patienter.',
            ], 422);
        }

        $isBoutique = $user->type_proprietaire === 'boutique';

        $request->validate([
            'cin_numero'       => 'required|string|max:20',
            'cin_photo_recto'  => 'required|image|max:5120',
            'cin_photo_verso'  => 'required|image|max:5120',
            'selfie_photo'     => 'required|image|max:5120',
            'ccp_photo'        => 'required|image|max:5120',
            'doc_boutique'     => ($isBoutique ? 'required' : 'nullable') . '|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ]);

        $recto      = $request->file('cin_photo_recto')->store('verifications');
        $verso      = $request->file('cin_photo_verso')->store('verifications');
        $selfie     = $request->file('selfie_photo')->store('verifications');
        $ccpPath    = $request->file('ccp_photo')->store('verifications');
        $boutiqueDoc = $request->hasFile('doc_boutique')
            ? $request->file('doc_boutique')->store('verifications')
            : null;

        $user->update([
            'cin_numero'          => $request->cin_numero,
            'cin_photo_recto'     => $recto,
            'cin_photo_verso'     => $verso,
            'selfie_photo'        => $selfie,
            'ccp_photo'           => $ccpPath,
            'doc_boutique_photo'  => $boutiqueDoc,
            'statut_verification' => 'en_attente',
        ]);

        return response()->json([
            'message' => 'Demande de vérification soumise. L\'admin examinera vos documents sous 24-48h.',
            'statut'  => 'en_attente',
        ]);
    }

    public function changerMotDePasse(Request $request)
    {
        $data = $request->validate([
            'current_password'      => 'required|string',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    public function modifierPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:2048']);

        $chemin = $request->file('photo')->store('profils');
        $request->user()->update(['photo_profil' => $chemin]);

        return response()->json(['photo_profil' => $chemin]);
    }
}
