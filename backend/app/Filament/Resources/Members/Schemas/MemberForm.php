<?php

namespace App\Filament\Resources\Members\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom')
                    ->required(),
                TextInput::make('slug')
                    ->helperText('Laisser vide pour générer automatiquement.'),
                FileUpload::make('logo_path')
                    ->label('Logo')
                    ->image()
                    ->disk('public')
                    ->directory('members')
                    ->visibility('public')
                    ->imageEditor(),
                Select::make('country_id')
                    ->label('Pays')
                    ->relationship('country', 'name')
                    ->searchable()
                    ->preload(),
                TextInput::make('city')
                    ->label('Ville'),
                TextInput::make('address')
                    ->label('Adresse'),
                TextInput::make('phone')
                    ->label('Téléphone')
                    ->tel(),
                TextInput::make('email')
                    ->label('Adresse e-mail')
                    ->email(),
                TextInput::make('website')
                    ->label('Site web')
                    ->url(),
                Textarea::make('description')
                    ->label('Description')
                    ->rows(5)
                    ->columnSpanFull(),
                Select::make('category')
                    ->options([
                        'Compagnie aérienne' => 'Compagnie aérienne',
                        'Partenaire industriel' => 'Partenaire industriel',
                        'Organisation professionnelle' => 'Organisation professionnelle',
                        'Institution' => 'Institution',
                        'Média' => 'Média',
                    ])
                    ->required()
                    ->default('Compagnie aérienne'),
                Select::make('status')
                    ->options([
                        'active' => 'Actif',
                        'inactive' => 'Inactif',
                        'pending' => 'En attente',
                    ])
                    ->required()
                    ->default('active'),
                TextInput::make('joined_year')
                    ->label("Année d'adhésion")
                    ->numeric(),
                Toggle::make('is_public')
                    ->label('Visible sur le site public'),
            ]);
    }
}
