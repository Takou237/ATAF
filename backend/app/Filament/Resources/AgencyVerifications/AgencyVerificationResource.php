<?php

namespace App\Filament\Resources\AgencyVerifications;

use App\Filament\Resources\AgencyVerifications\Pages\ListAgencyVerifications;
use App\Filament\Resources\AgencyVerifications\Tables\AgencyVerificationsTable;
use App\Models\AgencyVerification;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AgencyVerificationResource extends Resource
{
    protected static ?string $model = AgencyVerification::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMagnifyingGlass;

    protected static string|\UnitEnum|null $navigationGroup = 'Membres & Agréments';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = "Vérification d'agrément";

    protected static ?string $pluralModelLabel = "Vérifications d'agrément";

    public static function table(Table $table): Table
    {
        return AgencyVerificationsTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAgencyVerifications::route('/'),
        ];
    }
}
