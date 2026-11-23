<?php

namespace App\Filament\Resources\EventRegistrations\Tables;

use App\Filament\Support\CsvExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class EventRegistrationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('event.title')
                    ->label('Événement')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('first_name')
                    ->label('Prénom')
                    ->searchable(),
                TextColumn::make('last_name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('company')
                    ->label('Organisation')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('country')
                    ->label('Pays')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'confirmed' => 'Confirmée',
                        'waitlist' => "Liste d'attente",
                        'cancelled' => 'Annulée',
                        default => (string) $state,
                    })
                    ->color(fn (?string $state): string => match ($state) {
                        'confirmed' => 'success',
                        'waitlist' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Inscrit le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('event_id')
                    ->label('Événement')
                    ->relationship('event', 'title')
                    ->searchable()
                    ->preload(),
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'confirmed' => 'Confirmée',
                        'waitlist' => "Liste d'attente",
                        'cancelled' => 'Annulée',
                    ]),
            ])
            ->headerActions([
                Action::make('exportCsv')
                    ->label('Exporter (CSV)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->action(function ($livewire) {
                        $records = $livewire->getFilteredTableQuery()->with('event')->get();

                        return CsvExport::stream(
                            'inscriptions-'.now()->format('Ymd-His').'.csv',
                            ['Événement', 'Prénom', 'Nom', 'Fonction', 'Organisation', 'Pays', 'Téléphone', 'E-mail', 'Participation', 'Statut', 'Inscrit le'],
                            $records->map(fn ($record): array => [
                                $record->event?->title,
                                $record->first_name,
                                $record->last_name,
                                $record->function,
                                $record->company,
                                $record->country,
                                $record->phone,
                                $record->email,
                                $record->participation_type,
                                $record->status,
                                optional($record->created_at)->format('d/m/Y H:i'),
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
