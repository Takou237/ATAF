import { useState } from 'react';
import { Link } from 'react-router-dom';
import { news, events, regulations } from '../data';

type View = 'login' | 'dashboard';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A4F8A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Espace Membres</h1>
          <p className="text-slate-500 text-sm mt-1">Accès réservé aux membres ATAF</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <a href="#" className="text-xs text-[#1A4F8A] hover:underline">Mot de passe oublié ?</a>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors">
              Se connecter
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

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('accueil');

  const tabs = [
    { id: 'accueil', label: 'Tableau de bord' },
    { id: 'documents', label: 'Documents ATAF' },
    { id: 'evenements', label: 'Mes événements' },
    { id: 'actualites', label: 'Actualités réservées' },
    { id: 'profil', label: 'Mon profil' },
  ];

  const memberDocs = [
    { title: 'Manuel de sûreté aérienne — Membres ATAF', size: '3.1 MB', date: 'juin 2026' },
    { title: 'Formation SMS — Support de cours', size: '8.2 MB', date: 'mai 2026' },
    { title: 'Comptes rendus — 131ème Assemblée Générale', size: '2.9 MB', date: 'nov. 2025' },
    { title: 'Procès-verbal — Comité Exécutif Juin 2026', size: '1.4 MB', date: 'juin 2026' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-[#0D2B4E] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm">Bonjour</p>
            <h1 className="text-2xl font-bold mt-0.5">Jean-Pierre DUPONT</h1>
            <p className="text-blue-300 text-sm">Air France · Membre actif depuis 1950</p>
          </div>
          <button onClick={onLogout} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
                { label: 'Inscriptions actives', value: '2', color: 'bg-blue-50 text-[#1A4F8A]' },
                { label: 'Documents disponibles', value: '12', color: 'bg-green-50 text-[#3BAA35]' },
                { label: 'Notifications', value: '3', color: 'bg-orange-50 text-orange-600' },
                { label: 'Statut adhésion', value: 'Actif', color: 'bg-emerald-50 text-emerald-600' },
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
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Documents réservés aux membres</h2>
            <div className="space-y-3">
              {memberDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="w-10 h-12 bg-red-50 rounded-md flex items-center justify-center shrink-0 border border-red-100">
                    <span className="text-red-400 text-xs font-bold">PDF</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0D2B4E] text-sm">{doc.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.size} · {doc.date}</p>
                  </div>
                  <button className="text-xs text-[#1A4F8A] border border-[#1A4F8A]/20 px-3 py-1.5 rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors">
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actualites' && (
          <div>
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Actualités réservées aux membres</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: 'Compte rendu confidentiel — Réunion IATA mai 2026', date: '2 juin 2026', category: 'ATAF' },
                { title: 'Note interne : évolutions tarifaires prévues pour 2027', date: '15 mai 2026', category: 'Réglementation' },
                { title: 'Rapport exclusif : analyse de la concurrence sur les routes francophones', date: '3 avril 2026', category: 'Études' },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <span className="text-xs font-medium text-[#3BAA35] bg-[#3BAA35]/10 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-semibold text-[#0D2B4E] mt-2 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'evenements' && (
          <div>
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Mes inscriptions aux événements</h2>
            <div className="space-y-4">
              {events.slice(0, 3).map((ev) => {
                const d = new Date(ev.date);
                return (
                  <div key={ev.id} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-xl">
                    <div className="text-center shrink-0 w-14">
                      <div className="text-2xl font-bold text-[#1A4F8A]">{d.getDate()}</div>
                      <div className="text-slate-400 text-xs">{d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#0D2B4E]">{ev.title}</h3>
                      <p className="text-sm text-slate-500">{ev.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full block mb-1">Inscrit</span>
                      <button className="text-xs text-red-500 hover:underline">Se désinscrire</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="max-w-2xl">
            <h2 className="font-semibold text-[#0D2B4E] mb-5">Mon profil</h2>
            <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-4">
              {[
                ['Nom', 'DUPONT'],
                ['Prénom', 'Jean-Pierre'],
                ['Fonction', 'Directeur des Relations Institutionnelles'],
                ['Organisation', 'Air France'],
                ['Pays', 'France'],
                ['Email', 'jp.dupont@airfrance.fr'],
                ['Téléphone', '+33 1 41 56 78 00'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 text-sm w-40 shrink-0">{label}</span>
                  <span className="font-medium text-[#0D2B4E] text-sm">{value}</span>
                </div>
              ))}
              <button className="mt-4 px-5 py-2.5 bg-[#1A4F8A] text-white rounded-md text-sm font-medium hover:bg-[#12376A] transition-colors">
                Modifier mes informations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EspaceMembresPage() {
  const [view, setView] = useState<View>('login');
  return view === 'login'
    ? <LoginForm onLogin={() => setView('dashboard')} />
    : <Dashboard onLogout={() => setView('login')} />;
}
