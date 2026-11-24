<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Documents\DocumentResource;
use App\Filament\Resources\Members\MemberResource;
use App\Filament\Resources\MembershipApplications\MembershipApplicationResource;
use App\Filament\Resources\News\NewsResource;
use App\Models\Document;
use App\Models\Member;
use App\Models\MembershipApplication;
use App\Models\News;
use App\Models\PageView;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class SiteStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    protected ?string $heading = 'Vue d’ensemble';

    protected ?string $description = 'Activité du site et de l’association sur les 30 derniers jours.';

    protected function getStats(): array
    {
        $since = Carbon::now()->subDays(30);
        $visits = PageView::query()->where('visited_at', '>=', $since)->count();
        $today = PageView::query()->whereDate('visited_at', today())->count();
        $pages = PageView::query()->where('visited_at', '>=', $since)->distinct('path')->count('path');

        $members = Member::query()->where('status', 'active')->count();
        $pending = MembershipApplication::query()->whereIn('status', ['pending', 'review'])->count();
        $news = News::query()->published()->count();
        $documents = Document::query()->where('is_public', true)->count();

        return [
            Stat::make('Visites (30 jours)', number_format($visits, 0, ',', ' '))
                ->description($today.' aujourd’hui')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('primary'),
            Stat::make('Pages consultées', number_format($pages, 0, ',', ' '))
                ->description('Pages distinctes sur la période')
                ->descriptionIcon('heroicon-m-cursor-arrow-rays')
                ->color('info'),
            Stat::make('Membres actifs', number_format($members, 0, ',', ' '))
                ->description('Fiches membres publiées')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success')
                ->url(MemberResource::getUrl('index')),
            Stat::make('Demandes d’adhésion', number_format($pending, 0, ',', ' '))
                ->description($pending > 0 ? 'À traiter par le secrétariat' : 'Aucune demande en attente')
                ->descriptionIcon('heroicon-m-inbox-arrow-down')
                ->color($pending > 0 ? 'warning' : 'success')
                ->url(MembershipApplicationResource::getUrl('index')),
            Stat::make('Actualités publiées', number_format($news, 0, ',', ' '))
                ->description('Articles en ligne')
                ->descriptionIcon('heroicon-m-newspaper')
                ->color('primary')
                ->url(NewsResource::getUrl('index')),
            Stat::make('Documents publics', number_format($documents, 0, ',', ' '))
                ->description('Téléchargeables par les visiteurs')
                ->descriptionIcon('heroicon-m-folder-open')
                ->color('gray')
                ->url(DocumentResource::getUrl('index')),
        ];
    }
}
