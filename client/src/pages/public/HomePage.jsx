import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import useAuth from '../../hooks/useAuth';
import RecipeCard from '../../components/recipe/RecipeCard';
import { useState, useEffect } from 'react';
import { getRecipesApi, getMyRecipesApi } from '../../api/recipe.api';
import { getBookmarksApi } from '../../api/bookmark.api';
import { getChefsApi } from '../../api/user.api';
import { getReviewCountApi } from '../../api/review.api';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [recipeCount, setRecipeCount] = useState(null);
  const [verifiedChefCount, setVerifiedChefCount] = useState(null);
  const [reviewCount, setReviewCount] = useState(null);
  const [savedCount, setSavedCount] = useState(null);
  const [myRecipeCount, setMyRecipeCount] = useState(null);
  const [myRecipeReviewCount, setMyRecipeReviewCount] = useState(null);
  const userRoleLabel = user?.role === 'admin'
    ? 'Admin'
    : user?.role === 'chef'
      ? 'Professional Chef'
      : 'Food Enthusiast';
  const primaryCta = user?.role === 'admin'
    ? { to: '/admin', label: 'Open admin panel' }
    : user?.role === 'chef'
      ? { to: '/chef-dashboard', label: 'Open chef dashboard' }
      : { to: '/dashboard', label: 'Open your dashboard' };
  const secondaryCta = isAuthenticated
    ? { to: '/recipes', label: 'Browse recipes' }
    : { to: '/register', label: 'Become a chef →' };

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [recipesRes, chefsRes, reviewsRes] = await Promise.all([
          getRecipesApi({ limit: 1000, page: 1 }),
          getChefsApi({ verifiedOnly: true, limit: 1, page: 1 }),
          getReviewCountApi(),
        ]);

        const allRecipes = recipesRes.data.data.recipes || [];
        setFeatured(allRecipes.slice(0, 3));
        setRecipeCount(recipesRes.data.data.pagination?.total || allRecipes.length || 0);
        setVerifiedChefCount(chefsRes.data.data.pagination?.total || 0);
        setReviewCount(reviewsRes.data.data.total || 0);

        if (isAuthenticated) {
          const [bookmarksRes, myRecipesRes] = await Promise.all([
            getBookmarksApi(),
            getMyRecipesApi(),
          ]);

          const bookmarks = bookmarksRes.data.data.bookmarks || [];
          const mine = myRecipesRes.data.data.recipes || [];
          setSavedCount(bookmarks.filter((b) => b.recipe).length);
          setMyRecipeCount(mine.length);
          setMyRecipeReviewCount(
            mine.reduce((sum, recipe) => sum + (Number(recipe.totalReviews) || 0), 0)
          );
        }
      } catch (err) {
        console.error('Failed to fetch featured recipes', err);
        setFeatured([]);
      }
    };
    fetchHomepageData();
  }, [isAuthenticated]);

  const formatStat = (value) => (value === null ? '0' : String(value));

  const statItems = isAuthenticated
    ? user?.role === 'admin'
      ? [
          { n: formatStat(recipeCount), l: 'Recipes' },
          { n: formatStat(verifiedChefCount), l: 'Verified chefs' },
          { n: formatStat(reviewCount), l: 'Reviews' },
        ]
      : [
          { n: formatStat(savedCount), l: 'Saved' },
          { n: formatStat(myRecipeCount), l: 'My recipes' },
          { n: formatStat(myRecipeReviewCount), l: 'Reviews on my recipes' },
        ]
    : [
        { n: formatStat(recipeCount), l: 'Recipes' },
        { n: formatStat(verifiedChefCount), l: 'Verified chefs' },
        { n: formatStat(reviewCount), l: 'Reviews' },
      ];

  return (
    <Layout>
      <div className="page-enter">
        <section className="bg-parchment relative overflow-hidden py-20 md:py-28">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-peach opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-36 w-52 h-52 rounded-full bg-warm1 opacity-40 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="inline-flex items-center gap-2 bg-peach rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-paprika" />
              <span className="text-xs font-medium text-red-900 tracking-wide">
                {isAuthenticated ? `${userRoleLabel} Portal · Est. 2026` : 'Chef Portal · Est. 2026'}
              </span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl max-w-2xl leading-tight mb-4">
              {isAuthenticated ? (
                <>
                  Welcome back, <em className="text-paprika" style={{fontStyle:'italic'}}>{user?.name}</em><br/>
                  your {userRoleLabel.toLowerCase()} space.
                </>
              ) : (
                <>
                  Where <em className="text-paprika" style={{fontStyle:'italic'}}>verified</em><br/>
                  chefs share craft.
                </>
              )}
            </h1>

            <p className="text-gray-500 text-base max-w-md leading-relaxed mb-8">
              {isAuthenticated
                ? 'Pick up where you left off, manage your recipes, and keep exploring dishes worth saving.'
                : 'A curated platform for professional chefs and food lovers. Browse, review, and save recipes that matter.'}
            </p>

            <div className="flex gap-3 mb-10">
              <Link to={primaryCta.to}
                className="bg-paprika text-white text-sm font-medium px-6 py-3
                  rounded-lg hover:bg-red-800 transition-colors">
                {primaryCta.label}
              </Link>
              <Link to={secondaryCta.to}
                className="bg-white border border-linen text-gray-800 text-sm px-6 py-3
                  rounded-lg hover:border-sand transition-colors">
                {secondaryCta.label}
              </Link>
            </div>

            <div className="flex gap-10 pt-8 border-t border-linen">
              {statItems.map((s) => (
                <div key={s.l}>
                  <div className="font-heading text-2xl text-gray-900">{s.n}</div>
                  <div className="editorial-label mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="editorial-label mb-1.5">Hand-picked</div>
              <h2 className="font-heading text-3xl">Featured recipes</h2>
            </div>
            <Link to="/recipes" className="text-sm text-paprika hover:underline underline-offset-4">
              View all →
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((r,i) => <RecipeCard key={r._id} recipe={r} index={i} />)}
            </div>
          ) : (
            <div className="border border-linen rounded-xl bg-white p-8 text-center text-sm text-gray-500">
              Featured recipes will appear here once the backend returns recipe data.
            </div>
          )}
        </section>

        <section className="bg-white border-y border-linen py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="editorial-label text-center mb-2">Simple by design</div>
            <h2 className="font-heading text-3xl text-center mb-14">How RecipeNest works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {n:'01', t:'Browse recipes',      d:'Explore a curated library from verified professional chefs.'},
                {n:'02', t:'Find your chef',      d:'Filter by verified status, cuisine type, rating, and author.'},
                {n:'03', t:'Review and save',     d:'Bookmark your favourites and leave honest ratings.'},
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <div className="font-heading text-3xl text-linen leading-none shrink-0 mt-1">{s.n}</div>
                  <div>
                    <h3 className="font-heading text-lg mb-2">{s.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;