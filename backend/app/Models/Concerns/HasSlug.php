<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasSlug
{
    protected static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $base = Str::slug($model->title ?? $model->name ?? 'item');
                $slug = $base;
                $i = 2;

                while (static::query()->where('slug', $slug)->exists()) {
                    $slug = $base.'-'.$i++;
                }

                $model->slug = $slug;
            }
        });
    }
}
