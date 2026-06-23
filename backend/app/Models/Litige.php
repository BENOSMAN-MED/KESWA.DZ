<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Litige extends Model
{
    protected $fillable = [
        'reservation_id', 'ouvert_par_id',
        'description', 'photo_probleme', 'statut', 'decision_admin',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function ouvertPar()
    {
        return $this->belongsTo(Utilisateur::class, 'ouvert_par_id');
    }
}
