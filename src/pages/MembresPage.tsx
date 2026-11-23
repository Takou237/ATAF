import { useParams } from 'react-router-dom';
import CmsPage from '../components/CmsPage';

export default function MembresPage() {
  const { section } = useParams<{ section?: string }>();

  return <CmsPage slug={`membres-${section ?? 'annuaire'}`} prefix="/membres" />;
}
