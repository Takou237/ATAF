<?php

namespace App\Filament\Widgets;

use App\Models\PageView;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MostViewedPages extends ChartWidget
{
    protected ?string $heading = 'Pages les plus consultées (30 jours)';

    protected ?string $description = 'Les 8 adresses qui attirent le plus de trafic.';

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = ['lg' => 1];

    protected function getData(): array
    {
        $pages = PageView::query()
            ->where('visited_at', '>=', Carbon::now()->subDays(30))
            ->select('path', DB::raw('COUNT(*) as total'))
            ->groupBy('path')
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        return [
            'datasets' => [[
                'label' => 'Visites',
                'data' => $pages->pluck('total')->map(fn (mixed $total): int => (int) $total)->all(),
                'backgroundColor' => '#1A4F8A',
                'borderRadius' => 6,
            ]],
            'labels' => $pages->pluck('path')->map(fn (mixed $path): string => $this->label((string) $path))->all(),
        ];
    }

    /**
     * Rend les chemins techniques lisibles dans le graphique.
     */
    private function label(string $path): string
    {
        $clean = trim($path, '/');

        if ($clean === '') {
            return 'Accueil';
        }

        return '/'.mb_strimwidth($clean, 0, 24, '…');
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
