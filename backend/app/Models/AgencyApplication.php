<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AgencyApplication extends Model
{
    public const STATUSES = [
        'pending' => 'En attente',
        'review' => 'En cours d\'examen',
        'approved' => 'Approuvée',
        'rejected' => 'Rejetée',
    ];

    protected $guarded = ['id'];

    public function approve(): Agency
    {
        $number = $this->agreement_number ?: static::generateAgreementNumber();

        $agency = Agency::create([
            'name' => $this->agency_name,
            'agreement_number' => $number,
            'country' => $this->country,
            'status' => 'approved',
            'valid_from' => now()->toDateString(),
            'valid_until' => now()->addYears(2)->toDateString(),
        ]);

        $this->update([
            'status' => 'approved',
            'agreement_number' => $number,
        ]);

        return $agency;
    }

    public function reject(?string $note = null): void
    {
        $data = ['status' => 'rejected'];

        if (filled($note)) {
            $data['admin_notes'] = $note;
        }

        $this->update($data);
    }

    public static function generateAgreementNumber(): string
    {
        $prefix = 'ATAF-'.now()->year.'-';
        $sequence = 1;

        do {
            $number = $prefix.Str::padLeft((string) $sequence, 4, '0');
            $sequence++;
        } while (Agency::query()->where('agreement_number', $number)->exists());

        return $number;
    }
}
