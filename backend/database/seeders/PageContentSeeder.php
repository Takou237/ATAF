<?php

namespace Database\Seeders;

use App\Models\MediaItem;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Convertit le contenu éditorial jusqu'ici écrit en dur dans le code React
 * en blocs stockés dans `pages.sections`, éditables depuis /admin.
 */
class PageContentSeeder extends Seeder
{
    private function block(string $type, array $data = []): array
    {
        return array_merge(['type' => $type], $data);
    }

    private function button(string $title, string $url): array
    {
        return ['title' => $title, 'url' => $url];
    }

    public function run(): void
    {
        $this->seedSettings();
        $this->seedHome();
        $this->seedInstitutionalPages();
        $this->seedSectionPages();
        $this->seedContact();
        $this->seedMedia();
    }

    private function seedSettings(): void
    {
        $settings = [
            'contact_phone' => '',
            'footer_about' => "Association des Transporteurs Aériens Francophones, au service du transport aérien francophone depuis 1950.",
            'hero_image' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=900&fit=crop&auto=format',
        ];

        foreach ($settings as $key => $value) {
            if (! Setting::query()->where('key', $key)->exists()) {
                Setting::set($key, $value, 'general');
            }
        }

        $navigation = [
            ['label' => "L'ATAF", 'path' => '/ataf', 'children' => [
                ['label' => 'Présentation', 'path' => '/ataf/presentation'],
                ['label' => 'Missions', 'path' => '/ataf/missions'],
                ['label' => 'Histoire', 'path' => '/ataf/histoire'],
                ['label' => 'Gouvernance', 'path' => '/ataf/gouvernance'],
                ['label' => 'Organigramme', 'path' => '/ataf/organigramme'],
                ['label' => 'Bureau / CA', 'path' => '/ataf/bureau'],
            ]],
            ['label' => 'Membres', 'path' => '/membres', 'children' => [
                ['label' => 'Annuaire des membres', 'path' => '/membres/annuaire'],
                ['label' => 'Compagnies membres', 'path' => '/membres/compagnies'],
                ['label' => 'Partenaires', 'path' => '/membres/partenaires'],
                ['label' => 'Devenir membre', 'path' => '/membres/adhesion'],
            ]],
            ['label' => 'Actualités', 'path' => '/actualites', 'children' => [
                ['label' => 'Actualités ATAF', 'path' => '/actualites/ataf'],
                ['label' => 'Actualités membres', 'path' => '/actualites/membres'],
                ['label' => 'Communiqués', 'path' => '/actualites/communiques'],
                ['label' => 'Veille aéronautique', 'path' => '/actualites/veille'],
            ]],
            ['label' => 'Événements', 'path' => '/evenements', 'children' => [
                ['label' => 'Agenda', 'path' => '/evenements/agenda'],
                ['label' => 'Séminaires', 'path' => '/evenements/seminaires'],
                ['label' => 'Formations', 'path' => '/evenements/formations'],
                ['label' => 'Assemblées générales', 'path' => '/evenements/assemblees'],
                ['label' => 'Conférences', 'path' => '/evenements/conferences'],
            ]],
            ['label' => 'Réglementation', 'path' => '/reglementation', 'children' => [
                ['label' => 'Veille réglementaire', 'path' => '/reglementation/veille'],
                ['label' => 'Textes réglementaires', 'path' => '/reglementation/textes'],
                ['label' => 'Publications', 'path' => '/reglementation/publications'],
                ['label' => 'Notes et analyses', 'path' => '/reglementation/notes'],
            ]],
            ['label' => 'Nos agences', 'path' => '/agences', 'children' => [
                ['label' => 'Annuaire', 'path' => '/agences/annuaire'],
                ['label' => 'Vérifier un agrément', 'path' => '/agences/verification'],
                ['label' => 'Informations', 'path' => '/agences/informations'],
            ]],
            ['label' => 'Ressources', 'path' => '/ressources', 'children' => [
                ['label' => 'Centre documentaire', 'path' => '/ressources/documents'],
                ['label' => 'Publications', 'path' => '/ressources/publications'],
                ['label' => 'Médiathèque', 'path' => '/ressources/mediatheque'],
            ]],
            ['label' => 'Contact', 'path' => '/contact', 'children' => []],
        ];

        Setting::set('nav_items', json_encode($navigation, JSON_UNESCAPED_UNICODE), 'navigation');
    }

