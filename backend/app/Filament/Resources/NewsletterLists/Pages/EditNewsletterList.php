<?php

namespace App\Filament\Resources\NewsletterLists\Pages;

use App\Filament\Resources\NewsletterLists\NewsletterListResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditNewsletterList extends EditRecord
{
    protected static string $resource = NewsletterListResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
