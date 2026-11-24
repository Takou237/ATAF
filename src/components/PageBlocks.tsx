import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  getEvents,
  getMembers,
  getNews,
  getToken,
  mediaUrl,
  type MemberItem,
  type PageBlock,
  type PageBlockItem,
} from '../lib/api';
import ContactForm from './ContactForm';
import NewsletterForm from './NewsletterForm';
import FeatureIcon from './FeatureIcon';
import { WIDGETS } from './widgets';

const DEFAULT_PERSON_IMAGE = '/avatar-default.svg';

const isExternal = (url: string): boolean => /^(https?:)?\/\//i.test(url) || /^(mailto|tel):/i.test(url);

function LinkButton({ href, label, variant = 'primary' }: { href: string; label: string; variant?: 'primary' | 'ghost' }) {
  const className =
    variant === 'primary'
      ? 'rounded-md bg-[#3BAA35] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2D8A28]'
      : 'rounded-md border border-white/20 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20';

  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {label}
    </Link>
  );
}

function ActionLink({ item }: { item: PageBlockItem }) {
  const label = item.title ?? '';
  const url = item.url ?? '';
  if (!label || !url) return null;

  return isExternal(url) ? (
    <a href={url} className="font-medium text-[#1A4F8A] hover:underline">
      {label}
    </a>
  ) : (
    <Link to={url} className="font-medium text-[#1A4F8A] hover:underline">
      {label}
    </Link>
  );
}

