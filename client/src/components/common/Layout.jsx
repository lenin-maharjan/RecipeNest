import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBackTarget = () => {
    const { pathname } = location;

    if (pathname.startsWith('/recipes/edit/')) return '/dashboard';
    if (pathname === '/recipes/add') return '/dashboard';
    if (pathname.startsWith('/recipes/')) return '/recipes';
    if (pathname.startsWith('/chefs/')) return '/chefs';
    if (pathname.startsWith('/chef/')) return '/chefs';
    if (pathname === '/recipes' || pathname === '/chefs') return '/';
    if (
      pathname === '/dashboard' ||
      pathname === '/my-recipes' ||
      pathname === '/bookmarks' ||
      pathname === '/profile' ||
      pathname === '/chef-dashboard' ||
      pathname.startsWith('/admin')
    ) {
      return '/';
    }

    return null;
  };

  const backTarget = getBackTarget();
  const showBackButton = backTarget !== null;

  const handleBack = () => {
    if (backTarget) {
      navigate(backTarget);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <Navbar />
      <main className="flex-1">
        {showBackButton && (
          <div className="max-w-7xl mx-auto px-6 pt-5">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg leading-none">←</span>
              Back
            </button>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;