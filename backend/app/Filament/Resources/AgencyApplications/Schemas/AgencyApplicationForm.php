<?php

namespace App\Filament\Resources\AgencyApplications\Schemas;

use App\Models\AgencyApplication;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class AgencyApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('first_name')
                    ->label('Prénom')
                    ->required(),
                TextInput::make('last_name')
                    ->label('Nom')
                    ->required(),
                TextInput::make('agency_name')
                    ->label("Nom de l'agence")
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
                Textarea::make('message')
                    ->label('Message')
                    ->rows(4)
                    ->columnSpanFull(),
                Select::make('status')
                    ->label('Statut')
                    ->options(AgencyApplication::STATUSES)
                    ->required()
                    ->default('pending'),
                TextInput::make('agreement_number')
                    ->label("Numéro d'agrément")
                    ->disabled()
                    ->dehydrated(false)
                    ->helperText('Généré automatiquement lors de l\'approbation.'),
                Textarea::make('admin_notes')
                    ->label('Notes internes')
                    ->rows(4)
                    ->columnSpanFull(),
            ]);
    }
}
