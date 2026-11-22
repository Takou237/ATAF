import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAgencies, submitAgencyApplication, verifyAgency, type AgencyItem } from '../lib/api';
import { useApi } from '../hooks/useApi';

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
  { label: 'Annuaire', path: '/agences/annuaire' },
  { label: 'Vérifier un agrément', path: '/agences/verification' },
  { label: 'Informations', path: '/agences/informations' },
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
  const { data: agenciesData, loading } = useApi(getAgencies);
  const agencies = agenciesData ?? [];

  const countries = [...new Set(agencies.map((a) => a.country))].sort();
  const filtered = agencies.filter((a) =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search)) &&
    (!country || a.country === country)
  );

  return (
    <>
      <PageHero title="Agences agréées ATAF" subtitle="Annuaire dynamique des agences de voyage agréées" breadcrumb="Agences agréées / Annuaire" />
      <SubNav current="Annuaire" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input type="text" placeholder="Rechercher par nom ou numéro d'agrément..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]">
            <option value="">Tous les pays</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {loading && <p className="text-slate-400 text-sm mb-4">Chargement des agences…</p>}
        <p className="text-slate-500 text-sm mb-5">{filtered.length} agence{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</p>
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {['Nom de l\'agence', 'N° d\'agrément', 'Pays', 'Ville', 'Statut'].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <td className="py-3 px-5 font-medium text-[#0D2B4E]">{a.name}</td>
                  <td className="py-3 px-5 font-mono text-xs text-[#1A4F8A] bg-blue-50/50">{a.code}</td>
                  <td className="py-3 px-5 text-slate-500">{a.country}</td>
                  <td className="py-3 px-5 text-slate-500">{a.city}</td>
                  <td className="py-3 px-5">
                    <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{a.status}</span>
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

function Verification() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<null | 'found' | 'not-found'>(null);
  const [foundAgency, setFoundAgency] = useState<AgencyItem | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(null);

    try {
      const response = await verifyAgency(code);
      setResult(response.found ? 'found' : 'not-found');
      setFoundAgency(response.agency);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'La vérification a échoué.');
      setResult(null);
      setFoundAgency(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <PageHero title="Vérifier un agrément ATAF" subtitle="Contrôlez la validité d'un agrément d'agence de voyage" breadcrumb="Agences agréées / Vérification" />
      <SubNav current="Vérifier un agrément" />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#1A4F8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-[#0D2B4E] mb-2">Vérification d'agrément</h2>
            <p className="text-slate-500 text-sm">Saisissez le numéro d'agrément ATAF de l'agence à vérifier.</p>
          </div>

          <form onSubmit={verify} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Ex: 03-20001-3"
              value={code}
              onChange={(e) => { setCode(e.target.value); setResult(null); }}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] font-mono"
            />
            <button type="submit" disabled={checking} className="px-6 py-3 bg-[#1A4F8A] text-white rounded-md text-sm font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
              {checking ? 'Vérification…' : 'Vérifier'}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {result === 'found' && foundAgency && (
            <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#3BAA35] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#2D8A28] text-lg">AGRÉMENT VALIDE</p>
                  <p className="text-sm text-[#3BAA35]">Agence reconnue par l'ATAF</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[['Nom', foundAgency.name], ['N° d\'agrément', foundAgency.code], ['Pays', foundAgency.country], ['Ville', foundAgency.city], ['Statut', foundAgency.status]].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-[#3BAA35]/20 last:border-0">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-medium text-[#0D2B4E]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result === 'not-found' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <p className="font-bold text-red-700 text-lg mb-1">AGRÉMENT NON TROUVÉ / À VÉRIFIER</p>
              <p className="text-red-600 text-sm">Le numéro saisi ne correspond à aucune agence agréée ATAF. Vérifiez la saisie ou contactez le secrétariat.</p>
              <a href="mailto:sg@ataf.fr" className="inline-block mt-3 text-sm text-[#1A4F8A] hover:underline">sg@ataf.fr</a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Cette vérification est basée exclusivement sur les données validées par l'ATAF. Pour toute contestation, contactez le <a href="mailto:sg@ataf.fr" className="text-[#1A4F8A] hover:underline">Secrétariat Général</a>.
        </p>
      </div>
    </>
  );
}

function Informations() {
  const [form, setForm] = useState({ nom: '', prenom: '', agence: '', pays: '', email: '', telephone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      await submitAgencyApplication({
        firstName: form.prenom,
        lastName: form.nom,
        agencyName: form.agence,
        country: form.pays,
        email: form.email,
        phone: form.telephone || undefined,
        message: form.message || undefined,
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
      <PageHero title="Informations sur l'agrément" subtitle="Obtenir un agrément ATAF pour votre agence" breadcrumb="Agences agréées / Informations" />
      <SubNav current="Informations" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#0D2B4E] mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Qu'est-ce que l'agrément ATAF ?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              L'agrément ATAF est une reconnaissance officielle accordée aux agences de voyage qui remplissent les conditions requises pour opérer en tant qu'intermédiaires agréés dans la distribution de billets des compagnies membres de l'ATAF.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              L'agrément garantit aux compagnies et aux passagers que l'agence répond aux standards professionnels et financiers de l'ATAF.
            </p>
            <h3 className="font-semibold text-[#0D2B4E] mb-3">Conditions d'obtention</h3>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              {['Être une agence de voyage légalement constituée', 'Justifier d\'une garantie financière suffisante', 'Disposer d\'un personnel qualifié', 'S\'engager à respecter le code déontologique ATAF', 'Avoir souscrit une assurance professionnelle'].map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#3BAA35] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {c}
                </li>
              ))}
            </ul>
            <div className="bg-[#F8F9FC] rounded-xl p-5 border border-slate-200">
              <p className="text-sm text-slate-600">Pour obtenir un dossier de demande d'agrément, contactez le Secrétariat Général :</p>
              <a href="mailto:sg@ataf.fr" className="text-[#1A4F8A] font-medium text-sm mt-1 block">sg@ataf.fr</a>
            </div>
          </div>
          <div>
            {sent ? (
              <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">✓</div>
                <h3 className="font-bold text-lg text-[#2D8A28] mb-2">Demande envoyée !</h3>
                <p className="text-sm text-slate-600">Notre secrétariat vous contactera sous 5 jours ouvrés avec un dossier de demande d'agrément.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-[#0D2B4E]">Demande de dossier d'agrément</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[['nom', 'Nom *'], ['prenom', 'Prénom *']].map(([f, l]) => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{l}</label>
                      <input type="text" required value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                    </div>
                  ))}
                </div>
                {[['agence', 'Nom de l\'agence *'], ['pays', 'Pays *'], ['email', 'Email *'], ['telephone', 'Téléphone']].map(([f, l]) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{l}</label>
                    <input type={f === 'email' ? 'email' : f === 'telephone' ? 'tel' : 'text'} required={l.includes('*')} value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] resize-none" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
                  {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AgencesPage() {
  const { section } = useParams<{ section?: string }>();
  if (section === 'verification') return <Verification />;
  if (section === 'informations') return <Informations />;
  return <Annuaire />;
}
