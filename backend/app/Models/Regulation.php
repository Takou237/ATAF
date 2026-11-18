<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Regulation extends Model
{
    use HasSlug;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'published_on' => 'date',
            'is_public' => 'boolean',
        ];
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
