import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchMemberDocument,
  getEvents,
  getMyDocuments,
  getMyRegistrations,
  getNews,
  getToken,
  login,
  logout,
  me,
  setToken,
  updateProfile,
  type AuthUser,
  type DocumentItem,
  type EventItem,
} from '../lib/api';
import { useApi } from '../hooks/useApi';
import ApiErrorNotice from '../components/ApiErrorNotice';

function LoginForm({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      onLogin(await login(email, password));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Connexion impossible.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A4F8A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2B4E]">Espace Membres</h1>
          <p className="text-slate-500 text-sm mt-1">Accès réservé aux membres ATAF</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <Link to="/espace-membres/mot-de-passe-oublie" className="text-xs text-[#1A4F8A] hover:underline">Mot de passe oublié ?</Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={sending} className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors disabled:opacity-60">
              {sending ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-3">Pas encore membre ?</p>
            <Link to="/membres/adhesion" className="text-sm text-[#1A4F8A] font-medium hover:underline">Demander l'adhésion à l'ATAF →</Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Pour toute difficulté de connexion, contactez <a href="mailto:sg@ataf.fr" className="text-[#1A4F8A]">sg@ataf.fr</a>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ user: initialUser, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('accueil');
  const { data: eventsData, error: eventsError, reload: reloadEvents } = useApi(getEvents);
  const { data: newsData, error: newsError, reload: reloadNews } = useApi(getNews);
  const { data: myDocsData, error: myDocsError, reload: reloadMyDocs } = useApi(getMyDocuments);
  const { data: myRegsData, error: myRegsError, reload: reloadMyRegs } = useApi(getMyRegistrations);

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileOrg, setProfileOrg] = useState(user.organisation || '');
  const [profilePhone, setProfilePhone] = useState(user.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [documentAction, setDocumentAction] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await updateProfile({
        name: profileName,
        organisation: profileOrg,
        phone: profilePhone,
        password: newPassword || undefined,
      });
      setUser((prev) => ({ ...prev, ...res.user }));
      setProfileMessage('✅ Profil mis à jour avec succès.');
      setEditMode(false);
      setNewPassword('');
    } catch (err) {
      setProfileMessage(err instanceof Error ? err.message : 'Erreur lors de la mise à jour.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDocument = async (slug: string, mode: 'preview' | 'download') => {
    setDocumentAction(`${slug}:${mode}`);

    try {
      const blob = await fetchMemberDocument(slug);
      const objectUrl = URL.createObjectURL(blob);

      if (mode === 'preview') {
        window.open(objectUrl, '_blank', 'noopener,noreferrer');
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      } else {
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `${slug}.pdf`;
        link.click();
        URL.revokeObjectURL(objectUrl);
      }
    } catch (reason) {
      setProfileMessage(reason instanceof Error ? reason.message : 'Le document est indisponible.');
    } finally {
      setDocumentAction(null);
    }
  };

  const events = eventsData ?? [];
  const news = newsData ?? [];
  const memberDocs = myDocsData ?? [];
  const myRegistrations = myRegsData ?? [];
  const memberNews = news.filter((item) => item.isMembersOnly);

  const tabs = [
    { id: 'accueil', label: 'Tableau de bord' },
    { id: 'documents', label: `Documents ATAF (${memberDocs.length})` },
    { id: 'evenements', label: `Mes inscriptions (${myRegistrations.length})` },
    { id: 'actualites', label: 'Actualités réservées' },
    { id: 'profil', label: 'Mon profil' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-[#0D2B4E] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm">Bonjour</p>
            <h1 className="text-2xl font-bold mt-0.5">{user.name}</h1>
            <p className="text-blue-300 text-sm">
              {user.organisation || user.profile?.member?.name || 'Membre ATAF'}
              {user.profile?.member?.joined_year ? ` · Membre depuis ${user.profile.member.joined_year}` : ''}
            </p>
          </div>
          <button onClick={onLogout} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(eventsError || newsError) && (
          <div className="space-y-3 mb-6">
            {eventsError && <ApiErrorNotice message={eventsError} onRetry={reloadEvents} />}
            {newsError && <ApiErrorNotice message={newsError} onRetry={reloadNews} />}
          </div>
        )}
        {/* Tabs */}
        <div className="flex gap-0 border-b border-slate-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#1A4F8A] text-[#1A4F8A]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'accueil' && (
          <div>
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Inscriptions actives', value: String(myRegistrations.length), color: 'bg-blue-50 text-[#1A4F8A]' },
                { label: 'Documents disponibles', value: String(memberDocs.length), color: 'bg-green-50 text-[#3BAA35]' },
                { label: 'Actualités réservées', value: String(memberNews.length), color: 'bg-orange-50 text-orange-600' },
                { label: 'Statut adhésion', value: user.status === 'active' ? 'Actif' : 'En attente', color: 'bg-emerald-50 text-emerald-600' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4">
                  <div className={`text-2xl font-bold ${s.color.split(' ')[1]} mb-1`}>{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-100 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-[#0D2B4E] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full" />
                Notifications récentes
              </h2>
              <div className="space-y-3">
                {[
                  { text: '132ème Assemblée Générale — Inscriptions ouvertes', date: 'il y a 2j', type: 'event' },
                  { text: 'Nouveau document disponible : Procès-verbal CE Juin 2026', date: 'il y a 5j', type: 'doc' },
                  { text: 'Rappel : Cotisation 2027 à renouveler avant le 31/12/2026', date: 'il y a 1 sem.', type: 'info' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'event' ? 'bg-[#1A4F8A]' : n.type === 'doc' ? 'bg-[#3BAA35]' : 'bg-orange-400'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My upcoming events */}
            <div className="bg-white border border-slate-100 rounded-xl p-6">
              <h2 className="font-semibold text-[#0D2B4E] mb-4">Mes prochains événements</h2>
              <div className="space-y-3">
                {events.slice(0, 2).map((ev) => {
                  const d = new Date(ev.date);
                  return (
                    <div key={ev.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg">
                      <div className="w-10 h-10 bg-[#1A4F8A] rounded-lg flex flex-col items-center justify-center text-white">
                        <span className="text-sm font-bold leading-none">{d.getDate()}</span>
                        <span className="text-[10px] opacity-70">{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#0D2B4E]">{ev.title}</p>
                        <p className="text-xs text-slate-400">{ev.location}</p>
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{ev.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#0D2B4E]">Documents officiels & réservés</h2>
              <button onClick={reloadMyDocs} className="text-xs text-[#1A4F8A] hover:underline">Rafraîchir</button>
            </div>
            {myDocsError && <ApiErrorNotice message={myDocsError} onRetry={reloadMyDocs} />}
            {memberDocs.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-500 text-sm">
                Aucun document n'est disponible pour le moment.
              </div>
            ) : (
              <div className="space-y-3">
                {memberDocs.map((doc: DocumentItem) => (
                  <div key={doc.id || doc.code} className="ataf-hover-card flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
                    <div className="w-10 h-12 bg-red-50 rounded-md flex items-center justify-center shrink-0 border border-red-100">
                      <span className="text-red-500 text-xs font-bold">PDF</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0D2B4E] text-sm">{doc.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {doc.category || 'Document ATAF'} {doc.published_on ? `· ${doc.published_on}` : ''}
                      </p>
                    </div>
                    <a
                      href={doc.downloadUrl ?? '#'}
                      onClick={(event) => {
                        event.preventDefault();
                        void handleDocument(doc.slug, 'download');
                      }}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors"
                    >
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void handleDocument(doc.slug, 'preview');
                        }}
                        className="mr-2 underline underline-offset-2"
                      >
                        Aperçu
                      </span>
                      Télécharger
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'actualites' && (
          <div>
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Actualités réservées aux membres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {memberNews.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-500 text-sm col-span-2">
                  Aucune actualité confidentielle publiée pour l'instant.
                </div>
              ) : (
                memberNews.map((item) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <span className="text-xs font-medium text-[#3BAA35] bg-[#3BAA35]/10 px-2 py-0.5 rounded-full">{item.category}</span>
                    <h3 className="font-semibold text-[#0D2B4E] mt-2 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'evenements' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#0D2B4E]">Mes inscriptions aux événements</h2>
              <button onClick={reloadMyRegs} className="text-xs text-[#1A4F8A] hover:underline">Rafraîchir</button>
            </div>
            {myRegsError && <ApiErrorNotice message={myRegsError} onRetry={reloadMyRegs} />}
            {myRegistrations.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-slate-500 text-sm">
                <p className="mb-3">Vous n'êtes inscrit à aucun événement pour le moment.</p>
                <Link to="/evenements" className="inline-block px-4 py-2 bg-[#1A4F8A] text-white rounded-md text-xs font-medium hover:bg-[#12376A]">
                  Consulter les événements à venir →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRegistrations.map((reg: any) => {
                  const ev = reg.event;
                  const dateStr = ev?.date ? new Date(ev.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date à confirmer';
                  return (
                    <div key={reg.id} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-xl">
                      <div className="text-center shrink-0 w-16 bg-blue-50 py-2 rounded-lg">
                        <span className="text-xs text-[#1A4F8A] font-bold block">ATAF</span>
                        <span className="text-[10px] text-slate-400">Événement</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#0D2B4E]">{ev?.title || `Inscription #${reg.id}`}</h3>
                        <p className="text-sm text-slate-500">{ev?.location || 'Lieu communiqué ultérieurement'} · {dateStr}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full block mb-1">
                          {reg.status || 'Confirmé'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="max-w-2xl">
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Mon profil</h2>
            {profileMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-[#1A4F8A] rounded-lg text-sm">
                {profileMessage}
              </div>
            )}
            <div className="bg-white border border-slate-100 rounded-xl p-6">
              {!editMode ? (
                <div className="space-y-4">
                  {[
                    ['Nom', user.name],
                    ['Organisation', user.organisation || user.profile?.member?.name || '—'],
                    ['Email', user.email],
                    ['Téléphone', user.phone || user.profile?.phone || '—'],
                    ['Rôle', user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'Membre'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500 text-sm w-40 shrink-0">{label}</span>
                      <span className="font-medium text-[#0D2B4E] text-sm">{value}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-4 px-5 py-2.5 bg-[#1A4F8A] text-white rounded-md text-sm font-medium hover:bg-[#12376A] transition-colors"
                  >
                    Modifier mes informations
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organisation</label>
                    <input
                      type="text"
                      value={profileOrg}
                      onChange={(e) => setProfileOrg(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-2 bg-[#3BAA35] text-white rounded-md text-sm font-medium hover:bg-[#2D8A28] disabled:opacity-50"
                    >
                      {savingProfile ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EspaceMembresPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      setChecking(false);
      return;
    }

    let active = true;

    me()
      .then((current) => {
        if (active) setUser(current);
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Chargement de votre espace…</div>;
  }

  if (!user) return <LoginForm onLogin={setUser} />;

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return <Dashboard user={user} onLogout={handleLogout} />;
}
