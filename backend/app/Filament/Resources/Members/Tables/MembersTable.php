<?php

namespace App\Filament\Resources\Members\Tables;

use App\Filament\Support\CsvExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class MembersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo_path')
                    ->label('Logo')
                    ->disk('public')
                    ->imageHeight(32),
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('country.name')
                    ->label('Pays')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('city')
                    ->label('Ville')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('phone')
                    ->label('Téléphone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('category')
                    ->label('Catégorie')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'active' => 'Actif',
                        'inactive' => 'Inactif',
                        'pending' => 'En attente',
                        default => (string) $state,
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'gray',
                        'pending' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('joined_year')
                    ->label('Adhésion')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                IconColumn::make('is_public')
                    ->label('Public')
                    ->boolean(),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name')
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'active' => 'Actif',
                        'inactive' => 'Inactif',
                        'pending' => 'En attente',
                    ]),
                SelectFilter::make('category')
                    ->label('Catégorie')
                    ->options(fn (): array => \App\Models\Member::query()
                        ->whereNotNull('category')
                        ->distinct()
                        ->orderBy('category')
                        ->pluck('category', 'category')
                        ->all()),
                SelectFilter::make('country_id')
                    ->label('Pays')
                    ->relationship('country', 'name')
                    ->searchable()
                    ->preload(),
                TrashedFilter::make(),
            ])
            ->headerActions([
                Action::make('exportCsv')
                    ->label('Exporter (CSV)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->action(function ($livewire) {
                        $records = $livewire->getFilteredTableQuery()->with('country')->get();

                        return CsvExport::stream(
                            'membres-'.now()->format('Ymd-His').'.csv',
                            ['Nom', 'Catégorie', 'Pays', 'Ville', 'E-mail', 'Téléphone', 'Site web', 'Adhésion', 'Statut', 'Public'],
                            $records->map(fn ($record): array => [
                                $record->name,
                                $record->category,
                                $record->country?->name,
                                $record->city,
                                $record->email,
                                $record->phone,
                                $record->website,
                                $record->joined_year,
                                $record->status,
                                $record->is_public ? 'Oui' : 'Non',
                            ]),
                        );
                    }),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
