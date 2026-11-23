import { useParams } from 'react-router-dom';
import CmsPage from '../components/CmsPage';

export default function AgencesPage() {
  const { section } = useParams<{ section?: string }>();

  return <CmsPage slug={`agences-${section ?? 'annuaire'}`} prefix="/agences" />;
}
