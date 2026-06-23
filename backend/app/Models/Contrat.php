<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id', 'proprietaire_id', 'locataire_id',
        'date_signature', 'conditions',
        'etat_tenue_depart', 'etat_tenue_retour', 'statut',
    ];

    protected $casts = [
        'date_signature' => 'datetime',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function proprietaire()
    {
        return $this->belongsTo(Utilisateur::class, 'proprietaire_id');
    }

    public function locataire()
    {
        return $this->belongsTo(Utilisateur::class, 'locataire_id');
    }

    public static function genererConditions(Reservation $reservation): string
    {
        $tenue    = $reservation->tenue;
        $debut    = $reservation->date_debut->format('d/m/Y');
        $fin      = $reservation->date_fin->format('d/m/Y');
        $montant  = number_format($reservation->montant_total, 2) . ' DA';
        $caution  = number_format($tenue->caution, 2) . ' DA';

        return "CONTRAT DE LOCATION DE TENUE TRADITIONNELLE\n\n" .
               "Tenue : {$tenue->titre}\n" .
               "Période : du {$debut} au {$fin}\n" .
               "Montant total : {$montant}\n" .
               "Caution : {$caution}\n\n" .
               "CONDITIONS GÉNÉRALES :\n" .
               "1. Le locataire s'engage à restituer la tenue dans l'état initial.\n" .
               "2. Tout dommage constaté entraîne la retenue totale ou partielle de la caution.\n" .
               "3. Le retard de restitution est facturé au tarif journalier en vigueur.\n" .
               "4. La plateforme KASEWA.DZ prélève une commission de 15% sur le montant total.\n" .
               "5. En cas de litige, les parties s'engagent à utiliser le système de médiation de la plateforme.";
    }
}
