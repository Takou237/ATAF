<?php

namespace App\Filament\Resources\AgencyApplications\Pages;

use App\Filament\Resources\AgencyApplications\AgencyApplicationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAgencyApplications extends ListRecords
{
    protected static string $resource = AgencyApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
