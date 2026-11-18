import { useState } from 'react';
import { Link } from 'react-router-dom';
import { news, events } from '../data';

const stats = [
  { value: '75+', label: 'Années d\'existence' },
  { value: '40+', label: 'Membres actifs' },
  { value: '25', label: 'Pays représentés' },
  { value: '130+', label: 'Assemblées générales' },
];

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Séminaire & Formation',
    description: 'Des séminaires techniques réguliers sur la sécurité aérienne, la sûreté, le fret et la gestion des risques — ouverts aux experts des compagnies membres pour favoriser le partage de connaissances.',
    link: '/evenements/seminaires',
    linkLabel: 'Voir les séminaires',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Réglementation',
    description: 'Diffusion de l\'information aéropolitique afin de tenir les membres informés des évolutions techniques, réglementaires et politiques du transport aérien à l\'échelle internationale.',
    link: '/reglementation/veille',
    linkLabel: 'Accéder à la veille',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Représentativité',
    description: 'Représentation collective auprès des prestataires de services (ASECNA) et des instances internationales : OACI, IATA, AFRAA, aéroports francophones. Un réseau pour défendre les intérêts des membres.',
    link: '/ataf/missions',
    linkLabel: 'Nos missions',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: 'Rencontre',
    description: 'Une Assemblée Générale annuelle permettant aux PDG et hauts dirigeants d\'échanger sur les tendances du secteur, de définir les priorités et de consolider la coopération bilatérale au sein de la Francophonie.',
    link: '/evenements/assemblees',
    linkLabel: 'Assemblées générales',
  },
];

const objectives = [
  'Renforcer les avantages des compagnies membres dans l\'espace francophone',
  'Favoriser le partage d\'expériences et les transferts de technologie',
  'Encourager le dialogue entre les compagnies membres et leurs autorités de tutelle',
  'Faciliter les échanges entre présidents et dirigeants lors des Assemblées Générales',
  'Assurer la représentation collective auprès des instances internationales',
  'Contribuer au développement durable du transport aérien francophone',
];

