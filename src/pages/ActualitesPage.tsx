import { useParams, Link } from 'react-router-dom';
import { getNews } from '../lib/api';
import { useApi } from '../hooks/useApi';
import ApiErrorNotice from '../components/ApiErrorNotice';
import CmsPage from '../components/CmsPage';


function NewsDetail({ id }: { id: number }) {
  const { data: newsData, loading, error, reload } = useApi(getNews);
  const news = newsData ?? [];
  const item = news.find((n) => n.id === id);

  if (loading) return <div className="p-20 text-center text-slate-400">Chargement de l'article…</div>;
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <ApiErrorNotice message={error} onRetry={reload} />
      </div>
    );
  }
  if (!item) return <div className="p-20 text-center text-slate-400">Article non trouvé</div>;

  return (
    <>
      <div className="bg-[#1A4F8A] text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-blue-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Accueil</Link> /{' '}
            <Link to="/actualites" className="hover:text-white">Actualités</Link> / {item.category}
          </div>
          <span className="text-xs font-medium bg-[#3BAA35] px-3 py-1 rounded-full">{item.category}</span>
          <h1 className="text-3xl font-bold mt-3 leading-tight">{item.title}</h1>
          <p className="text-blue-200 text-sm mt-2">
            {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <img src={item.image} alt={item.title} className="w-full rounded-xl mb-8 aspect-[16/7] object-cover" />
        <div className="prose max-w-none text-slate-600 leading-relaxed">
          <p className="text-lg text-slate-700 font-medium mb-4">{item.summary}</p>
          <p>
            L'ATAF, dans le cadre de ses missions de veille et de représentation, suit avec attention les développements relatifs à
            cet événement majeur pour le transport aérien francophone.
          </p>
          <p>
            Les membres de l'association sont invités à consulter les informations détaillées et à participer aux discussions lors
            des prochaines réunions du comité exécutif.
          </p>
          <p>
            Pour toute information complémentaire, veuillez contacter le Secrétariat Général de l'ATAF à l'adresse{' '}
            <a href="mailto:sg@ataf.fr" className="text-[#1A4F8A]">sg@ataf.fr</a>.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/actualites" className="flex items-center gap-2 px-4 py-2 bg-[#1A4F8A] text-white rounded-md text-sm hover:bg-[#12376A]">
            ← Retour aux actualités
          </Link>
          {item.downloadUrl && (
            <a
              href={item.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#3BAA35] text-white rounded-md text-sm font-medium hover:bg-[#2D8A28]"
            >
              ↓ Télécharger le communiqué (PDF)
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default function ActualitesPage() {
  const { section } = useParams<{ section?: string }>();

  const numericId = section && !isNaN(parseInt(section)) ? parseInt(section) : null;
  if (numericId) return <NewsDetail id={numericId} />;

  return <CmsPage slug={`actualites-${section ?? 'ataf'}`} prefix="/actualites" />;
}
