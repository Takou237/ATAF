<?php

namespace App\Filament\Resources\BoardMembers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BoardMemberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('role')
                    ->required(),
                TextInput::make('company'),
                Textarea::make('bio')
                    ->columnSpanFull(),
                TextInput::make('photo_path'),
                TextInput::make('group')
                    ->required()
                    ->default('board'),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
