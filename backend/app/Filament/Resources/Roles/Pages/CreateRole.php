<?php

namespace App\Filament\Resources\Roles\Pages;

use App\Filament\Resources\Roles\RoleResource;
use Filament\Resources\Pages\CreateRecord;
use Spatie\Permission\PermissionRegistrar;

class CreateRole extends CreateRecord
{
    protected static string $resource = RoleResource::class;

    /**
     * Les permissions sont mises en cache par utilisateur : sans purge, un
     * changement de rôle ne serait pas visible immédiatement.
     */
    protected function afterCreate(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
