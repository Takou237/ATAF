<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * La base de production avait été remplie avec une version du seeder
     * antérieure à l'ajout des logos : tous les `logo_path` y étaient NULL et
     * le bandeau de logos du site affichait donc des noms au lieu d'images.
     * Cette migration ne complète que les logos manquants, sans écraser ceux
     * qu'un administrateur aurait renseignés depuis le back-office.
     */
    public function up(): void
    {
        foreach ($this->logos() as $name => $logo) {
            DB::table('members')
                ->where('name', $name)
                ->where(function ($query) {
                    $query->whereNull('logo_path')->orWhere('logo_path', '');
                })
                ->update(['logo_path' => $logo]);
        }
    }

    public function down(): void
    {
        // Donnée de contenu : rien à annuler.
    }

    /**
     * @return array<string, string>
     */
    private function logos(): array
    {
        return [
            'AERCAP' => 'https://www.ataf.fr/wp-content/uploads/2025/01/AerCap_Logo_Horizontal_Blue_RGB-1024x439.png',
            'AFMAÉ' => 'https://www.ataf.fr/wp-content/uploads/2023/09/AFMAe%E2%80%94-Logos-01-1-1024x1024.png',
            'APG Airlines' => 'https://www.ataf.fr/wp-content/uploads/2025/01/APG-Airline-logo-officiel-petit-edited.png',
            'ASECNA' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-ASECNA.png',
            'ATR' => 'https://www.ataf.fr/wp-content/uploads/2023/10/pngwing.com_-1-1024x176.png',
            'AVICO' => 'https://www.ataf.fr/wp-content/uploads/2024/12/avico.jpg',
            'Aeroport Nice Côte d’Azur' => 'https://www.ataf.fr/wp-content/uploads/2022/06/logo-Aeroport_Nice_Cote_dAzur_logo-1-1024x432.png',
            'Air Algérie' => 'https://www.ataf.fr/wp-content/uploads/2021/06/Air_Algérie_logo_logotype_emblem-1-1024x238.png',
            'Air Austral' => 'https://www.ataf.fr/wp-content/uploads/2022/10/logo-air-austral.png',
            'Air Burkina' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-Air-Burkina.jpg',
            'Air Caraïbes' => 'https://www.ataf.fr/wp-content/uploads/2021/11/air-caraibes.jpg',
            'Air Corsica' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Logo-Air-Corsica-transparent-1024x149.png',
            "Air Côte d'Ivoire" => 'https://www.ataf.fr/wp-content/uploads/2021/06/Logo-Air-Cote-dIvoire.jpg',
            'Air France' => 'https://www.ataf.fr/wp-content/uploads/2021/06/logo-AFskyteam-1024x712.jpg',
            'Air Madagascar' => 'https://www.ataf.fr/wp-content/uploads/2026/11/logo-Air-Madagascar.jpg',
            'Air Mauritius' => 'https://www.ataf.fr/wp-content/uploads/2022/06/logo-Air-Mauritius-1-1024x239.png',
            'Air Sénégal' => 'https://www.ataf.fr/wp-content/uploads/2022/04/Logo-Air-Sénégal.png',
            'Airline Factory' => 'https://www.ataf.fr/wp-content/uploads/2024/12/LOGO-AF_-HORIZONTAL-COULEUR_72-DPI-1-1024x237.png',
            'Allianz Travel' => 'https://www.ataf.fr/wp-content/uploads/2021/07/allianz.png',
            'Aviapartner' => 'https://www.ataf.fr/wp-content/uploads/2025/11/logo-Aviapartner.png',
            'BlueLink' => 'https://www.ataf.fr/wp-content/uploads/2021/05/BlueLink-logo-1024x240.png',
            'Brussels Airlines' => 'https://www.ataf.fr/wp-content/uploads/2022/10/logo-Brussels-Airlines-1024x242.png',
            'C.P.C. Aéronautique' => 'https://www.ataf.fr/wp-content/uploads/2021/07/Logo-CPC.png',
            'Congo Airways' => 'https://www.ataf.fr/wp-content/uploads/2024/11/logo-Congo-Airways.png',
            'Corsair' => 'https://www.ataf.fr/wp-content/uploads/2021/05/CORSAIR_Logo_SansBaseline-1024x329.png',
            'ER Aviation' => 'https://www.ataf.fr/wp-content/uploads/2026/04/ER-AVIATION-LOGO.png',
            'ER Group' => 'https://www.ataf.fr/wp-content/uploads/2026/04/logo-ER.png',
            'Embraer' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Embraer_logo-1024x172.png',
            'Fly Gabon' => 'https://www.ataf.fr/wp-content/uploads/2026/09/LOGO_FlyGabon-1024x264.jpg',
            'Holis' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-Holis.png',
            'IFURTA' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-IFURTA.jpg',
            'Impact Consultants' => 'https://www.ataf.fr/wp-content/uploads/2023/10/logo-Impact-Consultants.png',
            'Les EDVs' => 'https://www.ataf.fr/wp-content/uploads/2022/06/Les-EDVs.png',
            'MSC Croisières' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-MSC-Croisieres.jpg',
            'Marco-Polo' => 'https://www.ataf.fr/wp-content/uploads/2024/12/logo-marco-polo-ok.webp',
            'Maureva' => 'https://www.ataf.fr/wp-content/uploads/2022/11/logoMaureva-1.png',
            'Mauritania Airlines' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-MAURITANIA-AIRLINES.png',
            'Middle East Airlines' => 'https://www.ataf.fr/wp-content/uploads/2021/05/MEA-Logo-2.png',
            'Pratt & Whitney Canada' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Pratt__Whitney_logo.svg-1024x796.png',
            'Regourd Aviation' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-REGOURD-AVIATION.jpg',
            'Regourd Aviation Services' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-REGOURD-AVIATION.jpg',
            'Royal Air Maroc' => 'https://www.ataf.fr/wp-content/uploads/2021/07/LOGO-RAM.jpeg',
            'SETO' => 'https://www.ataf.fr/wp-content/uploads/2022/06/seto.png',
            'Servair' => 'https://www.ataf.fr/wp-content/uploads/2021/06/LOGO-SERVAIR-aGategroupMember-1024x478.png',
            'Travelsoft' => 'https://www.ataf.fr/wp-content/uploads/2025/11/Logo-Travelsoft-1024x241-1.png',
            'Tunisair' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Logo-TU-Vectorise-copie-1024x213.jpg',
            'Veling' => 'https://www.ataf.fr/wp-content/uploads/2021/05/Veling-Logo.png',
        ];
    }
};
