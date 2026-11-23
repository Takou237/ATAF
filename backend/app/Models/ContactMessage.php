<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactMessage extends Model
{
    public const STATUSES = [
        'new' => 'Nouveau',
        'in_progress' => 'En cours',
        'done' => 'Traité',
        'spam' => 'Spam',
    ];

    protected $guarded = ['id'];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