    private function seedHome(): void
    {
        Page::query()->updateOrCreate(
            ['slug' => 'home'],
            [
                'title' => 'Accueil',
                'subtitle' => 'Au service du transport aérien francophone',
                'status' => 'published',
                'position' => 0,
                'sections' => [
                    $this->block('hero', [
                        'title' => 'ATAF',
                        'subtitle' => 'Au service du transport aérien francophone',
                        'text' => "L'Association des Transporteurs Aériens Francophones fédère les grandes compagnies aériennes du monde francophone depuis 1950, favorisant le dialogue, le partage d'expériences et la représentation collective.",
                        'image' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=900&fit=crop&auto=format',
                        'items' => [
                            $this->button("Découvrir l'ATAF", '/ataf/presentation'),
                            $this->button('Espace membres', '/espace-membres'),
                            $this->button('Nos événements', '/evenements/agenda'),
                        ],
                    ]),
                    $this->block('stats', [
                        'items' => [
                            ['value' => '75+', 'label' => "Années d'existence"],
                            ['value' => '40+', 'label' => 'Membres actifs'],
                            ['value' => '25', 'label' => 'Pays représentés'],
                            ['value' => '130+', 'label' => 'Assemblées générales'],
                        ],
                    ]),
                    $this->block('features', [
                        'title' => 'Nos services',
                        'subtitle' => "L'ATAF offre à ses membres un cadre structuré d'échanges, de formation, de représentation et de rencontres au sein de la Francophonie aéronautique.",
                        'items' => [
                            ['icon' => '🎓', 'title' => 'Séminaire & Formation', 'text' => 'Des séminaires techniques réguliers sur la sécurité aérienne, la sûreté, le fret et la gestion des risques — ouverts aux experts des compagnies membres.'],
                            ['icon' => '📄', 'title' => 'Réglementation', 'text' => "Diffusion de l'information aéropolitique pour tenir les membres informés des évolutions techniques, réglementaires et politiques du transport aérien."],
                            ['icon' => '🤝', 'title' => 'Représentativité', 'text' => 'Représentation collective auprès des prestataires de services (ASECNA) et des instances internationales : OACI, IATA, AFRAA, aéroports francophones.'],
                            ['icon' => '📅', 'title' => 'Rencontre', 'text' => "Une Assemblée Générale annuelle permettant aux PDG et hauts dirigeants d'échanger sur les tendances du secteur et de définir les priorités."],
                        ],
                    ]),
                    $this->block('rich_text', [
                        'title' => "Présentation de l'ATAF",
                        'rich_text' => "<p>L'ATAF — <strong>Association Internationale des Transporteurs Aériens Francophones</strong> — est une organisation internationale fondée en <strong>1950</strong>, rassemblant les principales compagnies aériennes du monde francophone ainsi que leurs partenaires industriels et institutionnels.</p><p>Elle constitue un cadre privilégié de dialogue, d'échange d'expériences et de représentation collective auprès des grandes instances internationales de l'aviation civile : ICAO, IATA, AFRAA, ASECNA et autres organisations multilatérales.</p>",
                    ]),
                    $this->block('list', [
                        'title' => "Objectifs de l'ATAF",
                        'items' => [
                            ['title' => "Renforcer les avantages des compagnies membres dans l'espace francophone"],
                            ['title' => "Favoriser le partage d'expériences et les transferts de technologie"],
                            ['title' => 'Encourager le dialogue entre les compagnies membres et leurs autorités de tutelle'],
                            ['title' => 'Faciliter les échanges entre présidents et dirigeants lors des Assemblées Générales'],
                            ['title' => 'Assurer la représentation collective auprès des instances internationales'],
                            ['title' => 'Contribuer au développement durable du transport aérien francophone'],
                        ],
                    ]),
                    $this->block('news_grid', [
                        'title' => 'Actualités',
                        'subtitle' => 'Dernières nouvelles',
                        'limit' => 6,
                        'button_label' => 'Voir toutes les actualités',
                        'button_url' => '/actualites',
                    ]),
                    $this->block('events_grid', [
                        'title' => 'Prochains événements',
                        'subtitle' => 'À venir',
                        'limit' => 3,
                        'button_label' => "Voir tout l'agenda",
                        'button_url' => '/evenements/agenda',
                    ]),
                    $this->block('members_strip', [
                        'title' => 'Nos membres',
                        'subtitle' => 'Notre réseau',
                        'limit' => 10,
                        'button_label' => "Voir l'annuaire complet",
                        'button_url' => '/membres/annuaire',
                    ]),
                    $this->block('cta', [
                        'title' => 'Veille réglementaire du transport aérien',
                        'text' => "L'ATAF assure une veille permanente sur les évolutions réglementaires internationales affectant le transport aérien francophone. Nos équipes analysent et diffusent les textes de l'ICAO, de l'IATA, de l'AFRAA et des autorités nationales.",
                        'button_label' => 'Accéder à la veille réglementaire',
                        'button_url' => '/reglementation/veille',
                    ]),
                    $this->block('newsletter', [
                        'title' => 'Newsletter ATAF',
                        'text' => 'Recevez les informations ATAF directement dans votre boîte mail — actualités, événements, veille réglementaire.',
                    ]),
                ],
            ],
        );
    }

