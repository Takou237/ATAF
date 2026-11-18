<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->helperText('Identifiant unique de la page.'),
                TextInput::make('title')
                    ->label('Titre')
                    ->required(),
                TextInput::make('subtitle')
                    ->label('Sous-titre'),
                Textarea::make('body')
                    ->label('Contenu (HTML)')
                    ->rows(12)
                    ->columnSpanFull(),
                KeyValue::make('sections')
                    ->label('Sections structurées')
                    ->columnSpanFull(),
                Select::make('status')
                    ->options([
                        'draft' => 'Brouillon',
                        'published' => 'Publiée',
                    ])
                    ->required()
                    ->default('published'),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
