# TODO — Site public ATAF + Back-office

État du projet au 18/11/2026. Ce document liste ce qui est **fait**, ce qui **reste à faire**, et dans quel ordre.

---

## 1. État actuel

### Frontend (racine)
- [x] React 19 + Vite 8 + TypeScript + Tailwind CSS v4
- [x] Pages : Accueil, L'ATAF, Membres, Agences agréées, Actualités, Événements, Réglementation, Ressources, Contact
- [x] Composants partagés : Layout, Header, Footer, cartes, filtres, formulaires (statiques)
- [x] Données statiques dans `src/data/index.ts` (16 membres, 6 actualités, 5 événements, 16 agences, 6 réglementations)
- [ ] Branchement des pages sur l'API Laravel (données encore en dur)
- [ ] Formulaires connectés à l'API (contact, newsletter, inscription événement, adhésion, agrément)
- [ ] Authentification membre (espace privé)

### Backend (`backend/`)
- [x] Laravel 13.43 + PHP 8.3
- [x] Filament v5.11 (panneau `/admin`)
- [x] Spatie Permission (rôles), Media Library, Activity Log, Translatable
- [x] Sanctum (tokens API)
- [x] 25 tables métier + colonnes utilisateurs (`organisation`, `phone`, `status`)
- [x] 25 modèles Eloquent avec relations et casts
- [x] Seeders : rôles/permissions, paramètres, pays, pages, bureau, documents, publications, médias, import des données frontend, admin
- [x] 20 ressources Filament générées (formulaires/tableaux) avec groupes de navigation FR
- [x] API REST publique + auth token (29 routes)
- [x] CORS configuré pour `http://localhost:8443`
- [ ] Tests automatisés
- [ ] Emails transactionnels
- [ ] Déploiement

### Comptes créés
| Rôle | Email | Mot de passe |
|---|---|---|
| Super admin | `admin@ataf.fr` | `password` |
| Membre (démo) | `jp.dupont@airfrance.fr` | `password` |

> ⚠️ Changer ces mots de passe avant toute mise en ligne.

---

## 2. Démarrage local

```bash
# Frontend (port 8443, déjà lancé par Figma Make)
npm install
npm run dev

# Backend
cd backend
php artisan serve --port=8000
# Admin : http://localhost:8000/admin
# API   : http://localhost:8000/api
```

Base locale : SQLite (`backend/database/database.sqlite`).
Réinitialiser : `php artisan migrate:fresh --seed`.

---

## 3. API existante

Base : `http://localhost:8000/api`

### Public (lecture)
| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Ping |
| GET | `/settings` | Paramètres du site (clé/valeur) |
| GET | `/pages` / `/pages/{slug}` | Pages institutionnelles |
| GET | `/members` / `/members/{slug}` | Membres (publics) |
| GET | `/news` / `/news/{slug}` | Actualités publiées |
| GET | `/events` / `/events/{slug}` | Événements + programmes/intervenants |
| GET | `/regulations` / `/regulations/{slug}` | Réglementations publiques |
| GET | `/documents` / `/documents/{slug}` | Documents publics |
| GET | `/documents/{slug}/download` | Téléchargement (incrémente le compteur) |
| GET | `/publications` | Publications |
| GET | `/agencies` | Agences agréées |
| GET | `/agencies/verify/{num}` | Vérification d'agrément (journalisée) |
| GET | `/board-members` | Bureau / conseil |
| GET | `/media` | Photos et vidéos |

### Formulaires (écriture, rate-limited)
| Méthode | Route | Description |
|---|---|---|
| POST | `/contact-messages` | Contact (honeypot `website`) |
| POST | `/newsletter/subscribe` | Inscription newsletter |
| GET | `/newsletter/unsubscribe/{token}` | Désinscription |
| POST | `/events/{slug}/registrations` | Inscription à un événement |
| POST | `/membership-applications` | Demande d'adhésion |
| POST | `/agency-applications` | Demande d'agrément |

### Auth
| Méthode | Route | Description |
|---|---|---|
| POST | `/auth/login` | `email`, `password` → token Bearer |
| GET | `/auth/me` | Profil (auth:sanctum) |
| POST | `/auth/logout` | Révoque le token |

---

## 4. TODO — Site public

### 4.1 Branchement API (priorité P0)
- [ ] Créer `src/lib/api.ts` (fetch + gestion erreurs + Bearer token)
- [ ] Remplacer les imports de `src/data/index.ts` par des appels API dans chaque page
- [ ] États de chargement (skeletons) et d'erreur sur toutes les pages
- [ ] Pagination ou « charger plus » sur Actualités et Ressources
- [ ] Recherche et filtres côté serveur (membres par catégorie/pays, actualités par catégorie, événements par statut)
- [ ] Connecter les formulaires (Contact, Newsletter, Événement, Adhésion, Agrément) avec validation et messages de succès/erreur
- [ ] Honeypot anti-spam + protection CSRF/token si cookies Sanctum
- [ ] Vérificateur d'agrément : appel `/agencies/verify/{num}` au lieu du tableau statique

