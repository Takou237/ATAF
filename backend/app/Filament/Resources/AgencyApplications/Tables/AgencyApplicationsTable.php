<?php

namespace App\Filament\Resources\AgencyApplications\Tables;

use App\Models\AgencyApplication;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AgencyApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('agency_name')
                    ->label('Agence')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('first_name')
                    ->label('Prénom')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('last_name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('country')
                    ->label('Pays')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('agreement_number')
                    ->label('N° agrément')
                    ->searchable()
                    ->placeholder('—'),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => AgencyApplication::STATUSES[$state] ?? (string) $state)
                    ->color(fn (?string $state): string => match ($state) {
                        'approved' => 'success',
                        'review' => 'info',
                        'rejected' => 'danger',
                        default => 'warning',
                    }),
                TextColumn::make('created_at')
                    ->label('Reçue le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(AgencyApplication::STATUSES),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approuver')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading("Approuver la demande d'agrément")
                    ->modalDescription('Une agence agréée sera créée avec un numéro d\'agrément.')
                    ->visible(fn (AgencyApplication $record): bool => $record->status !== 'approved')
                    ->action(function (AgencyApplication $record): void {
                        $agency = $record->approve();

                        Notification::make()
                            ->title('Demande approuvée')
                            ->body("Agence créée : {$agency->name} ({$agency->agreement_number})")
                            ->success()
                            ->send();
                    }),
                Action::make('reject')
                    ->label('Rejeter')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->schema([
                        Textarea::make('note')
                            ->label('Motif du rejet')
                            ->rows(3),
                    ])
                    ->visible(fn (AgencyApplication $record): bool => $record->status !== 'rejected')
                    ->action(function (AgencyApplication $record, array $data): void {
                        $record->reject($data['note'] ?? null);

                        Notification::make()
                            ->title('Demande rejetée')
                            ->warning()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
