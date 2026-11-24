<?php

namespace App\Policies;

/**
 * Demandes d'agrément : accessible avec la permission « manage agencies ».
 */
class AgencyApplicationPolicy extends BasePolicy
{
    protected string $permission = 'manage agencies';
}
