<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'consent_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $subscriber) {
            $subscriber->token ??= Str::random(64);
        });
    }

    public function list(): BelongsTo
    {
        return $this->belongsTo(NewsletterList::class, 'newsletter_list_id');
    }
}
