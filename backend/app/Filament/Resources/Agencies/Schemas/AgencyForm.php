<?php

namespace App\Filament\Resources\Agencies\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AgencyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('agreement_number')
                    ->required(),
                TextInput::make('country'),
                TextInput::make('city'),
                TextInput::make('status')
                    ->required()
                    ->default('approved'),
                DatePicker::make('valid_from'),
                DatePicker::make('valid_until'),
            ]);
    }
}
