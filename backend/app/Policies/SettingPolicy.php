<?php

namespace App\Policies;

/**
 * Paramètres du site : accessible avec la permission « manage settings ».
 */
class SettingPolicy extends BasePolicy
{
    protected string $permission = 'manage settings';
}
