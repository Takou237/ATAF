<?php

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class VisitsTrend extends ChartWidget
{
    protected ?string $heading = 'Évolution des visites (14 derniers jours)';

    protected ?string $description = 'Nombre de pages vues par jour, tous visiteurs confondus.';

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = ['lg' => 2];

    protected function getData(): array
    {
        $start = Carbon::today()->subDays(13);
        $days = collect(range(13, 0))
            ->map(fn (int $offset): Carbon => Carbon::today()->subDays($offset));

        $counts = PageView::query()
            ->where('visited_at', '>=', $start)
            ->get(['visited_at'])
            ->groupBy(fn (PageView $view): string => $view->visited_at?->toDateString() ?? '')
            ->map(fn ($rows): int => $rows->count());

        return [
            'datasets' => [[
                'label' => 'Pages vues',
                'data' => $days
                    ->map(fn (Carbon $day): int => (int) ($counts[$day->toDateString()] ?? 0))
                    ->all(),
                'borderColor' => '#1A4F8A',
                'backgroundColor' => 'rgba(26, 79, 138, 0.12)',
                'fill' => true,
                'tension' => 0.35,
            ]],
            'labels' => $days->map(fn (Carbon $day): string => $day->format('d/m'))->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
