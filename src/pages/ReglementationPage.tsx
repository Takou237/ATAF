import { useParams } from 'react-router-dom';
import CmsPage from '../components/CmsPage';

export default function ReglementationPage() {
  const { section } = useParams<{ section?: string }>();

  return <CmsPage slug={`reglementation-${section ?? 'veille'}`} prefix="/reglementation" />;
}
