import { useApi } from '../hooks/useApi';
import { getPageContent } from '../lib/api';
import PageBlocks from '../components/PageBlocks';
import { useParams } from 'react-router-dom';

export default function ContactPage() {
  const { section } = useParams();
  const slug = section === 'compagnies-aeriennes' ? 'contact-compagnies-aeriennes' : 'contact';
  const { data, loading } = useApi(() => getPageContent(slug), [slug]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Chargement…</div>;
  }

  if (!data?.sections?.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-slate-500">
        Cette page n'est pas encore publiée.
      </div>
    );
  }

  return <PageBlocks blocks={data.sections} />;
}
