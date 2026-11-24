<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['visited_at' => 'datetime'];
    }
}
