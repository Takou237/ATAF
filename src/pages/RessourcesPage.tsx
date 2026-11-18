import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
  { label: 'Centre documentaire', path: '/ressources/documents' },
  { label: 'Publications', path: '/ressources/publications' },
  { label: 'Médiathèque', path: '/ressources/mediatheque' },
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

const categories = ['Réglementation', 'Sécurité', 'Sûreté', 'Formation', 'Transport', 'Gouvernance', 'Environnement', 'Études', 'Rapports', 'Publications ATAF'];

const docs = [
  { id: 1, title: 'Guide de sécurité aérienne ATAF 2026', category: 'Sécurité', type: 'PDF', size: '2.4 MB', date: 'sept. 2026', public: true },
  { id: 2, title: 'Rapport annuel ATAF 2025', category: 'Rapports', type: 'PDF', size: '5.8 MB', date: 'juil. 2026', public: true },
  { id: 3, title: 'Manuel de sûreté aérienne — Membres ATAF', category: 'Sûreté', type: 'PDF', size: '3.1 MB', date: 'juin 2026', public: false },
  { id: 4, title: 'Formation SMS — Support de cours', category: 'Formation', type: 'PDF', size: '8.2 MB', date: 'mai 2026', public: false },
  { id: 5, title: 'Étude : connectivité aérienne en Afrique francophone', category: 'Études', type: 'PDF', size: '6.7 MB', date: 'mars 2026', public: true },
  { id: 6, title: 'Textes fondateurs et statuts de l\'ATAF', category: 'Gouvernance', type: 'PDF', size: '1.2 MB', date: 'janv. 2026', public: true },
  { id: 7, title: 'Bilan environnemental du transport aérien francophone', category: 'Environnement', type: 'PDF', size: '4.5 MB', date: 'déc. 2025', public: true },
  { id: 8, title: 'Comptes rendus — 131ème Assemblée Générale', category: 'Rapports', type: 'PDF', size: '2.9 MB', date: 'nov. 2025', public: false },
];

function CentreDocumentaire() {
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const [access, setAccess] = useState('');

  const filtered = docs.filter((d) =>
    (!cat || d.category === cat) &&
    (!search || d.title.toLowerCase().includes(search.toLowerCase())) &&
    (!access || (access === 'public' ? d.public : !d.public))
  );

  return (
    <>
      <PageHero title="Centre documentaire" subtitle="Bibliothèque numérique de l'ATAF" breadcrumb="Ressources / Centre documentaire" />
      <SubNav current="Centre documentaire" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input type="text" placeholder="Rechercher un document..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]">
            <option value="">Toutes les catégories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={access} onChange={(e) => setAccess(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]">
            <option value="">Accès public et privé</option>
            <option value="public">Documents publics</option>
            <option value="private">Documents membres</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-10 h-12 bg-red-50 rounded-md flex items-center justify-center shrink-0 border border-red-100">
                <span className="text-red-500 text-xs font-bold">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#0D2B4E] truncate">{doc.title}</h3>
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  <span>{doc.category}</span>
                  <span>·</span>
                  <span>{doc.size}</span>
                  <span>·</span>
                  <span>{doc.date}</span>
                </div>
              </div>
              {doc.public ? (
                <button className="shrink-0 flex items-center gap-1.5 text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Télécharger
                </button>
              ) : (
                <Link to="/espace-membres" className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-md hover:border-[#1A4F8A] hover:text-[#1A4F8A] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  Membres
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Mediatheque() {
  const photos = [
    { id: 1, title: '131ème Assemblée Générale — Paris 2025', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' },
    { id: 2, title: 'Séminaire Sécurité — Dakar 2025', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop' },
    { id: 3, title: 'Formation réglementaire — Tunis 2025', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop' },
    { id: 4, title: 'Conférence sur la transition écologique', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop' },
    { id: 5, title: 'Réunion du Comité Exécutif', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop' },
    { id: 6, title: 'Séminaire Fret aérien — Abidjan 2024', url: 'https://images.unsplash.com/photo-1583245773069-f2f26873dd7e?w=400&h=300&fit=crop' },
  ];
  return (
    <>
      <PageHero title="Médiathèque" subtitle="Photos et vidéos des événements ATAF" breadcrumb="Ressources / Médiathèque" />
      <SubNav current="Médiathèque" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-[#0D2B4E] mb-5">Galerie photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-xl cursor-pointer bg-slate-100">
              <img src={p.url} alt={p.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#0D2B4E]/0 group-hover:bg-[#0D2B4E]/60 transition-all flex items-end">
                <p className="text-white text-sm font-medium p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">{p.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-[#0D2B4E] mb-5">Vidéos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Discours d\'ouverture — 131ème Assemblée Générale', duration: '12:34' },
              { title: 'ATAF en chiffres — édition 2025', duration: '5:20' },
            ].map((v) => (
              <div key={v.title} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                <div className="w-14 h-14 bg-[#1A4F8A] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#2563A8] transition-colors">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div>
                  <p className="font-medium text-[#0D2B4E]">{v.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{v.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function RessourcesPage() {
  const { section } = useParams<{ section?: string }>();
  if (section === 'publications') return (
    <>
      <PageHero title="Publications" subtitle="Publications et rapports de l'ATAF" breadcrumb="Ressources / Publications" />
      <SubNav current="Publications" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {docs.filter((d) => d.public).map((doc) => (
            <div key={doc.id} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-14 bg-red-50 rounded-md flex flex-col items-center justify-center gap-1 shrink-0 border border-red-100">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <span className="text-red-400 text-[10px] font-bold">PDF</span>
              </div>
              <div className="flex-1">
                <span className="text-xs text-[#3BAA35]">{doc.category}</span>
                <h3 className="font-medium text-[#0D2B4E] mt-0.5 text-sm">{doc.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{doc.size} · {doc.date}</p>
                <button className="mt-2 text-xs text-[#1A4F8A] font-medium hover:underline">Télécharger →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  if (section === 'mediatheque') return <Mediatheque />;
  return <CentreDocumentaire />;
}
