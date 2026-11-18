<?php

namespace App\Filament\Resources\AgencyApplications;

use App\Filament\Resources\AgencyApplications\Pages\CreateAgencyApplication;
use App\Filament\Resources\AgencyApplications\Pages\EditAgencyApplication;
use App\Filament\Resources\AgencyApplications\Pages\ListAgencyApplications;
use App\Filament\Resources\AgencyApplications\Schemas\AgencyApplicationForm;
use App\Filament\Resources\AgencyApplications\Tables\AgencyApplicationsTable;
use App\Models\AgencyApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AgencyApplicationResource extends Resource
{
    protected static ?string $model = AgencyApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Membres & Agréments';

    protected static ?int $navigationSort = 4;

    protected static ?string $modelLabel = "Demande d'agrément";

    protected static ?string $pluralModelLabel = "Demandes d'agrément";

    public static function form(Schema $schema): Schema
    {
        return AgencyApplicationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AgencyApplicationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAgencyApplications::route('/'),
            'create' => CreateAgencyApplication::route('/create'),
            'edit' => EditAgencyApplication::route('/{record}/edit'),
        ];
    }
}
