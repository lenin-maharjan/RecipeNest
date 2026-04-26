import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAdmin = user?.role === 'admin';
  const userProfession = user?.profession
    || (user?.role === 'chef'
      ? 'Professional Chef'
      : user?.role === 'admin'
        ? 'Admin'
        : 'Food Enthusiast');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setOpen(false);
  };

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-linen">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link to="/" className="font-heading text-xl tracking-tight text-gray-900 shrink-0">
          Recipe<span className="text-paprika">·</span>Nest
        </Link>

        <div className="flex gap-2 sm:gap-3 flex-1 items-center">
          {[
            { label: 'Home', to: '/' },
            { label: 'Recipes', to: '/recipes' },
            { label: 'Chefs', to: '/chefs' },
          ].map(item => (
            <NavLink key={item.label} to={item.to}
              className={({ isActive }) =>
                `text-sm px-3 py-1.5 rounded-md transition-colors ${isActive
                  ? 'bg-parchment text-gray-900 font-medium'
                  : 'text-stone-500 hover:text-gray-900 hover:bg-parchment/70'}`
              }>
              {item.label}
            </NavLink>
          ))}
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full border border-linen
                bg-white hover:bg-parchment transition-colors max-w-[220px] sm:max-w-none">
              <span className="w-9 h-9 rounded-full bg-peach text-paprika text-xs border border-linen
                font-medium flex items-center justify-center overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </span>
              <span className="hidden sm:flex min-w-0 flex-col items-start text-left leading-tight">
                <span className="text-sm text-gray-900 font-medium truncate w-full">{user.name}</span>
                <span className="text-[11px] text-gray-500 truncate w-full">{userProfession}</span>
              </span>
            </button>
            {open && (
              <div className="absolute right-0 top-10 bg-white border border-linen
                rounded-xl shadow-sm w-48 py-1 z-50">
                <div className="px-4 py-2 border-b border-linen sm:hidden">
                  <div className="text-sm text-gray-900 font-medium truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{userProfession}</div>
                </div>
                {[
                  { label: 'My profile', to: '/profile' },
                  { label: 'Dashboard', to: '/dashboard' },
                  { label: 'Bookmarks', to: '/bookmarks' },
                  ...(isAdmin ? [{ label: 'Admin panel', to: '/admin' }] : []),
                ].map(i => (
                  <Link key={i.label} to={i.to} onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-parchment">
                    {i.label}
                  </Link>
                ))}
                <div className="border-t border-linen my-1" />
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 shrink-0">
            <Link to="/login"
              className="text-sm text-gray-600 px-3 py-2 border border-linen
                rounded-md hover:border-sand hover:bg-parchment transition-colors">
              Sign in
            </Link>
            <Link to="/register"
              className="text-sm text-white bg-paprika px-4 py-2 rounded-md
                font-medium hover:bg-red-800 transition-colors">
              Join free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;