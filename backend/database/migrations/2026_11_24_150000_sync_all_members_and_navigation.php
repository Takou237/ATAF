<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Synchronise l'ensemble des 48 membres, de leurs logos et du menu Accueil
     * sur la base de données de production.
     */
    public function up(): void
    {
        $this->syncNavigation();
        $this->syncMembers();
    }

    public function down(): void
    {
        // Données de contenu.
    }

    private function syncNavigation(): void
    {
        $setting = DB::table('settings')->where('key', 'nav_items')->first();
        if (! $setting) {
            return;
        }

        $items = json_decode($setting->value, true);
        if (! is_array($items)) {
            return;
        }

        $hasHome = false;
        foreach ($items as $item) {
            if (($item['path'] ?? '') === '/') {
                $hasHome = true;
                break;
            }
        }

        if (! $hasHome) {
            array_unshift($items, ['label' => 'Accueil', 'path' => '/']);
            DB::table('settings')->where('key', 'nav_items')->update([
                'value' => json_encode($items, JSON_UNESCAPED_UNICODE),
                'updated_at' => Carbon::now(),
            ]);
        }
    }

    private function syncMembers(): void
    {
        $now = Carbon::now();
        $members = $this->membersList();

        foreach ($members as $data) {
            // S'assurer que le pays existe
            $country = DB::table('countries')->where('name', $data['country'])->first();
            if (! $country) {
                $countryId = DB::table('countries')->insertGetId([
                    'name' => $data['country'],
                    'code' => strtoupper(substr(Str::slug($data['country']), 0, 3)),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            } else {
                $countryId = $country->id;
            }

            $existing = DB::table('members')->where('name', $data['name'])->first();

            if ($existing) {
                // Mettre à jour le logo si vide ou incorrect
                DB::table('members')->where('id', $existing->id)->update([
                    'logo_path' => $data['logo'],
                    'country_id' => $countryId,
                    'is_public' => true,
                    'status' => 'active',
                    'updated_at' => $now,
                ]);
            } else {
                // Insérer le membre manquant
                DB::table('members')->insert([
                    'name' => $data['name'],
                    'slug' => Str::slug($data['name']),
                    'country_id' => $countryId,
                    'category' => $data['category'],
                    'city' => $data['city'] ?? null,
                    'joined_year' => $data['since'] ?? 1950,
                    'logo_path' => $data['logo'],
                    'website' => isset($data['web']) ? 'https://'.$data['web'] : null,
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'status' => 'active',
                    'is_public' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function membersList(): array
    {
        return [
            ['name' => 'Air France', 'country' => 'France', 'city' => 'Paris', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/logo-AFskyteam-1024x712.jpg', 'web' => 'airfrance.fr', 'email' => 'contact@airfrance.fr', 'phone' => '+33 1 41 56 78 00'],
            ['name' => 'Air Algérie', 'country' => 'Algérie', 'city' => 'Alger', 'category' => 'Compagnie aérienne', 'since' => 1953, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/Air_Alge%CC%81rie_logo_logotype_emblem-1-1024x238.png', 'web' => 'airalgerie.dz', 'email' => 'contact@airalgerie.dz', 'phone' => '+213 21 50 50 00'],
            ['name' => "Air Côte d'Ivoire", 'country' => "Côte d'Ivoire", 'city' => 'Abidjan', 'category' => 'Compagnie aérienne', 'since' => 2012, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/Logo-Air-Cote-dIvoire.jpg', 'web' => 'aircotedivoire.com'],
            ['name' => 'Royal Air Maroc', 'country' => 'Maroc', 'city' => 'Casablanca', 'category' => 'Compagnie aérienne', 'since' => 1957, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/07/LOGO-RAM.jpeg', 'web' => 'royalairmaroc.com', 'phone' => '+212 5 22 91 20 00'],
            ['name' => 'Tunisair', 'country' => 'Tunisie', 'city' => 'Tunis', 'category' => 'Compagnie aérienne', 'since' => 1948, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Logo-TU-Vectorise-copie-1024x213.jpg', 'web' => 'tunisair.com', 'phone' => '+216 70 837 000'],
            ['name' => 'Brussels Airlines', 'country' => 'Belgique', 'city' => 'Bruxelles', 'category' => 'Compagnie aérienne', 'since' => 2006, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/10/logo-Brussels-Airlines-1024x242.png', 'web' => 'brusselsairlines.com', 'phone' => '+32 2 754 19 07'],
            ['name' => 'Air Sénégal', 'country' => 'Sénégal', 'city' => 'Dakar', 'category' => 'Compagnie aérienne', 'since' => 2018, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/04/Logo-Air-Se%CC%81ne%CC%81gal.png', 'web' => 'airsenegal.sn'],
            ['name' => 'Air Mauritius', 'country' => 'Maurice', 'city' => 'Port-Louis', 'category' => 'Compagnie aérienne', 'since' => 1967, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/06/logo-Air-Mauritius-1-1024x239.png', 'web' => 'airmauritius.com'],
            ['name' => 'Corsair', 'country' => 'France', 'city' => 'Paris', 'category' => 'Compagnie aérienne', 'since' => 1990, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/CORSAIR_Logo_SansBaseline-1024x329.png', 'web' => 'corsair.fr'],
            ['name' => 'Air Caraïbes', 'country' => 'France', 'city' => 'Pointe-à-Pitre', 'category' => 'Compagnie aérienne', 'since' => 2000, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/11/air-caraibes.jpg', 'web' => 'aircaraibes.com'],
            ['name' => 'Air Austral', 'country' => 'France', 'city' => 'Saint-Denis de la Réunion', 'category' => 'Compagnie aérienne', 'since' => 1990, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/10/logo-air-austral.png', 'web' => 'air-austral.com'],
            ['name' => 'Middle East Airlines', 'country' => 'Liban', 'city' => 'Beyrouth', 'category' => 'Compagnie aérienne', 'since' => 1945, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/MEA-Logo-2.png', 'web' => 'mea.com.lb'],
            ['name' => 'ASECNA', 'country' => 'Sénégal', 'city' => 'Dakar', 'category' => 'Organisation internationale', 'since' => 1959, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-ASECNA.png', 'web' => 'asecna.aero', 'phone' => '+221 33 823 66 00'],
            ['name' => 'Embraer', 'country' => 'Brésil', 'city' => 'São Paulo', 'category' => 'Industriel', 'since' => 2005, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Embraer_logo-1024x172.png', 'web' => 'embraer.com'],
            ['name' => 'ATR', 'country' => 'France', 'city' => 'Toulouse', 'category' => 'Industriel', 'since' => 2003, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/10/pngwing.com_-1-1024x176.png', 'web' => 'atr-aircraft.com'],
            ['name' => 'Pratt & Whitney', 'country' => 'États-Unis', 'city' => 'East Hartford', 'category' => 'Partenaire', 'since' => 2008, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Pratt__Whitney_logo.svg-1024x796.png', 'web' => 'prattwhitney.com'],
            ['name' => 'Pratt & Whitney Canada', 'country' => 'Canada', 'category' => 'Partenaire', 'since' => 2008, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Pratt__Whitney_logo.svg-1024x796.png'],
            ['name' => 'Air Burkina', 'country' => 'Burkina Faso', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-Air-Burkina.jpg'],
            ['name' => 'Air Corsica', 'country' => 'France', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Logo-Air-Corsica-transparent-1024x149.png'],
            ['name' => 'Air Madagascar', 'country' => 'Madagascar', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2026/11/logo-Air-Madagascar.jpg'],
            ['name' => 'Fly Gabon', 'country' => 'Gabon', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2026/09/LOGO_FlyGabon-1024x264.jpg'],
            ['name' => 'APG Airlines', 'country' => 'France', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2025/01/APG-Airline-logo-officiel-petit-edited.png'],
            ['name' => 'Congo Airways', 'country' => 'République démocratique du Congo', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/11/logo-Congo-Airways.png'],
            ['name' => 'Mauritania Airlines', 'country' => 'Mauritanie', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-MAURITANIA-AIRLINES.png'],
            ['name' => 'Regourd Aviation', 'country' => 'France', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-REGOURD-AVIATION.jpg'],
            ['name' => 'ER Aviation', 'country' => 'France', 'category' => 'Compagnie aérienne', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2026/04/ER-AVIATION-LOGO.png'],
            ['name' => 'Aeroport Nice Côte d’Azur', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/06/logo-Aeroport_Nice_Cote_dAzur_logo-1-1024x432.png'],
            ['name' => 'AERCAP', 'country' => 'International', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2025/01/AerCap_Logo_Horizontal_Blue_RGB-1024x439.png'],
            ['name' => 'AFMAÉ', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/09/AFMAe%E2%80%94-Logos-01-1-1024x1024.png'],
            ['name' => 'Allianz Travel', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/07/allianz.png'],
            ['name' => 'Airline Factory', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/LOGO-AF_-HORIZONTAL-COULEUR_72-DPI-1-1024x237.png'],
            ['name' => 'AVICO', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/avico.jpg'],
            ['name' => 'BlueLink', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/BlueLink-logo-1024x240.png'],
            ['name' => 'C.P.C. Aéronautique', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/07/Logo-CPC.png'],
            ['name' => 'ER Group', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2026/04/logo-ER.png'],
            ['name' => 'Holis', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-Holis.png'],
            ['name' => 'IFURTA', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-IFURTA.jpg'],
            ['name' => 'Impact Consultants', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2023/10/logo-Impact-Consultants.png'],
            ['name' => 'Les EDVs', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/06/Les-EDVs.png'],
            ['name' => 'Marco-Polo', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-marco-polo-ok.webp'],
            ['name' => 'Maureva', 'country' => 'Maurice', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/11/logoMaureva-1.png'],
            ['name' => 'MSC Croisières', 'country' => 'Suisse', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-MSC-Croisieres.jpg'],
            ['name' => 'Regourd Aviation Services', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-REGOURD-AVIATION.jpg'],
            ['name' => 'Servair', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-SERVAIR-aGategroupMember-1024x478.png'],
            ['name' => 'SETO', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2022/06/seto.png'],
            ['name' => 'Veling', 'country' => 'Maurice', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Veling-Logo.png'],
            ['name' => 'Travelsoft', 'country' => 'France', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2025/11/Logo-Travelsoft-1024x241-1.png'],
            ['name' => 'Aviapartner', 'country' => 'Belgique', 'category' => 'Partenaire', 'since' => 1950, 'logo' => 'https://www.ataf.fr/wp-content/uploads/2025/11/logo-Aviapartner.png'],
        ];
    }
};
