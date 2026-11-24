<?php

namespace App\Filament\Resources\Roles\Pages;

use App\Filament\Resources\Roles\RoleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class EditRole extends EditRecord
{
    protected static string $resource = RoleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->visible(fn (Role $record): bool => RoleResource::canDelete($record)),
        ];
    }

    /** Purge le cache Spatie pour que le nouveau découpage s'applique aussitôt. */
    protected function afterSave(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
