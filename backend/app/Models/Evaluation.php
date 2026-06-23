<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'reservation_id', 'auteur_id', 'note',
        'commentaire', 'auteur_type', 'statut',
    ];

    protected $casts = ['note' => 'integer'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function auteur()
    {
        return $this->belongsTo(Utilisateur::class, 'auteur_id');
    }
}
