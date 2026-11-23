<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PageForm
{
    public const BLOCK_TYPES = [
        'hero' => 'Bannière de page',
        'rich_text' => 'Texte libre',
        'features' => 'Cartes de présentation (services, missions)',
        'stats' => 'Chiffres clés',
        'timeline' => 'Chronologie',
        'cards' => 'Fiches (personnes, structures)',
        'list' => 'Liste d’arguments',
        'cta' => 'Appel à l’action',
        'newsletter' => 'Bloc newsletter',
        'news_grid' => 'Grille actualités (automatique)',
        'events_grid' => 'Grille événements (automatique)',
        'members_strip' => 'Bandeau membres (automatique)',
        'contact' => 'Bloc contact (coordonnées + formulaire)',
        'widget' => 'Bloc dynamique (annuaire, formulaire, liste…)',
    ];

    /**
     * Blocs dynamiques : annuaires, formulaires et listes alimentés par la base.
     * Les clés doivent rester identiques à `WIDGETS` dans src/components/widgets/index.ts.
     */
    public const WIDGETS = [
        'members_directory' => 'Annuaire des membres (recherche + filtres)',
        'members_table' => 'Tableau des compagnies membres',
        'partners_grid' => 'Grille des partenaires',
        'membership_form' => 'Formulaire de demande d’adhésion',
        'agencies_directory' => 'Annuaire des agences agréées',
        'agency_verify' => 'Vérificateur d’agrément',
        'agency_form' => 'Formulaire de demande d’agrément',
        'documents_list' => 'Centre documentaire (recherche + pagination)',
        'publications_list' => 'Liste des publications',
        'media_gallery' => 'Médiathèque (photos et vidéos)',
        'news_list' => 'Liste des actualités',
        'events_list' => 'Liste des événements',
        'regulations_list' => 'Veille réglementaire',
        'documents_table' => 'Tableau des textes réglementaires',
        'regulations_notes' => 'Notes et analyses',
    ];

    public static function configure(Schema $schema): Schema
    {
        $visibleFor = fn (array $types): \Closure => fn (Get $get): bool => in_array($get('type'), $types, true);

        $allTypes = array_keys(self::BLOCK_TYPES);

        return $schema
            ->components([
                TextInput::make('slug')
                    ->helperText('Identifiant utilisé par le site : home, presentation, missions, contact…')
                    ->required(),
                TextInput::make('title')
                    ->label('Titre de la page')
                    ->required(),
                TextInput::make('subtitle')
                    ->label('Sous-titre'),
                Select::make('status')
                    ->options([
                        'draft' => 'Brouillon',
                        'published' => 'Publiée',
                    ])
                    ->required()
                    ->default('published'),
                TextInput::make('position')
                    ->label('Ordre')
                    ->required()
                    ->numeric()
                    ->default(0),

                Repeater::make('sections')
                    ->label('Blocs de contenu')
                    ->helperText('Chaque bloc correspond à une section de la page. Utilisez les flèches pour changer l’ordre.')
                    ->columnSpanFull()
                    ->collapsible()
                    ->cloneable()
                    ->reorderableWithButtons()
                    ->addActionLabel('Ajouter un bloc')
                    ->itemLabel(fn (?array $state): ?string => self::BLOCK_TYPES[$state['type'] ?? ''] ?? 'Nouveau bloc')
                    ->schema([
                        Select::make('type')
                            ->label('Type de bloc')
                            ->options(self::BLOCK_TYPES)
                            ->required()
                            ->live(),
                        Select::make('widget')
                            ->label('Bloc dynamique')
                            ->options(self::WIDGETS)
                            ->required()
                            ->visible($visibleFor(['widget'])),
                        TextInput::make('filter')
                            ->label('Filtre')
                            ->helperText('Facultatif : catégorie d’actualité, type d’événement…')
                            ->visible($visibleFor(['widget'])),
                        TextInput::make('title')
                            ->label('Titre')
                            ->visible($visibleFor(array_diff($allTypes, ['stats', 'contact', 'widget']))),
                        TextInput::make('subtitle')
                            ->label('Sous-titre')
                            ->visible($visibleFor(['hero', 'features', 'cards', 'list', 'news_grid', 'events_grid', 'members_strip'])),
                        Textarea::make('text')
                            ->label('Texte d’introduction')
                            ->rows(3)
                            ->visible($visibleFor(['hero', 'cta', 'newsletter', 'contact'])),
                        RichEditor::make('rich_text')
                            ->label('Contenu riche')
                            ->toolbarButtons([
                                'bold', 'italic', 'underline', 'link', 'bulletList', 'orderedList',
                                'blockquote', 'h2', 'h3', 'attachFiles', 'undo', 'redo',
                            ])
                            ->columnSpanFull()
                            ->visible($visibleFor(['rich_text'])),
                        FileUpload::make('image')
                            ->label('Image')
                            ->image()
                            ->disk('public')
                            ->directory('pages')
                            ->visibility('public')
                            ->visible($visibleFor(['hero', 'cards'])),
                        TextInput::make('button_label')
                            ->label('Libellé du bouton')
                            ->visible($visibleFor(['cta', 'news_grid', 'events_grid', 'members_strip'])),
                        TextInput::make('button_url')
                            ->label('Lien du bouton')
                            ->helperText('Ex. /actualites ou https://…')
                            ->visible($visibleFor(['cta', 'news_grid', 'events_grid', 'members_strip'])),
                        TextInput::make('limit')
                            ->label('Nombre d’éléments affichés')
                            ->numeric()
                            ->default(3)
                            ->visible($visibleFor(['news_grid', 'events_grid', 'members_strip'])),

                        Repeater::make('items')
                            ->label('Éléments du bloc')
                            ->columnSpanFull()
                            ->collapsible()
                            ->reorderableWithButtons()
                            ->addActionLabel('Ajouter un élément')
                            ->itemLabel(fn (?array $state): ?string => $state['title'] ?? $state['label'] ?? $state['value'] ?? $state['year'] ?? 'Élément')
                            ->visible($visibleFor(['hero', 'features', 'stats', 'timeline', 'cards', 'list', 'contact']))
                            ->schema([
                                TextInput::make('icon')
                                    ->label('Icône (emoji ou texte)')
                                    ->visible($visibleFor(['features'])),
                                TextInput::make('value')
                                    ->label('Valeur')
                                    ->visible($visibleFor(['stats'])),
                                TextInput::make('label')
                                    ->label('Libellé')
                                    ->visible($visibleFor(['stats'])),
                                TextInput::make('year')
                                    ->label('Année')
                                    ->visible($visibleFor(['timeline'])),
                                TextInput::make('title')
                                    ->label('Titre')
                                    ->visible($visibleFor(['hero', 'features', 'timeline', 'cards', 'list', 'contact'])),
                                TextInput::make('subtitle')
                                    ->label('Fonction / société')
                                    ->visible($visibleFor(['cards', 'contact'])),
                                Textarea::make('text')
                                    ->label('Texte')
                                    ->rows(3)
                                    ->visible($visibleFor(['features', 'timeline', 'cards', 'list'])),
                                TextInput::make('url')
                                    ->label('Lien')
                                    ->visible($visibleFor(['hero', 'cards', 'contact'])),
                                FileUpload::make('image')
                                    ->label('Image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('pages/items')
                                    ->visibility('public')
                                    ->visible($visibleFor(['cards'])),
                            ]),
                    ]),
            ]);
    }
}
