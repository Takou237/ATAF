<?php

namespace App\Policies;

/**
 * Membres : accessible avec la permission « manage members ».
 */
class MemberPolicy extends BasePolicy
{
    protected string $permission = 'manage members';
}
