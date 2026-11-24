<?php

namespace App\Policies;

/**
 * Catégories d'actualités : accessible avec la permission « manage content ».
 */
class NewsCategoryPolicy extends BasePolicy
{
    protected string $permission = 'manage content';
}