function BlockHeading({ eyebrow, title }: { eyebrow?: string; title?: string }) {
  if (!title) return null;

  return (
    <div className="mb-10 text-center">
      {eyebrow && <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#3BAA35]">{eyebrow}</p>}
      <h2 className="text-3xl font-bold text-[#0D2B4E]">
        {title}
      </h2>
    </div>
  );
}

function HeroBlock({ block }: { block: PageBlock }) {
  const buttons = block.items ?? [];

  if (block.image) {
    return (
      <section className="relative flex h-[92vh] min-h-[600px] items-center overflow-hidden">
        <img src={mediaUrl(block.image)} alt={block.title ?? ''} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2B4E]/90 via-[#0D2B4E]/70 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold leading-tight text-white md:text-6xl">
              {block.title}
            </h1>
            {block.subtitle && (
              <p className="mb-3 text-xl font-light text-slate-200">
                {block.subtitle}
              </p>
            )}
            {block.text && <p className="mb-10 max-w-lg text-base leading-relaxed text-slate-400">{block.text}</p>}
            <div className="flex flex-wrap gap-3">
              {buttons.map((item, index) => (
                <LinkButton
                  key={`${item.url}-${index}`}
                  href={item.url ?? '#'}
                  label={item.title ?? ''}
                  variant={index === 0 ? 'primary' : 'ghost'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#1A4F8A] py-14 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-4xl font-bold">
          {block.title}
        </h1>
        {block.subtitle && <p className="mt-2 text-lg text-blue-200">{block.subtitle}</p>}
        {block.text && <p className="mt-3 max-w-3xl text-blue-200">{block.text}</p>}
        {buttons.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {buttons.map((item, index) => (
              <LinkButton key={`${item.url}-${index}`} href={item.url ?? '#'} label={item.title ?? ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RichTextBlock({ block }: { block: PageBlock }) {
  if (!block.rich_text && !block.title) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-14">
      {block.title && (
        <h2 className="mb-6 text-2xl font-bold text-[#0D2B4E]">
          {block.title}
        </h2>
      )}
      <div
        className="leading-relaxed text-slate-600 [&_a]:text-[#1A4F8A] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A4F8A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#0D2B4E] [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-[#0D2B4E] [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: block.rich_text ?? '' }}
      />
    </section>
  );
}

function SplitBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        <article className="ataf-hover-card rounded-2xl border border-slate-100 bg-white p-8">
          <h2 className="ataf-hover-title mb-5 text-2xl font-bold text-[#0D2B4E]">{block.left_title}</h2>
          <div
            className="ataf-hover-text leading-relaxed text-slate-600 [&_a]:text-[#1A4F8A] [&_a]:underline [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: block.left_text ?? '' }}
          />
        </article>
        <article className="ataf-hover-card rounded-2xl border border-slate-100 bg-white p-8">
          <h2 className="ataf-hover-title mb-5 text-2xl font-bold text-[#0D2B4E]">{block.right_title}</h2>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex items-start gap-3">
                <span className="ataf-hover-icon mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A4F8A]/10 text-xs font-bold text-[#1A4F8A]">
                  {index + 1}
                </span>
                <span className="ataf-hover-text text-sm leading-relaxed text-slate-600">{item.title}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function FeaturesBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];
  // `variant: 'solid'` est utilisé pour les services de l'accueil : cartes
  // bleues, texte et icônes blancs, 2 par ligne puis 4 sur grand écran.
  const solid = block.variant === 'solid' || (!block.variant && (block.title ?? '').toLowerCase().includes('service'));

  if (solid) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <BlockHeading eyebrow={block.subtitle} title={block.title} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-xl bg-[#1A4F8A] p-6 text-white shadow-sm transition-colors hover:bg-[#12376A]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
                  <FeatureIcon name={item.title ?? item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <BlockHeading eyebrow={block.subtitle} title={block.title} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="ataf-hover-card rounded-xl border border-slate-100 bg-white p-6">
              <div className="ataf-hover-icon mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A4F8A]/8 text-[#1A4F8A]">
                <FeatureIcon name={item.title ?? item.icon} className="h-6 w-6" />
              </div>
              <h3 className="ataf-hover-title mb-2 font-semibold text-[#0D2B4E]">{item.title}</h3>
              <p className="ataf-hover-text text-sm leading-relaxed text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];

  return (
    <section className="bg-[#1A4F8A] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="text-center">
              <div className="mb-3 flex justify-center text-white">
                <FeatureIcon name={item.icon ?? ['calendar', 'exchange', 'governance', 'training'][index]} className="h-7 w-7" />
              </div>
              <div className="mb-1 text-4xl font-bold text-white">
                {item.value}
              </div>
              <div className="text-sm text-white/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {block.title && (
        <h2 className="mb-10 text-center text-2xl font-bold text-[#0D2B4E]">
          {block.title}
        </h2>
      )}
      <div className="relative">
        <div className="absolute bottom-0 left-6 top-0 w-px bg-[#E2E8F0]" />
        {items.map((item, index) => (
          <div key={`${item.year}-${index}`} className="relative mb-10 flex gap-8">
            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#1A4F8A] text-xs font-bold text-white shadow">
              {item.year}
            </div>
            <div className="pt-2">
              <div className="text-sm font-bold text-[#1A4F8A]">{item.year}</div>
              <h3 className="mt-0.5 font-semibold text-[#0D2B4E]">{item.title}</h3>
              {item.text && <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardsBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <BlockHeading eyebrow={block.subtitle} title={block.title} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const image = item.image || (block.avatar ? DEFAULT_PERSON_IMAGE : undefined);
          const body = (
            <>
              {image && (
                <img
                  src={mediaUrl(image)}
                  alt={item.title ?? ''}
                  className={`mb-4 object-cover ${block.avatar ? 'mx-auto h-28 w-28 rounded-full ring-4 ring-[#1A4F8A]/10' : 'h-40 w-full rounded-lg'}`}
                />
              )}
              <h3 className="ataf-hover-title font-bold text-[#0D2B4E]">{item.title}</h3>
              {item.subtitle && <div className="ataf-hover-link mt-1 text-sm font-medium text-[#1A4F8A]">{item.subtitle}</div>}
              {item.text && <p className="ataf-hover-text mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>}
              {item.download_url && (
                <a
                  href={mediaUrl(item.download_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="ataf-hover-link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1A4F8A] hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  <span aria-hidden="true">↓</span> Télécharger le PDF
                </a>
              )}
            </>
          );

          const className = 'ataf-hover-card rounded-xl border border-slate-100 bg-white p-6';

          if (item.url && isExternal(item.url)) {
            return (
              <a key={`${item.title}-${index}`} href={item.url} className={className}>
                {body}
              </a>
            );
          }

          if (item.url) {
            return (
              <Link key={`${item.title}-${index}`} to={item.url} className={className}>
                {body}
              </Link>
            );
          }

          return (
            <div key={`${item.title}-${index}`} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ListBlock({ block }: { block: PageBlock }) {
  const items = block.items ?? [];

  return (
    <section className="mx-auto max-w-4xl px-6 py-14">
      <BlockHeading eyebrow={block.subtitle} title={block.title} />
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="flex items-start gap-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A4F8A] text-xs font-bold text-white">
              {index + 1}
            </div>
            <div>
              <p className="pt-1 text-sm leading-relaxed text-slate-600">{item.title}</p>
              {item.text && <p className="mt-1 text-sm text-slate-500">{item.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaBlock({ block }: { block: PageBlock }) {
  return (
    <section className="bg-[#0D2B4E] py-16 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {block.title && (
          <h2 className="mb-4 text-3xl font-bold leading-tight">
            {block.title}
          </h2>
        )}
        {block.text && <p className="mb-8 leading-relaxed text-slate-400">{block.text}</p>}
        {block.button_label && block.button_url && <LinkButton href={block.button_url} label={block.button_label} />}
      </div>
    </section>
  );
}

function NewsletterBlock({ block }: { block: PageBlock }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {block.title && (
          <h2 className="mb-3 text-3xl font-bold text-[#0D2B4E]">
            {block.title}
          </h2>
        )}
        {block.text && <p className="mb-8 text-slate-500">{block.text}</p>}
        <NewsletterForm />
      </div>
    </section>
  );
}

function BlockAction({ label, url }: { label?: string; url?: string }) {
  if (!label || !url) return null;

  return (
    <div className="mt-10 text-center">
      <LinkButton href={url} label={label} />
    </div>
  );
}

function NewsGridBlock({ block }: { block: PageBlock }) {
  const limit = Number(block.limit) || 6;
  const { data, loading } = useApi(getNews);
  const items = (data ?? []).slice(0, limit);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <BlockHeading eyebrow={block.subtitle} title={block.title} />
        {loading && <p className="py-6 text-center text-slate-400">Chargement des actualités…</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/actualites/${item.id}`}
              className="ataf-hover-card group overflow-hidden rounded-xl border border-slate-100 bg-white"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-[#3BAA35]/10 px-2 py-0.5 text-xs font-medium text-[#3BAA35]">{item.category}</span>
                  <span className="text-xs text-slate-400">
                    {item.date ? new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </span>
                </div>
                <h3 className="ataf-hover-title font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[#1A4F8A]">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        <BlockAction label={block.button_label} url={block.button_url} />
      </div>
    </section>
  );
}

function EventsGridBlock({ block }: { block: PageBlock }) {
  const limit = Number(block.limit) || 3;
  const { data, loading } = useApi(getEvents);
  const items = (data ?? []).filter((event) => event.status === 'Ouvert').slice(0, limit);

  return (
    <section className="bg-[#F8F9FC] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <BlockHeading eyebrow={block.subtitle} title={block.title} />
        {loading && <p className="py-6 text-center text-slate-400">Chargement des événements…</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((event) => {
            const date = new Date(event.date);
            return (
              <Link
                key={event.id}
                to={`/evenements/${event.id}`}
                className="ataf-hover-card group overflow-hidden rounded-xl border border-slate-100 bg-white"
              >
                <div className="flex items-start gap-4 bg-[#1A4F8A] px-6 py-5">
                  <div className="text-center">
                    <div className="text-3xl font-bold leading-none text-white">{Number.isNaN(date.getTime()) ? '—' : date.getDate()}</div>
                    <div className="mt-1 text-xs uppercase text-blue-300">
                      {Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                    <div className="text-xs text-blue-300">{Number.isNaN(date.getTime()) ? '' : date.getFullYear()}</div>
                  </div>
                  <div>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">{event.type}</span>
                    <h3 className="mt-1.5 font-semibold leading-snug text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="mb-2 text-sm text-slate-500">{event.location}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {event.registered}/{event.maxParticipants} inscrits
                    </div>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">{event.status}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <BlockAction label={block.button_label} url={block.button_url} />
      </div>
    </section>
  );
}

function LogoRow({ items, reverse }: { items: MemberItem[]; reverse?: boolean }) {
  return (
    <div className="ataf-marquee">
      <div className={`ataf-marquee-track ${reverse ? 'ataf-marquee-reverse' : ''}`}>
        {[...items, ...items].map((member, index) => (
          <Link
            key={`${member.id}-${index}`}
            to="/membres/annuaire"
            title={member.name}
            aria-hidden={index >= items.length}
            className="ataf-logo mr-10 flex h-24 w-48 shrink-0 items-center justify-center md:mr-16 md:h-28 md:w-56"
          >
            {member.logo ? (
              <img
                src={member.logo}
                alt={member.name}
                loading="lazy"
                className="max-h-16 w-auto max-w-full object-contain md:max-h-20"
              />
            ) : (
              <span className="text-center text-sm font-medium text-slate-500">{member.name}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MembersStripBlock({ block }: { block: PageBlock }) {
  const limit = Number(block.limit) || 10;
  const { data } = useApi(getMembers);
  const items = (data ?? []).slice(0, limit);
  const middle = Math.ceil(items.length / 2);
  const rows = [items.slice(0, middle), items.slice(middle)].filter((row) => row.length > 0);

  return (
    <section className="relative overflow-hidden border-y border-slate-100 bg-gradient-to-b from-white via-[#F8F9FC] to-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <BlockHeading eyebrow={block.subtitle} title={block.title} />
      </div>
      <div className="mt-2 space-y-4">
        {rows.map((row, rowIndex) => (
          <LogoRow key={rowIndex} items={row} reverse={rowIndex % 2 === 1} />
        ))}
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <BlockAction label={block.button_label} url={block.button_url} />
      </div>
    </section>
  );
}

function ContactBlock({ block }: { block: PageBlock }) {
  const settings = useSiteSettings();
  const team = block.items ?? [];
  const email = settings.contact_email || 'sg@ataf.fr';
  const address = settings.contact_address || 'Secrétariat Général ATAF, Montreuil, France';

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-bold text-[#0D2B4E]">
              Secrétariat Général
            </h2>
            <div className="space-y-3 rounded-xl border border-slate-200 bg-[#F8F9FC] p-5">
              {team.map((person, index) => (
                <div key={`${person.title}-${index}`} className="border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-[#0D2B4E]">{person.title}</div>
                  <div className="text-xs text-slate-500">{person.subtitle}</div>
                  {person.url && (
                    <a href={person.url} className="text-xs text-[#1A4F8A] hover:underline">
                      {person.text || person.url.replace('mailto:', '')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#0D2B4E]">Adresse</h3>
            <p className="whitespace-pre-line text-sm text-slate-600">{address}</p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-[#0D2B4E]">Email général</h3>
            <a href={`mailto:${email}`} className="text-sm text-[#1A4F8A] hover:underline">
              {email}
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xl font-bold text-[#0D2B4E]">
            {block.title || 'Nous écrire'}
          </h2>
          {block.text && <p className="mb-6 text-slate-500">{block.text}</p>}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function WidgetBlock({ block }: { block: PageBlock }) {
  const Widget = block.widget ? WIDGETS[block.widget] : undefined;

  if (!Widget) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center text-sm text-slate-400">
        Bloc dynamique inconnu{block.widget ? ` : ${block.widget}` : ''}.
      </div>
    );
  }

  return <Widget block={block} />;
}

function BlockView({ block }: { block: PageBlock }) {
  if (block.members_only && !getToken()) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-[#1A4F8A]/15 bg-[#F8F9FC] p-10">
          <h2 className="text-2xl font-bold text-[#0D2B4E]">Contenu réservé aux membres</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">Connectez-vous à votre espace membres pour consulter ce contenu.</p>
          <Link to="/espace-membres" className="mt-6 inline-flex rounded-md bg-[#1A4F8A] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#12376A]">
            Accéder à l’espace membres
          </Link>
        </div>
      </section>
    );
  }

  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'rich_text':
      return <RichTextBlock block={block} />;
    case 'split':
      return <SplitBlock block={block} />;
    case 'features':
      return <FeaturesBlock block={block} />;
    case 'stats':
      return <StatsBlock block={block} />;
    case 'timeline':
      return <TimelineBlock block={block} />;
    case 'cards':
      return <CardsBlock block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'cta':
      return <CtaBlock block={block} />;
    case 'newsletter':
      return <NewsletterBlock block={block} />;
    case 'news_grid':
      return <NewsGridBlock block={block} />;
    case 'events_grid':
      return <EventsGridBlock block={block} />;
    case 'members_strip':
      return <MembersStripBlock block={block} />;
    case 'contact':
      return <ContactBlock block={block} />;
    case 'widget':
      return <WidgetBlock block={block} />;
    default:
      return null;
  }
}

export default function PageBlocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </>
  );
}
