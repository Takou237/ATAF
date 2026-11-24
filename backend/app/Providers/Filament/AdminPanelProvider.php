<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\MostViewedPages;
use App\Filament\Widgets\SiteStatsOverview;
use App\Filament\Widgets\VisitsTrend;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandLogo(fn (): string => asset('images/ataf-logo.png'))
            ->brandLogoHeight('2.5rem')
            ->darkMode(false)
            ->brandName('ATAF — Administration')
            ->colors([
                'primary' => Color::Sky,
            ])
            ->sidebarCollapsibleOnDesktop()
            // Ordre de lecture de la barre latérale : du métier (membres) vers
            // la technique (administration), avec une icône par rubrique.
            ->navigationGroups([
                NavigationGroup::make('Membres & Agréments')->icon('heroicon-o-user-group'),
                NavigationGroup::make('Contenus')->icon('heroicon-o-newspaper'),
                NavigationGroup::make('Institution')->icon('heroicon-o-building-library'),
                NavigationGroup::make('Événements')->icon('heroicon-o-calendar-days'),
                NavigationGroup::make('Ressources')->icon('heroicon-o-folder-open'),
                NavigationGroup::make('Communication')->icon('heroicon-o-megaphone'),
                NavigationGroup::make('Administration')->icon('heroicon-o-cog-6-tooth')->collapsed(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                SiteStatsOverview::class,
                VisitsTrend::class,
                MostViewedPages::class,
                AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
