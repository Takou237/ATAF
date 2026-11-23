<?php

namespace App\Filament\Resources\MembershipApplications\Tables;

use App\Models\MembershipApplication;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class MembershipApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('organisation')
                    ->label('Organisation')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('name')
                    ->label('Contact')
                    ->searchable(),
                TextColumn::make('country')
                    ->label('Pays')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('category')
                    ->label('Catégorie')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => MembershipApplication::STATUSES[$state] ?? (string) $state)
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
                    ->options(MembershipApplication::STATUSES),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approuver')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Approuver la demande')
                    ->modalDescription('Un membre sera créé à partir de cette demande.')
                    ->visible(fn (MembershipApplication $record): bool => $record->status !== 'approved')
                    ->action(function (MembershipApplication $record): void {
                        $member = $record->approve();

                        Notification::make()
                            ->title('Demande approuvée')
                            ->body("Membre créé : {$member->name}")
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
                    ->visible(fn (MembershipApplication $record): bool => $record->status !== 'rejected')
                    ->action(function (MembershipApplication $record, array $data): void {
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
