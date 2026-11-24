<?php

namespace App\Policies;

/**
 * Agences agréées : accessible avec la permission « manage agencies ».
 */
class AgencyPolicy extends BasePolicy
{
    protected string $permission = 'manage agencies';
}
