<?php

namespace App\Filament\Resources\News\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('news_category_id')
                    ->label('Catégorie')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),
                TextInput::make('title')
                    ->label('Titre')
                    ->required()
                    ->maxLength(255),
                TextInput::make('slug')
                    ->helperText('Laisser vide pour générer automatiquement.'),
                Textarea::make('excerpt')
                    ->label('Chapeau')
                    ->rows(3)
                    ->columnSpanFull(),
                Textarea::make('body')
                    ->label('Contenu')
                    ->rows(12)
                    ->columnSpanFull(),
                TextInput::make('image_path')
                    ->label('Image (URL)')
                    ->url(),
                TextInput::make('author')
                    ->label('Auteur'),
                DateTimePicker::make('published_at')
                    ->label('Publié le'),
                Select::make('status')
                    ->options([
                        'draft' => 'Brouillon',
                        'published' => 'Publié',
                        'archived' => 'Archivé',
                    ])
                    ->required()
                    ->default('draft'),
                Toggle::make('is_members_only')
                    ->label('Réservé aux membres'),
                Select::make('tags')
                    ->label('Étiquettes')
                    ->relationship('tags', 'name')
                    ->multiple()
                    ->preload(),
            ]);
    }
}
