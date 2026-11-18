<?php

namespace App\Filament\Resources\MembershipApplications;

use App\Filament\Resources\MembershipApplications\Pages\CreateMembershipApplication;
use App\Filament\Resources\MembershipApplications\Pages\EditMembershipApplication;
use App\Filament\Resources\MembershipApplications\Pages\ListMembershipApplications;
use App\Filament\Resources\MembershipApplications\Schemas\MembershipApplicationForm;
use App\Filament\Resources\MembershipApplications\Tables\MembershipApplicationsTable;
use App\Models\MembershipApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MembershipApplicationResource extends Resource
{
    protected static ?string $model = MembershipApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Membres & Agréments';

    protected static ?int $navigationSort = 2;

    protected static ?string $modelLabel = "Demande d'adhésion";

    protected static ?string $pluralModelLabel = "Demandes d'adhésion";

    public static function form(Schema $schema): Schema
    {
        return MembershipApplicationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MembershipApplicationsTable::configure($table);
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
            'index' => ListMembershipApplications::route('/'),
            'create' => CreateMembershipApplication::route('/create'),
            'edit' => EditMembershipApplication::route('/{record}/edit'),
        ];
    }
}
