import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocuments, getDocumentsPage, getPublications, type DocumentItem, type PublicationItem } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import ApiErrorNotice from '../components/ApiErrorNotice';

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

function CentreDocumentaire() {
  const [cat, setCat] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: allDocsData } = useApi(getDocuments);
  const allDocs = allDocsData ?? [];
  const categories = [...new Set(allDocs.map((d) => d.code))].sort();

  const loadFirstPage = () => {
    setLoading(true);
    setError(null);
    setPage(1);

    return getDocumentsPage({ page: 1, perPage: 10, search: debouncedSearch, category: cat })
      .then((result) => {
        setItems(result.data);
        setLastPage(result.lastPage);
        setTotal(result.total);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Impossible de charger les documents.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPage(1);

    getDocumentsPage({ page: 1, perPage: 10, search: debouncedSearch, category: cat })
      .then((result) => {
        if (!active) return;
        setItems(result.data);
        setLastPage(result.lastPage);
        setTotal(result.total);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Impossible de charger les documents.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, cat]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getDocumentsPage({ page: nextPage, perPage: 10, search: debouncedSearch, category: cat });
      setItems((previous) => [...previous, ...result.data]);
      setPage(nextPage);
      setLastPage(result.lastPage);
      setTotal(result.total);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Impossible de charger la suite.');
    } finally {
      setLoadingMore(false);
    }
  };

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
        </div>

        {error && <ApiErrorNotice message={error} onRetry={loadFirstPage} className="mb-6" />}
        {loading ? (
          <p className="text-slate-400 text-center py-10">Chargement des documents…</p>
        ) : items.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Aucun document correspondant.</p>
        ) : (
          <>
            <p className="text-slate-500 text-sm mb-5">{total} document{total > 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 gap-3">
              {items.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-12 bg-red-50 rounded-md flex items-center justify-center shrink-0 border border-red-100">
                    <span className="text-red-500 text-xs font-bold">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#0D2B4E] truncate">{doc.title}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      <span>{doc.code}</span>
                      <span>·</span>
                      <span>{doc.org}</span>
                      <span>·</span>
                      <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  {doc.downloadUrl ? (
                    <a href={doc.downloadUrl} className="shrink-0 flex items-center gap-1.5 text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                      Télécharger
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-slate-400 border border-slate-200 px-3 py-1.5 rounded-md">Indisponible</span>
                  )}
                </div>
              ))}
            </div>
            {page < lastPage && (
              <div className="text-center mt-8">
                <button type="button" onClick={loadMore} disabled={loadingMore} className="px-6 py-3 border border-[#1A4F8A]/20 text-[#1A4F8A] rounded-md text-sm font-medium hover:bg-[#1A4F8A] hover:text-white transition-colors disabled:opacity-60">
                  {loadingMore ? 'Chargement…' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        )}
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

function PublicationsList() {
  const { data, loading, error, reload } = useApi(getPublications);
  const publications: PublicationItem[] = data ?? [];

  return (
    <>
      <PageHero title="Publications" subtitle="Publications et rapports de l'ATAF" breadcrumb="Ressources / Publications" />
      <SubNav current="Publications" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
        {loading ? (
          <p className="text-slate-400 text-center py-10">Chargement des publications…</p>
        ) : publications.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Aucune publication disponible.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {publications.map((publication) => (
              <div key={publication.id} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-14 bg-red-50 rounded-md flex flex-col items-center justify-center gap-1 shrink-0 border border-red-100">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  <span className="text-red-400 text-[10px] font-bold">PDF</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-[#3BAA35]">{publication.type}</span>
                  <h3 className="font-medium text-[#0D2B4E] mt-0.5 text-sm">{publication.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{publication.pages} pages · {new Date(publication.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function RessourcesPage() {
  const { section } = useParams<{ section?: string }>();
  if (section === 'publications') return <PublicationsList />;
  if (section === 'mediatheque') return <Mediatheque />;
  return <CentreDocumentaire />;
}
