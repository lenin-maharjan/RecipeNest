// const HomePage = () => <div>Home Page</div>;
// export default HomePage;

import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import useAuth from '../../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* hero */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                        py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Recipes from{' '}
            <span className="text-primary-500">Verified Chefs</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Explore thousands of trusted recipes. Our verified chef badge
            system ensures you're cooking from the best.
          </p>
          <div className="flex items-center justify-center gap-4
                          flex-wrap">
            <Link to="/recipes" className="btn-primary text-base px-8 py-3">
              Browse Recipes
            </Link>
            {!isAuthenticated && (
              <Link to="/register"
                className="btn-secondary text-base px-8 py-3">
                Join as Chef
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why RecipeNest?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✓',
                title: 'Verified Chefs',
                desc: 'Every professional chef is verified by our admin team. Cook with confidence knowing the source.',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: '★',
                title: 'Rated Recipes',
                desc: 'Real reviews from real cooks. Filter by rating to find only the best recipes.',
                color: 'bg-yellow-100 text-yellow-600',
              },
              {
                icon: '♥',
                title: 'Save Favourites',
                desc: 'Bookmark any recipe and build your personal collection to cook later.',
                color: 'bg-red-100 text-red-600',
              },
            ].map((f) => (
              <div key={f.title} className="card p-8 text-center">
                <div className={`w-14 h-14 ${f.color} rounded-full flex
                  items-center justify-center text-2xl mx-auto mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-primary-500 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to share your recipes?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join thousands of chefs already sharing their best dishes.
            </p>
            <Link to="/register"
              className="bg-white text-primary-500 font-semibold
                         px-8 py-3 rounded-lg hover:bg-primary-50
                         transition-colors inline-block">
              Get Started Free
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default HomePage;