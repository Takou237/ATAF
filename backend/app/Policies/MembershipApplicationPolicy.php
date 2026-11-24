<?php

namespace App\Policies;

/**
 * Demandes d'adhésion : accessible avec la permission « manage members ».
 */
class MembershipApplicationPolicy extends BasePolicy
{
    protected string $permission = 'manage members';
}