### 4.2 SEO & partage
- [ ] `react-helmet-async` : title/description par page
- [ ] URLs canoniques, Open Graph, Twitter Cards
- [ ] `sitemap.xml` généré (Laravel) + `robots.txt`
- [ ] Données structurées JSON-LD (Organization, NewsArticle, Event)
- [ ] Fil d'Ariane avec balisage
- [ ] Rendu SSR/prerender (Inertia ou React Router SSG) pour l'indexation — **décision d'archi à prendre**

### 4.3 Internationalisation FR/EN
- [ ] i18n frontend (react-i18next) + sélecteur de langue
- [ ] Traductions des contenus en base (Spatie Translatable déjà installé : colonnes JSON à ajouter ou tables de traduction)
- [ ] Routes localisées (`/en/...`) et `hreflang`

### 4.4 Accessibilité (WCAG 2.1 AA)
- [ ] Contrastes, focus visibles, navigation clavier
- [ ] `alt` sur toutes les images, labels sur les champs
- [ ] Landmarks ARIA, skip-link
- [ ] Test axe / Lighthouse ≥ 90

### 4.5 Espace membre
- [ ] Page connexion / mot de passe oublié (Sanctum + email)
- [ ] Tableau de bord membre : profil, coordonnées, membres de l'entreprise
- [ ] Documents réservés (`is_public = false`) avec téléchargement authentifié
- [ ] Actualités « membres uniquement »
- [ ] Inscriptions aux événements et historique
- [ ] Annuaire des contacts membres (selon permissions)

### 4.6 Contenu & médias
- [ ] Remplacer les images Unsplash par des visuels ATAF (logo, photos d'événements)
- [ ] Uploader les vrais PDF (documents, publications, statuts)
- [ ] Renseigner les vraies coordonnées du Secrétariat Général
- [ ] Mentions légales, politique de confidentialité, cookies (RGPD)
- [ ] Bandeau cookies (consentement analytics)
- [ ] Analytics (Matomo ou Plausible, respectueux RGPD)

### 4.7 Performance
- [ ] Lazy-loading des images (`loading="lazy"`, `srcset`)
- [ ] Optimisation des images (WebP/AVIF)
- [ ] Code splitting des routes
- [ ] Compression Brotli/Gzip + cache HTTP
- [ ] Objectif Lighthouse Performance ≥ 90

---

## 5. TODO — Back-office Filament

### 5.1 Tableau de bord
- [ ] Widgets stats : membres, actualités, événements à venir, inscriptions, messages non lus, abonnés newsletter
- [ ] Graphique inscriptions par événement / messages par mois
- [ ] Activité récente (Activity Log)

### 5.2 Contenus
- [ ] Éditeur riche (Tiptap / RichEditor Filament) pour `news.body` et `pages.body`
- [ ] Upload d'images via Spatie Media Library (remplacer les champs URL)
- [ ] Aperçu avant publication, brouillons, planification (`published_at`)
- [ ] Gestion des étiquettes et catégories avec compteurs
- [ ] Duplication d'articles / événements
- [ ] Corbeille et restauration (SoftDeletes déjà sur News et Member)

### 5.3 Membres & agréments
- [ ] Relations Filament : contacts, profils utilisateurs sur la fiche membre
- [ ] Workflow de demande d'adhésion (pending → review → approved/rejected) + notes admin
- [ ] Workflow de demande d'agrément + génération du numéro d'agrément
- [ ] Import/export CSV des membres et agences
- [ ] Historique des vérifications d'agrément (`agency_verifications`)
- [ ] Attestation PDF d'agrément

### 5.4 Événements
- [ ] Relation managers : programme, intervenants, inscriptions
- [ ] Export des inscrits (CSV/Excel)
- [ ] Badges / attestations PDF
- [ ] Envoi d'e-mails de confirmation et de rappel
- [ ] Gestion de la capacité et liste d'attente

### 5.5 Communication
- [ ] Boîte de réception des messages de contact (statuts : nouveau, en cours, traité, spam), assignation
- [ ] Réponse par e-mail depuis l'admin
- [ ] Campagnes newsletter (éditeur + envoi via queue) et statistiques
- [ ] Modèles d'e-mails personnalisés (confirmation, bienvenue, relance)

### 5.6 Administration
- [ ] Politiques d'accès (`php artisan make:policy`) + `canViewAny` par ressource selon permissions
- [ ] Masquer les ressources non autorisées dans la navigation
- [ ] Gestion des rôles/permissions dans l'interface (plugin Filament Shield ou Resource Role)
- [ ] Journal d'activité consultable
- [ ] Paramètres du site éditables en une page unique (et non clé/valeur brute)
- [ ] Sauvegardes / exports planifiés

---

## 6. TODO — Technique & production

### 6.1 Qualité
- [ ] Tests feature API (Pest/PHPUnit) : endpoints publics, formulaires, auth, autorisations
- [ ] Tests Filament (création/édition des ressources principales)
- [ ] Factories pour tous les modèles
- [ ] Analyse statique (Larastan/PHPStan) + Pint
- [ ] ESLint + TypeScript strict côté front
- [ ] CI GitHub Actions (lint, tests, build)

### 6.2 Sécurité
- [ ] Changer les mots de passe de démo
- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] HTTPS + HSTS
- [ ] Rate limiting renforcé, anti-spam (honeypot existant + Turnstile/reCAPTCHA)
- [ ] Vérifier CORS (origines de production uniquement)
- [ ] Sauvegardes chiffrées quotidiennes (base + médias)
- [ ] Politique de rétention des données (RGPD)

