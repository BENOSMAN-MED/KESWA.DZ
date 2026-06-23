<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function inscrire(Request $request)
    {
        $data = $request->validate([
            'nom'               => 'required|string|max:60',
            'email'             => 'required|email|unique:utilisateurs,email',
            'password'          => 'required|string|min:8|confirmed',
            'telephone'         => 'nullable|string|max:15',
            'role'              => 'required|in:proprietaire,locataire',
            'type_proprietaire' => 'nullable|in:investisseur,boutique',
            'wilaya'            => 'nullable|string|max:60',
            'nom_boutique'      => 'nullable|string|max:100',
            'adresse_boutique'  => 'nullable|string|max:255',
        ]);

        // type_proprietaire obligatoire si role = proprietaire
        if ($data['role'] === 'proprietaire' && empty($data['type_proprietaire'])) {
            return response()->json([
                'message' => 'Veuillez choisir votre type de propriétaire : Investisseur ou Boutique.',
                'errors'  => ['type_proprietaire' => ['Ce champ est obligatoire pour les propriétaires.']],
            ], 422);
        }

        $utilisateur = Utilisateur::create([
            'nom'               => $data['nom'],
            'email'             => $data['email'],
            'password'          => Hash::make($data['password']),
            'telephone'         => $data['telephone'] ?? null,
            'wilaya'            => $data['wilaya'] ?? null,
            'role'              => $data['role'],
            'type_proprietaire' => $data['type_proprietaire'] ?? null,
            'nom_boutique'      => $data['nom_boutique'] ?? null,
            'adresse_boutique'  => $data['adresse_boutique'] ?? null,
        ]);

        $token = $utilisateur->createToken('kasewa-token')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'token'       => $token,
        ], 201);
    }

    public function connecter(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $utilisateur = Utilisateur::where('email', $data['email'])->first();

        if (!$utilisateur || !Hash::check($data['password'], $utilisateur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $token = $utilisateur->createToken('kasewa-token')->plainTextToken;

        return response()->json([
            'utilisateur' => $utilisateur,
            'token'       => $token,
        ]);
    }

    public function deconnecter(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    public function profil(Request $request)
    {
        return response()->json($request->user());
    }
}
