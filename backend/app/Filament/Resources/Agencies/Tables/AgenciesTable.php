<?php

namespace App\Filament\Resources\Agencies\Tables;

use App\Filament\Support\CsvExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AgenciesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Agence')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('agreement_number')
                    ->label("N° d'agrément")
                    ->searchable(),
                TextColumn::make('country')
                    ->label('Pays')
                    ->searchable(),
                TextColumn::make('city')
                    ->label('Ville')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'approved', 'Agréée' => 'success',
                        'pending' => 'warning',
                        'suspended' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('valid_from')
                    ->label('Valide du')
                    ->date('d/m/Y')
                    ->sortable(),
                TextColumn::make('valid_until')
                    ->label('Valide au')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('name')
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'approved' => 'Agréée',
                        'pending' => 'En attente',
                        'suspended' => 'Suspendue',
                    ]),
            ])
            ->headerActions([
                Action::make('exportCsv')
                    ->label('Exporter (CSV)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->action(function ($livewire) {
                        $records = $livewire->getFilteredTableQuery()->get();

                        return CsvExport::stream(
                            'agences-'.now()->format('Ymd-His').'.csv',
                            ['Agence', "N° d'agrément", 'Pays', 'Ville', 'Statut', 'Valide du', 'Valide au'],
                            $records->map(fn ($record): array => [
                                $record->name,
                                $record->agreement_number,
                                $record->country,
                                $record->city,
                                $record->status,
                                optional($record->valid_from)->format('d/m/Y'),
                                optional($record->valid_until)->format('d/m/Y'),
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
                ]),
            ]);
    }
}
