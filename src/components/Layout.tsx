import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../imports/LOGO-UPDATE-ATAG-1.png';
import { subscribeNewsletter, trackPageView } from '../lib/api';
import { parseNavigation } from '../lib/navigation';
import { useSiteSettings } from '../hooks/useSiteSettings';
import Honeypot from './Honeypot';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/association-internationale-de-transporteurs-a%C3%A9riens-ataf/?viewAsMember=true', network: 'linkedin', icon: 'fa-linkedin-in' },
  { label: 'Facebook', href: 'https://www.facebook.com/associationatafdetransportsaeriens/', network: 'facebook', icon: 'fa-facebook-f' },
  { label: 'X (Twitter)', href: 'https://x.com/AssociationATAF', network: 'x', icon: 'fa-twitter' },
];

/** Pastilles rondes : au survol la couleur du réseau remonte du bas et
 *  l’icône pivote sur elle-même (styles dans src/index.css). */
function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={`ataf-social ${compact ? 'ataf-social--compact' : ''}`}
      aria-label="Réseaux sociaux ATAF"
    >
      {SOCIAL_LINKS.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            data-network={social.network}
          >
            <i className={`fab ${social.icon}`} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterWebsite, setNewsletterWebsite] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const location = useLocation();
  const settings = useSiteSettings();
  const navItems = parseNavigation(settings.nav_items);
  const contactEmail = settings.contact_email || 'sg@ataf.fr';
  const contactAddress = settings.contact_address || 'Secrétariat Général ATAF, Montreuil, France';
  const contactWebsite = settings.contact_website || 'https://www.ataf.fr';
  const footerAbout =
    settings.footer_about ||
    'Association des Transporteurs Aériens Francophones, au service du transport aérien francophone depuis 1950.';

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

  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" translate="no">
      {/* Top bar */}
      <div className="bg-[#0D2B4E] text-white text-xs py-2 px-6 flex items-center justify-between">
        <span className="hidden sm:inline">Association des Transporteurs Aériens Francophones — fondée en 1950</span>
        <span className="sm:hidden">ATAF — depuis 1950</span>
        <div className="flex items-center gap-3">
          <SocialLinks compact />
          <span className="opacity-30">|</span>
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
              <p className="text-slate-400 text-sm leading-relaxed">{footerAbout}</p>
              <div className="mt-4"><SocialLinks /></div>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">L'ATAF</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[['Présentation', '/ataf/presentation'], ['Missions', '/ataf/missions'], ['Histoire', '/ataf/histoire'], ['Gouvernance', '/ataf/gouvernance'], ['Organigramme', '/ataf/organigramme']].map(([l, p]) => (
                  <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {[['Membres', '/membres/annuaire'], ['Actualités', '/actualites'], ['Événements', '/evenements/agenda'], ['Nos agences', '/agences/annuaire'], ['Réglementation', '/reglementation/veille'], ['Contact', '/contact']].map(([l, p]) => (
                  <li key={l}><Link to={p} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>{contactAddress}</li>
                <li className="pt-1"><a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a></li>
                <li><a href={contactWebsite} className="hover:text-white transition-colors">{contactWebsite.replace(/^https?:\/\//, '')}</a></li>
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
