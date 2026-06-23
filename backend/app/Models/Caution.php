<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caution extends Model
{
    protected $fillable = [
        'reservation_id', 'montant', 'statut',
        'date_liberation', 'motif_retenue',
    ];

    protected $casts = [
        'montant'         => 'decimal:2',
        'date_liberation' => 'date',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
