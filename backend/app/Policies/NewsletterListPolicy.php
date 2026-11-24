<?php

namespace App\Policies;

/**
 * Listes de newsletter : accessible avec la permission « manage newsletter ».
 */
class NewsletterListPolicy extends BasePolicy
{
    protected string $permission = 'manage newsletter';
}
