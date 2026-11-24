import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../lib/api';

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L'envoi de l'email a échoué.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FC] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A4F8A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2B4E]">Mot de passe oublié</h1>
          <p className="text-slate-500 text-sm mt-1">Recevez un lien de réinitialisation par email</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✓</div>
              <h2 className="font-bold text-lg text-[#0D2B4E] mb-2">Demande envoyée</h2>
              <p className="text-sm text-slate-600 mb-5">
                Si un compte existe pour <strong>{email}</strong>, un email contenant le lien de réinitialisation vient d'être envoyé.
              </p>
              <Link to="/espace-membres" className="text-sm text-[#1A4F8A] font-medium hover:underline">Retour à la connexion →</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
                {sending ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          <Link to="/espace-membres" className="text-[#1A4F8A] hover:underline">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
