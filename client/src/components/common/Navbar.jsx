import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isChef, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-500">
              RecipeNest
            </span>
          </Link>

          {/* desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/recipes"
              className="text-gray-600 hover:text-primary-500
                         font-medium transition-colors"
            >
              Recipes
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-500
                             font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/bookmarks"
                  className="text-gray-600 hover:text-primary-500
                             font-medium transition-colors"
                >
                  Bookmarks
                </Link>
              </>
            )}

            {isChef && (
              <Link
                to="/chef-dashboard"
                className="text-gray-600 hover:text-primary-500
                           font-medium transition-colors"
              >
                Chef Portal
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-primary-500
                           font-medium transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* user avatar */}
                <Link to="/profile" className="flex items-center gap-2
                  hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary-500
                    flex items-center justify-center text-white
                    text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500
                             transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500
                       hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>

        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white
                        px-4 py-4 space-y-3">
          <Link to="/recipes" onClick={() => setMenuOpen(false)}
            className="block text-gray-600 font-medium py-2">
            Recipes
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                className="block text-gray-600 font-medium py-2">
                Dashboard
              </Link>
              <Link to="/bookmarks" onClick={() => setMenuOpen(false)}
                className="block text-gray-600 font-medium py-2">
                Bookmarks
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className="block text-gray-600 font-medium py-2">
                Profile
              </Link>
            </>
          )}
          {isChef && (
            <Link to="/chef-dashboard" onClick={() => setMenuOpen(false)}
              className="block text-gray-600 font-medium py-2">
              Chef Portal
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="block text-gray-600 font-medium py-2">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout}
              className="block w-full text-left text-red-500
                         font-medium py-2">
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="btn-secondary text-center">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="btn-primary text-center">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;