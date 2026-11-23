<?php

namespace App\Filament\Resources\AgencyVerifications\Tables;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AgencyVerificationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('agreement_number')
                    ->label("N° recherché")
                    ->searchable(),
                TextColumn::make('found')
                    ->label('Résultat')
                    ->badge()
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Trouvé' : 'Non trouvé')
                    ->color(fn (bool $state): string => $state ? 'success' : 'danger'),
                TextColumn::make('ip')
                    ->label('Adresse IP')
                    ->searchable()
                    ->toggleable(),
                TextColumn::make('user_agent')
                    ->label('Navigateur')
                    ->limit(40)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('found')
                    ->label('Résultat')
                    ->options([
                        1 => 'Trouvé',
                        0 => 'Non trouvé',
                    ]),
            ]);
    }
}
