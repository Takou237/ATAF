import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent, getEvents, registerToEvent, type EventItem, type EventProgramItem } from '../lib/api';
import { useApi } from '../hooks/useApi';
import ApiErrorNotice from '../components/ApiErrorNotice';
import Honeypot from '../components/Honeypot';

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
  { label: 'Agenda', path: '/evenements/agenda' },
  { label: 'Séminaires', path: '/evenements/seminaires' },
  { label: 'Formations', path: '/evenements/formations' },
  { label: 'Assemblées générales', path: '/evenements/assemblees' },
  { label: 'Conférences', path: '/evenements/conferences' },
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

const statusColors: Record<string, string> = {
  Ouvert: 'bg-green-50 text-green-600',
  Complet: 'bg-orange-50 text-orange-600',
  Terminé: 'bg-slate-100 text-slate-500',
  Annulé: 'bg-red-50 text-red-500',
};

function EventCard({ ev }: { ev: EventItem }) {
  const d = new Date(ev.date);
  return (
    <Link to={`/evenements/${ev.id}`} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
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
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          {ev.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {ev.time}
        </div>
        <p className="text-sm text-slate-500 flex-1 line-clamp-2">{ev.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[ev.status]}`}>{ev.status}</span>
          <div className="text-xs text-slate-400">{ev.registered}/{ev.maxParticipants} inscrits</div>
        </div>
      </div>
    </Link>
  );
}

const defaultProgram: EventProgramItem[] = [
  { time: '09:00', title: 'Accueil et enregistrement des participants' },
  { time: '09:30', title: 'Ouverture officielle — Secrétaire Général ATAF' },
  { time: '10:00', title: 'Session 1 : Présentation thématique principale' },
  { time: '11:30', title: 'Pause-café et networking' },
  { time: '14:00', title: 'Session 2 : Ateliers et groupes de travail' },
  { time: '16:00', title: 'Conclusions et recommandations' },
  { time: '17:00', title: 'Clôture et cocktail de réseautage' },
];

function EventDetail({ id }: { id: number }) {
  const { data: eventsData, loading, error: listError, reload: reloadList } = useApi(getEvents);
  const events = eventsData ?? [];
  const ev = events.find((e) => e.id === id);
  const { data: detail, error: detailError, reload: reloadDetail } = useApi<
    EventItem & { programs: EventProgramItem[] } | null
  >(
    () => (ev ? getEvent(ev.slug) : Promise.resolve(null)),
    [ev?.slug],
  );

  const [form, setForm] = useState({ nom: '', prenom: '', fonction: '', entreprise: '', pays: '', telephone: '', email: '', participation: '', besoins: '' });
  const [website, setWebsite] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ev) return;

    setSending(true);
    setError(null);

    try {
      await registerToEvent(ev.slug, {
        lastName: form.nom,
        firstName: form.prenom,
        function: form.fonction,
        company: form.entreprise,
        country: form.pays,
        phone: form.telephone || undefined,
        email: form.email,
        participationType: form.participation || undefined,
        specialNeeds: form.besoins || undefined,
        website,
      });
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L'inscription a échoué.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Chargement de l'événement…</div>;
  if (listError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <ApiErrorNotice message={listError} onRetry={reloadList} />
      </div>
    );
  }
  if (!ev) return <div className="p-20 text-center text-slate-400">Événement non trouvé</div>;

  const d = new Date(ev.date);
  const programs = detail?.programs?.length ? detail.programs : defaultProgram;
  const filled = ev.maxParticipants > 0 ? Math.min(100, (ev.registered / ev.maxParticipants) * 100) : 0;

  return (
    <>
      <div className="bg-[#1A4F8A] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-blue-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Accueil</Link> / <Link to="/evenements/agenda" className="hover:text-white">Événements</Link> / {ev.type}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-medium bg-[#3BAA35] px-3 py-1 rounded-full">{ev.type}</span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[ev.status]}`}>{ev.status}</span>
          </div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Instrument Serif, serif' }}>{ev.title}</h1>
          <div className="flex flex-wrap gap-6 mt-4 text-blue-200 text-sm">
            <span>📅 {d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {ev.time}</span>
            <span>📍 {ev.location}</span>
            <span>👥 {ev.registered}/{ev.maxParticipants} inscrits</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#0D2B4E] mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{ev.description}</p>
            <p className="text-slate-600 leading-relaxed mb-6">Cet événement s'inscrit dans le cadre des activités annuelles de l'ATAF visant à renforcer les capacités des professionnels du transport aérien francophone et à favoriser les échanges entre les membres.</p>

            <h2 className="text-xl font-bold text-[#0D2B4E] mb-4">Programme</h2>
            <div className="space-y-3 mb-8">
              {programs.map((p) => (
                <div key={p.time} className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-[#1A4F8A] font-mono text-sm font-medium shrink-0 w-12">{p.time}</span>
                  <span className="text-slate-700 text-sm">{p.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-[#F8F9FC] rounded-xl p-6 border border-slate-200 sticky top-24">
              <h3 className="font-bold text-[#0D2B4E] mb-4">S'inscrire à cet événement</h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{ev.registered} inscrits</span>
                  <span>{ev.maxParticipants - ev.registered} places restantes</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full">
                  <div className="h-full bg-[#3BAA35] rounded-full transition-all" style={{ width: `${filled}%` }} />
                </div>
              </div>

              {detailError && (
                <ApiErrorNotice
                  message="Le programme détaillé est momentanément indisponible."
                  onRetry={reloadDetail}
                  className="mb-4"
                />
              )}
              {sent ? (
                <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/20 text-[#2D8A28] rounded-lg p-4 text-center text-sm">
                  ✓ Inscription enregistrée ! Un récapitulatif vous sera envoyé par email.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-3">
                  <Honeypot id="event-website" value={website} onChange={setWebsite} />
                  {[
                    { field: 'nom', label: 'Nom *', type: 'text' },
                    { field: 'prenom', label: 'Prénom *', type: 'text' },
                    { field: 'fonction', label: 'Fonction *', type: 'text' },
                    { field: 'entreprise', label: 'Entreprise *', type: 'text' },
                    { field: 'pays', label: 'Pays *', type: 'text' },
                    { field: 'telephone', label: 'Téléphone', type: 'tel' },
                    { field: 'email', label: 'Email *', type: 'email' },
                  ].map(({ field, label, type }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                      <input
                        type={type}
                        required={label.includes('*')}
                        value={form[field as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Type de participation</label>
                    <select value={form.participation} onChange={(e) => setForm({ ...form, participation: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] bg-white">
                      <option value="">Sélectionner...</option>
                      <option>Présentiel</option>
                      <option>En ligne (visioconférence)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Besoins particuliers</label>
                    <textarea rows={2} value={form.besoins} onChange={(e) => setForm({ ...form, besoins: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] resize-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={sending} className="w-full py-2.5 bg-[#1A4F8A] text-white rounded-md text-sm font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
                    {sending ? 'Inscription…' : "S'inscrire"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EventList({ type, title, navLabel }: { type?: string; title: string; navLabel: string }) {
  const { data: eventsData, loading, error, reload } = useApi(() => getEvents({ type }), [type]);
  const events = eventsData ?? [];
  const filtered = type ? events.filter((e) => e.type === type) : events;
  return (
    <>
      <PageHero title={title} breadcrumb={`Événements / ${navLabel}`} />
      <SubNav current={navLabel} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
        {loading ? (
          <p className="text-slate-400 text-center py-10">Chargement des événements…</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-10">Aucun événement prévu pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        )}
      </div>
    </>
  );
}

export default function EvenementsPage() {
  const { section } = useParams<{ section?: string }>();
  const { data: eventsData, loading, error, reload } = useApi(getEvents);
  const events = eventsData ?? [];

  const numericId = section && !isNaN(parseInt(section)) ? parseInt(section) : null;
  if (numericId) return <EventDetail id={numericId} />;

  if (section === 'seminaires') return <EventList type="Séminaire" title="Séminaires" navLabel="Séminaires" />;
  if (section === 'formations') return <EventList type="Formation" title="Formations" navLabel="Formations" />;
  if (section === 'assemblees') return <EventList type="Assemblée générale" title="Assemblées générales" navLabel="Assemblées générales" />;
  if (section === 'conferences') return <EventList type="Conférence" title="Conférences" navLabel="Conférences" />;

  return (
    <>
      <PageHero title="Agenda des événements" subtitle="Séminaires, formations, assemblées et conférences ATAF" breadcrumb="Événements / Agenda" />
      <SubNav current="Agenda" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
        {loading ? (
          <p className="text-slate-400 text-center py-10">Chargement des événements…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => <EventCard key={ev.id} ev={ev} />)}
          </div>
        )}
      </div>
    </>
  );
}
