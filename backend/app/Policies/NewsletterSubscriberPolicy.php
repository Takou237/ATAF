<?php

namespace App\Policies;

/**
 * Abonnés à la newsletter : accessible avec la permission « manage newsletter ».
 */
class NewsletterSubscriberPolicy extends BasePolicy
{
    protected string $permission = 'manage newsletter';
}
