import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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

          {/* Espace membres */}
          <Route path="/espace-membres" element={<EspaceMembresPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
