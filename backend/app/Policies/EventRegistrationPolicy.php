<?php

namespace App\Policies;

/**
 * Inscriptions aux événements : accessible avec la permission « manage events ».
 */
class EventRegistrationPolicy extends BasePolicy
{
    protected string $permission = 'manage events';
}
