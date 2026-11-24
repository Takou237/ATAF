import { useApi } from '../hooks/useApi';
import { getPageContent } from '../lib/api';
import PageBlocks from '../components/PageBlocks';
import type { PageBlock } from '../lib/api';

function organizeHomeSections(sections: PageBlock[]): PageBlock[] {
  const presentation = sections.find((block) => block.type === 'rich_text' && block.title?.toLowerCase().includes('présentation'));
  const objectives = sections.find((block) => block.type === 'list' && block.title?.toLowerCase().includes('objectifs'));
  const services = sections.find((block) => block.type === 'features' && block.title?.toLowerCase().includes('service'));

  if (!presentation || !objectives || !services) return sections;

  const split: PageBlock = {
    type: 'split',
    left_title: presentation.title,
    left_text: presentation.rich_text,
    right_title: objectives.title,
    items: objectives.items,
  };
  const remaining = sections.filter((block) => block !== presentation && block !== objectives && block !== services);
  const statsIndex = remaining.findIndex((block) => block.type === 'stats');
  const insertAt = statsIndex >= 0 ? statsIndex + 1 : 1;

  remaining.splice(insertAt, 0, split, { ...services, subtitle: undefined });

  return remaining;
}

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

  return <PageBlocks blocks={organizeHomeSections(data.sections)} />;
}
