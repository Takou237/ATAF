<?php

namespace App\Filament\Resources\Roles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class RolesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Rôle')
                    ->badge()
                    ->color('primary')
                    ->searchable(),
                TextColumn::make('permissions.name')
                    ->label('Permissions')
                    ->badge()
                    ->color('gray')
                    ->placeholder('Aucune'),
                TextColumn::make('users_count')
                    ->counts('users')
                    ->label('Utilisateurs')
                    ->badge()
                    ->color('success')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
