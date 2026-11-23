<?php

namespace App\Filament\Resources\MediaItems\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
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
                    ->label('Titre')
                    ->required(),
                Select::make('type')
                    ->options([
                        'photo' => 'Photo',
                        'video' => 'Vidéo',
                    ])
                    ->required()
                    ->default('photo'),
                TextInput::make('url')
                    ->label('URL externe (vidéo, lien)')
                    ->url(),
                FileUpload::make('file_path')
                    ->label('Fichier')
                    ->disk('public')
                    ->directory('media')
                    ->visibility('public'),
                FileUpload::make('thumbnail_path')
                    ->label('Miniature')
                    ->image()
                    ->disk('public')
                    ->directory('media/thumbnails')
                    ->visibility('public'),
                Select::make('event_id')
                    ->label('Événement lié')
                    ->relationship('event', 'title')
                    ->searchable()
                    ->preload(),
                DatePicker::make('published_on')
                    ->label('Publié le'),
                TextInput::make('position')
                    ->label('Ordre')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
