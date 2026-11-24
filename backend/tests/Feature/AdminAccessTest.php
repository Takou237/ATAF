<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\News;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RbacSeeder::class);
    }

    private function userWithRole(string $role): User
    {
        $user = User::create([
            'name' => ucfirst($role),
            'email' => $role.'@test.local',
            'password' => bcrypt('password'),
        ]);

        $user->assignRole($role);

        return $user;
    }

    public function test_communication_only_manages_content(): void
    {
        $this->actingAs($this->userWithRole('communication'));

        $this->get('/admin/news')->assertOk();
        $this->get('/admin/members')->assertForbidden();
        $this->get('/admin/users')->assertForbidden();
        $this->get('/admin/settings')->assertForbidden();
    }

    public function test_events_role_only_manages_events(): void
    {
        $this->actingAs($this->userWithRole('events'));

        $this->get('/admin/events')->assertOk();
        $this->get('/admin/event-registrations')->assertOk();
        $this->get('/admin/news')->assertForbidden();
    }

    public function test_members_role_manages_members_and_agencies(): void
    {
        $this->actingAs($this->userWithRole('members'));

        $this->get('/admin/members')->assertOk();
        $this->get('/admin/agencies')->assertOk();
        $this->get('/admin/news')->assertForbidden();
    }

    public function test_policies_follow_permissions(): void
    {
        $communication = $this->userWithRole('communication');

        $this->assertTrue($communication->can('viewAny', News::class));
        $this->assertFalse($communication->can('viewAny', Member::class));
        $this->assertFalse($communication->can('create', Member::class));
    }
}
