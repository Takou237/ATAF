<?php

namespace App\Policies;

/**
 * Messages de contact : accessible avec la permission « manage content ».
 */
class ContactMessagePolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