const filters = ['Tous', 'ATAF', 'Membres', 'Réglementation', 'Événements'];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredNews = activeFilter === 'Tous'
    ? news.slice(0, 6)
    : news.filter((n) => n.category === activeFilter).slice(0, 6);

  const upcomingEvents = events.filter((e) => e.status === 'Ouvert').slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=900&fit=crop&auto=format"
          alt="Transport aérien francophone"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2B4E]/90 via-[#0D2B4E]/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#3BAA35]/20 border border-[#3BAA35]/30 text-[#4DC247] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DC247] animate-pulse" />
              CO₂ neutre — Engagement environnemental
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
              ATAF
            </h1>
            <p className="text-xl text-slate-200 mb-3 font-light" style={{ fontFamily: 'Instrument Serif, serif' }}>
              Au service du transport aérien francophone
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-lg">
              L'Association des Transporteurs Aériens Francophones fédère les grandes compagnies aériennes du monde francophone depuis 1950, favorisant le dialogue, le partage d'expériences et la représentation collective.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/ataf/presentation" className="px-6 py-3 bg-[#1A4F8A] text-white font-medium rounded-md hover:bg-[#2563A8] transition-colors">
                Découvrir l'ATAF
              </Link>
              <Link to="/espace-membres" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-md hover:bg-white/20 transition-colors backdrop-blur-sm">
                Espace membres
              </Link>
              <Link to="/evenements/agenda" className="px-6 py-3 bg-[#3BAA35] text-white font-medium rounded-md hover:bg-[#2D8A28] transition-colors">
                Nos événements
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs">
          <span>Défiler</span>
          <div className="w-px h-10 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1A4F8A] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'Instrument Serif, serif' }}>{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Services blocks */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Ce que nous faisons</p>
            <h2 className="text-3xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Nos services</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              L'ATAF offre à ses membres un cadre structuré d'échanges, de formation, de représentation et de rencontres au sein de la Francophonie aéronautique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className="group relative flex flex-col border border-slate-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A4F8A] to-[#3BAA35] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-xl bg-[#1A4F8A]/8 flex items-center justify-center text-[#1A4F8A] mb-5 group-hover:bg-[#1A4F8A] group-hover:text-white transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-bold text-[#0D2B4E] mb-3 text-lg" style={{ fontFamily: 'Instrument Serif, serif' }}>{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.description}</p>
                <Link
                  to={s.link}
                  className="mt-5 text-sm font-medium text-[#1A4F8A] group-hover:text-[#3BAA35] transition-colors flex items-center gap-1"
                >
                  {s.linkLabel}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Présentation & Objectifs */}
      <section className="py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Présentation */}
            <div>
              <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Qui sommes-nous</p>
              <h2 className="text-3xl font-bold text-[#0D2B4E] mb-5" style={{ fontFamily: 'Instrument Serif, serif' }}>
                Présentation de l'ATAF
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                L'ATAF — <strong>Association Internationale des Transporteurs Aériens Francophones</strong> — est une organisation internationale fondée en <strong>1950</strong>, rassemblant les principales compagnies aériennes du monde francophone ainsi que leurs partenaires industriels et institutionnels.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Elle constitue un cadre privilégié de dialogue, d'échange d'expériences et de représentation collective auprès des grandes instances internationales de l'aviation civile : ICAO, IATA, AFRAA, ASECNA et autres organisations multilatérales.
              </p>
              <div className="bg-white border-l-4 border-[#1A4F8A] rounded-r-xl p-5 shadow-sm">
                <p className="text-slate-700 italic text-sm leading-relaxed">
                  "L'ATAF est un espace de confiance où les dirigeants de l'aviation francophone construisent ensemble un secteur plus sûr, plus efficace et plus durable."
                </p>
                <p className="text-xs text-slate-400 mt-2">— Gnl Abdoulaye COULIBALY, Président de l'ATAF</p>
              </div>
              <div className="mt-6">
                <Link to="/ataf/presentation" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A4F8A] text-white rounded-md font-medium text-sm hover:bg-[#12376A] transition-colors">
                  En savoir plus sur l'ATAF
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

            {/* Objectifs */}
            <div>
              <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Nos priorités</p>
              <h2 className="text-3xl font-bold text-[#0D2B4E] mb-6" style={{ fontFamily: 'Instrument Serif, serif' }}>
                Objectifs de l'ATAF
              </h2>
              <ul className="space-y-4">
                {objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#1A4F8A] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed pt-1">{obj}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link to="/ataf/missions" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1A4F8A] text-[#1A4F8A] rounded-md font-medium text-sm hover:bg-[#1A4F8A] hover:text-white transition-colors">
                  Voir nos missions
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Dernières nouvelles</p>
              <h2 className="text-3xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Actualités</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                    activeFilter === f
                      ? 'bg-[#1A4F8A] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link key={item.id} to={`/actualites/${item.id}`} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#3BAA35] bg-[#3BAA35]/10 px-2 py-0.5 rounded-full">{item.category}</span>
                    <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 leading-snug group-hover:text-[#1A4F8A] transition-colors line-clamp-2" style={{ fontFamily: 'Instrument Serif, serif' }}>{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/actualites" className="inline-flex items-center gap-2 px-6 py-3 border border-[#1A4F8A] text-[#1A4F8A] rounded-md hover:bg-[#1A4F8A] hover:text-white transition-colors font-medium">
              Voir toutes les actualités
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-20 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">À venir</p>
              <h2 className="text-3xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Prochains événements</h2>
            </div>
            <Link to="/evenements/agenda" className="text-sm text-[#1A4F8A] font-medium hover:underline">Voir tout l'agenda →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev) => {
              const d = new Date(ev.date);
              return (
                <Link key={ev.id} to={`/evenements/${ev.id}`} className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-slate-100">
                  <div className="bg-[#1A4F8A] px-6 py-5 flex items-start gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white leading-none">{d.getDate()}</div>
                      <div className="text-blue-300 text-xs uppercase mt-1">{d.toLocaleDateString('fr-FR', { month: 'short' })}</div>
                      <div className="text-blue-300 text-xs">{d.getFullYear()}</div>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.type === 'Assemblée générale' ? 'bg-[#3BAA35]/20 text-[#4DC247]' : 'bg-white/10 text-white/70'}`}>{ev.type}</span>
                      <h3 className="text-white font-semibold mt-1.5 leading-snug" style={{ fontFamily: 'Instrument Serif, serif' }}>{ev.title}</h3>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      {ev.location}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-slate-400">{ev.registered}/{ev.maxParticipants} inscrits</div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3BAA35] rounded-full" style={{ width: `${(ev.registered / ev.maxParticipants) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Members logos */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Notre réseau</p>
            <h2 className="text-3xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Nos membres</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Air France', 'Air Algérie', 'Royal Air Maroc', 'Tunisair', 'Brussels Airlines', 'Air Sénégal', 'Air Côte d\'Ivoire', 'Corsair', 'Air Caraïbes', 'MEA'].map((m) => (
              <div key={m} className="px-5 py-2.5 border border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-[#1A4F8A] hover:text-[#1A4F8A] transition-colors cursor-pointer">
                {m}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/membres/annuaire" className="text-sm text-[#1A4F8A] font-medium hover:underline">Voir l'annuaire complet →</Link>
          </div>
        </div>
      </section>

      {/* Regulatory watch teaser */}
      <section className="py-20 bg-[#0D2B4E] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#4DC247] text-sm font-medium uppercase tracking-wider mb-3">Réglementation</p>
              <h2 className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
                Veille réglementaire du transport aérien
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                L'ATAF assure une veille permanente sur les évolutions réglementaires internationales affectant le transport aérien francophone. Nos équipes analysent et diffusent les textes de l'ICAO, de l'IATA, de l'AFRAA et des autorités nationales.
              </p>
              <Link to="/reglementation/veille" className="inline-flex items-center gap-2 px-6 py-3 bg-[#3BAA35] text-white rounded-md hover:bg-[#2D8A28] transition-colors font-medium">
                Accéder à la veille réglementaire
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Alerte', title: 'Nouvelles dispositions ICAO sur la sécurité des pistes', date: '10 sept. 2026' },
                { type: 'Texte', title: 'Règlement UE 2026/1234 – Transport aérien international', date: '20 août 2026' },
                { type: 'Analyse', title: 'Impact du carbone sur la compétitivité aérienne', date: '28 juil. 2026' },
              ].map((r) => (
                <div key={r.title} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${r.type === 'Alerte' ? 'bg-red-500/20 text-red-300' : r.type === 'Analyse' ? 'bg-[#3BAA35]/20 text-[#4DC247]' : 'bg-blue-500/20 text-blue-300'}`}>{r.type}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Restez informé</p>
          <h2 className="text-3xl font-bold text-[#0D2B4E] mb-3" style={{ fontFamily: 'Instrument Serif, serif' }}>Newsletter ATAF</h2>
          <p className="text-slate-500 mb-8">Recevez les informations ATAF directement dans votre boîte mail — actualités, événements, veille réglementaire.</p>
          {subscribed ? (
            <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 text-[#2D8A28] rounded-xl p-6 font-medium">
              ✓ Inscription confirmée ! Merci de votre intérêt pour l'ATAF.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
              />
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A]"
              />
              <button type="submit" className="px-6 py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors whitespace-nowrap">
                S'inscrire
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
