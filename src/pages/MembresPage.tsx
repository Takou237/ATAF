import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMembers, submitMembershipApplication } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
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
  { label: 'Annuaire des membres', path: '/membres/annuaire' },
  { label: 'Compagnies membres', path: '/membres/compagnies' },
  { label: 'Partenaires', path: '/membres/partenaires' },
  { label: 'Devenir membre', path: '/membres/adhesion' },
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

function Annuaire() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data: membersData, loading, error, reload } = useApi(
    () => getMembers({ search: debouncedSearch, country, category }),
    [debouncedSearch, country, category],
  );
  const { data: allMembersData } = useApi(getMembers);
  const members = membersData ?? [];
  const allMembers = allMembersData ?? [];

  const countries = [...new Set(allMembers.map((m) => m.country).filter(Boolean))].sort();
  const categories = [...new Set(allMembers.map((m) => m.category).filter(Boolean))].sort();

  const filtered = members.filter((m) => {
    const s = search.trim().toLowerCase();
    return (
      (!s || (m.name ?? '').toLowerCase().includes(s) || (m.city ?? '').toLowerCase().includes(s)) &&
      (!country || m.country === country) &&
      (!category || m.category === category)
    );
  });

  return (
    <>
      <PageHero title="Annuaire des membres" subtitle="Découvrez le réseau ATAF" breadcrumb="Membres / Annuaire" />
      <SubNav current="Annuaire des membres" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
          />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] bg-white">
            <option value="">Tous les pays</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] bg-white">
            <option value="">Toutes les catégories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement de l'annuaire…</p>}
        <p className="text-slate-500 text-sm mb-5">{filtered.length} membre{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1A4F8A]/10 flex items-center justify-center text-[#1A4F8A] font-bold text-sm">
                  {(m.name || '?').charAt(0)}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.category === 'Compagnie aérienne' ? 'bg-blue-50 text-blue-600' : m.category === 'Partenaire' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                  {m.category || 'Membre'}
                </span>
              </div>
              <h3 className="font-semibold text-[#0D2B4E] mb-1">{m.name}</h3>
              <p className="text-slate-400 text-sm">{[m.city, m.country].filter(Boolean).join(', ')}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Membre depuis {m.since || '—'}</span>
                {m.web && <a href={`https://${m.web}`} target="_blank" rel="noreferrer" className="text-[#1A4F8A] hover:underline">{m.web}</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Compagnies() {
  const { data: membersData, error, reload } = useApi(getMembers);
  const members = membersData ?? [];
  const airlines = members.filter((m) => m.category === 'Compagnie aérienne');
  return (
    <>
      <PageHero title="Compagnies membres" subtitle="Les compagnies aériennes du réseau ATAF" breadcrumb="Membres / Compagnies" />
      <SubNav current="Compagnies membres" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                {['Compagnie', 'Pays', 'Ville', 'Membre depuis', 'Site web'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {airlines.map((m, i) => (
                <tr key={m.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="py-3 px-4 font-medium text-[#0D2B4E]">{m.name}</td>
                  <td className="py-3 px-4 text-slate-500">{m.country}</td>
                  <td className="py-3 px-4 text-slate-500">{m.city}</td>
                  <td className="py-3 px-4 text-slate-500">{m.since}</td>
                  <td className="py-3 px-4">
                    {m.web && <a href={`https://${m.web}`} target="_blank" rel="noreferrer" className="text-[#1A4F8A] hover:underline">{m.web}</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Partenaires() {
  const { data: membersData, error, reload } = useApi(getMembers);
  const members = membersData ?? [];
  const partners = members.filter((m) => m.category !== 'Compagnie aérienne');
  return (
    <>
      <PageHero title="Partenaires" subtitle="Nos partenaires institutionnels et industriels" breadcrumb="Membres / Partenaires" />
      <SubNav current="Partenaires" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-6" />}
        <p className="text-slate-600 mb-8">L'ATAF rassemble autour de ses membres compagnies aériennes de nombreux partenaires industriels, institutionnels et de services qui contribuent au développement du transport aérien francophone.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((p) => (
            <div key={p.id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#3BAA35]/10 flex items-center justify-center text-[#3BAA35] font-bold">{(p.name || '?').charAt(0)}</div>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{p.category || 'Membre'}</span>
              </div>
              <h3 className="font-semibold text-[#0D2B4E] mb-1">{p.name}</h3>
              <p className="text-slate-400 text-sm">{[p.city, p.country].filter(Boolean).join(', ')}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">Membre depuis {p.since || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Adhesion() {
  const [form, setForm] = useState({ name: '', company: '', country: '', email: '', phone: '', category: '', message: '' });
  const [website, setWebsite] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await submitMembershipApplication({
        name: form.name,
        organisation: form.company,
        country: form.country,
        email: form.email,
        phone: form.phone || undefined,
        category: form.category || undefined,
        message: form.message || undefined,
        website,
      });
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L'envoi de la demande a échoué.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero title="Devenir membre" subtitle="Rejoignez le réseau ATAF" breadcrumb="Membres / Devenir membre" />
      <SubNav current="Devenir membre" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#0D2B4E] mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Rejoindre l'ATAF</h2>
            <p className="text-slate-600 leading-relaxed mb-6">Devenir membre de l'ATAF, c'est intégrer un réseau d'excellence du transport aérien francophone et bénéficier de nombreux avantages :</p>
            <ul className="space-y-3 mb-8">
              {['Accès à la veille réglementaire exclusive', 'Participation aux séminaires et formations', 'Représentation collective auprès des instances internationales', 'Networking avec les dirigeants du secteur', 'Accès à l\'espace membres sécurisé', 'Visibilité dans l\'annuaire ATAF'].map((a) => (
                <li key={a} className="flex items-start gap-3 text-slate-600 text-sm">
                  <svg className="w-5 h-5 text-[#3BAA35] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {a}
                </li>
              ))}
            </ul>
            <div className="bg-[#F8F9FC] rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold text-[#0D2B4E] mb-2">Catégories de membres</h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• Compagnies aériennes membres actifs</li>
                <li>• Organismes de navigation aérienne</li>
                <li>• Partenaires industriels et commerciaux</li>
                <li>• Membres associés et institutions</li>
              </ul>
            </div>
          </div>
          <div>
            {sent ? (
              <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 text-[#2D8A28] rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-bold text-lg mb-2">Demande envoyée !</h3>
                <p className="text-sm">Notre équipe prendra contact avec vous dans les meilleurs délais pour étudier votre demande d'adhésion.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-4">
                <Honeypot id="membership-website" value={website} onChange={setWebsite} />
                <h3 className="font-semibold text-[#0D2B4E]">Formulaire de demande d'adhésion</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organisation *</label>
                    <input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pays *</label>
                  <input type="text" required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie souhaitée *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] bg-white">
                    <option value="">Sélectionner...</option>
                    <option>Compagnie aérienne</option>
                    <option>Organisme de navigation aérienne</option>
                    <option>Partenaire industriel</option>
                    <option>Membre associé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] resize-none" placeholder="Présentez brièvement votre organisation et votre intérêt pour l'ATAF..." />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
                  {sending ? 'Envoi en cours…' : "Envoyer ma demande d'adhésion"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function MembresPage() {
  const { section } = useParams<{ section: string }>();
  if (section === 'compagnies') return <Compagnies />;
  if (section === 'partenaires') return <Partenaires />;
  if (section === 'adhesion') return <Adhesion />;
  return <Annuaire />;
}
