<?php

namespace App\Filament\Resources\Members\Pages;

use App\Filament\Resources\Members\MemberResource;
use App\Models\MemberProfile;
use App\Models\User;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateMember extends CreateRecord
{
    protected static string $resource = MemberResource::class;

    protected function afterCreate(): void
    {
        $data = $this->data;
        $email = trim((string) ($data['account_email'] ?? '')) ?: trim((string) ($this->record->email ?? ''));
        $password = trim((string) ($data['account_password'] ?? ''));

        // Un membre sans adresse e-mail reçoit malgré tout un compte par défaut,
        // avec un identifiant dérivé de son nom et un mot de passe communiqué à
        // l'administrateur qui vient de créer la fiche.
        if ($email === '') {
            $email = Str::slug($this->record->name ?: 'membre').'-'.$this->record->id.'@membres.ataf.fr';
        }

        $existing = User::query()->where('email', $email)->first();
        $created = $existing === null;

        if ($created && $password === '') {
            $password = Str::random(12);
        }

        $user = $existing ?? new User(['email' => $email]);

        $user->forceFill([
            'name' => $this->record->name,
            'organisation' => $this->record->name,
            'phone' => $this->record->phone,
            'status' => 'active',
            'email_verified_at' => $user->email_verified_at ?? now(),
        ]);

        if ($created) {
            $user->password = Hash::make($password);
        }

        $user->save();
        $user->syncRoles(['member']);

        MemberProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            ['member_id' => $this->record->id, 'phone' => $this->record->phone, 'validated_at' => now()],
        );

        if ($created) {
            Notification::make()
                ->title('Compte membre créé')
                ->body("Identifiant : {$email} — Mot de passe : {$password}")
                ->success()
                ->persistent()
                ->send();
        }
    }
}
