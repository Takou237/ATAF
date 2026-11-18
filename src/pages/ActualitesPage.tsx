import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { news } from '../data';

const PageHero = ({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb: string }) => (
  <div className="bg-[#1A4F8A] text-white py-14">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-blue-300 text-sm mb-3">
        <Link to="/" className="hover:text-white">Accueil</Link> / {breadcrumb}
      </div>
      <h1 className="text-4xl font-bold" style={{ fontFamily: 'Instrument Serif, serif' }}>{title}</h1>
      {subtitle && <p className="text-blue-200 mt-2">{subtitle}</p>}
    </div>
  </div>
);

const subNav = [
  { label: 'Actualités ATAF', path: '/actualites/ataf' },
  { label: 'Actualités membres', path: '/actualites/membres' },
  { label: 'Communiqués', path: '/actualites/communiques' },
  { label: 'Veille aéronautique', path: '/actualites/veille' },
];

function SubNav({ current }: { current: string }) {
  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto">
        {subNav.map((item) => (
          <Link key={item.path} to={item.path} className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${current === item.label ? 'border-[#1A4F8A] text-[#1A4F8A]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewsGrid({ items, title, subtitle, breadcrumb, navLabel }: { items: typeof news; title: string; subtitle?: string; breadcrumb: string; navLabel: string }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHero title={title} subtitle={subtitle} breadcrumb={breadcrumb} />
      <SubNav current={navLabel} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Aucune actualité correspondante.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Link key={item.id} to={`/actualites/${item.id}`} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[#3BAA35] bg-[#3BAA35]/10 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 leading-snug group-hover:text-[#1A4F8A] transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function NewsDetail({ id }: { id: number }) {
  const item = news.find((n) => n.id === id);
  if (!item) return <div className="p-20 text-center text-slate-400">Article non trouvé</div>;
  return (
    <>
      <div className="bg-[#1A4F8A] text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-blue-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Accueil</Link> / <Link to="/actualites" className="hover:text-white">Actualités</Link> / {item.category}
          </div>
          <span className="text-xs font-medium bg-[#3BAA35] px-3 py-1 rounded-full">{item.category}</span>
          <h1 className="text-3xl font-bold mt-3 leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>{item.title}</h1>
          <p className="text-blue-200 text-sm mt-2">{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <img src={item.image} alt={item.title} className="w-full rounded-xl mb-8 aspect-[16/7] object-cover" />
        <div className="prose max-w-none text-slate-600 leading-relaxed">
          <p className="text-lg text-slate-700 font-medium mb-4">{item.summary}</p>
          <p>L'ATAF, dans le cadre de ses missions de veille et de représentation, suit avec attention les développements relatifs à cet événement majeur pour le transport aérien francophone.</p>
          <p>Les membres de l'association sont invités à consulter les informations détaillées et à participer aux discussions lors des prochaines réunions du comité exécutif.</p>
          <p>Pour toute information complémentaire, veuillez contacter le Secrétariat Général de l'ATAF à l'adresse <a href="mailto:sg@ataf.fr" className="text-[#1A4F8A]">sg@ataf.fr</a>.</p>
        </div>
        <div className="flex gap-3 mt-8">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Partager
          </button>
          <Link to="/actualites" className="flex items-center gap-2 px-4 py-2 bg-[#1A4F8A] text-white rounded-md text-sm hover:bg-[#12376A]">
            ← Retour aux actualités
          </Link>
        </div>
      </div>
    </>
  );
}

function VeilleAero() {
  const items = [
    { source: 'newsaero.info', title: 'Bilan du trafic aérien mondial - Août 2026', date: '15 sept. 2026', url: '#' },
    { source: 'ICAO', title: 'ICAO Council adopts new safety standards for runway incursions', date: '10 sept. 2026', url: '#' },
    { source: 'IATA', title: 'Airlines see passenger demand grow 8% year-on-year in August 2026', date: '8 sept. 2026', url: '#' },
    { source: 'AFRAA', title: 'African aviation traffic report Q2 2026', date: '5 sept. 2026', url: '#' },
    { source: 'newsaero.info', title: 'KlasJet renforce ses capacités ACMI avec l\'ajout de nouveaux appareils', date: '3 sept. 2026', url: '#' },
    { source: 'ASECNA', title: 'ASECNA modernise ses systèmes de contrôle aérien dans 6 pays', date: '28 août 2026', url: '#' },
  ];
  return (
    <>
      <PageHero title="Veille aéronautique" subtitle="Revue de presse et actualités du secteur" breadcrumb="Actualités / Veille aéronautique" />
      <SubNav current="Veille aéronautique" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {items.map((item, i) => (
            <a key={i} href={item.url} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow group">
              <span className="shrink-0 bg-[#1A4F8A]/10 text-[#1A4F8A] text-xs font-bold px-2.5 py-1.5 rounded-md">{item.source}</span>
              <div className="flex-1">
                <p className="font-medium text-slate-800 group-hover:text-[#1A4F8A] transition-colors">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1">{item.date}</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-[#1A4F8A] shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function Communiques() {
  const items = [
    { title: 'Communiqué de presse — 132ème Assemblée Générale de l\'ATAF', date: '25 août 2026' },
    { title: 'Prise de position ATAF sur la réforme du code de l\'aviation civile', date: '10 juillet 2026' },
    { title: 'ATAF salue la nomination de nouveaux dirigeants chez ses membres', date: '26 mai 2026' },
    { title: 'Déclaration de l\'ATAF sur la transition environnementale du transport aérien', date: '15 avril 2026' },
  ];
  return (
    <>
      <PageHero title="Communiqués" subtitle="Déclarations officielles et communiqués de presse" breadcrumb="Actualités / Communiqués" />
      <SubNav current="Communiqués" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-10 h-10 bg-[#1A4F8A]/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#0D2B4E] group-hover:text-[#1A4F8A] transition-colors">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
              </div>
              <button className="text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">
                Télécharger
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ActualitesPage() {
  const { section } = useParams<{ section?: string }>();

  // section can be a numeric id for detail view
  const numericId = section && !isNaN(parseInt(section)) ? parseInt(section) : null;
  if (numericId) return <NewsDetail id={numericId} />;

  const membresNews = news.filter((n) => n.category === 'Membres');

  if (section === 'membres') return <NewsGrid items={membresNews} title="Actualités membres" breadcrumb="Actualités / Membres" navLabel="Actualités membres" />;
  if (section === 'communiques') return <Communiques />;
  if (section === 'veille') return <VeilleAero />;

  return <NewsGrid items={news} title="Actualités ATAF" subtitle="Toutes les actualités de l'association" breadcrumb="Actualités" navLabel="Actualités ATAF" />;
}
