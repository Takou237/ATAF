<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\MemberProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@ataf.fr'],
            [
                'name' => 'Administrateur ATAF',
                'password' => 'password',
                'organisation' => 'ATAF',
                'status' => 'active',
                'email_verified_at' => now(),
            ],
        );

        $admin->syncRoles(['super-admin']);

        $member = User::firstOrCreate(
            ['email' => 'jp.dupont@airfrance.fr'],
            [
                'name' => 'Jean-Pierre DUPONT',
                'password' => 'password',
                'organisation' => 'Air France',
                'phone' => '+33 1 41 56 78 00',
                'status' => 'active',
                'email_verified_at' => now(),
            ],
        );

        $member->syncRoles(['member']);

        MemberProfile::firstOrCreate(
            ['user_id' => $member->id],
            [
                'member_id' => Member::query()->where('name', 'Air France')->value('id'),
                'role' => 'Directeur des Relations Institutionnelles',
                'phone' => '+33 1 41 56 78 00',
                'validated_at' => now(),
            ],
        );
    }
}
