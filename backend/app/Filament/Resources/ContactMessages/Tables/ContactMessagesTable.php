<?php

namespace App\Filament\Resources\ContactMessages\Tables;

use App\Models\ContactMessage;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class ContactMessagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('organisation')
                    ->label('Organisation')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('subject')
                    ->label('Sujet')
                    ->searchable()
                    ->limit(50),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => ContactMessage::STATUSES[$state] ?? (string) $state)
                    ->color(fn (?string $state): string => match ($state) {
                        'new' => 'warning',
                        'in_progress' => 'info',
                        'done' => 'success',
                        'spam' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('assignedUser.name')
                    ->label('Assigné à')
                    ->placeholder('Non assigné'),
                TextColumn::make('created_at')
                    ->label('Reçu le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options(ContactMessage::STATUSES),
                SelectFilter::make('assigned_to')
                    ->label('Assigné à')
                    ->relationship('assignedUser', 'name')
                    ->searchable()
                    ->preload(),
            ])
            ->recordActions([
                Action::make('reply')
                    ->label('Répondre')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('primary')
                    ->schema([
                        TextInput::make('reply_subject')
                            ->label('Sujet')
                            ->required()
                            ->default(fn (ContactMessage $record): string => 'Re: '.$record->subject),
                        Textarea::make('reply_body')
                            ->label('Message')
                            ->rows(8)
                            ->required(),
                    ])
                    ->action(function (ContactMessage $record, array $data): void {
                        Mail::raw($data['reply_body'], function ($message) use ($record, $data): void {
                            $message->to($record->email)
                                ->subject($data['reply_subject']);
                        });

                        $record->update(['status' => 'in_progress']);

                        Notification::make()
                            ->title('Réponse envoyée')
                            ->body("E-mail envoyé à {$record->email}.")
                            ->success()
                            ->send();
                    }),
                Action::make('markDone')
                    ->label('Marquer traité')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (ContactMessage $record): bool => $record->status !== 'done')
                    ->action(function (ContactMessage $record): void {
                        $record->update(['status' => 'done']);

                        Notification::make()
                            ->title('Message marqué comme traité')
                            ->success()
                            ->send();
                    }),
                Action::make('markSpam')
                    ->label('Spam')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (ContactMessage $record): bool => $record->status !== 'spam')
                    ->action(function (ContactMessage $record): void {
                        $record->update(['status' => 'spam']);

                        Notification::make()
                            ->title('Message marqué comme spam')
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
