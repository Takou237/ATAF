<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->helperText('Identifiant unique de la page.'),
                TextInput::make('title')
                    ->label('Titre')
                    ->required(),
                TextInput::make('subtitle')
                    ->label('Sous-titre'),
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
                KeyValue::make('sections')
                    ->label('Sections structurées')
                    ->columnSpanFull(),
                Select::make('status')
                    ->options([
                        'draft' => 'Brouillon',
                        'published' => 'Publiée',
                    ])
                    ->required()
                    ->default('published'),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
