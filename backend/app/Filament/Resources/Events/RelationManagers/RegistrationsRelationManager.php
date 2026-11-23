<?php

namespace App\Filament\Resources\Events\RelationManagers;

use App\Filament\Support\CsvExport;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class RegistrationsRelationManager extends RelationManager
{
    protected static string $relationship = 'registrations';

    protected static ?string $title = 'Inscriptions';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->label('Compte utilisateur')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
                TextInput::make('first_name')
                    ->label('Prénom')
                    ->required(),
                TextInput::make('last_name')
                    ->label('Nom')
                    ->required(),
                TextInput::make('function')
                    ->label('Fonction'),
                TextInput::make('company')
                    ->label('Organisation'),
                TextInput::make('country')
                    ->label('Pays'),
                TextInput::make('phone')
                    ->label('Téléphone')
                    ->tel(),
                TextInput::make('email')
                    ->label('Adresse e-mail')
                    ->email()
                    ->required(),
                Select::make('participation_type')
                    ->label('Participation')
                    ->options([
                        'presentiel' => 'Présentiel',
                        'distance' => 'À distance',
                    ]),
                Textarea::make('special_needs')
                    ->label('Besoins particuliers')
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Statut')
                    ->options([
                        'confirmed' => 'Confirmée',
                        'waitlist' => "Liste d'attente",
                        'cancelled' => 'Annulée',
                    ])
                    ->required()
                    ->default('confirmed'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('last_name')
            ->columns([
                TextColumn::make('first_name')
                    ->label('Prénom')
                    ->searchable(),
                TextColumn::make('last_name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('company')
                    ->label('Organisation')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable(),
                TextColumn::make('country')
                    ->label('Pays')
                    ->toggleable(),
                TextColumn::make('participation_type')
                    ->label('Participation')
                    ->badge()
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
                SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'confirmed' => 'Confirmée',
                        'waitlist' => "Liste d'attente",
                        'cancelled' => 'Annulée',
                    ]),
            ])
            ->headerActions([
                CreateAction::make(),
                Action::make('exportCsv')
                    ->label('Exporter (CSV)')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->action(function ($livewire) {
                        $records = $livewire->getFilteredTableQuery()->get();

                        return CsvExport::stream(
                            'inscriptions-'.now()->format('Ymd-His').'.csv',
                            ['Prénom', 'Nom', 'Fonction', 'Organisation', 'Pays', 'Téléphone', 'E-mail', 'Participation', 'Statut', 'Inscrit le'],
                            $records->map(fn ($record): array => [
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
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
