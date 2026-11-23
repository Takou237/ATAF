import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getPageContent } from '../lib/api';
import PageBlocks from '../components/PageBlocks';
import SectionTabs from '../components/SectionTabs';

export default function AtafPage() {
  const { section } = useParams<{ section: string }>();
  const slug = section ?? 'presentation';
  const { data, loading } = useApi(() => getPageContent(slug), [slug]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-400">Chargement…</div>;
  }

  if (!data?.sections?.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-slate-500">
        Cette page n'existe pas ou n'est pas encore publiée.
      </div>
    );
  }

  const [first, ...rest] = data.sections;

  return (
    <>
      {first && <PageBlocks blocks={[first]} />}
      <SectionTabs prefix="/ataf" />
      <PageBlocks blocks={rest} />
    </>
  );
}