### 6.3 Base de données
- [ ] Passer de SQLite à **PostgreSQL 16** (installé sur la machine)
- [ ] Mettre à jour `.env` (`DB_CONNECTION=pgsql`, hôte, base, utilisateur)
- [ ] Créer la base et lancer `php artisan migrate --seed`
- [ ] Index de recherche (`pg_trgm` ou Scout + Meilisearch)

### 6.4 Emails & queues
- [ ] Configurer SMTP réel (Mailgun/SES/OVH)
- [ ] `QUEUE_CONNECTION=redis` ou database + `php artisan queue:work` (Supervisor)
- [ ] Emails transactionnels : contact, inscription, adhésion, agrément, newsletter
- [ ] Notifications admin (nouveau message, nouvelle demande)

### 6.5 Déploiement
- [ ] Serveur / hébergement (VPS, Forge, Ploi)
- [ ] Build frontend (`npm run build`) servi par Nginx
- [ ] `php artisan filament:assets`, `storage:link`, `config:cache`, `route:cache`, `view:cache`
- [ ] HTTPS (Let's Encrypt), domaine `ataf.fr`
- [ ] Déploiement automatique (GitHub Actions ou Forge)
- [ ] Monitoring (Sentry, uptime) et logs centralisés

---

## 7. Roadmap priorisée

### P0 — Rendre le site vivant
1. Client API + branchement des pages publiques
2. Formulaires connectés
3. Vérificateur d'agrément réel
4. Mots de passe et secrets sécurisés

### P1 — Back-office utilisable au quotidien
5. Éditeur riche + médias
6. Workflows adhésion/agrément
7. Relation managers événements + exports
8. Boîte de réception contact

### P2 — Qualité et ouverture
9. Espace membre + documents privés
10. Newsletter et emails transactionnels
11. i18n FR/EN + SEO avancé
12. Tests, CI, PostgreSQL, déploiement

---

## 8. Notes & pièges

- **Filament v5** : ressources dans `app/Filament/Resources/<Plural>/` avec `Schemas/*Form.php` et `Tables/*Table.php`. Les assets Filament sont ignorés par Git (`public/css/filament`, `public/js/filament`) → lancer `php artisan filament:assets` au déploiement.
- **Sanctum** : l'API utilise des **tokens Bearer** (`/auth/login`). Pour une auth par cookies SPA, ajouter le middleware `EnsureFrontendRequestsAreStateful` et `withCredentials` côté front.
- **Statuts agrément** : les données importées utilisent `Agréée` (FR) ; le scope `Agency::approved()` accepte `approved` et `Agréée`.
- **Seed volumineux** : ~275 inscriptions de démo sont créées (participants factices `participantN@demo.ataf.fr`) → le seed prend ~35 s. Les supprimer avant production.
- **JSON casts** : `pages.sections` et `events.documents` sont des colonnes JSON ; les formulaires Filament utilisent `KeyValue`.
- **Laravel Boost** : `backend/AGENTS.md` demande d'installer `laravel/boost` en dev ; non installé (réseau/disque limités). À faire si besoin d'outils Laravel avancés.
- **Composer** : miroir Tencent configuré dans `backend/composer.json`. En cas d'échec `Permission denied` sur `vendor/composer/tmp-*.zip`, relancer avec `COMPOSER_MAX_PARALLEL_HTTP=1`.
- **Disque** : ~4,6 Go libres sur `C:` — surveiller `backend/vendor` et les uploads.

---

## 9. Commandes utiles

```bash
cd backend

php artisan migrate:fresh --seed      # réinitialiser la base + données démo
php artisan make:filament-resource X  # nouvelle ressource admin
php artisan make:policy XPolicy --model=X
php artisan route:list --path=api
php artisan test
php artisan optimize:clear
php artisan filament:assets
```
