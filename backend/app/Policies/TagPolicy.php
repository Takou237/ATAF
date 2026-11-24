<?php

namespace App\Policies;

/**
 * Étiquettes : accessible avec la permission « manage content ».
 */
class TagPolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
