<?php

namespace App\Filament\Resources\NewsletterLists\Pages;

use App\Filament\Resources\NewsletterLists\NewsletterListResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNewsletterList extends CreateRecord
{
    protected static string $resource = NewsletterListResource::class;
}
