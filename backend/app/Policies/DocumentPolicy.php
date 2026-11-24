<?php

namespace App\Policies;

/**
 * Documents : accessible avec la permission « manage documents ».
 */
class DocumentPolicy extends BasePolicy
{
    protected string $permission = 'manage documents';
}
