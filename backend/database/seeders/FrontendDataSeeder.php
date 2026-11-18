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

        $this->seedMembers($data['members'] ?? []);
        $this->seedNews($data['news'] ?? []);
        $this->seedEvents($data['events'] ?? []);
        $this->seedAgencies($data['agencies'] ?? []);
        $this->seedRegulations($data['regulations'] ?? []);
    }

    private function countryId(string $name): ?int
    {
        return Country::firstOrCreate(['name' => $name])->id;
    }

    private function seedMembers(array $members): void
    {
        foreach ($members as $member) {
            Member::updateOrCreate(
                ['name' => $member['name']],
                [
                    'slug' => Str::slug($member['name']),
                    'country_id' => $this->countryId($member['country']),
                    'category' => $member['category'] ?? null,
                    'city' => $member['city'] ?? null,
                    'joined_year' => $member['since'] ?? null,
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
