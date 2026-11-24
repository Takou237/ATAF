<?php

namespace App\Policies;

/**
 * Utilisateurs du back-office : accessible avec la permission « manage users ».
 */
class UserPolicy extends BasePolicy
{
    protected string $permission = 'manage users';
}
