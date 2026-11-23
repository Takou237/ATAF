<?php

namespace App\Filament\Resources\Events\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class EventForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Titre')
                    ->required()
                    ->maxLength(255),
                TextInput::make('slug')
                    ->helperText('Laisser vide pour générer automatiquement.'),
                RichEditor::make('description')
                    ->label('Description')
                    ->toolbarButtons([
                        'bold',
                        'italic',
                        'underline',
                        'link',
                        'bulletList',
                        'orderedList',
                        'blockquote',
                        'h2',
                        'h3',
                        'undo',
                        'redo',
                    ])
                    ->columnSpanFull(),
                Select::make('type')
                    ->options([
                        'Séminaire' => 'Séminaire',
                        'Conférence' => 'Conférence',
                        'Assemblée Générale' => 'Assemblée Générale',
                        'Formation' => 'Formation',
                        'Webinaire' => 'Webinaire',
                    ])
                    ->required()
                    ->default('Séminaire'),
                Select::make('status')
                    ->options([
                        'Ouvert' => 'Ouvert',
                        'Complet' => 'Complet',
                        'Clôturé' => 'Clôturé',
                    ])
                    ->required()
                    ->default('Ouvert'),
                DateTimePicker::make('starts_at')
                    ->label('Début')
                    ->required(),
                DateTimePicker::make('ends_at')
                    ->label('Fin')
                    ->after('starts_at'),
                TextInput::make('time')
                    ->label('Horaire affiché'),
                TextInput::make('location')
                    ->label('Lieu'),
                TextInput::make('capacity')
                    ->label('Capacité')
                    ->numeric(),
                FileUpload::make('image_path')
                    ->label('Image')
                    ->image()
                    ->disk('public')
                    ->directory('events')
                    ->visibility('public')
                    ->imageEditor(),
                KeyValue::make('documents')
                    ->label('Documents')
                    ->columnSpanFull(),
            ]);
    }
}
