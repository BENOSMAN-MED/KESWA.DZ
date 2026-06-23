<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationKasewa extends Model
{
    use HasFactory;

    protected $table = 'notifications_kasewa';

    protected $fillable = [
        'utilisateur_id', 'reservation_id', 'type', 'contenu', 'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public static function envoyer(int $utilisateurId, string $type, string $contenu, ?int $reservationId = null): self
    {
        return self::create([
            'utilisateur_id' => $utilisateurId,
            'reservation_id' => $reservationId,
            'type'           => $type,
            'contenu'        => $contenu,
            'lu'             => false,
        ]);
    }
}
