<?php

namespace App\Filament\Resources\Publications\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PublicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('type')
                    ->required()
                    ->default('Rapport'),
                DatePicker::make('published_on'),
                TextInput::make('pages')
                    ->numeric(),
                TextInput::make('file_path'),
                Toggle::make('is_public')
                    ->required(),
            ]);
    }
}
