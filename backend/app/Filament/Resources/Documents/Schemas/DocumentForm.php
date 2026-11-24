<?php

namespace App\Filament\Resources\Documents\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class DocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('category'),
                TextInput::make('type')
                    ->required()
                    ->default('PDF'),
                FileUpload::make('file_path')
                    ->label('Fichier PDF')
                    ->acceptedFileTypes(['application/pdf'])
                    ->disk('public')
                    ->directory('documents')
                    ->visibility('public'),
                TextInput::make('file_size')
                    ->numeric(),
                Toggle::make('is_public')
                    ->required(),
                TextInput::make('download_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                DatePicker::make('published_on'),
            ]);
    }
}
