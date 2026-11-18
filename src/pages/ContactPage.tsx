import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '', organisation: '' });
  const [sent, setSent] = useState(false);

  return (
    <div>
      <div className="bg-[#1A4F8A] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-blue-300 text-sm mb-3">
            <Link to="/" className="hover:text-white">Accueil</Link> / Contact
          </div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Instrument Serif, serif' }}>Contact</h1>
          <p className="text-blue-200 mt-2">Secrétariat Général de l'ATAF</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contacts */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0D2B4E] mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>Secrétariat Général</h2>
              <div className="bg-[#F8F9FC] rounded-xl p-5 border border-slate-200 space-y-3">
                {[
                  { name: 'Patrick ALEXANDRE', role: 'Directeur Général', email: 'palexandre@ataf.fr' },
                  { name: 'Jean-Claude CROS', role: 'Directeur Général Adjoint', email: 'jccros@ataf.fr' },
                  { name: 'Claude THENEVIN', role: 'Trésorier', email: 'clthenevin@ataf.fr' },
                  { name: 'Sonia VALLON', role: 'Administration et Finances', email: 'svallon@ataf.fr' },
                  { name: 'Raphaël CROS', role: 'Communication', email: 'rcros@ataf.fr' },
                ].map((p) => (
                  <div key={p.name} className="pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                    <div className="font-medium text-[#0D2B4E] text-sm">{p.name}</div>
                    <div className="text-slate-500 text-xs">{p.role}</div>
                    <a href={`mailto:${p.email}`} className="text-[#1A4F8A] text-xs hover:underline">{p.email}</a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#0D2B4E] mb-3">Adresse</h3>
              <div className="flex items-start gap-3 text-slate-600 text-sm">
                <svg className="w-5 h-5 text-[#1A4F8A] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <div>
                  <p>Secrétariat Général ATAF</p>
                  <p>Montreuil, France</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#0D2B4E] mb-3">Email général</h3>
              <a href="mailto:sg@ataf.fr" className="flex items-center gap-2 text-[#1A4F8A] text-sm hover:underline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                sg@ataf.fr
              </a>
            </div>

            <div className="bg-[#0D2B4E] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-2">Agences agréées</h3>
              <p className="text-slate-400 text-sm mb-3">Pour toute question relative à l'agrément d'agences de voyage :</p>
              <Link to="/agences/informations" className="text-[#4DC247] text-sm hover:underline">Informations sur l'agrément →</Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#0D2B4E] mb-6" style={{ fontFamily: 'Instrument Serif, serif' }}>Nous écrire</h2>
            {sent ? (
              <div className="bg-[#3BAA35]/10 border border-[#3BAA35]/30 rounded-xl p-10 text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="font-bold text-xl text-[#2D8A28] mb-2">Message envoyé !</h3>
                <p className="text-slate-600">Merci de nous avoir contactés. Notre équipe vous répondra dans les meilleurs délais.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet *</label>
                    <input type="text" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] focus:ring-1 focus:ring-[#1A4F8A]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] focus:ring-1 focus:ring-[#1A4F8A]/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Organisation</label>
                  <input type="text" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] focus:ring-1 focus:ring-[#1A4F8A]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Sujet *</label>
                  <select required value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] focus:ring-1 focus:ring-[#1A4F8A]/20 bg-white">
                    <option value="">Sélectionner un sujet...</option>
                    <option>Adhésion / Devenir membre</option>
                    <option>Agences agréées</option>
                    <option>Événements et formations</option>
                    <option>Réglementation</option>
                    <option>Presse et communication</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={7}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Votre message..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[#1A4F8A] focus:ring-1 focus:ring-[#1A4F8A]/20 resize-none"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-[#1A4F8A] text-white rounded-md font-medium hover:bg-[#12376A] transition-colors text-sm">
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
