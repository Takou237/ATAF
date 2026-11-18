<?php

namespace App\Filament\Resources\MediaItems\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MediaItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('type')
                    ->required()
                    ->default('photo'),
                TextInput::make('url')
                    ->url(),
                TextInput::make('file_path'),
                TextInput::make('thumbnail_path'),
                Select::make('event_id')
                    ->relationship('event', 'title'),
                DatePicker::make('published_on'),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
