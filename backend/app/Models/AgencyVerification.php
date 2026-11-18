<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgencyVerification extends Model
{
    public const UPDATED_AT = null;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'found' => 'boolean',
            'created_at' => 'datetime',
        ];
    }
}
