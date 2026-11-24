<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * La base de production contient « Pratt & Whitney » là où le seeder local
     * écrit « Pratt & Whitney Canada » : la migration précédente n'a donc pas
     * reconnu ce membre. On complète le logo sous ses deux orthographes.
     */
    public function up(): void
    {
        DB::table('members')
            ->whereIn('name', ['Pratt & Whitney', 'Pratt & Whitney Canada'])
            ->where(function ($query) {
                $query->whereNull('logo_path')->orWhere('logo_path', '');
            })
            ->update([
                'logo_path' => 'https://www.ataf.fr/wp-content/uploads/2023/10/Pratt__Whitney_logo.svg-1024x796.png',
            ]);
    }

    public function down(): void
    {
        // Donnée de contenu : rien à annuler.
    }
};
