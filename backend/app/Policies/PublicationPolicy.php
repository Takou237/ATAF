<?php

namespace App\Policies;

/**
 * Publications : accessible avec la permission « manage documents ».
 */
class PublicationPolicy extends BasePolicy
{
    protected string $permission = 'manage documents';
}
