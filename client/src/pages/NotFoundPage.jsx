import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="page-enter min-h-screen bg-parchment flex items-center justify-center px-4">
        <div className="text-center py-20">
          <div className="font-heading text-6xl text-linen mb-3">—</div>
          <h1 className="font-heading text-5xl mb-2">404</h1>
          <h2 className="font-heading text-xl">Page not found</h2>
          <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link to="/" className="bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">
              Go Home
            </Link>
            <Link to="/recipes" className="border border-linen text-gray-700 text-sm px-5 py-2.5 rounded-lg hover:bg-parchment transition-colors">
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;