<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Country;
use App\Models\Event;
use App\Models\EventProgram;
use App\Models\EventRegistration;
use App\Models\Member;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Regulation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class FrontendDataSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(
            file_get_contents(database_path('seeders/data/frontend.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        $this->seedMembers(array_merge($data['members'] ?? [], $this->directoryMembers()));
        $this->seedNews($data['news'] ?? []);
        $this->seedEvents($data['events'] ?? []);
        $this->seedAgencies($data['agencies'] ?? []);
        $this->seedRegulations($data['regulations'] ?? []);
    }

    private function countryId(string $name): ?int
    {
        return Country::firstOrCreate(['name' => $name])->id;
    }

    /**
     * Membres et partenaires publiquement référencés dans l'annuaire ATAF.
     * Les logos et informations détaillées restent éditables depuis l'administration.
     *
     * @return list<array<string, string|int>>
     */
    private function directoryMembers(): array
    {
        $airlines = [
            ['name' => 'Air Algérie', 'country' => 'Algérie'],
            ['name' => 'Air Austral', 'country' => 'La Réunion'],
            ['name' => 'Air Burkina', 'country' => 'Burkina Faso'],
            ['name' => 'Air Caraïbes', 'country' => 'France / Caraïbes'],
            ['name' => 'Air Corsica', 'country' => 'France / Corse'],
            ['name' => "Air Côte d'Ivoire", 'country' => "Côte d'Ivoire"],
            ['name' => 'Air France', 'country' => 'France'],
            ['name' => 'Air Madagascar', 'country' => 'Madagascar'],
            ['name' => 'Air Mauritius', 'country' => 'Maurice'],
            ['name' => 'Air Sénégal', 'country' => 'Sénégal'],
            ['name' => 'Fly Gabon', 'country' => 'Gabon'],
            ['name' => 'APG Airlines', 'country' => 'France'],
            ['name' => 'Brussels Airlines', 'country' => 'Belgique'],
            ['name' => 'Corsair', 'country' => 'France'],
            ['name' => 'Congo Airways', 'country' => 'République démocratique du Congo'],
            ['name' => 'Mauritania Airlines', 'country' => 'Mauritanie'],
            ['name' => 'Middle East Airlines', 'country' => 'Liban'],
            ['name' => 'Regourd Aviation', 'country' => 'France'],
            ['name' => 'ER Aviation', 'country' => 'France'],
            ['name' => 'Royal Air Maroc', 'country' => 'Maroc'],
            ['name' => 'Tunisair', 'country' => 'Tunisie'],
        ];

        $partners = [
            'Aeroport Nice Côte d’Azur', 'AERCAP', 'AFMAÉ', 'Allianz Travel', 'ASECNA', 'ATR',
            'Airline Factory', 'AVICO', 'BlueLink', 'C.P.C. Aéronautique', 'Embraer', 'ER Group',
            'Holis', 'IFURTA', 'Impact Consultants', 'Les EDVs', 'Marco-Polo', 'Maureva', 'MSC Croisières',
            'Pratt & Whitney Canada', 'Regourd Aviation Services', 'Servair', 'SETO', 'Veling',
            'Travelsoft', 'Aviapartner',
        ];

        return array_merge(
            array_map(fn (array $member): array => $member + ['category' => 'Compagnie aérienne', 'since' => 1950], $airlines),
            array_map(fn (string $name): array => [
                'name' => $name,
                'country' => 'International',
                'category' => 'Partenaire',
                'since' => 1950,
            ], $partners),
        );
    }

    /**
     * Logos publics des membres, repris du site officiel ataf.fr.
     * Ils restent remplaçables depuis l'administration (upload d'un logo).
     *
     * @return array<string, string>
     */
    private function memberLogos(): array
    {
        return [
            'Air Algérie' => "2021/06/Air_Alge\u{0301}rie_logo_logotype_emblem-1-1024x238.png",
            'Air Austral' => '2022/10/logo-air-austral.png',
            'Air Burkina' => '2021/06/LOGO-Air-Burkina.jpg',
            'Air Caraïbes' => '2021/11/air-caraibes.jpg',
            'Air Corsica' => '2021/05/Logo-Air-Corsica-transparent-1024x149.png',
            "Air Côte d'Ivoire" => '2021/06/Logo-Air-Cote-dIvoire.jpg',
            'Air France' => '2021/06/logo-AFskyteam-1024x712.jpg',
            'Air Madagascar' => '2026/11/logo-Air-Madagascar.jpg',
            'Air Mauritius' => '2022/06/logo-Air-Mauritius-1-1024x239.png',
            'Air Sénégal' => "2022/04/Logo-Air-Se\u{0301}ne\u{0301}gal.png",
            'Fly Gabon' => '2026/09/LOGO_FlyGabon-1024x264.jpg',
            'APG Airlines' => '2025/01/APG-Airline-logo-officiel-petit-edited.png',
            'Brussels Airlines' => '2022/10/logo-Brussels-Airlines-1024x242.png',
            'Corsair' => '2021/05/CORSAIR_Logo_SansBaseline-1024x329.png',
            'Congo Airways' => '2024/11/logo-Congo-Airways.png',
            'Mauritania Airlines' => '2021/06/LOGO-MAURITANIA-AIRLINES.png',
            'Middle East Airlines' => '2021/05/MEA-Logo-2.png',
            'Regourd Aviation' => '2021/06/LOGO-REGOURD-AVIATION.jpg',
            'ER Aviation' => '2026/04/ER-AVIATION-LOGO.png',
            'Royal Air Maroc' => '2021/07/LOGO-RAM.jpeg',
            'Tunisair' => '2021/05/Logo-TU-Vectorise-copie-1024x213.jpg',
            'Aeroport Nice Côte d’Azur' => '2022/06/logo-Aeroport_Nice_Cote_dAzur_logo-1-1024x432.png',
            'AERCAP' => '2025/01/AerCap_Logo_Horizontal_Blue_RGB-1024x439.png',
            'AFMAÉ' => '2023/09/AFMAe%E2%80%94-Logos-01-1-1024x1024.png',
            'Allianz Travel' => '2021/07/allianz.png',
            'ASECNA' => '2021/06/LOGO-ASECNA.png',
            'ATR' => '2023/10/pngwing.com_-1-1024x176.png',
            'Airline Factory' => '2024/12/LOGO-AF_-HORIZONTAL-COULEUR_72-DPI-1-1024x237.png',
            'AVICO' => '2024/12/avico.jpg',
            'BlueLink' => '2021/05/BlueLink-logo-1024x240.png',
            'C.P.C. Aéronautique' => '2021/07/Logo-CPC.png',
            'Embraer' => '2023/10/Embraer_logo-1024x172.png',
            'ER Group' => '2026/04/logo-ER.png',
            'Holis' => '2024/12/logo-Holis.png',
            'IFURTA' => '2021/06/LOGO-IFURTA.jpg',
            'Impact Consultants' => '2023/10/logo-Impact-Consultants.png',
            'Les EDVs' => '2022/06/Les-EDVs.png',
            'Marco-Polo' => '2024/12/logo-marco-polo-ok.webp',
            'Maureva' => '2022/11/logoMaureva-1.png',
            'MSC Croisières' => '2024/12/logo-MSC-Croisieres.jpg',
            'Pratt & Whitney Canada' => '2023/10/Pratt__Whitney_logo.svg-1024x796.png',
            'Regourd Aviation Services' => '2021/06/LOGO-REGOURD-AVIATION.jpg',
            'Servair' => '2021/06/LOGO-SERVAIR-aGategroupMember-1024x478.png',
            'SETO' => '2022/06/seto.png',
            'Veling' => '2021/05/Veling-Logo.png',
            'Travelsoft' => '2025/11/Logo-Travelsoft-1024x241-1.png',
            'Aviapartner' => '2025/11/logo-Aviapartner.png',
        ];
    }

    private function seedMembers(array $members): void
    {
        $logos = $this->memberLogos();

        foreach ($members as $member) {
            $logo = $member['logo'] ?? (isset($logos[$member['name']])
                ? 'https://www.ataf.fr/wp-content/uploads/'.$logos[$member['name']]
                : null);

            Member::updateOrCreate(
                ['name' => $member['name']],
                [
                    'slug' => Str::slug($member['name']),
                    'country_id' => $this->countryId($member['country']),
                    'category' => $member['category'] ?? null,
                    'city' => $member['city'] ?? null,
                    'joined_year' => $member['since'] ?? null,
                    'logo_path' => $logo,
                    'website' => isset($member['web']) ? 'https://'.$member['web'] : null,
                    'email' => $member['email'] ?? null,
                    'phone' => $member['phone'] ?? null,
                    'status' => 'active',
                    'is_public' => true,
                ],
            );
        }
    }

    private function seedNews(array $items): void
    {
        foreach ($items as $item) {
            $category = NewsCategory::firstOrCreate(
                ['name' => $item['category']],
                ['slug' => Str::slug($item['category'])],
            );

            News::updateOrCreate(
                ['title' => $item['title']],
                [
                    'slug' => Str::slug($item['title']),
                    'news_category_id' => $category->id,
                    'excerpt' => $item['summary'] ?? null,
                    'body' => $item['summary'] ?? null,
                    'image_path' => $item['image'] ?? null,
                    'status' => 'published',
                    'published_at' => Carbon::parse($item['date'])->setTime(9, 0),
                    'is_members_only' => false,
                ],
            );
        }
    }

    private function seedEvents(array $items): void
    {
        $programme = [
            ['09:00', 'Accueil et enregistrement des participants'],
            ['09:30', 'Allocution de bienvenue'],
            ['10:00', 'Séance plénière'],
            ['12:30', 'Déjeuner'],
            ['14:00', 'Ateliers thématiques'],
            ['15:30', 'Table ronde et échanges'],
            ['17:00', 'Clôture'],
        ];

        foreach ($items as $item) {
            $startsAt = Carbon::parse($item['date'].' '.($item['time'] ?? '09:00'));

            $event = Event::updateOrCreate(
                ['title' => $item['title']],
                [
                    'slug' => Str::slug($item['title']),
                    'type' => $item['type'] ?? null,
                    'status' => $item['status'] ?? 'Ouvert',
                    'description' => $item['description'] ?? null,
                    'starts_at' => $startsAt,
                    'ends_at' => $startsAt->copy()->addHours(8),
                    'location' => $item['location'] ?? null,
                    'capacity' => $item['maxParticipants'] ?? null,
                ],
            );

            $event->programs()->delete();

            foreach ($programme as $position => [$time, $title]) {
                EventProgram::create([
                    'event_id' => $event->id,
                    'time' => $time,
                    'title' => $title,
                    'position' => $position,
                ]);
            }

            $registered = (int) ($item['registered'] ?? 0);

            for ($i = 1; $i <= $registered; $i++) {
                EventRegistration::firstOrCreate(
                    ['event_id' => $event->id, 'email' => "participant{$i}@demo.ataf.fr"],
                    [
                        'first_name' => 'Participant',
                        'last_name' => (string) $i,
                        'company' => 'Compagnie membre',
                        'status' => 'confirmed',
                    ],
                );
            }
        }
    }

    private function seedAgencies(array $items): void
    {
        foreach ($items as $item) {
            Agency::updateOrCreate(
                ['agreement_number' => $item['code']],
                [
                    'name' => $item['name'],
                    'country' => $item['country'] ?? null,
                    'city' => $item['city'] ?? null,
                    'status' => $item['status'] ?? 'approved',
                ],
            );
        }
    }

    private function seedRegulations(array $items): void
    {
        foreach ($items as $item) {
            Regulation::updateOrCreate(
                ['title' => $item['title']],
                [
                    'slug' => Str::slug($item['title']),
                    'published_on' => $item['date'] ?? null,
                    'category' => $item['category'] ?? null,
                    'type' => $item['type'] ?? null,
                    'summary' => $item['summary'] ?? null,
                    'is_public' => true,
                ],
            );
        }
    }
}
