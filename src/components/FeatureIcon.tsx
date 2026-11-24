type FeatureIconProps = {
  name?: string;
  className?: string;
};

const iconPaths: Record<string, string> = {
  calendar: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm3 8h3m-3 4h3m2-4h3m-3 4h3',
  dialogue: 'M7 8h10M7 12h6m8-1a7 7 0 01-7 7H9l-5 3 1.5-4.2A7 7 0 1119 11z',
  exchange: 'M7 7h10l-3-3m3 3l-3 3M17 17H7l3 3m-3-3l3-3',
  governance: 'M12 3l8 4v5c0 4.5-3.1 7.7-8 9-4.9-1.3-8-4.5-8-9V7l8-4zm-3 9l2 2 4-4',
  regulation: 'M6 3h9l3 3v15H6a2 2 0 01-2-2V5a2 2 0 012-2zm9 0v4h4M8 11h8M8 15h8M8 19h5',
  representation: 'M5 21v-9m0 0V5a1 1 0 011-1h8l1 3h4a1 1 0 011 1v4a1 1 0 01-1 1H8l-3-1zm0 0l-2 1',
  seminar: 'M4 5a2 2 0 012-2h10a2 2 0 012 2v14H6a2 2 0 01-2-2V5zm4 2h6m-6 4h6m-6 4h4',
  training: 'M3 10l9-5 9 5-9 5-9-5zm4 3v4c3 2 7 2 10 0v-4M21 10v6',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.5 2.4 4 5.7 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.7-4 9s1.5 6.6 4 9M3.5 9h17M3.5 15h17',
};

function resolveIcon(name?: string): string {
  const value = (name ?? '').toLowerCase();

  if (value.includes('calendar') || value.includes('rencontre') || value.includes('agenda')) return 'calendar';
  if (value.includes('transfert') || value.includes('partage') || value.includes('exchange')) return 'exchange';
  if (value.includes('dialogue') || value.includes('échange') || value.includes('echange')) return 'dialogue';
  if (value.includes('gouver') || value.includes('sécurité') || value.includes('securite')) return 'governance';
  if (value.includes('réglement') || value.includes('reglement') || value.includes('document')) return 'regulation';
  if (value.includes('représent') || value.includes('represent')) return 'representation';
  if (value.includes('formation') || value.includes('training')) return 'training';
  if (value.includes('séminaire') || value.includes('seminar')) return 'seminar';
  if (value.includes('développ') || value.includes('developp') || value.includes('francophone') || value.includes('globe') || value.includes('monde')) return 'globe';

  return 'dialogue';
}

export default function FeatureIcon({ name, className = 'h-6 w-6' }: FeatureIconProps) {
  const path = iconPaths[resolveIcon(name)];

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
