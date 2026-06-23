<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'expediteur_id', 'destinataire_id',
        'reservation_id', 'contenu', 'lu',
    ];

    protected $casts = ['lu' => 'boolean'];

    public function expediteur()
    {
        return $this->belongsTo(Utilisateur::class, 'expediteur_id');
    }

    public function destinataire()
    {
        return $this->belongsTo(Utilisateur::class, 'destinataire_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
