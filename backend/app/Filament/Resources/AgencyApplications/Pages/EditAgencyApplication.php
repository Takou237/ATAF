<?php

namespace App\Filament\Resources\AgencyApplications\Pages;

use App\Filament\Resources\AgencyApplications\AgencyApplicationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAgencyApplication extends EditRecord
{
    protected static string $resource = AgencyApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
