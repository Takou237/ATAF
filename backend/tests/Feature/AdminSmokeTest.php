<?php

namespace Tests\Feature;

use App\Models\Agency;
use App\Models\AgencyApplication;
use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\Member;
use App\Models\MembershipApplication;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_pages_render(): void
    {
        Role::create(['name' => 'super-admin', 'guard_name' => 'web']);

        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.local',
            'password' => bcrypt('password'),
        ]);
        $user->assignRole('super-admin');

        $news = News::create(['title' => 'Test', 'slug' => 'test', 'status' => 'draft']);
        $event = Event::create([
            'title' => 'Event', 'slug' => 'event', 'type' => 'Séminaire',
            'status' => 'Ouvert', 'starts_at' => now(),
        ]);
        $member = Member::create(['name' => 'Member', 'slug' => 'member']);
        $membership = MembershipApplication::create([
            'name' => 'A', 'organisation' => 'Org', 'country' => 'Sénégal',
            'email' => 'a@test.local', 'status' => 'pending',
        ]);
        $agencyApplication = AgencyApplication::create([
            'first_name' => 'A', 'last_name' => 'B', 'agency_name' => 'Agence',
            'country' => 'Sénégal', 'email' => 'b@test.local', 'status' => 'pending',
        ]);
        $message = ContactMessage::create([
            'name' => 'C', 'email' => 'c@test.local', 'subject' => 'Sujet',
            'message' => 'Bonjour', 'status' => 'new',
        ]);
        $agency = Agency::create([
            'name' => 'Agence', 'agreement_number' => 'ATAF-2026-0001', 'status' => 'approved',
        ]);

        $this->actingAs($user);

        $urls = [
            '/admin',
            '/admin/news',
            "/admin/news/{$news->slug}/edit",
            '/admin/pages',
            '/admin/members',
            "/admin/members/{$member->id}/edit",
            '/admin/events',
            "/admin/events/{$event->slug}/edit",
            '/admin/membership-applications',
            "/admin/membership-applications/{$membership->id}/edit",
            '/admin/agency-applications',
            "/admin/agency-applications/{$agencyApplication->id}/edit",
            '/admin/contact-messages',
            "/admin/contact-messages/{$message->id}/edit",
            '/admin/agencies',
            "/admin/agencies/{$agency->id}/edit",
            '/admin/event-registrations',
            '/admin/agency-verifications',
            '/admin/media-items',
        ];

        foreach ($urls as $url) {
            $response = $this->get($url);
            $this->assertSame(200, $response->getStatusCode(), "Échec sur {$url}");
        }
    }
}
