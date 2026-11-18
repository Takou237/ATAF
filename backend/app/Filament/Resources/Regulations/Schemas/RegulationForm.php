<?php

namespace App\Filament\Resources\Regulations\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class RegulationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                DatePicker::make('published_on'),
                TextInput::make('category'),
                TextInput::make('type')
                    ->required()
                    ->default('Note d\'information'),
                Textarea::make('summary')
                    ->columnSpanFull(),
                Textarea::make('body')
                    ->columnSpanFull(),
                TextInput::make('document_path'),
                Toggle::make('is_public')
                    ->required(),
            ]);
    }
}
