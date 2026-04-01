import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              RecipeNest
            </h3>
            <p className="text-sm text-gray-400">
              Discover recipes from verified chefs and build your personal collection.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/recipes"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link to="/dashboard"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bookmarks"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Chef Portal */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Chefs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Join as Chef
                </Link>
              </li>
              <li>
                <Link to="/chef-dashboard"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Chef Portal
                </Link>
              </li>
              <li>
                <Link to="/recipes/add"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Add Your Recipe
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#"
                  className="text-gray-400 hover:text-primary-500
                             transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} RecipeNest. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-primary-500
                                   transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500
                                   transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500
                                   transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
