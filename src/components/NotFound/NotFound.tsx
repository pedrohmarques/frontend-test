import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusMessage from '../StatusMessage/StatusMessage';

interface NotFoundPageProps {
  title?: string;
  description?: string;
}

export default function NotFound({
  title = 'Page not found',
  description = 'The page you are looking for does not exist or was moved.',
}: NotFoundPageProps) {
  return (
    <main className="container">
      <StatusMessage
        icon={SearchX}
        title={title}
        description={description}
        headingLevel={1}
        actions={
          <Link to="/" className="button secondary">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to the blog
          </Link>
        }
      />
    </main>
  );
}