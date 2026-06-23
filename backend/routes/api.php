<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TenueController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\ParametresController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ContratController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\FavorisController;
use App\Models\Tenue;
use App\Models\Utilisateur;
use App\Models\Reservation;
use App\Models\Evaluation;

// ─── Routes publiques ────────────────────────────────────────────────
Route::get('/parametres',    [ParametresController::class, 'index']);

Route::get('/stats-publiques', function () {
    $noteMoyenne = Evaluation::avg('note');
    $categories = Tenue::where('statut', 'disponible')
        ->selectRaw('type, COUNT(*) as total')
        ->groupBy('type')
        ->pluck('total', 'type');

    return response()->json([
        'annonces'    => Tenue::where('statut', 'disponible')->count(),
        'utilisateurs'=> Utilisateur::count(),
        'locations'   => Reservation::where('statut', 'termine')->count(),
        'note_moyenne'=> $noteMoyenne ? round($noteMoyenne, 1) : null,
        'categories'  => $categories,
    ]);
});
Route::middleware('throttle:auth')->group(function () {
    Route::post('/inscription', [AuthController::class, 'inscrire']);
    Route::post('/connexion',   [AuthController::class, 'connecter']);
});

Route::middleware('throttle:contact')->post('/contact', [ContactController::class, 'envoyer']);

Route::get('/tenues',                        [TenueController::class, 'index']);
Route::get('/tenues/{tenue}',                [TenueController::class, 'show']);
Route::get('/tenues/{tenue}/disponibilite',   [TenueController::class, 'verifierDispo']);
Route::get('/tenues/{tenue}/dates-bloquees', [TenueController::class, 'datesBloquees']);
Route::get('/tenues/{tenue}/evaluations',    [EvaluationController::class, 'parTenue']);

