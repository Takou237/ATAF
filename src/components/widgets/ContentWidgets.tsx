import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getDocuments,
  getDocumentsPage,
  getEvents,
  getMedia,
  getNewsPage,
  getPublications,
  getRegulations,
  type DocumentItem,
  type EventItem,
  type NewsItem,
  type PublicationItem,
} from '../../lib/api';
import { useApi } from '../../hooks/useApi';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import ApiErrorNotice from '../ApiErrorNotice';
import type { WidgetProps } from './types';


const loadMoreClass =
  'px-6 py-3 border border-[#1A4F8A]/20 text-[#1A4F8A] rounded-md text-sm font-medium hover:bg-[#1A4F8A] hover:text-white transition-colors disabled:opacity-60';

const formatMonth = (value: string): string =>
  value ? new Date(value).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';

/* ------------------------------------------------------------------ */
/* Centre documentaire                                                 */
/* ------------------------------------------------------------------ */

export function DocumentsList() {
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher un document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
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
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow"
              >
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
                  <a
                    href={doc.downloadUrl}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
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
              <button type="button" onClick={loadMore} disabled={loadingMore} className={loadMoreClass}>
                {loadingMore ? 'Chargement…' : 'Charger plus'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

export function PublicationsList() {
  const { data, loading, error, reload } = useApi(getPublications);
  const publications: PublicationItem[] = data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
      {loading ? (
        <p className="text-slate-400 text-center py-10">Chargement des publications…</p>
      ) : publications.length === 0 ? (
        <p className="text-slate-400 text-center py-10">Aucune publication disponible.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {publications.map((publication) => (
            <div
              key={publication.id}
              className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-14 bg-red-50 rounded-md flex flex-col items-center justify-center gap-1 shrink-0 border border-red-100">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-red-400 text-[10px] font-bold">PDF</span>
              </div>
              <div className="flex-1">
                <span className="text-xs text-[#3BAA35]">{publication.type}</span>
                <h3 className="font-medium text-[#0D2B4E] mt-0.5 text-sm">{publication.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {publication.pages} pages · {formatMonth(publication.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Médiathèque                                                         */
/* ------------------------------------------------------------------ */

export function MediaGallery() {
  const { data, loading, error, reload } = useApi(getMedia);
  const items = data ?? [];
  const photos = items.filter((item) => item.type !== 'video' && item.src);
  const videos = items.filter((item) => item.type === 'video');

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
      {loading ? (
        <p className="text-slate-400 text-center py-10">Chargement de la médiathèque…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center text-slate-500">
          Aucun média pour le moment. Ajoutez des photos et vidéos depuis l'espace d'administration
          (Médias), elles apparaîtront ici automatiquement.
        </div>
      ) : (
        <>
          {photos.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-[#0D2B4E] mb-5">Galerie photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <figure key={photo.id} className="group relative overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {photo.title && (
                      <figcaption className="absolute inset-0 flex items-end bg-[#0D2B4E]/0 group-hover:bg-[#0D2B4E]/60 transition-all">
                        <p className="text-white text-sm font-medium p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          {photo.title}
                        </p>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </>
          )}

          {videos.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-[#0D2B4E] mb-5">Vidéos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url || video.src || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <div className="w-14 h-14 bg-[#1A4F8A] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#2563A8] transition-colors">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#0D2B4E]">{video.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Vidéo</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Actualités                                                          */
/* ------------------------------------------------------------------ */

export function NewsList({ block }: WidgetProps) {
  const category = block.filter || undefined;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPage(1);

    getNewsPage({ page: 1, perPage: 9, search: debouncedSearch, category })
      .then((result) => {
        if (!active) return;
        setItems(result.data);
        setLastPage(result.lastPage);
        setTotal(result.total);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Impossible de charger les actualités.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, category]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getNewsPage({ page: nextPage, perPage: 9, search: debouncedSearch, category });
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
      {error && <ApiErrorNotice message={error} onRetry={loadMore} className="mb-6" />}
      {loading ? (
        <p className="text-slate-400 text-center py-10">Chargement des actualités…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-400 text-center py-10">Aucune actualité correspondante.</p>
      ) : (
        <>
          <p className="text-slate-500 text-sm mb-5">{total} actualité{total > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/actualites/${item.id}`}
                className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[#3BAA35] bg-[#3BAA35]/10 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {item.downloadUrl && <span className="ml-auto rounded bg-[#1A4F8A]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#1A4F8A]">PDF</span>}
                  </div>
                  <h3 className="font-semibold text-slate-800 leading-snug group-hover:text-[#1A4F8A] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
          {page < lastPage && (
            <div className="text-center mt-8">
              <button type="button" onClick={loadMore} disabled={loadingMore} className={loadMoreClass}>
                {loadingMore ? 'Chargement…' : 'Charger plus'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Événements                                                          */
/* ------------------------------------------------------------------ */

const statusColors: Record<string, string> = {
  Ouvert: 'bg-green-50 text-green-600',
  Complet: 'bg-orange-50 text-orange-600',
  Terminé: 'bg-slate-100 text-slate-500',
  Annulé: 'bg-red-50 text-red-500',
};

function EventCard({ ev }: { ev: EventItem }) {
  const d = new Date(ev.date);

  return (
    <Link
      to={`/evenements/${ev.id}`}
      className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="bg-[#1A4F8A] px-5 py-4 flex items-center gap-4">
        <div className="text-center shrink-0">
          <div className="text-3xl font-bold text-white leading-none">{d.getDate()}</div>
          <div className="text-blue-200 text-xs uppercase">{d.toLocaleDateString('fr-FR', { month: 'short' })}</div>
          <div className="text-blue-300 text-xs">{d.getFullYear()}</div>
        </div>
        <div>
          <span className="text-xs text-blue-200 bg-white/10 px-2 py-0.5 rounded-full">{ev.type}</span>
          <h3 className="text-white font-semibold mt-1 leading-snug group-hover:text-[#4DC247] transition-colors">{ev.title}</h3>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {ev.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {ev.time}
        </div>
        <p className="text-sm text-slate-500 flex-1 line-clamp-2">{ev.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[ev.status] ?? 'bg-slate-100 text-slate-500'}`}>
            {ev.status}
          </span>
          <div className="text-xs text-slate-400">{ev.registered}/{ev.maxParticipants} inscrits</div>
        </div>
      </div>
    </Link>
  );
}

export function EventsList({ block }: WidgetProps) {
  const type = block.filter || undefined;
  const { data: eventsData, loading, error, reload } = useApi(() => getEvents(type ? { type } : {}), [type]);
  const events = eventsData ?? [];
  const filtered = type ? events.filter((e) => e.type === type) : events;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
      {loading ? (
        <p className="text-slate-400 text-center py-10">Chargement des événements…</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-10">Aucun événement prévu pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Réglementation                                                      */
/* ------------------------------------------------------------------ */

const typeColors: Record<string, string> = {
  Alerte: 'bg-red-50 text-red-600',
  'Texte réglementaire': 'bg-blue-50 text-blue-600',
  "Note d'information": 'bg-yellow-50 text-yellow-700',
  Analyse: 'bg-green-50 text-green-600',
  Communiqué: 'bg-purple-50 text-purple-600',
  Rapport: 'bg-slate-100 text-slate-600',
};

export function RegulationsList() {
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

  const filtered = regulations.filter(
    (r) =>
      (!category || r.category === category) &&
      (!type || r.type === type) &&
      (!search || r.title.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]"
        >
          <option value="">Toutes les catégories</option>
          {cats.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]"
        >
          <option value="">Tous les types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
      {loading && <p className="text-slate-400 text-sm mb-4">Chargement de la veille…</p>}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[r.type] || 'bg-slate-100 text-slate-600'}`}>
              {r.type}
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-[#0D2B4E]">{r.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{r.summary}</p>
              <div className="flex gap-3 mt-2 text-xs text-slate-400">
                <span>{new Date(r.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>{r.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentsTable() {
  const { data: itemsData, loading, error, reload } = useApi(getDocuments);
  const items = itemsData ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
      {loading && <p className="text-slate-400 text-sm mb-4">Chargement des textes…</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              {['Référence', 'Titre', 'Organisme', "Date d'entrée en vigueur", 'Action'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={`${item.id}-${i}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-[#1A4F8A]">{item.code}</td>
                <td className="py-3 px-4 font-medium text-[#0D2B4E]">{item.title}</td>
                <td className="py-3 px-4 text-slate-500">{item.org}</td>
                <td className="py-3 px-4 text-slate-500">{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                <td className="py-3 px-4">
                  {item.downloadUrl ? (
                    <a
                      href={item.downloadUrl}
                      className="text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors"
                    >
                      Télécharger
                    </a>
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
  );
}

export function RegulationsNotes() {
  const { data: regulationsData, loading, error, reload } = useApi(getRegulations);
  const regulations = regulationsData ?? [];
  const notes = regulations.filter((r) => r.type === 'Analyse' || r.type === "Note d'information");

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
      {loading && <p className="text-slate-400 text-sm mb-4">Chargement des notes…</p>}
      <div className="space-y-4">
        {notes.map((n) => (
          <div key={n.id} className="p-6 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${typeColors[n.type] || 'bg-slate-100 text-slate-600'}`}>
                  {n.type}
                </span>
                <h3 className="font-semibold text-[#0D2B4E] mt-2 mb-2">{n.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{n.summary}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(n.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {n.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
