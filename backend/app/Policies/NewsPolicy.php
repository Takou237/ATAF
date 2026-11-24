<?php

namespace App\Policies;

/**
 * Actualités : accessible avec la permission « manage content ».
 */
class NewsPolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
