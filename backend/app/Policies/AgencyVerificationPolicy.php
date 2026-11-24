<?php

namespace App\Policies;

/**
 * Historique des vérifications d'agrément : accessible avec la permission « manage agencies ».
 */
class AgencyVerificationPolicy extends BasePolicy
{
    protected string $permission = 'manage agencies';
}