    private function seedInstitutionalPages(): void
    {
        Page::query()->updateOrCreate(
            ['slug' => 'presentation'],
            [
                'title' => "L'ATAF",
                'subtitle' => 'Association des Transporteurs Aériens Francophones',
                'status' => 'published',
                'position' => 1,
                'sections' => [
                    $this->block('hero', [
                        'title' => "L'ATAF",
                        'subtitle' => 'Association des Transporteurs Aériens Francophones',
                    ]),
                    $this->block('rich_text', [
                        'title' => 'Qui sommes-nous ?',
                        'rich_text' => "<p>L'ATAF — <strong>Association Internationale des Transporteurs Aériens Francophones</strong> — est une organisation internationale fondée en <strong>1950</strong>, rassemblant les principales compagnies aériennes du monde francophone ainsi que leurs partenaires industriels, institutionnels et commerciaux.</p><p>L'ATAF regroupe aujourd'hui plus de 40 membres actifs — compagnies aériennes, organismes de navigation aérienne, industriels et partenaires — dans plus de 25 pays représentant l'ensemble de la Francophonie aéronautique.</p><blockquote>« L'ATAF est un espace de confiance où les dirigeants de l'aviation francophone construisent ensemble un secteur plus sûr, plus efficace et plus durable. »<br>— Gnl Abdoulaye COULIBALY, Président de l'ATAF</blockquote>",
                    ]),
                    $this->block('stats', [
                        'items' => [
                            ['value' => '1950', 'label' => 'Année de création'],
                            ['value' => '40+', 'label' => 'Membres actifs'],
                            ['value' => '25', 'label' => 'Pays représentés'],
                            ['value' => '130+', 'label' => 'Assemblées générales'],
                        ],
                    ]),
                    $this->block('list', [
                        'title' => "Objectifs de l'ATAF",
                        'items' => [
                            ['title' => "Renforcer les avantages des compagnies membres dans l'espace francophone"],
                            ['title' => "Favoriser le partage d'expériences et les transferts de technologie"],
                            ['title' => 'Encourager le dialogue entre les compagnies membres et leurs autorités de tutelle'],
                            ['title' => 'Faciliter les échanges entre présidents et dirigeants lors des Assemblées Générales'],
                            ['title' => 'Assurer la représentation collective auprès des instances internationales (ICAO, IATA, AFRAA, ASECNA)'],
                            ['title' => 'Contribuer au développement durable et responsable du transport aérien francophone'],
                        ],
                    ]),
                ],
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'missions'],
            [
                'title' => 'Missions',
                'subtitle' => "Les engagements de l'ATAF",
                'status' => 'published',
                'position' => 2,
                'sections' => [
                    $this->block('hero', ['title' => 'Missions', 'subtitle' => "Les engagements de l'ATAF"]),
                    $this->block('features', [
                        'title' => 'Nos missions',
                        'items' => [
                            ['icon' => '✈️', 'title' => 'Dialogue et concertation', 'text' => 'Favoriser le dialogue entre compagnies membres, autorités et instances internationales.'],
                            ['icon' => '🔗', 'title' => "Partage d'expériences", 'text' => "Promouvoir l'échange d'expériences et le transfert de technologies entre membres."],
                            ['icon' => '📋', 'title' => 'Veille réglementaire', 'text' => 'Assurer la diffusion des évolutions réglementaires aéronautiques internationales.'],
                            ['icon' => '🎓', 'title' => 'Formation', 'text' => 'Organiser des séminaires et formations techniques pour les professionnels membres.'],
                            ['icon' => '🤝', 'title' => 'Représentation collective', 'text' => "Représenter les intérêts des membres auprès d'ASECNA, ICAO, IATA, AFRAA."],
                            ['icon' => '🌍', 'title' => 'Développement francophone', 'text' => "Contribuer au développement de l'aviation civile dans l'espace francophone."],
                        ],
                    ]),
                ],
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'histoire'],
            [
                'title' => 'Histoire',
                'subtitle' => '75 ans au service du transport aérien francophone',
                'status' => 'published',
                'position' => 3,
                'sections' => [
                    $this->block('hero', ['title' => 'Histoire', 'subtitle' => '75 ans au service du transport aérien francophone']),
                    $this->block('timeline', [
                        'title' => 'Les grandes étapes',
                        'items' => [
                            ['year' => '1950', 'title' => "Création de l'ATAF", 'text' => "Fondation au sein de l'Union française, regroupant les premières compagnies aériennes francophones."],
                            ['year' => '1960', 'title' => 'Internationalisation', 'text' => 'Extension du réseau aux nouvelles nations indépendantes francophones suite aux décolonisations.'],
                            ['year' => '1975', 'title' => '50ème Assemblée Générale', 'text' => "Célébration du 50ème anniversaire de l'association à Paris."],
                            ['year' => '1990', 'title' => 'Expansion du réseau', 'text' => 'Intégration de nouveaux partenaires industriels et institutionnels du secteur aérien.'],
                            ['year' => '2000', 'title' => 'Ère numérique', 'text' => "Modernisation des outils de communication et d'échange entre membres."],
                            ['year' => '2020', 'title' => 'Nouvelle direction', 'text' => "Patrick Alexandre prend les fonctions de Secrétaire Général, anciennement DGA d'Air France."],
                            ['year' => '2026', 'title' => '132ème Assemblée Générale', 'text' => "L'ATAF tient sa 132ème Assemblée Générale à Ajaccio, Corse."],
                        ],
                    ]),
                ],
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'gouvernance'],
            [
                'title' => 'Gouvernance',
                'subtitle' => "Structure et fonctionnement de l'ATAF",
                'status' => 'published',
                'position' => 4,
                'sections' => [
                    $this->block('hero', ['title' => 'Gouvernance', 'subtitle' => "Structure et fonctionnement de l'ATAF"]),
                    $this->block('cards', [
                        'title' => 'Les instances',
                        'items' => [
                            ['title' => 'Assemblée Générale', 'text' => "Instance souveraine réunissant tous les membres, tenue annuellement. Définit les orientations stratégiques et élit les instances dirigeantes."],
                            ['title' => 'Comité Exécutif', 'text' => "Composé du Président, des Vice-Présidents et du Trésorier. Gère les affaires courantes et met en oeuvre les décisions de l'AG."],
                            ['title' => 'Secrétariat Général', 'text' => 'Structure permanente basée à Montreuil, France. Assure le fonctionnement quotidien, la communication et la coordination avec les membres.'],
                        ],
                    ]),
                    $this->block('cards', [
                        'title' => 'Secrétariat Général',
                        'subtitle' => 'Montreuil, France — 5 collaborateurs permanents',
                        'items' => [
                            ['title' => 'Patrick ALEXANDRE', 'subtitle' => 'Directeur Général', 'url' => 'mailto:palexandre@ataf.fr', 'text' => 'palexandre@ataf.fr'],
                            ['title' => 'Jean-Claude CROS', 'subtitle' => 'Directeur Général Adjoint', 'url' => 'mailto:jccros@ataf.fr', 'text' => 'jccros@ataf.fr'],
                            ['title' => 'Claude THENEVIN', 'subtitle' => 'Trésorier', 'url' => 'mailto:clthenevin@ataf.fr', 'text' => 'clthenevin@ataf.fr'],
                            ['title' => 'Sonia VALLON', 'subtitle' => 'Administration et Finances', 'url' => 'mailto:svallon@ataf.fr', 'text' => 'svallon@ataf.fr'],
                            ['title' => 'Raphaël CROS', 'subtitle' => 'Communication', 'url' => 'mailto:rcros@ataf.fr', 'text' => 'rcros@ataf.fr'],
                        ],
                    ]),
                ],
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'organigramme'],
            [
                'title' => 'Organigramme',
                'subtitle' => "Structure de direction de l'ATAF",
                'status' => 'published',
                'position' => 5,
                'sections' => [
                    $this->block('hero', ['title' => 'Organigramme', 'subtitle' => "Structure de direction de l'ATAF"]),
                    $this->block('cards', [
                        'title' => 'Présidence',
                        'items' => [
                            ['title' => 'Gnl Abdoulaye COULIBALY', 'subtitle' => 'Président', 'text' => "Air Côte d'Ivoire"],
                        ],
                    ]),
                    $this->block('cards', [
                        'title' => 'Vice-présidents',
                        'items' => [
                            ['title' => 'Mme Anne RIGAIL', 'subtitle' => '1ère Vice-Présidente', 'text' => 'Air France'],
                            ['title' => 'M. Pierre MURACCIOLE', 'subtitle' => 'Vice-Président', 'text' => 'Air Corsica'],
                            ['title' => 'M. Pascal de IZAGUIRRE', 'subtitle' => 'Vice-Président', 'text' => 'Corsair'],
                            ['title' => 'M. Mohamad EL-HOUT', 'subtitle' => 'Vice-Président', 'text' => 'Middle East Airlines'],
                            ['title' => 'M. Nyl Charles MORET-MBA', 'subtitle' => 'Vice-Président', 'text' => 'FLY GABON'],
                            ['title' => 'Mme Halima I. KHOUAJA', 'subtitle' => 'Vice-Présidente', 'text' => 'TUNISAIR'],
                        ],
                    ]),
                    $this->block('cards', [
                        'title' => 'Direction Générale',
                        'items' => [
                            ['title' => 'M. Patrick ALEXANDRE', 'subtitle' => 'Directeur Général'],
                            ['title' => 'M. Jean-Claude CROS', 'subtitle' => 'Directeur Général Adjoint'],
                            ['title' => 'M. Claude THENEVIN', 'subtitle' => 'Trésorier'],
                        ],
                    ]),
                ],
            ],
        );

        Page::query()->updateOrCreate(
            ['slug' => 'bureau'],
            [
                'title' => "Bureau / Conseil d'administration",
                'subtitle' => "Les membres du bureau de l'ATAF",
                'status' => 'published',
                'position' => 6,
                'sections' => [
                    $this->block('hero', ['title' => "Bureau / Conseil d'administration", 'subtitle' => "Les membres du bureau de l'ATAF"]),
                    $this->block('rich_text', [
                        'rich_text' => "<p>Le Bureau de l'ATAF est composé du Président, des Vice-Présidents et du Trésorier. Il se réunit régulièrement pour assurer la gestion de l'association entre les Assemblées Générales.</p>",
                    ]),
                    $this->block('cards', [
                        'items' => [
                            ['title' => 'Gnl Abdoulaye COULIBALY', 'subtitle' => 'Président', 'text' => "Air Côte d'Ivoire — Général Abdoulaye Coulibaly est à la tête de l'ATAF en tant que Président. Il dirige également Air Côte d'Ivoire, compagnie nationale de Côte d'Ivoire."],
                            ['title' => 'Mme Anne RIGAIL', 'subtitle' => '1ère Vice-Présidente', 'text' => "Air France — Anne Rigail est Directrice Générale d'Air France et Vice-Présidente de l'ATAF, représentant la principale compagnie aérienne française."],
                            ['title' => 'M. Pierre MURACCIOLE', 'subtitle' => 'Vice-Président', 'text' => 'Air Corsica — Pierre Muracciole dirige Air Corsica et représente les compagnies régionales françaises au sein du bureau.'],
                            ['title' => 'M. Pascal de IZAGUIRRE', 'subtitle' => 'Vice-Président', 'text' => 'Corsair — Pascal de Izaguirre est à la tête de Corsair, compagnie française spécialisée dans les liaisons vers les DOM-TOM et l’Afrique.'],
                            ['title' => 'M. Mohamad EL-HOUT', 'subtitle' => 'Vice-Président', 'text' => "Middle East Airlines — Mohamad El-Hout représente le Liban et les compagnies arabophones francophones au sein du bureau."],
                            ['title' => 'M. Claude THENEVIN', 'subtitle' => 'Trésorier', 'text' => "ATAF — Claude Thenevin assure la gestion financière de l'ATAF en sa qualité de Trésorier."],
                        ],
                    ]),
                ],
            ],
        );
    }

