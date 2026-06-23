<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['nom', 'email', 'sujet', 'message', 'lu', 'reponse_admin'];

    protected $casts = ['lu' => 'boolean'];
}
