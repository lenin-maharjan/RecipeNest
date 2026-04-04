import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center
                      justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            Page not found
          </h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <Link to="/recipes" className="btn-secondary">
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;