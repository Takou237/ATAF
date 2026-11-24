<?php

namespace Tests\Feature;

use App\Filament\Resources\Roles\RoleResource;
use App\Models\Member;
use App\Models\News;
use App\Models\User;
use Database\Seeders\RbacSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
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

    public function test_admin_manages_roles(): void
    {
        $this->actingAs($this->userWithRole('admin'));

        $this->get('/admin/roles')->assertOk();
    }

    public function test_roles_are_closed_to_other_roles(): void
    {
        $this->actingAs($this->userWithRole('communication'));

        $this->get('/admin/roles')->assertForbidden();
    }

    public function test_sensitive_roles_cannot_be_deleted(): void
    {
        $this->actingAs($this->userWithRole('admin'));
        $this->userWithRole('communication');

        $this->assertFalse(RoleResource::canDelete(Role::findByName('super-admin')));
        $this->assertFalse(RoleResource::canDelete(Role::findByName('communication')));
        $this->assertTrue(RoleResource::canDelete(Role::findByName('events')));
    }
}
