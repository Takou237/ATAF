<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipApplication extends Model
{
    public const STATUSES = [
        'pending' => 'En attente',
        'review' => 'En cours d\'examen',
        'approved' => 'Approuvée',
        'rejected' => 'Rejetée',
    ];

    protected $guarded = ['id'];

    public function approve(): Member
    {
        $country = Country::firstOrCreate(['name' => trim((string) $this->country)]);

        $member = Member::create([
            'name' => $this->organisation,
            'country_id' => $country->id,
            'email' => $this->email,
            'phone' => $this->phone,
            'category' => $this->category ?: 'Compagnie aérienne',
            'status' => 'active',
            'joined_year' => now()->year,
            'is_public' => true,
            'description' => $this->message,
        ]);

        $this->update(['status' => 'approved']);

        return $member;
    }

    public function reject(?string $note = null): void
    {
        $data = ['status' => 'rejected'];

        if (filled($note)) {
            $data['admin_notes'] = $note;
        }

        $this->update($data);
    }
}
