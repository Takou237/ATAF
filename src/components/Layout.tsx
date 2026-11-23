import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../imports/LOGO-UPDATE-ATAG-1.png';
import { subscribeNewsletter } from '../lib/api';
import Honeypot from './Honeypot';

const navItems = [
  { label: "L'ATAF", path: '/ataf', children: [
    { label: 'Présentation', path: '/ataf/presentation' },
    { label: 'Missions', path: '/ataf/missions' },
    { label: 'Histoire', path: '/ataf/histoire' },
    { label: 'Gouvernance', path: '/ataf/gouvernance' },
    { label: 'Organigramme', path: '/ataf/organigramme' },
    { label: 'Bureau / CA', path: '/ataf/bureau' },
  ]},
  { label: 'Membres', path: '/membres', children: [
    { label: 'Annuaire des membres', path: '/membres/annuaire' },
    { label: 'Compagnies membres', path: '/membres/compagnies' },
    { label: 'Partenaires', path: '/membres/partenaires' },
    { label: 'Devenir membre', path: '/membres/adhesion' },
  ]},
  { label: 'Actualités', path: '/actualites', children: [
    { label: 'Actualités ATAF', path: '/actualites/ataf' },
    { label: 'Actualités membres', path: '/actualites/membres' },
    { label: 'Communiqués', path: '/actualites/communiques' },
    { label: 'Veille aéronautique', path: '/actualites/veille' },
  ]},
  { label: 'Événements', path: '/evenements', children: [
    { label: 'Agenda', path: '/evenements/agenda' },
    { label: 'Séminaires', path: '/evenements/seminaires' },
    { label: 'Formations', path: '/evenements/formations' },
    { label: 'Assemblées générales', path: '/evenements/assemblees' },
    { label: 'Conférences', path: '/evenements/conferences' },
  ]},
  { label: 'Réglementation', path: '/reglementation', children: [
    { label: 'Veille réglementaire', path: '/reglementation/veille' },
    { label: 'Textes réglementaires', path: '/reglementation/textes' },
    { label: 'Publications', path: '/reglementation/publications' },
    { label: 'Notes et analyses', path: '/reglementation/notes' },
  ]},
  { label: 'Nos agences', path: '/agences', children: [
    { label: 'Annuaire', path: '/agences/annuaire' },
    { label: 'Vérifier un agrément', path: '/agences/verification' },
    { label: 'Informations', path: '/agences/informations' },
  ]},
  { label: 'Ressources', path: '/ressources', children: [
    { label: 'Centre documentaire', path: '/ressources/documents' },
    { label: 'Publications', path: '/ressources/publications' },
    { label: 'Médiathèque', path: '/ressources/mediatheque' },
  ]},
  { label: 'Contact', path: '/contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterWebsite, setNewsletterWebsite] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const location = useLocation();

  const handleNewsletter = async (event: React.FormEvent) => {
    event.preventDefault();
    setNewsletterStatus('sending');
    setNewsletterError(null);

    try {
      await subscribeNewsletter(newsletterEmail, undefined, newsletterWebsite);
      setNewsletterStatus('sent');
      setNewsletterEmail('');
      setNewsletterWebsite('');
    } catch (reason) {
      setNewsletterStatus('error');
      setNewsletterError(reason instanceof Error ? reason.message : "L'inscription a échoué.");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0D2B4E] text-white text-xs py-2 px-6 flex items-center justify-between">
        <span className="hidden sm:inline">Association des Transporteurs Aériens Francophones — fondée en 1950</span>
        <span className="sm:hidden">ATAF — depuis 1950</span>
        <div className="flex items-center gap-3">
          {/* Espace membres green button */}
          <Link
            to="/espace-membres"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#3BAA35] text-white text-xs font-semibold rounded hover:bg-[#2D8A28] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Espace membres
          </Link>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-[#4DC247] transition-colors">FR</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-[#4DC247] transition-colors">EN</a>
        </div>
      </div>

      {/* Main nav */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo image */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logoImg} alt="ATAF" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`px-3 py-5 text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname.startsWith(item.path) && item.path !== '/'
                      ? 'text-[#1A4F8A]'
                      : 'text-slate-700 hover:text-[#1A4F8A]'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-white shadow-xl border border-slate-100 rounded-b-lg min-w-52 py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-5 py-2.5 text-sm text-slate-600 hover:text-[#1A4F8A] hover:bg-slate-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className="block px-6 py-3 text-sm font-medium text-slate-700 border-b border-slate-50"
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="block px-10 py-2.5 text-sm text-slate-500 border-b border-slate-50 hover:text-[#1A4F8A]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              to="/espace-membres"
              className="block px-6 py-4 text-sm font-medium text-[#3BAA35]"
            >
              🔒 Espace membres
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0D2B4E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="mb-4">
                <img src={logoImg} alt="ATAF" className="h-8 w-auto brightness-0 invert" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Association des Transporteurs Aériens Francophones, au service du transport aérien francophone depuis 1950.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-[#3BAA35] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-[#3BAA35] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>L'ATAF</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[['Présentation', '/ataf/presentation'], ['Missions', '/ataf/missions'], ['Histoire', '/ataf/histoire'], ['Gouvernance', '/ataf/gouvernance'], ['Organigramme', '/ataf/organigramme']].map(([l, p]) => (
                  <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[['Membres', '/membres/annuaire'], ['Actualités', '/actualites'], ['Événements', '/evenements/agenda'], ['Nos agences', '/agences/annuaire'], ['Réglementation', '/reglementation/veille'], ['Contact', '/contact']].map(([l, p]) => (
                  <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Secrétariat Général ATAF</li>
                <li>Montreuil, France</li>
                <li className="pt-1"><a href="mailto:sg@ataf.fr" className="hover:text-white transition-colors">sg@ataf.fr</a></li>
                <li><a href="https://www.ataf.fr" className="hover:text-white transition-colors">www.ataf.fr</a></li>
              </ul>
              <div className="mt-5">
                <p className="text-sm text-slate-400 mb-2">Newsletter ATAF</p>
                <form onSubmit={handleNewsletter} className="relative flex gap-2">
                  <Honeypot id="footer-website" value={newsletterWebsite} onChange={setNewsletterWebsite} />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded placeholder-slate-500 border border-white/10 focus:outline-none focus:border-[#3BAA35]"
                  />
                  <button type="submit" disabled={newsletterStatus === 'sending'} className="px-3 py-2 bg-[#3BAA35] rounded text-sm hover:bg-[#2D8A28] transition-colors disabled:opacity-60">
                    {newsletterStatus === 'sending' ? '…' : 'OK'}
                  </button>
                </form>
                {newsletterStatus === 'sent' && <p className="text-[#4DC247] text-xs mt-2">Inscription confirmée.</p>}
                {newsletterStatus === 'error' && <p className="text-red-400 text-xs mt-2">{newsletterError}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 max-w-7xl mx-auto">
          <span>© {new Date().getFullYear()} ATAF – Association des Transporteurs Aériens Francophones. Tous droits réservés.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Plan du site</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
