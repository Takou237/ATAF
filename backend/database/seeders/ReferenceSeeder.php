<?php

namespace Database\Seeders;

use App\Models\BoardMember;
use App\Models\Country;
use App\Models\Document;
use App\Models\MediaItem;
use App\Models\NewsCategory;
use App\Models\NewsletterList;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Setting;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ReferenceSeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            'France' => 'FR',
            'Algérie' => 'DZ',
            'Côte d\'Ivoire' => 'CI',
            'Maroc' => 'MA',
            'Tunisie' => 'TN',
            'Belgique' => 'BE',
            'Sénégal' => 'SN',
            'Maurice' => 'MU',
            'Liban' => 'LB',
            'Brésil' => 'BR',
            'États-Unis' => 'US',
            'Cameroun' => 'CM',
            'Gabon' => 'GA',
            'Nouvelle-Calédonie' => 'NC',
        ];

        foreach ($countries as $name => $code) {
            Country::firstOrCreate(['name' => $name], ['code' => $code]);
        }

        $settings = [
            'site_name' => 'ATAF',
            'site_baseline' => 'Au service du transport aérien francophone',
            'founded_year' => '1950',
            'contact_email' => 'sg@ataf.fr',
            'contact_address' => 'Secrétariat Général ATAF, Montreuil, France',
            'contact_website' => 'https://www.ataf.fr',
            'stats_years' => '75+',
            'stats_members' => '40+',
            'stats_countries' => '25',
            'stats_assemblies' => '130+',
            'social_twitter' => '#',
            'social_linkedin' => '#',
        ];

        foreach ($settings as $key => $value) {
            Setting::set($key, $value);
        }

        $pages = [
            [
                'slug' => 'presentation',
                'title' => "L'ATAF",
                'subtitle' => 'Association des Transporteurs Aériens Francophones',
                'body' => "<p>L'ATAF — Association des Transporteurs Aériens Francophones — est une organisation internationale fondée en 1950, rassemblant les principales compagnies aériennes du monde francophone ainsi que leurs partenaires industriels, institutionnels et commerciaux.</p><p>Elle constitue un cadre privilégié de dialogue, d'échange d'expériences et de représentation collective auprès des grandes instances internationales de l'aviation civile : ICAO, IATA, AFRAA, ASECNA.</p>",
            ],
            [
                'slug' => 'missions',
                'title' => 'Missions',
                'subtitle' => "Les engagements de l'ATAF",
                'body' => "<p>Dialogue et concertation, partage d'expériences, veille réglementaire, formation, représentation collective et développement de l'aviation dans l'espace francophone.</p>",
            ],
            [
                'slug' => 'histoire',
                'title' => 'Histoire',
                'subtitle' => '75 ans au service du transport aérien francophone',
                'body' => "<p>Fondée en 1950, l'ATAF a accompagné les grandes étapes de l'aviation civile francophone, de l'internationalisation du réseau aux enjeux actuels de durabilité.</p>",
            ],
            [
                'slug' => 'gouvernance',
                'title' => 'Gouvernance',
                'subtitle' => "Structure et fonctionnement de l'ATAF",
                'body' => "<p>L'Assemblée Générale, le Comité Exécutif et le Secrétariat Général assurent la gouvernance de l'association.</p>",
            ],
            [
                'slug' => 'organigramme',
                'title' => 'Organigramme',
                'subtitle' => "Structure de direction de l'ATAF",
                'body' => '<p>Présidence, vice-présidences et direction générale.</p>',
            ],
            [
                'slug' => 'bureau',
                'title' => "Bureau / Conseil d'administration",
                'subtitle' => "Les membres du bureau de l'ATAF",
                'body' => "<p>Le Bureau est composé du Président, des Vice-Présidents et du Trésorier.</p>",
            ],
            [
                'slug' => 'statuts',
                'title' => 'Statuts',
                'subtitle' => "Textes fondateurs de l'ATAF",
                'body' => '<p>Les statuts de l\'association sont disponibles auprès du Secrétariat Général.</p>',
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page + ['status' => 'published']);
        }

        $board = [
            ['Gnl Abdoulaye COULIBALY', 'Président', 'Air Côte d\'Ivoire', 'board'],
            ['Mme Anne RIGAIL', '1ère Vice-Présidente', 'Air France', 'board'],
            ['M. Pierre MURACCIOLE', 'Vice-Président', 'Air Corsica', 'board'],
            ['M. Pascal de IZAGUIRRE', 'Vice-Président', 'Corsair', 'board'],
            ['M. Mohamad EL-HOUT', 'Vice-Président', 'Middle East Airlines', 'board'],
            ['M. Nyl Charles MORET-MBA', 'Vice-Président', 'FLY GABON', 'board'],
            ['Mme Halima I. KHOUAJA', 'Vice-Présidente', 'TUNISAIR', 'board'],
            ['M. Claude THENEVIN', 'Trésorier', 'ATAF', 'board'],
            ['M. Patrick ALEXANDRE', 'Directeur Général', 'ATAF', 'secretariat'],
            ['M. Jean-Claude CROS', 'Directeur Général Adjoint', 'ATAF', 'secretariat'],
            ['Mme Sonia VALLON', 'Administration et Finances', 'ATAF', 'secretariat'],
            ['M. Raphaël CROS', 'Communication', 'ATAF', 'secretariat'],
        ];

        foreach ($board as $position => [$name, $role, $company, $group]) {
            BoardMember::updateOrCreate(
                ['name' => $name, 'role' => $role],
                ['company' => $company, 'group' => $group, 'position' => $position],
            );
        }

        foreach (['ATAF', 'Membres', 'Réglementation', 'Événements', 'Publications'] as $name) {
            NewsCategory::firstOrCreate(['name' => $name], ['slug' => Str::slug($name)]);
        }

        foreach (['ICAO', 'IATA', 'AFRAA', 'ASECNA', 'Sécurité', 'Environnement', 'Formation'] as $name) {
            Tag::firstOrCreate(['name' => $name], ['slug' => Str::slug($name)]);
        }

        $documents = [
            ['Guide de sécurité aérienne ATAF 2026', 'Sécurité', 2_400_000, true, '2026-09-01'],
            ['Rapport annuel ATAF 2025', 'Rapports', 5_800_000, true, '2026-07-01'],
            ['Manuel de sûreté aérienne — Membres ATAF', 'Sûreté', 3_100_000, false, '2026-06-01'],
            ['Formation SMS — Support de cours', 'Formation', 8_200_000, false, '2026-05-01'],
            ['Étude : connectivité aérienne en Afrique francophone', 'Études', 6_700_000, true, '2026-03-01'],
            ['Textes fondateurs et statuts de l\'ATAF', 'Gouvernance', 1_200_000, true, '2026-01-01'],
            ['Bilan environnemental du transport aérien francophone', 'Environnement', 4_500_000, true, '2025-12-01'],
            ['Comptes rendus — 131ème Assemblée Générale', 'Rapports', 2_900_000, false, '2025-11-01'],
        ];

        foreach ($documents as [$title, $category, $size, $isPublic, $date]) {
            Document::updateOrCreate(
                ['title' => $title],
                [
                    'slug' => Str::slug($title),
                    'category' => $category,
                    'type' => 'PDF',
                    'file_size' => $size,
                    'is_public' => $isPublic,
                    'published_on' => $date,
                ],
            );
        }

        $publications = [
            ['Rapport annuel ATAF 2025', 'Rapport annuel', '2026-07-01', 48],
            ['Bulletin trimestriel ATAF — T2 2026', 'Bulletin', '2026-06-01', 24],
            ['Guide pratique : mise en conformité ICAO pour les compagnies francophones', 'Guide', '2026-05-01', 72],
            ['Étude ATAF sur la connectivité aérienne en Afrique francophone', 'Étude', '2026-03-01', 96],
            ['Bulletin trimestriel ATAF — T1 2026', 'Bulletin', '2026-03-01', 20],
        ];

        foreach ($publications as [$title, $type, $date, $pages]) {
            Publication::updateOrCreate(
                ['title' => $title],
                ['type' => $type, 'published_on' => $date, 'pages' => $pages, 'is_public' => true],
            );
        }

        $photos = [
            ['131ème Assemblée Générale — Paris 2025', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'],
            ['Séminaire Sécurité — Dakar 2025', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop'],
            ['Formation réglementaire — Tunis 2025', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop'],
            ['Conférence sur la transition écologique', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
            ['Réunion du Comité Exécutif', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop'],
            ['Séminaire Fret aérien — Abidjan 2024', 'https://images.unsplash.com/photo-1583245773069-f2f26873dd7e?w=800&h=600&fit=crop'],
        ];

        foreach ($photos as $position => [$title, $url]) {
            MediaItem::updateOrCreate(
                ['title' => $title],
                ['type' => 'photo', 'url' => $url, 'position' => $position],
            );
        }

        foreach (["Discours d'ouverture — 131ème Assemblée Générale", 'ATAF en chiffres — édition 2025'] as $position => $title) {
            MediaItem::updateOrCreate(
                ['title' => $title],
                ['type' => 'video', 'position' => $position],
            );
        }

        NewsletterList::firstOrCreate(['slug' => 'general'], ['name' => 'Newsletter générale']);
        NewsletterList::firstOrCreate(['slug' => 'membres'], ['name' => 'Newsletter membres']);
    }
}
