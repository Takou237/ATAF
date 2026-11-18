<?php

namespace App\Filament\Resources\NewsletterLists\Pages;

use App\Filament\Resources\NewsletterLists\NewsletterListResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNewsletterLists extends ListRecords
{
    protected static string $resource = NewsletterListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
