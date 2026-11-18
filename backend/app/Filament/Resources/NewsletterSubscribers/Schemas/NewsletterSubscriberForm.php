<?php

namespace App\Filament\Resources\NewsletterSubscribers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NewsletterSubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('newsletter_list_id')
                    ->numeric(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('name'),
                TextInput::make('token')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                DateTimePicker::make('consent_at'),
                DateTimePicker::make('unsubscribed_at'),
            ]);
    }
}
