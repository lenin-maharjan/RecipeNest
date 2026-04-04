import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center
                        justify-between gap-4">

          <div className="text-center md:text-left">
            <Link to="/" className="text-xl font-bold text-primary-500">
              RecipeNest
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Discover recipes from verified chefs
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/recipes"
              className="hover:text-primary-500 transition-colors">
              Recipes
            </Link>
            <Link to="/register"
              className="hover:text-primary-500 transition-colors">
              Join as Chef
            </Link>
            <Link to="/login"
              className="hover:text-primary-500 transition-colors">
              Sign In
            </Link>
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