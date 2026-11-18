import { useParams, Link } from 'react-router-dom';

const PageHero = ({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb: string }) => (
  <div className="bg-[#1A4F8A] text-white py-14">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-blue-300 text-sm mb-3">
        <Link to="/" className="hover:text-white">Accueil</Link> / {breadcrumb}
      </div>
      <h1 className="text-4xl font-bold" style={{ fontFamily: 'Instrument Serif, serif' }}>{title}</h1>
      {subtitle && <p className="text-blue-200 mt-2 text-lg">{subtitle}</p>}
    </div>
  </div>
);

const subNav = [
  { label: 'Présentation', path: '/ataf/presentation' },
  { label: 'Missions', path: '/ataf/missions' },
  { label: 'Histoire', path: '/ataf/histoire' },
  { label: 'Gouvernance', path: '/ataf/gouvernance' },
  { label: 'Organigramme', path: '/ataf/organigramme' },
  { label: 'Bureau / CA', path: '/ataf/bureau' },
];

function SubNav({ current }: { current: string }) {
  return (
    <div className="border-b border-slate-200 bg-white sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-6 flex gap-0 overflow-x-auto">
        {subNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              current === item.label
                ? 'border-[#1A4F8A] text-[#1A4F8A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const atafObjectives = [
  'Renforcer les avantages des compagnies membres dans l\'espace francophone',
  'Favoriser le partage d\'expériences et les transferts de technologie',
  'Encourager le dialogue entre les compagnies membres et leurs autorités de tutelle',
  'Faciliter les échanges entre présidents et dirigeants lors des Assemblées Générales',
  'Assurer la représentation collective auprès des instances internationales (ICAO, IATA, AFRAA, ASECNA)',
  'Contribuer au développement durable et responsable du transport aérien francophone',
];

function Presentation() {
  return (
    <>
      <PageHero title="L'ATAF" subtitle="Association des Transporteurs Aériens Francophones" breadcrumb="L'ATAF / Présentation" />
      <SubNav current="Présentation" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0D2B4E] mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Qui sommes-nous ?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              L'ATAF — <strong>Association Internationale des Transporteurs Aériens Francophones</strong> — est une organisation internationale fondée en <strong>1950</strong>, rassemblant les principales compagnies aériennes du monde francophone ainsi que leurs partenaires industriels, institutionnels et commerciaux.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Elle constitue un cadre privilégié de dialogue, d'échange d'expériences et de représentation collective auprès des grandes instances internationales de l'aviation civile : ICAO, IATA, AFRAA, ASECNA, et autres organisations multilatérales.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              L'ATAF regroupe aujourd'hui plus de 40 membres actifs — compagnies aériennes, organismes de navigation aérienne, industriels et partenaires — dans plus de 25 pays représentant l'ensemble de la Francophonie aéronautique.
            </p>
            <div className="bg-[#F8F9FC] border-l-4 border-[#1A4F8A] p-5 rounded-r-lg">
              <p className="text-slate-700 italic">
                "L'ATAF est bien plus qu'une association professionnelle : c'est un espace de confiance où les dirigeants de l'aviation francophone se retrouvent pour construire ensemble un secteur plus sûr, plus efficace et plus durable."
              </p>
              <p className="text-sm text-slate-500 mt-2">— Gnl Abdoulaye COULIBALY, Président de l'ATAF</p>
            </div>
          </div>
          <aside className="space-y-5">
            <div className="bg-[#0D2B4E] text-white rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-blue-300" style={{ fontFamily: 'Instrument Serif, serif' }}>Chiffres clés</h3>
              {[['1950', 'Année de création'], ['40+', 'Membres actifs'], ['25', 'Pays représentés'], ['130+', 'Assemblées générales']].map(([v, l]) => (
                <div key={l} className="flex justify-between py-3 border-b border-white/10 last:border-0">
                  <span className="text-slate-400 text-sm">{l}</span>
                  <span className="text-white font-bold">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/20 rounded-xl p-5">
              <h3 className="font-semibold text-[#2D8A28] mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>Engagement CO₂ neutre</h3>
              <p className="text-sm text-slate-600">L'ATAF s'engage dans la transition environnementale du transport aérien francophone.</p>
            </div>
          </aside>
        </div>

        {/* Objectifs section */}
        <div className="border-t border-slate-100 pt-14">
          <div className="text-center mb-10">
            <p className="text-[#3BAA35] text-sm font-medium uppercase tracking-wider mb-2">Nos priorités</p>
            <h2 className="text-2xl font-bold text-[#0D2B4E]" style={{ fontFamily: 'Instrument Serif, serif' }}>Objectifs de l'ATAF</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">L'ATAF agit selon plusieurs axes stratégiques pour servir ses membres et promouvoir l'excellence du transport aérien francophone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {atafObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full bg-[#1A4F8A] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pt-1">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Missions() {
  const missions = [
    { icon: '✈️', title: 'Dialogue et concertation', desc: 'Favoriser le dialogue entre compagnies membres, autorités et instances internationales.' },
    { icon: '🔗', title: 'Partage d\'expériences', desc: 'Promouvoir l\'échange d\'expériences et le transfert de technologies entre membres.' },
    { icon: '📋', title: 'Veille réglementaire', desc: 'Assurer la diffusion des évolutions réglementaires aéronautiques internationales.' },
    { icon: '🎓', title: 'Formation', desc: 'Organiser des séminaires et formations techniques pour les professionnels membres.' },
    { icon: '🤝', title: 'Représentation collective', desc: 'Représenter les intérêts des membres auprès d\'ASECNA, ICAO, IATA, AFRAA.' },
    { icon: '🌍', title: 'Développement francophone', desc: 'Contribuer au développement de l\'aviation civile dans l\'espace francophone.' },
  ];
  return (
    <>
      <PageHero title="Missions" subtitle="Les engagements de l'ATAF" breadcrumb="L'ATAF / Missions" />
      <SubNav current="Missions" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m) => (
            <div key={m.title} className="p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{m.icon}</div>
              <h3 className="font-semibold text-[#0D2B4E] mb-2">{m.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Histoire() {
  const timeline = [
    { year: '1950', title: 'Création de l\'ATAF', desc: 'Fondation au sein de l\'Union française, regroupant les premières compagnies aériennes francophones.' },
    { year: '1960', title: 'Internationalisation', desc: 'Extension du réseau aux nouvelles nations indépendantes francophones suite aux décolonisations.' },
    { year: '1975', title: '50ème Assemblée Générale', desc: 'Célébration du 50ème anniversaire de l\'association à Paris.' },
    { year: '1990', title: 'Expansion du réseau', desc: 'Intégration de nouveaux partenaires industriels et institutionnels du secteur aérien.' },
    { year: '2000', title: 'Ère numérique', desc: 'Modernisation des outils de communication et d\'échange entre membres.' },
    { year: '2020', title: 'Nouvelle direction', desc: 'Patrick Alexandre prend les fonctions de Secrétaire Général, anciennement DGA d\'Air France.' },
    { year: '2026', title: '132ème Assemblée Générale', desc: 'L\'ATAF tient sa 132ème Assemblée Générale à Ajaccio, Corse.' },
  ];
  return (
    <>
      <PageHero title="Histoire" subtitle="75 ans au service du transport aérien francophone" breadcrumb="L'ATAF / Histoire" />
      <SubNav current="Histoire" />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#E2E8F0]" />
          {timeline.map((item, i) => (
            <div key={item.year} className="relative flex gap-8 mb-10">
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-[#1A4F8A] flex items-center justify-center text-white text-xs font-bold text-center leading-tight border-4 border-white shadow">
                <span className="text-[10px]">{item.year.slice(2)}</span>
              </div>
              <div className="pt-2">
                <div className="text-[#1A4F8A] font-bold text-sm">{item.year}</div>
                <h3 className="font-semibold text-[#0D2B4E] mt-0.5">{item.title}</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Gouvernance() {
  return (
    <>
      <PageHero title="Gouvernance" subtitle="Structure et fonctionnement de l'ATAF" breadcrumb="L'ATAF / Gouvernance" />
      <SubNav current="Gouvernance" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: 'Assemblée Générale', desc: 'Instance souveraine réunissant tous les membres, tenue annuellement. Définit les orientations stratégiques et élit les instances dirigeantes.' },
            { title: 'Comité Exécutif', desc: 'Composé du Président, des Vice-Présidents et du Trésorier. Gère les affaires courantes et met en oeuvre les décisions de l\'AG.' },
            { title: 'Secrétariat Général', desc: 'Structure permanente basée à Montreuil, France. Assure le fonctionnement quotidien, la communication et la coordination avec les membres.' },
          ].map((g) => (
            <div key={g.title} className="bg-[#F8F9FC] rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-[#0D2B4E] mb-3">{g.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-[#0D2B4E] rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>Secrétariat Général</h3>
          <p className="text-slate-400 text-sm mb-6">Montreuil, France — 5 collaborateurs permanents</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Patrick ALEXANDRE', role: 'Directeur Général', email: 'palexandre@ataf.fr' },
              { name: 'Jean-Claude CROS', role: 'Directeur Général Adjoint', email: 'jccros@ataf.fr' },
              { name: 'Claude THENEVIN', role: 'Trésorier', email: 'clthenevin@ataf.fr' },
              { name: 'Sonia VALLON', role: 'Administration et Finances', email: 'svallon@ataf.fr' },
              { name: 'Raphaël CROS', role: 'Communication', email: 'rcros@ataf.fr' },
            ].map((p) => (
              <div key={p.name} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="font-semibold text-white">{p.name}</div>
                <div className="text-blue-300 text-sm">{p.role}</div>
                <a href={`mailto:${p.email}`} className="text-slate-400 text-xs hover:text-white mt-1 block">{p.email}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Organigramme() {
  return (
    <>
      <PageHero title="Organigramme" subtitle="Structure de direction de l'ATAF" breadcrumb="L'ATAF / Organigramme" />
      <SubNav current="Organigramme" />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-block bg-[#1A4F8A] text-white rounded-xl px-8 py-4 shadow-lg">
            <div className="font-bold text-lg">Gnl Abdoulaye COULIBALY</div>
            <div className="text-blue-200 text-sm">Président</div>
            <div className="text-blue-300 text-xs mt-1">Air Côte d'Ivoire</div>
          </div>
          <div className="w-px h-8 bg-slate-300 mx-auto mt-0" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { name: 'Mme Anne RIGAIL', role: '1ère Vice-Présidente', company: 'Air France' },
            { name: 'M. Pierre MURACCIOLE', role: 'Vice-Président', company: 'Air Corsica' },
            { name: 'M. Pascal de IZAGUIRRE', role: 'Vice-Président', company: 'Corsair' },
            { name: 'M. Mohamad EL-HOUT', role: 'Vice-Président', company: 'Middle East Airlines' },
            { name: 'M. Nyl Charles MORET-MBA', role: 'Vice-Président', company: 'FLY GABON' },
            { name: 'Mme Halima I. KHOUAJA', role: 'Vice-Présidente', company: 'TUNISAIR' },
          ].map((p) => (
            <div key={p.name} className="bg-white border border-slate-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#1A4F8A]/10 flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <div className="font-semibold text-[#0D2B4E] text-sm">{p.name}</div>
              <div className="text-[#1A4F8A] text-xs mt-0.5">{p.role}</div>
              <div className="text-slate-400 text-xs mt-0.5">{p.company}</div>
            </div>
          ))}
        </div>
        <div className="bg-[#F8F9FC] rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-[#0D2B4E] mb-4">Direction Générale</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'M. Patrick ALEXANDRE', role: 'Directeur Général' },
              { name: 'M. Jean-Claude CROS', role: 'Directeur Général Adjoint' },
              { name: 'M. Claude THENEVIN', role: 'Trésorier' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1A4F8A]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                </div>
                <div>
                  <div className="font-medium text-[#0D2B4E] text-sm">{p.name}</div>
                  <div className="text-slate-500 text-xs">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Bureau() {
  return (
    <>
      <PageHero title="Bureau / Conseil d'administration" subtitle="Les membres du bureau de l'ATAF" breadcrumb="L'ATAF / Bureau" />
      <SubNav current="Bureau / CA" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl">
          Le Bureau de l'ATAF est composé du Président, des Vice-Présidents et du Trésorier. Il se réunit régulièrement pour assurer la gestion de l'association entre les Assemblées Générales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Gnl Abdoulaye COULIBALY', role: 'Président', company: 'Air Côte d\'Ivoire', bio: 'Général Abdoulaye Coulibaly est à la tête de l\'ATAF en tant que Président. Il dirige également Air Côte d\'Ivoire, compagnie nationale de Côte d\'Ivoire.' },
            { name: 'Mme Anne RIGAIL', role: '1ère Vice-Présidente', company: 'Air France', bio: 'Anne Rigail est Directrice Générale d\'Air France et Vice-Présidente de l\'ATAF, représentant la principale compagnie aérienne française.' },
            { name: 'M. Pierre MURACCIOLE', role: 'Vice-Président', company: 'Air Corsica', bio: 'Pierre Muracciole dirige Air Corsica et représente les compagnies régionales françaises au sein du bureau de l\'ATAF.' },
            { name: 'M. Pascal de IZAGUIRRE', role: 'Vice-Président', company: 'Corsair', bio: 'Pascal de Izaguirre est à la tête de Corsair, compagnie française spécialisée dans les liaisons vers les DOM-TOM et l\'Afrique.' },
            { name: 'M. Mohamad EL-HOUT', role: 'Vice-Président', company: 'Middle East Airlines', bio: 'Mohamad El-Hout représente le Liban et les compagnies arabophones francophones au sein du bureau de l\'ATAF.' },
            { name: 'M. Claude THENEVIN', role: 'Trésorier', company: 'ATAF', bio: 'Claude Thenevin assure la gestion financière de l\'ATAF en sa qualité de Trésorier.' },
          ].map((p) => (
            <div key={p.name} className="flex gap-5 p-6 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-[#1A4F8A]/10 flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-[#1A4F8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0D2B4E]">{p.name}</h3>
                <div className="text-[#1A4F8A] text-sm font-medium">{p.role}</div>
                <div className="text-slate-400 text-xs mb-2">{p.company}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AtafPage() {
  const { section } = useParams<{ section: string }>();
  if (section === 'missions') return <Missions />;
  if (section === 'histoire') return <Histoire />;
  if (section === 'gouvernance') return <Gouvernance />;
  if (section === 'organigramme') return <Organigramme />;
  if (section === 'bureau') return <Bureau />;
  return <Presentation />;
}
