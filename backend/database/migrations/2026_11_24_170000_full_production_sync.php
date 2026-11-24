<?php

use App\Models\Agency;
use App\Models\BoardMember;
use App\Models\Country;
use App\Models\Document;
use App\Models\Event;
use App\Models\EventProgram;
use App\Models\MediaItem;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\Page;
use App\Models\Publication;
use App\Models\Regulation;
use App\Models\Setting;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\RbacSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Synchronisation totale et absolue de l'ensemble des données
     * (pages, blocs, avatars, images uploadées, bureau/CA, réglages,
     * actualités, événements, documents, agences) vers la production.
     */
    public function up(): void
    {
        $this->syncStorageFiles();
        $this->syncSettings();
        $this->syncPages();
        $this->syncBoardMembers();
        $this->syncContent();

        // RBAC & Admin users
        (new RbacSeeder())->run();
        (new AdminUserSeeder())->run();
    }

    public function down(): void
    {
        // Données de contenu.
    }

    private function syncStorageFiles(): void
    {
        $source = database_path('seeders/data/storage');
        $target = storage_path('app/public');

        if (File::isDirectory($source)) {
            File::ensureDirectoryExists($target);
            File::copyDirectory($source, $target);
        }
    }

    private function syncSettings(): void
    {
        $file = database_path('seeders/data/settings_full.json');
        if (! File::exists($file)) {
            return;
        }

        $items = json_decode(File::get($file), true);
        if (! is_array($items)) {
            return;
        }

        foreach ($items as $item) {
            Setting::set($item['key'], $item['value'], $item['group'] ?? 'general');
        }
    }

    private function syncPages(): void
    {
        $file = database_path('seeders/data/pages_full.json');
        if (! File::exists($file)) {
            return;
        }

        $pages = json_decode(File::get($file), true);
        if (! is_array($pages)) {
            return;
        }

        foreach ($pages as $p) {
            Page::query()->updateOrCreate(
                ['slug' => $p['slug']],
                [
                    'title' => $p['title'],
                    'subtitle' => $p['subtitle'] ?? null,
                    'body' => $p['body'] ?? null,
                    'sections' => $p['sections'] ?? [],
                    'status' => $p['status'] ?? 'published',
                    'position' => $p['position'] ?? 0,
                    'is_in_menu' => $p['is_in_menu'] ?? false,
                ],
            );
        }
    }

    private function syncBoardMembers(): void
    {
        $file = database_path('seeders/data/board_members_full.json');
        if (! File::exists($file)) {
            return;
        }

        $items = json_decode(File::get($file), true);
        if (! is_array($items)) {
            return;
        }

        foreach ($items as $bm) {
            BoardMember::query()->updateOrCreate(
                ['name' => $bm['name'], 'role' => $bm['role']],
                [
                    'company' => $bm['company'] ?? null,
                    'group' => $bm['group'] ?? 'board',
                    'position' => $bm['position'] ?? 0,
                    'bio' => $bm['bio'] ?? null,
                    'photo_path' => $bm['photo_path'] ?? null,
                    'email' => $bm['email'] ?? null,
                    'linkedin' => $bm['linkedin'] ?? null,
                    'is_public' => $bm['is_public'] ?? true,
                ],
            );
        }
    }

    private function syncContent(): void
    {
        $file = database_path('seeders/data/content_full.json');
        if (! File::exists($file)) {
            return;
        }

        $data = json_decode(File::get($file), true);
        if (! is_array($data)) {
            return;
        }

        // News categories
        foreach (['ATAF', 'Membres', 'Réglementation', 'Événements', 'Publications'] as $cat) {
            NewsCategory::query()->firstOrCreate(['name' => $cat], ['slug' => Str::slug($cat)]);
        }

        // News
        foreach ($data['news'] ?? [] as $item) {
            $catId = null;
            if (! empty($item['category']['name'])) {
                $cat = NewsCategory::query()->where('name', $item['category']['name'])->first();
                $catId = $cat?->id;
            }

            News::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'summary' => $item['summary'] ?? null,
                    'body' => $item['body'] ?? null,
                    'image_path' => $item['image_path'] ?? null,
                    'attachment_path' => $item['attachment_path'] ?? null,
                    'category_id' => $catId,
                    'status' => $item['status'] ?? 'published',
                    'published_at' => $item['published_at'] ?? now(),
                    'is_featured' => $item['is_featured'] ?? false,
                    'views_count' => $item['views_count'] ?? 0,
                ],
            );
        }

        // Events & programs
        foreach ($data['events'] ?? [] as $item) {
            $event = Event::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'type' => $item['type'] ?? 'Événement',
                    'location' => $item['location'] ?? null,
                    'starts_at' => $item['starts_at'] ?? now(),
                    'ends_at' => $item['ends_at'] ?? null,
                    'capacity' => $item['capacity'] ?? null,
                    'is_free' => $item['is_free'] ?? true,
                    'status' => $item['status'] ?? 'published',
                    'is_featured' => $item['is_featured'] ?? false,
                ],
            );

            if (! empty($item['programs']) && is_array($item['programs'])) {
                foreach ($item['programs'] as $prog) {
                    EventProgram::query()->updateOrCreate(
                        ['event_id' => $event->id, 'time' => $prog['time'], 'title' => $prog['title']],
                        [
                            'speaker' => $prog['speaker'] ?? null,
                            'description' => $prog['description'] ?? null,
                            'position' => $prog['position'] ?? 0,
                        ],
                    );
                }
            }
        }

        // Regulations
        foreach ($data['regulations'] ?? [] as $item) {
            Regulation::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'category' => $item['category'] ?? null,
                    'type' => $item['type'] ?? null,
                    'summary' => $item['summary'] ?? null,
                    'content' => $item['content'] ?? null,
                    'file_path' => $item['file_path'] ?? null,
                    'published_on' => $item['published_on'] ?? null,
                    'is_public' => $item['is_public'] ?? true,
                ],
            );
        }

        // Documents
        foreach ($data['documents'] ?? [] as $item) {
            Document::query()->updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'category' => $item['category'] ?? null,
                    'type' => $item['type'] ?? 'PDF',
                    'file_path' => $item['file_path'] ?? null,
                    'file_size' => $item['file_size'] ?? 0,
                    'is_public' => $item['is_public'] ?? true,
                    'published_on' => $item['published_on'] ?? null,
                ],
            );
        }

        // Publications
        foreach ($data['publications'] ?? [] as $item) {
            Publication::query()->updateOrCreate(
                ['title' => $item['title']],
                [
                    'type' => $item['type'] ?? 'Bulletin',
                    'published_on' => $item['published_on'] ?? null,
                    'pages' => $item['pages'] ?? 0,
                    'file_path' => $item['file_path'] ?? null,
                    'is_public' => $item['is_public'] ?? true,
                ],
            );
        }

        // Media items
        foreach ($data['media_items'] ?? [] as $item) {
            MediaItem::query()->updateOrCreate(
                ['title' => $item['title']],
                [
                    'type' => $item['type'] ?? 'photo',
                    'url' => $item['url'] ?? null,
                    'path' => $item['path'] ?? null,
                    'caption' => $item['caption'] ?? null,
                    'position' => $item['position'] ?? 0,
                ],
            );
        }

        // Agencies
        foreach ($data['agencies'] ?? [] as $item) {
            Agency::query()->updateOrCreate(
                ['agreement_number' => $item['agreement_number']],
                [
                    'name' => $item['name'],
                    'country' => $item['country'] ?? null,
                    'city' => $item['city'] ?? null,
                    'address' => $item['address'] ?? null,
                    'phone' => $item['phone'] ?? null,
                    'email' => $item['email'] ?? null,
                    'status' => $item['status'] ?? 'approved',
                    'approved_at' => $item['approved_at'] ?? now(),
                ],
            );
        }
    }
};
