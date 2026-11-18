<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasSlug;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'published_on' => 'date',
            'file_size' => 'integer',
            'download_count' => 'integer',
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
