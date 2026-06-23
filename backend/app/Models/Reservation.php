<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $locataire_id
 * @property int $tenue_id
 * @property \Illuminate\Support\Carbon|null $date_debut
 * @property \Illuminate\Support\Carbon|null $date_fin
 * @property float $montant_total
 * @property string $statut
 * @property float|null $note_locataire
 *
 * @property-read Utilisateur|null $locataire
 * @property-read Tenue|null $tenue
 * @property-read Paiement|null $paiement
 * @property-read Caution|null $caution
 * @property-read \Illuminate\Database\Eloquent\Collection|Evaluation[] $evaluations
 * @property-read \Illuminate\Database\Eloquent\Collection|Message[] $messages
 * @property-read Litige|null $litige
 */
class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'locataire_id', 'tenue_id', 'date_debut', 'date_fin',
        'montant_total', 'statut', 'note_locataire',
        'avec_livraison', 'frais_livraison', 'avec_retour', 'frais_retour',
        'frais_service', 'avec_essayage', 'paiement_proprietaire',
        'mode_livraison', 'mode_paiement',
        'adresse_livraison', 'tailles_choisies', 'quantite_demandee',
        'reception_confirmee', 'retour_signale',
    ];

    protected $casts = [
        'date_debut'       => 'date',
        'date_fin'         => 'date',
        'montant_total'    => 'decimal:2',
        'tailles_choisies' => 'array',
    ];

    public function locataire()
    {
        return $this->belongsTo(Utilisateur::class, 'locataire_id');
    }

    public function tenue()
    {
        return $this->belongsTo(Tenue::class);
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }

    public function caution()
    {
        return $this->hasOne(Caution::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function litige()
    {
        return $this->hasOne(Litige::class);
    }

    public function contrat()
    {
        return $this->hasOne(Contrat::class);
    }

    public function notifications()
    {
        return $this->hasMany(NotificationKasewa::class);
    }

    public function calculerTotal(): float
    {
        $nbJours = $this->date_debut->diffInDays($this->date_fin) + 1;
        return $nbJours * $this->tenue->prix_jour;
    }
}
