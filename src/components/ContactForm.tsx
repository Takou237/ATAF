import { useState } from 'react';
import { submitContact } from '../lib/api';
import Honeypot from './Honeypot';

export default function ContactForm() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '', organisation: '' });
  const [website, setWebsite] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      await submitContact({
        name: form.nom,
        email: form.email,
        organisation: form.organisation || undefined,
        subject: form.sujet,
        message: form.message,
        website,
      });
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L'envoi du message a échoué.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-10 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-bold text-xl text-[#2D8A28] mb-2">Message envoyé !</h3>
        <p className="text-slate-600">
          Merci de nous avoir contactés. Notre équipe vous répondra dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5">
      <Honeypot id="contact-website" value={website} onChange={setWebsite} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet *</label>
          <input
            type="text"
            required
            value={form.nom}
            onChange={(event) => setForm({ ...form, nom: event.target.value })}
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Organisation</label>
        <input
          type="text"
          value={form.organisation}
          onChange={(event) => setForm({ ...form, organisation: event.target.value })}
          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Sujet *</label>
        <input
          type="text"
          required
          value={form.sujet}
          onChange={(event) => setForm({ ...form, sujet: event.target.value })}
          className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="w-full resize-none rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-md bg-[#1A4F8A] py-3 text-sm font-medium text-white transition-colors hover:bg-[#12376A] disabled:opacity-60"
      >
        {sending ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
