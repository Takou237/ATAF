<?php

namespace App\Filament\Resources\News\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
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
                RichEditor::make('body')
                    ->label('Contenu')
                    ->toolbarButtons([
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'link',
                        'bulletList',
                        'orderedList',
                        'blockquote',
                        'h2',
                        'h3',
                        'attachFiles',
                        'undo',
                        'redo',
                    ])
                    ->columnSpanFull(),
                FileUpload::make('image_path')
                    ->label('Image de couverture')
                    ->image()
                    ->disk('public')
                    ->directory('news')
                    ->visibility('public')
                    ->imageEditor(),
                TextInput::make('author')
                    ->label('Auteur'),
                DateTimePicker::make('published_at')
                    ->label('Publié le')
                    ->helperText('Laisser vide pour un brouillon non planifié.'),
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
