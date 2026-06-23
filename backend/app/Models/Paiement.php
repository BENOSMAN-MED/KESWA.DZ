<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'reservation_id', 'ref_transaction',
        'montant', 'mode', 'statut',
        'recu_photo', 'numero_compte',
    ];

    protected $casts = ['montant' => 'decimal:2'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
