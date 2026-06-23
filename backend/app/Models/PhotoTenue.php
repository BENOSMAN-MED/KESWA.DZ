<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhotoTenue extends Model
{
    protected $table = 'photos_tenue';

    protected $fillable = ['tenue_id', 'chemin', 'principale'];

    protected $casts = ['principale' => 'boolean'];

    public function tenue()
    {
        return $this->belongsTo(Tenue::class);
    }
}
