<?php

namespace App\Filament\Resources\Roles\Schemas;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Spatie\Permission\Models\Permission;

class RoleForm
{
    /**
     * Libellé lisible de chaque permission et rubrique sous laquelle la ranger.
     * Les permissions inconnues (ajoutées plus tard) atterrissent dans « Autres ».
     */
    private const PERMISSIONS = [
        'manage content' => ['Contenus', 'Gérer les actualités, pages et médias'],
        'manage members' => ['Membres', 'Gérer les membres et les adhésions'],
        'manage agencies' => ['Agences', 'Gérer les agences et les agréments'],
        'manage events' => ['Événements', 'Gérer les événements et les inscriptions'],
        'manage documents' => ['Ressources', 'Gérer les documents et publications'],
        'manage newsletter' => ['Communication', 'Gérer les listes et abonnés newsletter'],
        'manage users' => ['Administration', 'Gérer les utilisateurs et les rôles'],
        'manage settings' => ['Administration', 'Gérer les paramètres du site'],
        'view statistics' => ['Administration', 'Consulter les statistiques du site'],
    ];

    /** Ordre d'affichage des rubriques dans la liste des permissions. */
    private const ORDER = ['Membres', 'Agences', 'Contenus', 'Événements', 'Ressources', 'Communication', 'Administration', 'Autres'];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Nom du rôle')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->disabled(fn (?object $record): bool => $record?->name === 'super-admin')
                    ->helperText('Identifiant technique, en minuscules (ex. communication, events).'),
                Hidden::make('guard_name')
                    ->default('web'),
                CheckboxList::make('permissions')
                    ->label('Permissions')
                    ->relationship('permissions', 'name')
                    ->options(fn (): array => self::permissionOptions())
                    ->columns(2)
                    ->bulkToggleable()
                    ->columnSpanFull()
                    ->disabled(fn (?object $record): bool => $record?->name === 'super-admin')
                    ->helperText(fn (?object $record): string => $record?->name === 'super-admin'
                        ? 'Le super-administrateur dispose de tous les droits, quel que soit le contenu de cette liste.'
                        : 'Cochez les domaines que ce rôle peut administrer.'),
            ]);
    }

    /**
     * Options groupées par domaine, indexées par identifiant de permission :
     * le champ est une relation, Filament attend donc les clés des modèles liés.
     */
    public static function permissionOptions(): array
    {
        $groups = [];

        foreach (Permission::query()->orderBy('name')->get() as $permission) {
            [$group, $label] = self::PERMISSIONS[$permission->name] ?? ['Autres', $permission->name];
            $groups[$group][$permission->id] = $label;
        }

        return array_filter(
            array_combine(
                self::ORDER,
                array_map(fn (string $group): array => $groups[$group] ?? [], self::ORDER)
            ),
            fn (array $permissions): bool => $permissions !== []
        );
    }
}