// ─── Routes authentifiées ─────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Paramètres site (admin uniquement via middleware)
    Route::put('/parametres',  [ParametresController::class, 'modifier'])->middleware('admin');

    // Profil
    Route::get('/profil',                              [AuthController::class, 'profil']);
    Route::post('/deconnexion',                        [AuthController::class, 'deconnecter']);
    Route::put('/profil/modifier',                     [ProfilController::class, 'modifier']);
    Route::post('/profil/photo',                       [ProfilController::class, 'modifierPhoto']);
    Route::post('/profil/verification',                [ProfilController::class, 'soumettreVerification']);
    Route::put('/profil/mot-de-passe',                 [ProfilController::class, 'changerMotDePasse']);

    // Tenues (propriétaire)
    Route::get('/mes-tenues',         [TenueController::class, 'mesTenues']);
    Route::post('/tenues',            [TenueController::class, 'store']);
    Route::put('/tenues/{tenue}',     [TenueController::class, 'update']);
    Route::delete('/tenues/{tenue}',  [TenueController::class, 'destroy']);

    // Réservations (locataire)
    Route::post('/reservations',                [ReservationController::class, 'store']);
    Route::get('/mes-reservations',             [ReservationController::class, 'mesReservations']);

    // Réservations (propriétaire)
    Route::get('/demandes-recues',                          [ReservationController::class, 'demandesRecues']);
    Route::put('/reservations/{reservation}/confirmer',     [ReservationController::class, 'confirmer']);
    Route::put('/reservations/{reservation}/annuler',       [ReservationController::class, 'annuler']);
    Route::put('/reservations/{reservation}/terminer',            [ReservationController::class, 'terminer']);
    Route::put('/reservations/{reservation}/confirmer-reception', [ReservationController::class, 'confirmerReception']);
    Route::put('/reservations/{reservation}/signaler-retour',     [ReservationController::class, 'signalerRetour']);
    Route::put('/reservations/{reservation}/confirmer-retour',    [ReservationController::class, 'confirmerRetour']);

    // Paiement
    Route::post('/reservations/{reservation}/payer',  [PaiementController::class, 'payer']);
    Route::get('/reservations/{reservation}/paiement',[PaiementController::class, 'statut']);

    // Évaluations
    Route::post('/reservations/{reservation}/evaluation', [EvaluationController::class, 'store']);

    // Litiges
    Route::post('/reservations/{reservation}/litige', [ReservationController::class, 'ouvrirLitige']);

    // Messagerie
    Route::get('/messages',                        [MessageController::class, 'index']);
    Route::get('/messages/{autreUserId}',          [MessageController::class, 'conversation']);
    Route::post('/messages',                       [MessageController::class, 'store']);
    Route::get('/utilisateurs/{userId}/info',      [MessageController::class, 'utilisateur']);

    // Notifications
    Route::get('/notifications',                              [NotificationController::class, 'index']);
    Route::get('/notifications/non-lues',                     [NotificationController::class, 'nonLues']);
    Route::put('/notifications/lire-tout',                    [NotificationController::class, 'marquerToutLu']);
    Route::put('/notifications/{notification}/lire',          [NotificationController::class, 'marquerLu']);

    // Favoris
    Route::get('/mes-favoris',                   [FavorisController::class, 'mes']);
    Route::post('/tenues/{tenue}/favori',         [FavorisController::class, 'toggle']);

    // Contrats
    Route::get('/reservations/{reservation}/contrat',         [ContratController::class, 'show']);
    Route::put('/contrats/{contrat}/etat-retour',             [ContratController::class, 'noterEtatRetour']);

    // Admin
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats',                                  [AdminController::class, 'stats']);
        Route::get('/stats/mensuelles',                       [AdminController::class, 'statsMenusuelles']);
        Route::get('/utilisateurs',                           [AdminController::class, 'utilisateurs']);
        Route::put('/utilisateurs/{utilisateur}/suspendre',   [AdminController::class, 'suspendreUtilisateur']);
        Route::get('/tenues',                                 [AdminController::class, 'tenues']);
        Route::get('/tenues/en-attente',                      [AdminController::class, 'tenuesEnAttente']);
        Route::put('/tenues/{tenue}/valider',                 [AdminController::class, 'validerTenue']);
        Route::put('/tenues/{tenue}/rejeter',                 [AdminController::class, 'rejeterTenue']);
        Route::delete('/tenues/{tenue}',                      [AdminController::class, 'supprimerTenue']);
        Route::get('/litiges',                                [AdminController::class, 'litiges']);
        Route::put('/litiges/{litige}/resoudre',              [AdminController::class, 'resoudreLitige']);
        Route::get('/verifications',                          [AdminController::class, 'verificationsEnAttente']);
        Route::put('/utilisateurs/{utilisateur}/valider',     [AdminController::class, 'validerVerification']);
        Route::put('/utilisateurs/{utilisateur}/rejeter',     [AdminController::class, 'rejeterVerification']);
        Route::get('/paiements',                              [AdminController::class, 'tousLesPaiements']);
        Route::get('/paiements/en-attente',                   [AdminController::class, 'paiementsEnAttente']);
        Route::put('/paiements/{paiement}/valider',           [AdminController::class, 'validerPaiement']);
        Route::put('/paiements/{paiement}/rejeter',           [AdminController::class, 'rejeterPaiement']);
        Route::get('/reservations/a-regler',                  [AdminController::class, 'reservationsARegler']);
        Route::put('/reservations/{reservation}/payer-proprietaire', [AdminController::class, 'payerProprietaire']);
        Route::get('/contact-messages',                       [AdminController::class, 'contactMessages']);
        Route::put('/contact-messages/{contactMessage}/lire', [AdminController::class, 'marquerMessageLu']);
        Route::delete('/contact-messages/{contactMessage}',   [AdminController::class, 'supprimerMessage']);
        Route::post('/utilisateurs/{utilisateur}/message',    [AdminController::class, 'envoyerMessage']);
    });
});
