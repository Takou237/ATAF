import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../lib/api';

export default function ReinitialiserMotDePassePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSending(true);
    setError(null);

    try {
      await resetPassword({ token, email, password, passwordConfirmation: confirmation });
      setDone(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'La réinitialisation a échoué.');
    } finally {
      setSending(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FC] px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-bold text-[#0D2B4E] mb-3">Lien invalide</h1>
          <p className="text-sm text-slate-600 mb-5">Ce lien de réinitialisation est incomplet ou expiré.</p>
          <Link to="/espace-membres/mot-de-passe-oublie" className="text-sm text-[#1A4F8A] font-medium hover:underline">Demander un nouveau lien →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FC] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Nouveau mot de passe</h1>
          <p className="text-slate-500 text-sm mt-1">Choisissez un mot de passe d'au moins 8 caractères</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {done ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✓</div>
              <h2 className="font-bold text-lg text-[#0D2B4E] mb-2">Mot de passe réinitialisé</h2>
              <p className="text-sm text-slate-600 mb-5">Vous pouvez désormais vous connecter avec votre nouveau mot de passe.</p>
              <Link to="/espace-membres" className="text-sm text-[#1A4F8A] font-medium hover:underline">Se connecter →</Link>
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
                {sending ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
