<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $reservation_id
 * @property numeric $montant
 * @property string $statut
 * @property \Illuminate\Support\Carbon|null $date_liberation
 * @property string|null $motif_retenue
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Reservation $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereDateLiberation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereMontant($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereMotifRetenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Caution whereUpdatedAt($value)
 */
	class Caution extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nom
 * @property string $email
 * @property string $sujet
 * @property string $message
 * @property bool $lu
 * @property string|null $reponse_admin
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereLu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereReponseAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereSujet($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ContactMessage whereUpdatedAt($value)
 */
	class ContactMessage extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $reservation_id
 * @property int $proprietaire_id
 * @property int $locataire_id
 * @property \Illuminate\Support\Carbon|null $date_signature
 * @property string $conditions
 * @property string|null $etat_tenue_depart
 * @property string|null $etat_tenue_retour
 * @property string $statut
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Utilisateur $locataire
 * @property-read \App\Models\Utilisateur $proprietaire
 * @property-read \App\Models\Reservation $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereConditions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereDateSignature($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereEtatTenueDepart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereEtatTenueRetour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereLocataireId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereProprietaireId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contrat whereUpdatedAt($value)
 */
	class Contrat extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $reservation_id
 * @property int $auteur_id
 * @property int $note
 * @property string|null $commentaire
 * @property string $auteur_type
 * @property string $statut
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Utilisateur $auteur
 * @property-read \App\Models\Reservation $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereAuteurId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereAuteurType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereCommentaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Evaluation whereUpdatedAt($value)
 */
	class Evaluation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $reservation_id
 * @property int $ouvert_par_id
 * @property string $description
 * @property string|null $photo_probleme
 * @property string $statut
 * @property string|null $decision_admin
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Utilisateur $ouvertPar
 * @property-read \App\Models\Reservation $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereDecisionAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereOuvertParId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige wherePhotoProbleme($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Litige whereUpdatedAt($value)
 */
	class Litige extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $expediteur_id
 * @property int $destinataire_id
 * @property int|null $reservation_id
 * @property string $contenu
 * @property bool $lu
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Utilisateur $destinataire
 * @property-read \App\Models\Utilisateur $expediteur
 * @property-read \App\Models\Reservation|null $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereContenu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereDestinataireId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereExpediteurId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereLu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Message whereUpdatedAt($value)
 */
	class Message extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $utilisateur_id
 * @property int|null $reservation_id
 * @property string $type
 * @property string $contenu
 * @property bool $lu
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Reservation|null $reservation
 * @property-read \App\Models\Utilisateur $utilisateur
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereContenu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereLu($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationKasewa whereUtilisateurId($value)
 */
	class NotificationKasewa extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $reservation_id
 * @property string|null $ref_transaction
 * @property numeric $montant
 * @property string $mode
 * @property string $statut
 * @property string|null $recu_photo
 * @property string|null $numero_compte
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Reservation $reservation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereMode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereMontant($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereNumeroCompte($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereRecuPhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereRefTransaction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereReservationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Paiement whereUpdatedAt($value)
 */
	class Paiement extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $tenue_id
 * @property string $chemin
 * @property bool $principale
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Tenue $tenue
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue whereChemin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue wherePrincipale($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue whereTenueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PhotoTenue whereUpdatedAt($value)
 */
	class PhotoTenue extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $locataire_id
 * @property int $tenue_id
 * @property \Illuminate\Support\Carbon|null $date_debut
 * @property \Illuminate\Support\Carbon|null $date_fin
 * @property float $montant_total
 * @property string $statut
 * @property float|null $note_locataire
 * @property-read Utilisateur|null $locataire
 * @property-read Tenue|null $tenue
 * @property-read Paiement|null $paiement
 * @property-read Caution|null $caution
 * @property-read \Illuminate\Database\Eloquent\Collection|Evaluation[] $evaluations
 * @property-read \Illuminate\Database\Eloquent\Collection|Message[] $messages
 * @property-read Litige|null $litige
 * @property int|null $nb_jours
 * @property int $avec_livraison
 * @property numeric $frais_livraison
 * @property int $avec_retour
 * @property numeric $frais_retour
 * @property numeric $frais_service
 * @property int $avec_essayage
 * @property string $mode_livraison
 * @property string $mode_paiement
 * @property string|null $adresse_livraison
 * @property array<array-key, mixed>|null $tailles_choisies
 * @property int $quantite_demandee
 * @property int $reception_confirmee
 * @property int $retour_signale
 * @property string $paiement_proprietaire
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Contrat|null $contrat
 * @property-read int|null $evaluations_count
 * @property-read int|null $messages_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\NotificationKasewa> $notifications
 * @property-read int|null $notifications_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereAdresseLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereAvecEssayage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereAvecLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereAvecRetour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereDateDebut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereDateFin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereFraisLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereFraisRetour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereFraisService($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereLocataireId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereModeLivraison($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereModePaiement($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereMontantTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereNbJours($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereNoteLocataire($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation wherePaiementProprietaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereQuantiteDemandee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereReceptionConfirmee($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereRetourSignale($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereTaillesChoisies($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereTenueId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reservation whereUpdatedAt($value)
 */
	class Reservation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $utilisateur_id
 * @property string $titre
 * @property string $type
 * @property string $taille
 * @property array<array-key, mixed>|null $tailles
 * @property array<array-key, mixed>|null $couleurs
 * @property int $quantite
 * @property array<array-key, mixed>|null $quantites_par_taille
 * @property string|null $description
 * @property numeric $prix_jour
 * @property numeric $caution
 * @property string $statut
 * @property string|null $wilaya
 * @property string|null $ville
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evaluation> $evaluations
 * @property-read int|null $evaluations_count
 * @property-read \App\Models\PhotoTenue|null $photoPrincipale
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PhotoTenue> $photos
 * @property-read int|null $photos_count
 * @property-read \App\Models\Utilisateur $proprietaire
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Reservation> $reservations
 * @property-read int|null $reservations_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereCaution($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereCouleurs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue wherePrixJour($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereQuantite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereQuantitesParTaille($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereStatut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereTaille($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereTailles($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereTitre($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereUtilisateurId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereVille($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tenue whereWilaya($value)
 */
	class Tenue extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $nom
 * @property string $email
 * @property string $password
 * @property string|null $telephone
 * @property string|null $rib_barid
 * @property array<array-key, mixed>|null $favoris
 * @property string $role
 * @property string|null $type_proprietaire
 * @property string|null $nom_boutique
 * @property string|null $adresse_boutique
 * @property numeric $score_rep
 * @property bool $verifie
 * @property string|null $cin_numero
 * @property string|null $cin_photo_recto
 * @property string|null $cin_photo_verso
 * @property string|null $selfie_photo
 * @property string|null $ccp_photo
 * @property string|null $doc_boutique_photo
 * @property string|null $wilaya
 * @property string $statut_verification
 * @property string|null $motif_rejet
 * @property string|null $photo_profil
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evaluation> $evaluations
 * @property-read int|null $evaluations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Litige> $litiges
 * @property-read int|null $litiges_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messagesEnvoyes
 * @property-read int|null $messages_envoyes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Message> $messagesRecus
 * @property-read int|null $messages_recus_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\NotificationKasewa> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Reservation> $reservations
 * @property-read int|null $reservations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tenue> $tenues
 * @property-read int|null $tenues_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereAdresseBoutique($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereCcpPhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereCinNumero($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereCinPhotoRecto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereCinPhotoVerso($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereDocBoutiquePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereFavoris($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereMotifRejet($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereNom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereNomBoutique($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur wherePhotoProfil($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereRibBarid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereScoreRep($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereSelfiePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereStatutVerification($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereTelephone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereTypeProprietaire($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereVerifie($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Utilisateur whereWilaya($value)
 */
	class Utilisateur extends \Eloquent {}
}

