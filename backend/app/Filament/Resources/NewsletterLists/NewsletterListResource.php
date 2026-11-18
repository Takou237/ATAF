<?php

namespace App\Filament\Resources\NewsletterLists;

use App\Filament\Resources\NewsletterLists\Pages\CreateNewsletterList;
use App\Filament\Resources\NewsletterLists\Pages\EditNewsletterList;
use App\Filament\Resources\NewsletterLists\Pages\ListNewsletterLists;
use App\Filament\Resources\NewsletterLists\Schemas\NewsletterListForm;
use App\Filament\Resources\NewsletterLists\Tables\NewsletterListsTable;
use App\Models\NewsletterList;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class NewsletterListResource extends Resource
{
    protected static ?string $model = NewsletterList::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Communication';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Liste newsletter';

    protected static ?string $pluralModelLabel = 'Listes newsletter';

    public static function form(Schema $schema): Schema
    {
        return NewsletterListForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewsletterListsTable::configure($table);
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
            'index' => ListNewsletterLists::route('/'),
            'create' => CreateNewsletterList::route('/create'),
            'edit' => EditNewsletterList::route('/{record}/edit'),
        ];
    }
}
