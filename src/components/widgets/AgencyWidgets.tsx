import { useState } from 'react';
import { getAgencies, submitAgencyApplication, verifyAgency, type AgencyItem } from '../../lib/api';
import { useApi } from '../../hooks/useApi';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import ApiErrorNotice from '../ApiErrorNotice';
import Honeypot from '../Honeypot';

const inputClass =
  'w-full px-3 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]';

/* ------------------------------------------------------------------ */
/* Annuaire des agences agréées                                        */
/* ------------------------------------------------------------------ */

export function AgenciesDirectory() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const { data: agenciesData, loading, error, reload } = useApi(
    () => getAgencies({ search: debouncedSearch, country }),
    [debouncedSearch, country],
  );
  const { data: allAgenciesData } = useApi(getAgencies);
  const agencies = agenciesData ?? [];
  const allAgencies = allAgenciesData ?? [];

  const countries = [...new Set(allAgencies.map((a) => a.country).filter(Boolean))].sort();
  const filtered = agencies.filter((a) => {
    const s = search.trim().toLowerCase();
    return (
      (!s || (a.name ?? '').toLowerCase().includes(s) || (a.code ?? '').toLowerCase().includes(s)) &&
      (!country || a.country === country)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom ou numéro d'agrément..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:border-[#1A4F8A]"
        >
          <option value="">Tous les pays</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {error && <ApiErrorNotice message={error} onRetry={reload} className="mb-5" />}
      {loading && <p className="text-slate-400 text-sm mb-4">Chargement des agences…</p>}
      <p className="text-slate-500 text-sm mb-5">
        {filtered.length} agence{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
      </p>
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["Nom de l'agence", "N° d'agrément", 'Pays', 'Ville', 'Statut'].map((h) => (
                <th key={h} className="text-left py-3 px-5 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr
                key={a.id}
                className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
              >
                <td className="py-3 px-5 font-medium text-[#0D2B4E]">{a.name}</td>
                <td className="py-3 px-5 font-mono text-xs text-[#1A4F8A] bg-blue-50/50">{a.code || '—'}</td>
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
  );
}

/* ------------------------------------------------------------------ */
/* Vérificateur d'agrément                                             */
/* ------------------------------------------------------------------ */

export function AgencyVerify() {
  const settings = useSiteSettings();
  const email = settings.contact_email || 'sg@ataf.fr';
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
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1A4F8A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0D2B4E] mb-2">Vérification d'agrément</h2>
          <p className="text-slate-500 text-sm">Saisissez le numéro d'agrément ATAF de l'agence à vérifier.</p>
        </div>

        <form onSubmit={verify} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Ex: 03-20001-3"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setResult(null);
            }}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] font-mono"
          />
          <button
            type="submit"
            disabled={checking}
            className="px-6 py-3 bg-[#1A4F8A] text-white rounded-md text-sm font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60"
          >
            {checking ? 'Vérification…' : 'Vérifier'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {result === 'found' && foundAgency && (
          <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#3BAA35] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#2D8A28] text-lg">AGRÉMENT VALIDE</p>
                <p className="text-sm text-[#3BAA35]">Agence reconnue par l'ATAF</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Nom', foundAgency.name],
                ["N° d'agrément", foundAgency.code],
                ['Pays', foundAgency.country],
                ['Ville', foundAgency.city],
                ['Statut', foundAgency.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-[#3BAA35]/20 last:border-0">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-[#0D2B4E]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result === 'not-found' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="font-bold text-red-700 text-lg mb-1">AGRÉMENT NON TROUVÉ / À VÉRIFIER</p>
            <p className="text-red-600 text-sm">
              Le numéro saisi ne correspond à aucune agence agréée ATAF. Vérifiez la saisie ou contactez le secrétariat.
            </p>
            <a href={`mailto:${email}`} className="inline-block mt-3 text-sm text-[#1A4F8A] hover:underline">{email}</a>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Cette vérification est basée exclusivement sur les données validées par l'ATAF. Pour toute contestation, contactez le{' '}
        <a href={`mailto:${email}`} className="text-[#1A4F8A] hover:underline">Secrétariat Général</a>.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Demande de dossier d'agrément                                       */
/* ------------------------------------------------------------------ */

export function AgencyForm() {
  const settings = useSiteSettings();
  const email = settings.contact_email || 'sg@ataf.fr';
  const [form, setForm] = useState({ nom: '', prenom: '', agence: '', pays: '', email: '', telephone: '', message: '' });
  const [website, setWebsite] = useState('');
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
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div>
        {sent ? (
          <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-bold text-lg text-[#2D8A28] mb-2">Demande envoyée !</h3>
            <p className="text-sm text-slate-600">
              Notre secrétariat vous contactera sous 5 jours ouvrés avec un dossier de demande d'agrément.
            </p>
            <a href={`mailto:${email}`} className="inline-block mt-3 text-sm text-[#1A4F8A] hover:underline">{email}</a>
          </div>
        ) : (
            <form onSubmit={handleSubmit} className="relative space-y-4">
              <Honeypot id="agency-website" value={website} onChange={setWebsite} />
              <h3 className="font-semibold text-[#0D2B4E]">Demande de dossier d'agrément</h3>
              <div className="grid grid-cols-2 gap-4">
                {[['nom', 'Nom *'], ['prenom', 'Prénom *']].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                    <input
                      type="text"
                      required
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              {[['agence', "Nom de l'agence *"], ['pays', 'Pays *'], ['email', 'Email *'], ['telephone', 'Téléphone']].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type={field === 'email' ? 'email' : field === 'telephone' ? 'tel' : 'text'}
                    required={label.includes('*')}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60"
              >
                {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </button>
            </form>
          )}
      </div>
    </div>
  );
}
