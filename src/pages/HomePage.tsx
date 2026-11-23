import { useApi } from '../hooks/useApi';
import { getPageContent } from '../lib/api';
import PageBlocks from '../components/PageBlocks';

export default function HomePage() {
  const { data, loading } = useApi(() => getPageContent('home'), []);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Chargement…</div>;
  }

  if (!data?.sections?.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-slate-500">
        Le contenu de cette page n'a pas encore été publié depuis le back-office.
      </div>
    );
  }

  return <PageBlocks blocks={data.sections} />;
}
