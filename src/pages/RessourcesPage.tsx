import { useParams } from 'react-router-dom';
import CmsPage from '../components/CmsPage';

export default function RessourcesPage() {
  const { section } = useParams<{ section?: string }>();

  return <CmsPage slug={`ressources-${section ?? 'documents'}`} prefix="/ressources" />;
}
