<?php

namespace App\Policies;

/**
 * Médiathèque : accessible avec la permission « manage content ».
 */
class MediaItemPolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
