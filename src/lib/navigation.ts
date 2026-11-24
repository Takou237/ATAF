export type NavItem = {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
};

export const DEFAULT_NAV: NavItem[] = [
  { label: 'Accueil', path: '/' },
  { label: "L'ATAF", path: '/ataf', children: [
    { label: 'Présentation', path: '/ataf/presentation' },
    { label: 'Missions', path: '/ataf/missions' },
    { label: 'Histoire', path: '/ataf/histoire' },
    { label: 'Gouvernance', path: '/ataf/gouvernance' },
    { label: 'Organigramme', path: '/ataf/organigramme' },
    { label: 'Bureau / CA', path: '/ataf/bureau' },
  ] },
  { label: 'Membres', path: '/membres', children: [
    { label: 'Annuaire des membres', path: '/membres/annuaire' },
    { label: 'Compagnies membres', path: '/membres/compagnies' },
    { label: 'Partenaires', path: '/membres/partenaires' },
    { label: 'Devenir membre', path: '/membres/adhesion' },
  ] },
  { label: 'Actualités', path: '/actualites', children: [
    { label: 'Actualités ATAF', path: '/actualites/ataf' },
    { label: 'Actualités membres', path: '/actualites/membres' },
    { label: 'Communiqués', path: '/actualites/communiques' },
    { label: 'Veille aéronautique', path: '/actualites/veille' },
  ] },
  { label: 'Événements', path: '/evenements', children: [
    { label: 'Agenda', path: '/evenements/agenda' },
    { label: 'Séminaires', path: '/evenements/seminaires' },
    { label: 'Formations', path: '/evenements/formations' },
    { label: 'Assemblées générales', path: '/evenements/assemblees' },
    { label: 'Conférences', path: '/evenements/conferences' },
  ] },
  { label: 'Réglementation', path: '/reglementation', children: [
    { label: 'Veille réglementaire', path: '/reglementation/veille' },
    { label: 'Textes réglementaires', path: '/reglementation/textes' },
    { label: 'Publications', path: '/reglementation/publications' },
    { label: 'Notes et analyses', path: '/reglementation/notes' },
  ] },
  { label: 'Nos agences', path: '/agences', children: [
    { label: 'Annuaire', path: '/agences/annuaire' },
    { label: 'Vérifier un agrément', path: '/agences/verification' },
    { label: 'Informations', path: '/agences/informations' },
  ] },
  { label: 'Ressources', path: '/ressources', children: [
    { label: 'Centre documentaire', path: '/ressources/documents' },
    { label: 'Publications', path: '/ressources/publications' },
    { label: 'Médiathèque', path: '/ressources/mediatheque' },
  ] },
  { label: 'Contact', path: '/contact', children: [
    { label: 'Secrétariat Général', path: '/contact' },
    { label: 'Compagnies aériennes', path: '/contact/compagnies-aeriennes' },
  ] },
];

/** Lit la navigation enregistrée dans les réglages ; retombe sur le menu par défaut. */
export function parseNavigation(raw?: string): NavItem[] {
  if (!raw) return DEFAULT_NAV;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_NAV;

    const list = parsed
      .filter((item: unknown): item is NavItem => {
        const entry = item as NavItem;
        return Boolean(entry?.label && entry?.path);
      })
      .map((item) => ({
        ...item,
        children: Array.isArray(item.children) ? item.children : [],
      }));

    if (!list.some((item) => item.path === '/')) {
      list.unshift({ label: 'Accueil', path: '/' });
    }

    return list;
  } catch {
    return DEFAULT_NAV;
  }
}

/** Sous-menu d'une section (ex. « /ataf »), utilisé par les pages. */
export function sectionNav(nav: NavItem[], prefix: string): { label: string; path: string }[] {
  return nav.find((item) => item.path === prefix)?.children ?? [];
}
