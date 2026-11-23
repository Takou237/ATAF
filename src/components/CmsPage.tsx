import { useApi } from '../hooks/useApi';
import { getPageContent } from '../lib/api';
import PageBlocks from './PageBlocks';
import SectionTabs from './SectionTabs';

/**
 * Page CMS : bannière + sous-menu (si `prefix`) + blocs éditables.
 * Tout le contenu vient de `pages.sections`, géré dans /admin.
 */
export default function CmsPage({ slug, prefix }: { slug: string; prefix?: string }) {
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
      {prefix && <SectionTabs prefix={prefix} />}
      <PageBlocks blocks={rest} />
    </>
  );
}
