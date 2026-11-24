<?php

namespace App\Policies;

/**
 * Rôles et permissions : réservés aux gestionnaires d'utilisateurs, puisque
 * attribuer un rôle revient à attribuer des droits.
 */
class RolePolicy extends BasePolicy
{
    protected string $permission = 'manage users';
}
