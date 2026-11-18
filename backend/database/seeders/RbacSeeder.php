<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'manage content',
            'manage members',
            'manage events',
            'manage documents',
            'manage agencies',
            'manage newsletter',
            'manage users',
            'manage settings',
            'view statistics',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roles = [
            'super-admin' => $permissions,
            'admin' => $permissions,
            'communication' => ['manage content', 'manage newsletter', 'view statistics'],
            'events' => ['manage events', 'view statistics'],
            'members' => ['manage members', 'manage agencies', 'view statistics'],
            'member' => [],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }
    }
}
