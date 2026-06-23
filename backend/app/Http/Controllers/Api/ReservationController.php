<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NouvelleDemandeEmail;
use App\Mail\ReservationConfirmeeEmail;
use App\Mail\ReservationAnnuleeEmail;
use App\Mail\LocationTermineeEmail;
use App\Models\Contrat;
use App\Models\Litige;
use App\Models\NotificationKasewa;
use App\Models\Reservation;
use App\Models\Tenue;
use App\Models\Caution;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        // Seuls les locataires peuvent effectuer une réservation
        if ($user->role !== 'locataire') {
            return response()->json([
                'message' => 'Seuls les locataires peuvent effectuer une réservation. Inscrivez-vous avec un compte locataire.',
            ], 403);
        }

        // Vérification du compte obligatoire pour louer
        if ($user->statut_verification !== 'verifie') {
            return response()->json([
                'message' => 'Votre profil doit être vérifié par l\'administrateur avant de pouvoir louer une tenue.',
                'statut_verification' => $user->statut_verification,
            ], 403);
        }

        $data = $request->validate([
            'tenue_id'          => 'required|exists:tenues,id',
            'date_debut'        => 'required|date|after_or_equal:today',
            'date_fin'          => 'required|date|after:date_debut',
            'mode_livraison'    => 'in:point_retrait,domicile',
            'mode_paiement'     => 'in:sur_place,en_ligne',
            'avec_essayage'     => 'boolean',
            // Livraison à domicile : adresse exacte obligatoire
            'adresse_livraison' => 'nullable|string|max:500',
            // Multi-tailles : {"M":1,"XXL":1}
            'tailles_choisies'  => 'nullable|array',
        ]);

        $tenue = Tenue::findOrFail($data['tenue_id']);

        // Vérification que le propriétaire est aussi vérifié
        if ($tenue->proprietaire->statut_verification !== 'verifie') {
            return response()->json(['message' => 'Ce propriétaire n\'est pas encore vérifié sur la plateforme.'], 422);
        }

        $modeLivraison = $data['mode_livraison'] ?? 'point_retrait';
        $avecLivraison = $modeLivraison === 'domicile';

        // Adresse obligatoire si livraison à domicile
        if ($avecLivraison && empty($data['adresse_livraison'])) {
            return response()->json(['message' => 'Veuillez saisir l\'adresse exacte de livraison.'], 422);
        }

        // Quantité totale demandée (somme des tailles choisies, minimum 1)
        $taillesChoisies    = $data['tailles_choisies'] ?? [];
        $quantiteDemandee   = !empty($taillesChoisies)
            ? array_sum(array_values($taillesChoisies))
            : 1;
        $quantiteDemandee   = max(1, (int) $quantiteDemandee);

        // Vérifier le stock disponible pour la quantité demandée
        $stockDispo = $tenue->stockDisponible($data['date_debut'], $data['date_fin']);
        if ($stockDispo < $quantiteDemandee) {
            return response()->json([
                'message' => "Stock insuffisant. Seulement {$stockDispo} unité(s) disponible(s) pour ces dates.",
            ], 422);
        }

        $nbJours         = (new \DateTime($data['date_debut']))->diff(new \DateTime($data['date_fin']))->days + 1;
        $montantLocation = $nbJours * $tenue->prix_jour * $quantiteDemandee;

        // Frais lus depuis la table parametres (avec fallback)
        $params = DB::table('parametres')
            ->whereIn('cle', ['frais_livraison', 'frais_service'])
            ->pluck('valeur', 'cle');
        $fraisLivraisonConfig = (int) ($params['frais_livraison'] ?? 250);
        $fraisServiceConfig   = (int) ($params['frais_service']   ?? 250);

        // Livraison à domicile : frais KASEWA (aller + retour inclus)
        $fraisLivraison = $avecLivraison ? $fraisLivraisonConfig : 0;
        $fraisRetour    = 0; // inclus dans les frais de livraison

        $modePaiement = $data['mode_paiement'] ?? 'sur_place';
        $avecEssayage = $data['avec_essayage'] ?? false;

        // Frais de service — exonéré après 2 locations terminées
        $nbLocationsTerminees = Reservation::where('locataire_id', $user->id)
            ->where('statut', 'termine')
            ->count();
        $fraisService = ($nbLocationsTerminees >= 2) ? 0 : $fraisServiceConfig;

        $montantTotal = $montantLocation + $fraisLivraison + $fraisRetour + $fraisService;

        $reservation = Reservation::create([
            'locataire_id'      => $user->id,
            'tenue_id'          => $data['tenue_id'],
            'date_debut'        => $data['date_debut'],
            'date_fin'          => $data['date_fin'],
            'montant_total'     => $montantTotal,
            'avec_livraison'    => $avecLivraison,
            'frais_livraison'   => $fraisLivraison,
            'avec_retour'       => false,
            'frais_retour'      => 0,
            'frais_service'     => $fraisService,
            'avec_essayage'     => $avecEssayage,
            'mode_livraison'    => $modeLivraison,
            'mode_paiement'     => $modePaiement,
            'adresse_livraison' => $avecLivraison ? $data['adresse_livraison'] : null,
            'tailles_choisies'  => !empty($taillesChoisies) ? $taillesChoisies : null,
            'quantite_demandee' => $quantiteDemandee,
            'statut'            => 'demande',
        ]);

        Caution::create([
            'reservation_id' => $reservation->id,
            'montant'        => $tenue->caution,
            'statut'         => 'bloquee',
        ]);

        // Notifier le propriétaire
        NotificationKasewa::envoyer(
            $tenue->utilisateur_id,
            'reservation',
            "Nouvelle demande de location pour \"{$tenue->titre}\" du {$data['date_debut']} au {$data['date_fin']}.",
            $reservation->id
        );

        // Email au propriétaire
        $proprietaire = $tenue->proprietaire;
        Mail::to($proprietaire->email)->queue(new NouvelleDemandeEmail(
            proprietaire_nom: $proprietaire->nom,
            locataire_nom:    $request->user()->nom,
            tenue_titre:      $tenue->titre,
            date_debut:       $data['date_debut'],
            date_fin:         $data['date_fin'],
            montant:          number_format($montantTotal, 2),
        ));

        return response()->json($reservation->load(['tenue', 'caution']), 201);
    }

    public function mesReservations(Request $request)
    {
        $reservations = Reservation::with(['tenue.photoPrincipale'])
            ->where('locataire_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($reservations);
    }

    public function demandesRecues(Request $request)
    {
        $reservations = Reservation::with(['locataire:id,nom,telephone,email', 'tenue:id,titre,type,utilisateur_id'])
            ->whereHas('tenue', fn(Builder $q) => $q->where('utilisateur_id', $request->user()->id))
            ->latest()
            ->get();

        return response()->json($reservations);
    }

    public function confirmer(Request $request, Reservation $reservation)
    {
        $this->autoriserProprietaire($reservation, $request->user());

        if ($reservation->statut === 'confirme') {
            return response()->json(['message' => 'Cette réservation est déjà confirmée.'], 422);
        }

        $reservation->update(['statut' => 'confirme']);

        // Générer le contrat automatiquement (une seule fois)
        Contrat::create([
            'reservation_id'   => $reservation->id,
            'proprietaire_id'  => $request->user()->id,
            'locataire_id'     => $reservation->locataire_id,
            'date_signature'   => now(),
            'conditions'       => Contrat::genererConditions($reservation->load('tenue')),
            'etat_tenue_depart' => 'Bon état général',
            'statut'           => 'actif',
        ]);

        // Notifier + email au locataire
        NotificationKasewa::envoyer(
            $reservation->locataire_id,
            'contrat',
            "Votre réservation pour \"{$reservation->tenue->titre}\" a été confirmée. Un contrat de location a été généré.",
            $reservation->id
        );

        $locataire = $reservation->locataire;
        Mail::to($locataire->email)->queue(new ReservationConfirmeeEmail(
            locataire_nom:    $locataire->nom,
            proprietaire_nom: $request->user()->nom,
            tenue_titre:      $reservation->tenue->titre,
            date_debut:       $reservation->date_debut->format('d/m/Y'),
            date_fin:         $reservation->date_fin->format('d/m/Y'),
            montant:          number_format((float) $reservation->montant_total, 2),
            caution:          number_format((float) $reservation->tenue->caution, 2),
        ));

        return response()->json($reservation->load('contrat'));
    }

    public function annuler(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        if ($reservation->locataire_id !== $user->id && $reservation->tenue->utilisateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $ancienStatut = $reservation->statut;
        $reservation->update(['statut' => 'annule']);

        if (in_array($ancienStatut, ['confirme', 'en_cours'])) {
            $reservation->tenue->update(['statut' => 'disponible']);
            if ($reservation->contrat) {
                $reservation->contrat->update(['statut' => 'annule']);
            }
        }

        if ($reservation->paiement && $reservation->paiement->statut === 'valide') {
            $reservation->paiement->update(['statut' => 'rembourse']);
        }

        if ($reservation->caution) {
            $reservation->caution->update(['statut' => 'liberee', 'date_liberation' => now()]);
        }

        // Notifier + email l'autre partie
        $estLocataire  = ($user->id === $reservation->locataire_id);
        $autreUserId   = $estLocataire ? $reservation->tenue->utilisateur_id : $reservation->locataire_id;
        $autreUser     = \App\Models\Utilisateur::find($autreUserId);
        $cautionMontant = $reservation->caution ? number_format((float) $reservation->caution->montant, 2) : '0.00';

        NotificationKasewa::envoyer(
            $autreUserId,
            'reservation',
            "La réservation pour \"{$reservation->tenue->titre}\" a été annulée.",
            $reservation->id
        );

        if ($autreUser) {
            Mail::to($autreUser->email)->queue(new ReservationAnnuleeEmail(
                destinataire_nom:  $autreUser->nom,
                tenue_titre:       $reservation->tenue->titre,
                date_debut:        $reservation->date_debut->format('d/m/Y'),
                date_fin:          $reservation->date_fin->format('d/m/Y'),
                annule_par:        $user->nom,
                caution_remboursee: $estLocataire && in_array($ancienStatut, ['confirme', 'en_cours']),
                caution:           $cautionMontant,
            ));
        }

        return response()->json(['message' => 'Réservation annulée.']);
    }

    public function terminer(Request $request, Reservation $reservation)
    {
        $this->autoriserProprietaire($reservation, $request->user());

        $reservation->update(['statut' => 'termine']);
        $reservation->tenue->update(['statut' => 'en_maintenance']);

        if ($reservation->caution) {
            $reservation->caution->update(['statut' => 'remboursee', 'date_liberation' => now()]);
        }

        if ($reservation->contrat) {
            $reservation->contrat->update(['statut' => 'termine']);
        }

        // Notifier le locataire
        NotificationKasewa::envoyer(
            $reservation->locataire_id,
            'reservation',
            "Votre location de \"{$reservation->tenue->titre}\" est terminée. La caution vous a été remboursée. Pensez à laisser une évaluation !",
            $reservation->id
        );

        // Notifier le propriétaire — tenue en maintenance
        NotificationKasewa::envoyer(
            $reservation->tenue->utilisateur_id,
            'reservation',
            "La location de \"{$reservation->tenue->titre}\" est terminée. La tenue est automatiquement passée en maintenance. Vérifiez-la puis remettez-la en disponible depuis votre stock.",
            $reservation->id
        );

        $locataire      = $reservation->locataire;
        $cautionMontant = $reservation->caution ? number_format((float) $reservation->caution->montant, 2) : '0.00';

        Mail::to($locataire->email)->queue(new LocationTermineeEmail(
            locataire_nom: $locataire->nom,
            tenue_titre:   $reservation->tenue->titre,
            date_debut:    $reservation->date_debut->format('d/m/Y'),
            date_fin:      $reservation->date_fin->format('d/m/Y'),
            caution:       $cautionMontant,
        ));

        return response()->json(['message' => 'Location terminée. Caution remboursée au locataire.']);
    }

    public function confirmerReception(Request $request, Reservation $reservation)
    {
        if ($reservation->locataire_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        if ($reservation->statut !== 'en_cours') {
            return response()->json(['message' => 'La réservation doit être en cours.'], 422);
        }

        $reservation->update(['reception_confirmee' => true]);

        NotificationKasewa::envoyer(
            $reservation->tenue->utilisateur_id,
            'reservation',
            "✅ Le locataire a confirmé la réception de \"{$reservation->tenue->titre}\". La location est en cours.",
            $reservation->id
        );

        return response()->json(['message' => 'Réception confirmée.']);
    }

    public function signalerRetour(Request $request, Reservation $reservation)
    {
        if ($reservation->locataire_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        if ($reservation->statut !== 'en_cours') {
            return response()->json(['message' => 'La réservation doit être en cours.'], 422);
        }

        $reservation->update(['retour_signale' => true]);

        NotificationKasewa::envoyer(
            $reservation->tenue->utilisateur_id,
            'reservation',
            "📦 Le locataire a retourné \"{$reservation->tenue->titre}\". Confirmez la réception pour clôturer la location.",
            $reservation->id
        );

        \App\Models\Message::create([
            'expediteur_id'   => $reservation->locataire_id,
            'destinataire_id' => $reservation->tenue->utilisateur_id,
            'reservation_id'  => $reservation->id,
            'contenu'         => "📦 J'ai retourné la tenue \"{$reservation->tenue->titre}\". Merci de confirmer la réception pour clôturer la location.",
        ]);

        return response()->json(['message' => 'Retour signalé. Le propriétaire a été notifié.']);
    }

    public function confirmerRetour(Request $request, Reservation $reservation)
    {
        $this->autoriserProprietaire($reservation, $request->user());

        if (!$reservation->retour_signale) {
            return response()->json(['message' => 'Le locataire n\'a pas encore signalé le retour.'], 422);
        }

        // Clôture complète de la location
        $reservation->update(['statut' => 'termine']);
        $reservation->tenue->update(['statut' => 'en_maintenance']);

        if ($reservation->caution) {
            $reservation->caution->update(['statut' => 'remboursee', 'date_liberation' => now()]);
        }
        if ($reservation->contrat) {
            $reservation->contrat->update(['statut' => 'termine']);
        }

        NotificationKasewa::envoyer(
            $reservation->locataire_id,
            'reservation',
            "✅ Le propriétaire a confirmé le retour de \"{$reservation->tenue->titre}\". La caution vous a été remboursée. Merci !",
            $reservation->id
        );

        NotificationKasewa::envoyer(
            $reservation->tenue->utilisateur_id,
            'reservation',
            "✅ Retour confirmé pour \"{$reservation->tenue->titre}\". La tenue est en maintenance — vérifiez-la puis remettez-la en disponible.",
            $reservation->id
        );

        return response()->json(['message' => 'Retour confirmé. Location clôturée.']);
    }

    public function ouvrirLitige(Request $request, Reservation $reservation)
    {
        $user = $request->user();

        $estLocataire   = $reservation->locataire_id === $user->id;
        $estProprietaire = $reservation->tenue && $reservation->tenue->utilisateur_id === $user->id;

        if (!$estLocataire && !$estProprietaire) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if (Litige::where('reservation_id', $reservation->id)->exists()) {
            return response()->json(['message' => 'Un litige est déjà ouvert pour cette réservation.'], 422);
        }

        $data = $request->validate([
            'description'    => 'required|string|min:20|max:1000',
            'photo_probleme' => 'nullable|image|max:5120',
        ]);

        $photoChemin = null;
        if ($request->hasFile('photo_probleme')) {
            $photoChemin = $request->file('photo_probleme')->store('litiges', 'public');
        }

        $litige = Litige::create([
            'reservation_id'  => $reservation->id,
            'ouvert_par_id'   => $user->id,
            'description'     => $data['description'],
            'photo_probleme'  => $photoChemin,
            'statut'          => 'ouvert',
        ]);

        // Identifier l'autre partie
        $autreId = $estLocataire
            ? $reservation->tenue->utilisateur_id
            : $reservation->locataire_id;

        $role = $estLocataire ? 'locataire' : 'propriétaire';

        // Message automatique à l'autre partie
        \App\Models\Message::create([
            'expediteur_id'   => $user->id,
            'destinataire_id' => $autreId,
            'reservation_id'  => $reservation->id,
            'contenu'         => "⚠️ Litige ouvert par le {$role} concernant la réservation #{$reservation->id} ({$reservation->tenue->titre}).\n\nMotif : {$data['description']}",
        ]);

        // Notification à l'autre partie
        NotificationKasewa::envoyer(
            $autreId,
            'litige',
            "Un litige a été ouvert par le {$role} pour la réservation #{$reservation->id}. Consultez votre messagerie.",
            $reservation->id
        );

        return response()->json(['message' => 'Litige ouvert avec succès.', 'litige' => $litige], 201);
    }

    private function autoriserProprietaire(Reservation $reservation, $user): void
    {
        if ($reservation->tenue->utilisateur_id !== $user->id) {
            abort(403, 'Non autorisé.');
        }
    }
}
