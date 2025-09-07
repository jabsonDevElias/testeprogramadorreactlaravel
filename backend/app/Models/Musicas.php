<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Musicas extends Model
{
    protected $fillable = [
        'titulo',
        'visualizacoes',
        'youtube_id',
        'thumb',
        'aprovado',
        'user_id'
    ];
}
