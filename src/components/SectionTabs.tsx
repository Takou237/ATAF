import { Link, useLocation } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { parseNavigation, sectionNav } from '../lib/navigation';

export default function SectionTabs({ prefix }: { prefix: string }) {
  const settings = useSiteSettings();
  const items = sectionNav(parseNavigation(settings.nav_items), prefix);
  const location = useLocation();

  if (items.length === 0) return null;

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl overflow-x-auto px-6">
        {items.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap border-b-2 px-5 py-4 text-sm font-medium transition-colors ${
                active
                  ? 'border-[#1A4F8A] text-[#1A4F8A]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
