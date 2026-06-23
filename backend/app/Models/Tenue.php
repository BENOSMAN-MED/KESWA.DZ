<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenue extends Model
{
    use HasFactory;

    protected $fillable = [
        'utilisateur_id', 'titre', 'type', 'taille',
        'tailles', 'couleurs', 'quantite', 'quantites_par_taille',
        'description', 'prix_jour', 'caution', 'statut',
        'wilaya', 'ville',
    ];

    protected $casts = [
        'prix_jour'            => 'decimal:2',
        'caution'              => 'decimal:2',
        'tailles'              => 'array',
        'couleurs'             => 'array',
        'quantite'             => 'integer',
        'quantites_par_taille' => 'array',
    ];

    public function proprietaire()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function photos()
    {
        return $this->hasMany(PhotoTenue::class, 'tenue_id');
    }

    public function photoPrincipale()
    {
        return $this->hasOne(PhotoTenue::class, 'tenue_id')->where('principale', true);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'tenue_id');
    }

    public function evaluations()
    {
        return $this->hasManyThrough(
            \App\Models\Evaluation::class,
            Reservation::class,
            'tenue_id',
            'reservation_id',
            'id',
            'id'
        );
    }

    public function stockDisponible(string $dateDebut, string $dateFin): int
    {
        // Le jour suivant la fin d'une location est bloqué (jour de laverie).
        // Une réservation [debut, fin] occupe donc [debut, fin+1jour] effectivement.
        $reservationsActives = $this->reservations()
            ->whereIn('statut', ['demande', 'confirme', 'en_cours'])
            ->where(function ($q) use ($dateDebut, $dateFin) {
                $q->where('date_debut', '<=', $dateFin)
                  ->whereRaw("DATE_ADD(date_fin, INTERVAL 1 DAY) >= ?", [$dateDebut]);
            })->count();

        return max(0, ($this->quantite ?? 1) - $reservationsActives);
    }

    public function datesBloquees(): array
    {
        return $this->reservations()
            ->whereIn('statut', ['demande', 'confirme', 'en_cours'])
            ->select('date_debut', 'date_fin')
            ->get()
            ->map(function ($r) {
                return [
                    'debut' => $r->date_debut->format('Y-m-d'),
                    'fin'   => $r->date_fin->addDay()->format('Y-m-d'), // +1 jour laverie
                ];
            })->toArray();
    }

    public function estDisponible(string $dateDebut, string $dateFin): bool
    {
        return $this->stockDisponible($dateDebut, $dateFin) > 0;
    }
}
