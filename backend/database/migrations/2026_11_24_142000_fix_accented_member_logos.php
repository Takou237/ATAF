<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Les fichiers de ces deux logos sont stockés sur ataf.fr avec des accents
     * décomposés (e + accent combinant). L'URL en Unicode composé (é) renvoie
     * donc 404 ; on enregistre la forme déjà encodée, qui fonctionne telle
     * quelle dans l'attribut src de l'image.
     */
    public function up(): void
    {
        $logos = [
            'Air Algérie' => 'https://www.ataf.fr/wp-content/uploads/2021/06/Air_Alge%CC%81rie_logo_logotype_emblem-1-1024x238.png',
            'Air Sénégal' => 'https://www.ataf.fr/wp-content/uploads/2022/04/Logo-Air-Se%CC%81ne%CC%81gal.png',
        ];

        foreach ($logos as $name => $logo) {
            DB::table('members')->where('name', $name)->update(['logo_path' => $logo]);
        }
    }

    public function down(): void
    {
        // Donnée de contenu : rien à annuler.
    }
};
