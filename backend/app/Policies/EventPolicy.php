<?php

namespace App\Policies;

/**
 * Événements : accessible avec la permission « manage events ».
 */
class EventPolicy extends BasePolicy
{
    protected string $permission = 'manage events';
}
