import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { installHoverFx } from './lib/hoverFx';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AtafPage from './pages/AtafPage';
import MembresPage from './pages/MembresPage';
import ActualitesPage from './pages/ActualitesPage';
import EvenementsPage from './pages/EvenementsPage';
import ReglementationPage from './pages/ReglementationPage';
import AgencesPage from './pages/AgencesPage';
import RessourcesPage from './pages/RessourcesPage';
import ContactPage from './pages/ContactPage';
import EspaceMembresPage from './pages/EspaceMembresPage';
import MotDePasseOubliePage from './pages/MotDePasseOubliePage';
import ReinitialiserMotDePassePage from './pages/ReinitialiserMotDePassePage';

/**
 * Isole chaque page : une erreur de rendu n'affiche plus un écran blanc mais un
 * message, et le compteur `key` réinitialise l'erreur dès qu'on change de page.
 */
function PageBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();

  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

export default function App() {
  // Lueur qui suit la souris + inclinaison 3D des cartes (une seule fois).
  useEffect(() => {
    installHoverFx();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <PageBoundary>
          <Routes>
          <Route path="/" element={<HomePage />} />

          {/* L'ATAF */}
          <Route path="/ataf" element={<Navigate to="/ataf/presentation" replace />} />
          <Route path="/ataf/:section" element={<AtafPage />} />

          {/* Membres */}
          <Route path="/membres" element={<Navigate to="/membres/annuaire" replace />} />
          <Route path="/membres/:section" element={<MembresPage />} />

          {/* Actualités */}
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/actualites/:section" element={<ActualitesPage />} />

          {/* Événements */}
          <Route path="/evenements" element={<Navigate to="/evenements/agenda" replace />} />
          <Route path="/evenements/:section" element={<EvenementsPage />} />

          {/* Réglementation */}
          <Route path="/reglementation" element={<Navigate to="/reglementation/veille" replace />} />
          <Route path="/reglementation/:section" element={<ReglementationPage />} />

          {/* Agences agréées */}
          <Route path="/agences" element={<Navigate to="/agences/annuaire" replace />} />
          <Route path="/agences/:section" element={<AgencesPage />} />

          {/* Ressources */}
          <Route path="/ressources" element={<Navigate to="/ressources/documents" replace />} />
          <Route path="/ressources/:section" element={<RessourcesPage />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact/:section" element={<ContactPage />} />

          {/* Espace membres */}
          <Route path="/espace-membres" element={<EspaceMembresPage />} />
          <Route path="/espace-membres/mot-de-passe-oublie" element={<MotDePasseOubliePage />} />
          <Route path="/espace-membres/reinitialiser" element={<ReinitialiserMotDePassePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageBoundary>
      </Layout>
    </BrowserRouter>
  );
}
