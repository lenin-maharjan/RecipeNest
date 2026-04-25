import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Footer = () => {
  const { isAuthenticated, isChef, isAdmin } = useAuth();
  return (
    <footer className="bg-white border-t border-linen mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-center md:text-left">
            <Link to="/" className="font-heading text-lg tracking-tight text-gray-900">
              Recipe<span className="text-paprika">·</span>Nest
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Discover recipes from verified chefs
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <Link to="/recipes" className="hover:text-paprika transition-colors">
              Recipes
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-paprika transition-colors">
                  Dashboard
                </Link>
                {isChef && (
                  <Link to="/chef-dashboard" className="hover:text-paprika transition-colors">
                    Chef Portal
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="hover:text-paprika transition-colors">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="hover:text-paprika transition-colors">
                  Join as Chef
                </Link>
                <Link to="/login" className="hover:text-paprika transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RecipeNest.
            Built with MERN stack.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;