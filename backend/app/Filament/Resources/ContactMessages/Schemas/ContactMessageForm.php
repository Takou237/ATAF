<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use App\Models\ContactMessage;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom')
                    ->required(),
                TextInput::make('email')
                    ->label('Adresse e-mail')
                    ->email()
                    ->required(),
                TextInput::make('organisation')
                    ->label('Organisation'),
                TextInput::make('subject')
                    ->label('Sujet')
                    ->required(),
                Textarea::make('message')
                    ->label('Message reçu')
                    ->rows(8)
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Statut')
                    ->options(ContactMessage::STATUSES)
                    ->required()
                    ->default('new'),
                Select::make('assigned_to')
                    ->label('Assigné à')
                    ->relationship('assignedUser', 'name')
                    ->searchable()
                    ->preload(),
            ]);
    }
}
