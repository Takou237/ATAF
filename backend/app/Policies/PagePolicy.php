<?php

namespace App\Policies;

/**
 * Pages éditoriales : accessible avec la permission « manage content ».
 */
class PagePolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
