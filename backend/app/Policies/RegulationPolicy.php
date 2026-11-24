<?php

namespace App\Policies;

/**
 * Réglementations : accessible avec la permission « manage documents ».
 */
class RegulationPolicy extends BasePolicy
{
    protected string $permission = 'manage documents';
}
