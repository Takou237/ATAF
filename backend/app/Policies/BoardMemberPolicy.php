<?php

namespace App\Policies;

/**
 * Bureau et conseil : accessible avec la permission « manage content ».
 */
class BoardMemberPolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
