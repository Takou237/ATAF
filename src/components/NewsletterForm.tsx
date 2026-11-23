import { useState } from 'react';
import { subscribeNewsletter } from '../lib/api';
import Honeypot from './Honeypot';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      await subscribeNewsletter(email, name || undefined, website);
      setStatus('sent');
      setEmail('');
      setName('');
      setWebsite('');
    } catch (reason) {
      setStatus('error');
      setError(reason instanceof Error ? reason.message : "L'inscription a échoué.");
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 text-[#2D8A28] rounded-xl p-6 font-medium">
        ✓ Inscription confirmée ! Merci de votre intérêt pour l'ATAF.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative mx-auto max-w-md">
      <Honeypot id="newsletter-website" value={website} onChange={setWebsite} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Votre nom (facultatif)"
          className="flex-1 rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="votre@email.com"
          className="flex-1 rounded-md border border-slate-200 px-4 py-3 text-sm focus:border-[#1A4F8A] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="whitespace-nowrap rounded-md bg-[#1A4F8A] px-6 py-3 font-medium text-white transition-colors hover:bg-[#12376A] disabled:opacity-60"
        >
          {status === 'sending' ? 'Envoi…' : "S'inscrire"}
        </button>
      </div>
      {status === 'error' && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </form>
  );
}
