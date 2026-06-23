<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use App\Models\Tenue;
use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\Litige;
use App\Models\ContactMessage;
use App\Models\Message;
use App\Mail\PaiementValideEmail;
use App\Mail\PaiementRejeteEmail;
use App\Mail\VerificationValideeEmail;
use App\Mail\VerificationRejeteeEmail;
use App\Models\NotificationKasewa;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    /** Lit les taux de commission depuis la table parametres (fallback sur valeurs par défaut). */
    private function tauxCommissions(): array
    {
        $tableName   = 'parametres';
        /** @var \Illuminate\Database\Query\Builder $paramsQuery */
        $paramsQuery = DB::table($tableName);
        $paramsQuery->whereIn('cle', ['commission_boutique', 'commission_investisseur']);
        $params = $paramsQuery->pluck('valeur', 'cle');

        return [
            'boutique'     => (float) ($params['commission_boutique']     ?? 15) / 100,
            'investisseur' => (float) ($params['commission_investisseur'] ?? 19) / 100,
        ];
    }

    public function stats()
    {
        /** @var Builder $qBoutique */
        $qBoutique = Reservation::query();
        $qBoutique->where(['statut' => 'termine']);
        $qBoutique->whereHas('tenue.proprietaire', fn(Builder $q) => $q->where(['type_proprietaire' => 'boutique']));
        $revenusBoutique = $qBoutique->sum('montant_total');

        /** @var Builder $qInvestisseur */
        $qInvestisseur = Reservation::query();
        $qInvestisseur->where(['statut' => 'termine']);
        $qInvestisseur->whereHas('tenue.proprietaire', fn(Builder $q) => $q->where(['type_proprietaire' => 'investisseur']));
        $revenusInvestisseur = $qInvestisseur->sum('montant_total');

        /** @var Builder $qEnCours */
        $qEnCours = Reservation::query();
        $qEnCours->where(['statut' => 'en_cours']);
        /** @var Builder $qLitiges */
        $qLitiges = Litige::query();
        $qLitiges->where(['statut' => 'ouvert']);

        $taux = $this->tauxCommissions();

        return response()->json([
            'utilisateurs'               => Utilisateur::count(),
            'tenues'                     => Tenue::count(),
            'reservations'               => Reservation::count(),
            'en_cours'                   => $qEnCours->count(),
            'litiges_ouverts'            => $qLitiges->count(),
            'revenus_total'              => $revenusBoutique + $revenusInvestisseur,
            'revenus_boutique'           => $revenusBoutique,
            'revenus_investisseur'       => $revenusInvestisseur,
            'commission_total'           => round($revenusBoutique * $taux['boutique'] + $revenusInvestisseur * $taux['investisseur']),
            'taux_commission_boutique'   => (int) round($taux['boutique'] * 100),
            'taux_commission_investisseur' => (int) round($taux['investisseur'] * 100),
        ]);
    }

    public function statsMenusuelles()
    {
        $mois = collect(range(6, 0))->map(function ($i) {
            $date  = now()->subMonths($i);
            $label = $date->locale('fr')->isoFormat('MMM');
            $year  = $date->year;
            $month = $date->month;

            /** @var Builder $qLoc */
            $qLoc = Reservation::query();
            $qLoc->whereYear('created_at', $year);
            $qLoc->whereMonth('created_at', $month);
            $locations = $qLoc->count();

            /** @var Builder $qRev */
            $qRev = Reservation::query();
            $qRev->whereYear('created_at', $year);
            $qRev->whereMonth('created_at', $month);
            $qRev->where(['statut' => 'termine']);
            $revenus = $qRev->sum('montant_total');

            return [
                'mois'      => ucfirst($label),
                'locations' => $locations,
                'revenus'   => (int) $revenus,
            ];
        });

        return response()->json($mois);
    }

    public function utilisateurs(Request $request)
    {
        /** @var Builder $builder */
        $builder = Utilisateur::query();
        $builder->withCount(['tenues', 'reservations']);
        $builder->latest();
        $utilisateurs = $builder->paginate(20);

        return response()->json($utilisateurs);
    }

    public function suspendreUtilisateur(Utilisateur $utilisateur)
    {
        $estActif = $utilisateur->verifie;
        $utilisateur->update(['verifie' => !$estActif]);
        if ($estActif) {
            $utilisateur->tokens()->delete();
        }
        return response()->json([
            'message' => $estActif ? 'Utilisateur suspendu.' : 'Compte réactivé.',
            'verifie' => !$estActif,
        ]);
    }

    public function tenues(Request $request)
    {
        /** @var Builder $builder */
        $builder = Tenue::query();
        $builder->latest();
        $builder->with([
            'proprietaire:id,nom,wilaya',
            'photos' => fn($q) => $q->orderBy('principale', 'desc')->limit(1),
        ]);
        $tenues = $builder->paginate(20);

        return response()->json($tenues);
    }

    public function supprimerTenue(Tenue $tenue)
    {
        $tenue->update(['statut' => 'inactif']);
        return response()->json(['message' => 'Annonce désactivée.']);
    }

    public function validerTenue(Tenue $tenue)
    {
        $tenue->update(['statut' => 'disponible']);

        NotificationKasewa::envoyer(
            $tenue->utilisateur_id,
            'reservation',
            "Votre annonce \"{$tenue->titre}\" a été validée et est maintenant visible dans le catalogue."
        );

        return response()->json(['message' => 'Annonce validée et publiée.']);
    }

    public function rejeterTenue(Request $request, Tenue $tenue)
    {
        $data = $request->validate(['motif' => 'required|string|max:500']);

        $tenue->update(['statut' => 'inactif']);

        NotificationKasewa::envoyer(
            $tenue->utilisateur_id,
            'reservation',
            "Votre annonce \"{$tenue->titre}\" a été rejetée. Motif : {$data['motif']}"
        );

        return response()->json(['message' => 'Annonce rejetée.']);
    }

    public function tenuesEnAttente()
    {
        /** @var Builder $builder */
        $builder = Tenue::query();
        $builder->where(['statut' => 'en_attente']);
        $builder->latest();
        $builder->with([
            'proprietaire:id,nom,wilaya,type_proprietaire',
            'photos' => fn($q) => $q->orderBy('principale', 'desc')->limit(1),
        ]);
        $tenues = $builder->get();

        return response()->json($tenues);
    }

    public function litiges(Request $request)
    {
        /** @var Builder $litigesQuery */
        $litigesQuery = Litige::query();
        $litigesQuery->with(['reservation.locataire:id,nom', 'reservation.tenue', 'ouvertPar:id,nom']);
        $litigesQuery->latest();
        $litiges = $litigesQuery->paginate(10);

        return response()->json($litiges);
    }

    public function resoudreLitige(Request $request, Litige $litige)
    {
        $data = $request->validate([
            'decision_admin' => 'required|string',
        ]);

        $litige->update([
            'statut'         => 'clos',
            'decision_admin' => $data['decision_admin'],
        ]);

        return response()->json($litige);
    }

    public function verificationsEnAttente()
    {
        /** @var Builder $usersQuery */
        $usersQuery = Utilisateur::query();
        $usersQuery->whereIn('statut_verification', ['en_attente', 'non_soumis', 'rejete']);
        $usersQuery->where([['role', '!=', 'admin']]);
        $usersQuery->select('id', 'nom', 'email', 'role', 'telephone', 'cin_numero',
                            'cin_photo_recto', 'cin_photo_verso', 'selfie_photo',
                            'ccp_photo', 'doc_boutique_photo',
                            'statut_verification', 'motif_rejet', 'verifie', 'created_at');
        $usersQuery->orderByRaw("FIELD(statut_verification, 'en_attente', 'non_soumis', 'rejete')");
        $usersQuery->latest();
        $users = $usersQuery->get()->makeVisible([
            'cin_photo_recto', 'cin_photo_verso', 'selfie_photo', 'ccp_photo', 'doc_boutique_photo',
        ]);

        return response()->json($users);
    }

    public function validerVerification(Utilisateur $utilisateur)
    {
        $utilisateur->update([
            'statut_verification' => 'verifie',
            'verifie'             => true,
            'motif_rejet'         => null,
        ]);

        NotificationKasewa::envoyer(
            $utilisateur->id,
            'reservation',
            'Votre identité a été vérifiée avec succès. Vous pouvez maintenant publier des annonces et effectuer des réservations.'
        );

        Mail::to($utilisateur->email)->queue(new VerificationValideeEmail(
            nom:  $utilisateur->nom,
            role: $utilisateur->role,
        ));

        return response()->json(['message' => 'Compte vérifié avec succès.']);
    }

    public function rejeterVerification(Request $request, Utilisateur $utilisateur)
    {
        $data = $request->validate(['motif' => 'required|string|max:500']);
        $utilisateur->update([
            'statut_verification' => 'rejete',
            'verifie'             => false,
            'motif_rejet'         => $data['motif'],
        ]);

        NotificationKasewa::envoyer(
            $utilisateur->id,
            'reservation',
            "Votre vérification d'identité a été rejetée. Motif : {$data['motif']}"
        );

        Mail::to($utilisateur->email)->queue(new VerificationRejeteeEmail(
            nom:   $utilisateur->nom,
            motif: $data['motif'],
        ));

        return response()->json(['message' => 'Vérification rejetée.']);
    }

    // ── Paiements ──────────────────────────────────────────────────────────

    public function paiementsEnAttente()
    {
        /** @var Builder $paiementsQuery */
        $paiementsQuery = Paiement::query();
        $paiementsQuery->with(['reservation.locataire:id,nom,email', 'reservation.tenue:id,titre']);
        $paiementsQuery->where(['statut' => 'en_attente']);
        $paiementsQuery->latest();
        $paiements = $paiementsQuery->get();

        return response()->json($paiements);
    }

    public function validerPaiement(Paiement $paiement)
    {
        $paiement->update(['statut' => 'valide']);

        $reservation = $paiement->reservation;
        $reservation->update(['statut' => 'en_cours']);
        $reservation->tenue->update(['statut' => 'louee']);

        NotificationKasewa::envoyer(
            $reservation->locataire_id,
            'paiement',
            "Votre paiement de {$paiement->montant} DA pour \"{$reservation->tenue->titre}\" a été validé. La location est maintenant en cours.",
            $reservation->id
        );

        $locataire = $reservation->locataire;
        Mail::to($locataire->email)->queue(new PaiementValideEmail(
            locataire_nom: $locataire->nom,
            tenue_titre:   $reservation->tenue->titre,
            montant:       number_format((float) $paiement->montant, 2),
            mode:          strtoupper(str_replace('_', ' ', $paiement->mode)),
            reference:     $paiement->ref_transaction ?? '-',
            date_debut:    $reservation->date_debut->format('d/m/Y'),
            date_fin:      $reservation->date_fin->format('d/m/Y'),
        ));

        return response()->json(['message' => 'Paiement validé. Location en cours.']);
    }

    public function rejeterPaiement(Request $request, Paiement $paiement)
    {
        $data = $request->validate(['motif' => 'nullable|string|max:500']);

        $paiement->update(['statut' => 'echoue']);

        $reservation = $paiement->reservation;
        $reservation->update(['statut' => 'annule']);

        if ($reservation->caution) {
            $reservation->caution->update(['statut' => 'liberee', 'date_liberation' => now()]);
        }

        $motif = $data['motif'] ?? 'Motif non précisé';
        NotificationKasewa::envoyer(
            $reservation->locataire_id,
            'paiement',
            "Votre paiement pour \"{$reservation->tenue->titre}\" a été rejeté. Motif : {$motif}",
            $reservation->id
        );

        $locataire = $reservation->locataire;
        Mail::to($locataire->email)->queue(new PaiementRejeteEmail(
            locataire_nom: $locataire->nom,
            tenue_titre:   $reservation->tenue->titre,
            motif:         $motif,
        ));

        return response()->json(['message' => 'Paiement rejeté. Réservation annulée.']);
    }

    public function tousLesPaiements()
    {
        /** @var Builder $tousQuery */
        $tousQuery = Paiement::query();
        $tousQuery->with(['reservation.locataire:id,nom,email', 'reservation.tenue:id,titre']);
        $tousQuery->latest();
        $paiements = $tousQuery->paginate(20);

        return response()->json($paiements);
    }

    // ── Virements propriétaires ─────────────────────────────────────────────

    public function reservationsARegler()
    {
        /** @var Builder $resaQuery */
        $resaQuery = Reservation::query();
        $resaQuery->with([
            'locataire:id,nom,email,telephone',
            'tenue:id,titre,caution,utilisateur_id',
            'tenue.proprietaire:id,nom,email,telephone,rib_barid,type_proprietaire',
            'caution',
        ]);
        $resaQuery->where(['statut' => 'termine']);
        $resaQuery->where(['paiement_proprietaire' => 'en_attente']);
        $resaQuery->latest();
        $reservations = $resaQuery->get();

        return response()->json($reservations);
    }

    public function payerProprietaire(Reservation $reservation)
    {
        if ($reservation->statut !== 'termine') {
            return response()->json(['message' => 'La location n\'est pas encore terminée.'], 422);
        }

        $reservation->update(['paiement_proprietaire' => 'paye']);

        $proprietaire = $reservation->tenue->proprietaire;
        $taux = $this->tauxCommissions();
        $commissionRate = ($proprietaire->type_proprietaire === 'boutique') ? $taux['boutique'] : $taux['investisseur'];
        $net = round($reservation->montant_total * (1 - $commissionRate));
        $pct = (int) round($commissionRate * 100);

        NotificationKasewa::envoyer(
            $proprietaire->id,
            'paiement',
            "Virement reçu : {$net} DA pour la location de \"{$reservation->tenue->titre}\" (" . (100 - $pct) . "% du montant total).",
            $reservation->id
        );

        return response()->json(['message' => "Virement de {$net} DA confirmé pour {$proprietaire->nom} (commission {$pct}%)."]);
    }

    // ── Messages de contact ────────────────────────────────────────────────

    public function contactMessages()
    {
        /** @var Builder $msgQuery */
        $msgQuery = ContactMessage::query()->latest();
        $messages = $msgQuery->get();
        return response()->json($messages);
    }

    public function marquerMessageLu(ContactMessage $contactMessage)
    {
        $contactMessage->update(['lu' => true]);
        return response()->json($contactMessage);
    }

    public function supprimerMessage(ContactMessage $contactMessage)
    {
        $contactMessage->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }

    // ── Message interne admin → utilisateur ───────────────────────────────

    public function envoyerMessage(Request $request, Utilisateur $utilisateur)
    {
        $data = $request->validate([
            'contenu' => 'required|string|min:5|max:1000',
        ]);

        $admin = $request->user();

        Message::create([
            'expediteur_id'   => $admin->id,
            'destinataire_id' => $utilisateur->id,
            'contenu'         => $data['contenu'],
        ]);

        NotificationKasewa::envoyer(
            $utilisateur->id,
            'message',
            "Nouveau message de l'administration KASEWA : " . mb_substr($data['contenu'], 0, 80) . (mb_strlen($data['contenu']) > 80 ? '...' : '')
        );

        return response()->json(['message' => 'Message envoyé.']);
    }
}