    private function page(string $slug, string $title, int $position, array $sections): void
    {
        Page::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'title' => $title,
                'status' => 'published',
                'position' => $position,
                'sections' => $sections,
            ],
        );
    }

    /**
     * Sous-pages de rubriques : bannière + blocs éditoriaux + bloc dynamique.
     */
    private function seedSectionPages(): void
    {
        $position = 20;

        $this->page('membres-annuaire', 'Annuaire des membres', $position++, [
            $this->block('hero', ['title' => 'Annuaire des membres', 'subtitle' => 'Découvrez le réseau ATAF']),
            $this->block('widget', ['widget' => 'members_directory']),
        ]);

        $this->page('membres-compagnies', 'Compagnies membres', $position++, [
            $this->block('hero', ['title' => 'Compagnies membres', 'subtitle' => 'Les compagnies aériennes du réseau ATAF']),
            $this->block('widget', ['widget' => 'members_table']),
        ]);

        $this->page('membres-partenaires', 'Partenaires', $position++, [
            $this->block('hero', ['title' => 'Partenaires', 'subtitle' => 'Nos partenaires institutionnels et industriels']),
            $this->block('rich_text', [
                'rich_text' => '<p>L’ATAF rassemble autour de ses membres compagnies aériennes de nombreux partenaires industriels, institutionnels et de services qui contribuent au développement du transport aérien francophone.</p>',
            ]),
            $this->block('widget', ['widget' => 'partners_grid']),
        ]);

        $this->page('membres-adhesion', 'Devenir membre', $position++, [
            $this->block('hero', ['title' => 'Devenir membre', 'subtitle' => 'Rejoignez le réseau ATAF']),
            $this->block('rich_text', [
                'title' => 'Rejoindre l’ATAF',
                'rich_text' => '<p>Devenir membre de l’ATAF, c’est intégrer un réseau d’excellence du transport aérien francophone et bénéficier de nombreux avantages.</p>',
            ]),
            $this->block('list', [
                'title' => 'Les avantages de l’adhésion',
                'items' => [
                    ['title' => 'Accès à la veille réglementaire exclusive'],
                    ['title' => 'Participation aux séminaires et formations'],
                    ['title' => 'Représentation collective auprès des instances internationales'],
                    ['title' => 'Networking avec les dirigeants du secteur'],
                    ['title' => 'Accès à l’espace membres sécurisé'],
                    ['title' => 'Visibilité dans l’annuaire ATAF'],
                ],
            ]),
            $this->block('cards', [
                'title' => 'Catégories de membres',
                'items' => [
                    ['title' => 'Compagnies aériennes', 'text' => 'Membres actifs du réseau ATAF.'],
                    ['title' => 'Organismes de navigation aérienne', 'text' => 'Fournisseurs de services de la navigation aérienne.'],
                    ['title' => 'Partenaires industriels et commerciaux', 'text' => 'Industriels et sociétés de services du secteur.'],
                    ['title' => 'Membres associés et institutions', 'text' => 'Organisations et institutions partenaires.'],
                ],
            ]),
            $this->block('widget', ['widget' => 'membership_form']),
        ]);

        $this->page('agences-annuaire', 'Agences agréées ATAF', $position++, [
            $this->block('hero', ['title' => 'Agences agréées ATAF', 'subtitle' => 'Annuaire dynamique des agences de voyage agréées']),
            $this->block('widget', ['widget' => 'agencies_directory']),
        ]);

        $this->page('agences-verification', 'Vérifier un agrément ATAF', $position++, [
            $this->block('hero', ['title' => 'Vérifier un agrément ATAF', 'subtitle' => 'Contrôlez la validité d’un agrément d’agence de voyage']),
            $this->block('widget', ['widget' => 'agency_verify']),
        ]);

        $this->page('agences-informations', 'Informations sur l’agrément', $position++, [
            $this->block('hero', ['title' => 'Informations sur l’agrément', 'subtitle' => 'Obtenir un agrément ATAF pour votre agence']),
            $this->block('rich_text', [
                'title' => 'Qu’est-ce que l’agrément ATAF ?',
                'rich_text' => '<p>L’agrément ATAF est une reconnaissance officielle accordée aux agences de voyage qui remplissent les conditions requises pour opérer en tant qu’intermédiaires agréés dans la distribution de billets des compagnies membres de l’ATAF.</p><p>L’agrément garantit aux compagnies et aux passagers que l’agence répond aux standards professionnels et financiers de l’ATAF.</p>',
            ]),
            $this->block('list', [
                'title' => 'Conditions d’obtention',
                'items' => [
                    ['title' => 'Être une agence de voyage légalement constituée'],
                    ['title' => 'Justifier d’une garantie financière suffisante'],
                    ['title' => 'Disposer d’un personnel qualifié'],
                    ['title' => 'S’engager à respecter le code déontologique ATAF'],
                    ['title' => 'Avoir souscrit une assurance professionnelle'],
                ],
            ]),
            $this->block('rich_text', [
                'rich_text' => '<p>Pour obtenir un dossier de demande d’agrément, contactez le Secrétariat Général via le formulaire ci-dessous.</p>',
            ]),
            $this->block('widget', ['widget' => 'agency_form']),
        ]);

        $this->page('ressources-documents', 'Centre documentaire', $position++, [
            $this->block('hero', ['title' => 'Centre documentaire', 'subtitle' => 'Bibliothèque numérique de l’ATAF']),
            $this->block('widget', ['widget' => 'documents_list']),
        ]);

        $this->page('ressources-publications', 'Publications', $position++, [
            $this->block('hero', ['title' => 'Publications', 'subtitle' => 'Publications et rapports de l’ATAF']),
            $this->block('widget', ['widget' => 'publications_list']),
        ]);

        $this->page('ressources-mediatheque', 'Médiathèque', $position++, [
            $this->block('hero', ['title' => 'Médiathèque', 'subtitle' => 'Photos et vidéos des événements ATAF']),
            $this->block('widget', ['widget' => 'media_gallery']),
        ]);

        $this->page('actualites-ataf', 'Actualités ATAF', $position++, [
            $this->block('hero', ['title' => 'Actualités ATAF', 'subtitle' => 'Toutes les actualités de l’association']),
            $this->block('widget', ['widget' => 'news_list']),
        ]);

        $this->page('actualites-membres', 'Actualités membres', $position++, [
            $this->block('hero', ['title' => 'Actualités membres', 'subtitle' => 'Les actualités de nos compagnies et partenaires']),
            $this->block('widget', ['widget' => 'news_list', 'filter' => 'Membres']),
        ]);

        $this->page('actualites-communiques', 'Communiqués', $position++, [
            $this->block('hero', ['title' => 'Communiqués', 'subtitle' => 'Déclarations officielles et communiqués de presse']),
            $this->block('cards', [
                'items' => [
                    ['title' => 'Communiqué de presse — 132ème Assemblée Générale de l’ATAF', 'text' => '25 août 2026'],
                    ['title' => 'Prise de position ATAF sur la réforme du code de l’aviation civile', 'text' => '10 juillet 2026'],
                    ['title' => 'ATAF salue la nomination de nouveaux dirigeants chez ses membres', 'text' => '26 mai 2026'],
                    ['title' => 'Déclaration de l’ATAF sur la transition environnementale du transport aérien', 'text' => '15 avril 2026'],
                ],
            ]),
        ]);

        $this->page('actualites-veille', 'Veille aéronautique', $position++, [
            $this->block('hero', ['title' => 'Veille aéronautique', 'subtitle' => 'Revue de presse et actualités du secteur']),
            $this->block('cards', [
                'items' => [
                    ['title' => 'Bilan du trafic aérien mondial - Août 2026', 'subtitle' => 'newsaero.info', 'text' => '15 septembre 2026'],
                    ['title' => 'ICAO Council adopts new safety standards for runway incursions', 'subtitle' => 'ICAO', 'text' => '10 septembre 2026'],
                    ['title' => 'Airlines see passenger demand grow 8% year-on-year in August 2026', 'subtitle' => 'IATA', 'text' => '8 septembre 2026'],
                    ['title' => 'African aviation traffic report Q2 2026', 'subtitle' => 'AFRAA', 'text' => '5 septembre 2026'],
                    ['title' => 'KlasJet renforce ses capacités ACMI avec l’ajout de nouveaux appareils', 'subtitle' => 'newsaero.info', 'text' => '3 septembre 2026'],
                    ['title' => 'ASECNA modernise ses systèmes de contrôle aérien dans 6 pays', 'subtitle' => 'ASECNA', 'text' => '28 août 2026'],
                ],
            ]),
        ]);

        $this->page('evenements-agenda', 'Agenda des événements', $position++, [
            $this->block('hero', ['title' => 'Agenda des événements', 'subtitle' => 'Séminaires, formations, assemblées et conférences ATAF']),
            $this->block('widget', ['widget' => 'events_list']),
        ]);

        $this->page('evenements-seminaires', 'Séminaires', $position++, [
            $this->block('hero', ['title' => 'Séminaires', 'subtitle' => 'Rencontres professionnelles et retours d’expérience du secteur']),
            $this->block('widget', ['widget' => 'events_list', 'filter' => 'Séminaire']),
        ]);

        $this->page('evenements-formations', 'Formations', $position++, [
            $this->block('hero', ['title' => 'Formations', 'subtitle' => 'Développer les compétences des professionnels du transport aérien']),
            $this->block('widget', ['widget' => 'events_list', 'filter' => 'Formation']),
        ]);

        $this->page('evenements-assemblees', 'Assemblées générales', $position++, [
            $this->block('hero', ['title' => 'Assemblées générales', 'subtitle' => 'Les rendez-vous statutaires de l’association']),
            $this->block('widget', ['widget' => 'events_list', 'filter' => 'Assemblée générale']),
        ]);

        $this->page('evenements-conferences', 'Conférences', $position++, [
            $this->block('hero', ['title' => 'Conférences', 'subtitle' => 'Échanges avec les acteurs du transport aérien francophone']),
            $this->block('widget', ['widget' => 'events_list', 'filter' => 'Conférence']),
        ]);

        $this->page('reglementation-veille', 'Veille réglementaire', $position++, [
            $this->block('hero', ['title' => 'Veille réglementaire', 'subtitle' => 'Dernières évolutions du cadre réglementaire aéronautique international']),
            $this->block('widget', ['widget' => 'regulations_list']),
        ]);

        $this->page('reglementation-textes', 'Textes réglementaires', $position++, [
            $this->block('hero', ['title' => 'Textes réglementaires', 'subtitle' => 'Base documentaire réglementaire ATAF']),
            $this->block('widget', ['widget' => 'documents_table']),
        ]);

        $this->page('reglementation-publications', 'Publications', $position++, [
            $this->block('hero', ['title' => 'Publications', 'subtitle' => 'Publications officielles de l’ATAF']),
            $this->block('widget', ['widget' => 'publications_list']),
        ]);

        $this->page('reglementation-notes', 'Notes et analyses', $position++, [
            $this->block('hero', ['title' => 'Notes et analyses', 'subtitle' => 'Analyses et notes d’information ATAF']),
            $this->block('widget', ['widget' => 'regulations_notes']),
        ]);
    }

    /**
     * Quelques médias de démonstration pour la médiathèque.
     */
    private function seedMedia(): void
    {
        if (MediaItem::query()->exists()) {
            return;
        }

        $items = [
            ['title' => '131ème Assemblée Générale — Paris 2025', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', 'published_on' => '2025-06-01'],
            ['title' => 'Séminaire Sécurité — Dakar 2025', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', 'published_on' => '2025-04-01'],
            ['title' => 'Formation réglementaire — Tunis 2025', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop', 'published_on' => '2025-03-01'],
            ['title' => 'Conférence sur la transition écologique', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 'published_on' => '2024-11-01'],
            ['title' => 'Réunion du Comité Exécutif', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop', 'published_on' => '2024-09-01'],
            ['title' => 'Séminaire Fret aérien — Abidjan 2024', 'type' => 'photo', 'url' => 'https://images.unsplash.com/photo-1583245773069-f2f26873dd7e?w=800&h=600&fit=crop', 'published_on' => '2024-05-01'],
            ['title' => 'Discours d’ouverture — 131ème Assemblée Générale', 'type' => 'video', 'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'published_on' => '2025-06-01'],
        ];

        foreach ($items as $index => $item) {
            MediaItem::query()->create($item + ['position' => $index]);
        }
    }

    private function seedContact(): void
    {
        Page::query()->updateOrCreate(
            ['slug' => 'contact'],
            [
                'title' => 'Contact',
                'subtitle' => "Secrétariat Général de l'ATAF",
                'status' => 'published',
                'position' => 10,
                'sections' => [
                    $this->block('hero', ['title' => 'Contact', 'subtitle' => "Secrétariat Général de l'ATAF"]),
                    $this->block('contact', [
                        'title' => 'Nous écrire',
                        'text' => 'Merci de nous contacter via le formulaire ci-dessous ou directement par e-mail.',
                        'items' => [
                            ['title' => 'Patrick ALEXANDRE', 'subtitle' => 'Directeur Général', 'url' => 'mailto:palexandre@ataf.fr', 'text' => 'palexandre@ataf.fr'],
                            ['title' => 'Jean-Claude CROS', 'subtitle' => 'Directeur Général Adjoint', 'url' => 'mailto:jccros@ataf.fr', 'text' => 'jccros@ataf.fr'],
                            ['title' => 'Claude THENEVIN', 'subtitle' => 'Trésorier', 'url' => 'mailto:clthenevin@ataf.fr', 'text' => 'clthenevin@ataf.fr'],
                            ['title' => 'Sonia VALLON', 'subtitle' => 'Administration et Finances', 'url' => 'mailto:svallon@ataf.fr', 'text' => 'svallon@ataf.fr'],
                            ['title' => 'Raphaël CROS', 'subtitle' => 'Communication', 'url' => 'mailto:rcros@ataf.fr', 'text' => 'rcros@ataf.fr'],
                        ],
                    ]),
                ],
            ],
        );
    }
}
