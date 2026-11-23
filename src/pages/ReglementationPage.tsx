import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocuments, getPublications, getRegulations } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import ApiErrorNotice from '../components/ApiErrorNotice';

const formatMonth = (value: string): string =>
  value ? new Date(value).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

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
  { label: 'Veille réglementaire', path: '/reglementation/veille' },
  { label: 'Textes réglementaires', path: '/reglementation/textes' },
  { label: 'Publications', path: '/reglementation/publications' },
  { label: 'Notes et analyses', path: '/reglementation/notes' },
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

const typeColors: Record<string, string> = {
  'Alerte': 'bg-red-50 text-red-600',
  'Texte réglementaire': 'bg-blue-50 text-blue-600',
  'Note d\'information': 'bg-yellow-50 text-yellow-700',
  'Analyse': 'bg-green-50 text-green-600',
  'Communiqué': 'bg-purple-50 text-purple-600',
  'Rapport': 'bg-slate-100 text-slate-600',
};

function Veille() {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data: regulationsData, loading, error, reload } = useApi(
    () => getRegulations({ search: debouncedSearch, category, type }),
    [debouncedSearch, category, type],
  );
  const { data: allRegulationsData } = useApi(getRegulations);
  const regulations = regulationsData ?? [];
  const allRegulations = allRegulationsData ?? [];

  const cats = [...new Set(allRegulations.map((r) => r.category))];
  const types = [...new Set(allRegulations.map((r) => r.type))];

  const filtered = regulations.filter((r) =>
    (!category || r.category === category) &&
    (!type || r.type === type) &&
    (!search || r.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <PageHero title="Veille réglementaire" subtitle="Dernières évolutions du cadre réglementaire aéronautique international" breadcrumb="Réglementation / Veille" />
      <SubNav current="Veille réglementaire" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]">
            <option value="">Toutes les catégories</option>
            {cats.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]">
            <option value="">Tous les types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement de la veille…</p>}
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
              <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[r.type] || 'bg-slate-100 text-slate-600'}`}>{r.type}</span>
              <div className="flex-1">
                <h3 className="font-medium text-[#0D2B4E] group-hover:text-[#1A4F8A] transition-colors">{r.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{r.summary}</p>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span>{new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{r.category}</span>
                </div>
              </div>
              <button className="shrink-0 text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">
                Lire
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Textes() {
  const { data: itemsData, loading, error, reload } = useApi(getDocuments);
  const items = itemsData ?? [];
  return (
    <>
      <PageHero title="Textes réglementaires" subtitle="Base documentaire réglementaire ATAF" breadcrumb="Réglementation / Textes" />
      <SubNav current="Textes réglementaires" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement des textes…</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                {['Référence', 'Titre', 'Organisme', 'Date d\'entrée en vigueur', 'Action'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-[#1A4F8A]">{item.code}</td>
                  <td className="py-3 px-4 font-medium text-[#0D2B4E]">{item.title}</td>
                  <td className="py-3 px-4 text-slate-500">{item.org}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                  <td className="py-3 px-4">
                    {item.downloadUrl ? (
                      <a href={item.downloadUrl} className="text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">Télécharger</a>
                    ) : (
                      <span className="text-xs text-slate-400 border border-slate-200 px-3 py-1.5 rounded-md">Indisponible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Publications() {
  const { data: pubsData, loading, error, reload } = useApi(getPublications);
  const pubs = pubsData ?? [];
  return (
    <>
      <PageHero title="Publications" subtitle="Publications officielles de l'ATAF" breadcrumb="Réglementation / Publications" />
      <SubNav current="Publications" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement des publications…</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pubs.map((p) => (
            <div key={p.id} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-12 h-14 bg-[#1A4F8A]/10 rounded-md flex flex-col items-center justify-center gap-1 shrink-0">
                <svg className="w-6 h-6 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                <span className="text-[10px] text-slate-400 font-mono">PDF</span>
              </div>
              <div className="flex-1">
                <span className="text-xs text-[#3BAA35] font-medium">{p.type}</span>
                <h3 className="font-medium text-[#0D2B4E] text-sm mt-0.5 leading-snug">{p.title}</h3>
                <div className="text-xs text-slate-400 mt-1">{formatMonth(p.date)} · {p.pages} pages</div>
                <button className="mt-2 text-xs text-[#1A4F8A] font-medium hover:underline">Télécharger →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Notes() {
  const { data: regulationsData, loading, error, reload } = useApi(getRegulations);
  const regulations = regulationsData ?? [];
  const notes = regulations.filter((r) => r.type === 'Analyse' || r.type === 'Note d\'information');
  return (
    <>
      <PageHero title="Notes et analyses" subtitle="Analyses et notes d'information ATAF" breadcrumb="Réglementation / Notes" />
      <SubNav current="Notes et analyses" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement des notes…</p>}
        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.id} className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[n.type]}`}>{n.type}</span>
                  <h3 className="font-semibold text-[#0D2B4E] mt-2 mb-2">{n.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{n.summary}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(n.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {n.category}</p>
                </div>
                <button className="shrink-0 text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">Lire</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ReglementationPage() {
  const { section } = useParams<{ section?: string }>();
  if (section === 'textes') return <Textes />;
  if (section === 'publications') return <Publications />;
  if (section === 'notes') return <Notes />;
  return <Veille />;
}
