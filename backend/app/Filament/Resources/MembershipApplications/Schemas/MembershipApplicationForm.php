<?php

namespace App\Filament\Resources\MembershipApplications\Schemas;

use App\Models\MembershipApplication;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class MembershipApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom du contact')
                    ->required(),
                TextInput::make('organisation')
                    ->label('Organisation')
                    ->required(),
                TextInput::make('country')
                    ->label('Pays')
                    ->required(),
                TextInput::make('email')
                    ->label('Adresse e-mail')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->label('Téléphone')
                    ->tel(),
                TextInput::make('category')
                    ->label('Catégorie'),
                Textarea::make('message')
                    ->label('Message')
                    ->rows(4)
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Statut')
                    ->options(MembershipApplication::STATUSES)
                    ->required()
                    ->default('pending'),
                Textarea::make('admin_notes')
                    ->label('Notes internes')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
