<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom', 'email', 'password', 'telephone', 'wilaya', 'rib_barid',
        'role', 'type_proprietaire', 'nom_boutique', 'adresse_boutique',
        'score_rep', 'verifie', 'photo_profil',
        'statut_verification', 'motif_rejet', 'cin_numero',
        'cin_photo_recto', 'cin_photo_verso', 'selfie_photo',
        'ccp_photo', 'doc_boutique_photo',
        'favoris',
    ];

    protected $hidden = [
        'password', 'remember_token',
        'cin_photo_recto', 'cin_photo_verso', 'selfie_photo',
        'ccp_photo', 'doc_boutique_photo',
    ];

    protected $casts = [
        'verifie'    => 'boolean',
        'score_rep'  => 'decimal:2',
        'favoris'    => 'array',
    ];

    public function tenues()
    {
        return $this->hasMany(Tenue::class, 'utilisateur_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'locataire_id');
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'expediteur_id');
    }

    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'destinataire_id');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'auteur_id');
    }

    public function litiges()
    {
        return $this->hasMany(Litige::class, 'ouvert_par_id');
    }

    public function notifications()
    {
        return $this->hasMany(NotificationKasewa::class, 'utilisateur_id');
    }
}
