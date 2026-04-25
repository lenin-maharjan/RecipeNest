import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import useAuth from '../../hooks/useAuth';
import { getMyRecipesApi } from '../../api/recipe.api';
import { getBookmarksApi } from '../../api/bookmark.api';

const TINTS = ['#FAEBC0','#FDE8D5','#E4EFE7','#F0E8F0','#E8EEF5'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('My recipes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesRes, bookmarksRes] = await Promise.all([getMyRecipesApi(), getBookmarksApi()]);
        setMyRecipes(recipesRes.data.data.recipes);
        setBookmarks(bookmarksRes.data.data.bookmarks);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><div className="flex justify-center items-center py-20"><span className="inline-block w-5 h-5 border-2 border-paprika border-t-transparent rounded-full animate-spin" /></div></Layout>;

  const totalReviews = myRecipes.reduce((s, r) => s + (r.totalReviews || 0), 0);

  return (
    <Layout>
      <div className="page-enter">
        {/* Profile Header */}
        <div className="bg-white border-b border-linen">
          <div className="max-w-5xl mx-auto px-6">
            <div className="h-20 bg-gradient-to-r from-peach via-warm1 to-parchment rounded-none" />
            <div className="flex items-end gap-5 -mt-7 pb-6">
              <div className="w-14 h-14 rounded-xl bg-paprika text-white font-heading text-2xl flex items-center justify-center border-3 border-white shrink-0">
                {user?.name?.[0]}
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="font-heading text-2xl">{user?.name}</h1>
                  {user?.isVerifiedChef && <span className="badge-verified">✓ Verified</span>}
                </div>
                <div className="editorial-label">{user?.role === 'chef' ? 'Professional Chef' : 'Food Enthusiast'}</div>
              </div>
              <div className="flex gap-8 pb-1">
                {[{n: myRecipes.length, l:'Recipes'},{n: bookmarks.length, l:'Saved'},{n: totalReviews, l:'Reviews'}].map(s => (
                  <div key={s.l} className="text-center">
                    <div className="font-heading text-xl">{s.n}</div>
                    <div className="editorial-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-linen">
          <div className="max-w-5xl mx-auto px-6 flex">
            {['My recipes','Bookmarks','Reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-sm px-0 py-3.5 mr-7 border-b-2 transition-colors ${
                  activeTab===tab
                    ? 'border-paprika text-gray-900 font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
            <Link to="/recipes/add" className="ml-auto my-2 bg-paprika text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
              + New Recipe
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-12">
          {activeTab === 'My recipes' && (
            myRecipes.length === 0 ? (
              <div className="text-center py-20">
                <div className="font-heading text-6xl text-linen mb-3">—</div>
                <h3 className="font-heading text-xl">No recipes yet</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Start building your culinary portfolio.</p>
                <Link to="/recipes/add" className="inline-block mt-6 bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">Create first recipe</Link>
              </div>
            ) : (
              <div className="mt-4">
                {myRecipes.map((recipe, i) => (
                  <div key={recipe._id} className="flex gap-3 items-center px-6 py-4 border-b border-linen last:border-0">
                    <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center" style={{background: TINTS[i % TINTS.length]}}>
                      <span className="font-heading text-xl italic opacity-20">{recipe.category?.[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="editorial-label mb-0.5">{recipe.category}</div>
                      <div className="font-heading text-base truncate">{recipe.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">★ {Number(recipe.averageRating||0).toFixed(1)} · {recipe.totalReviews||0} reviews</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/recipes/edit/${recipe._id}`} className="text-xs border border-linen text-gray-500 px-3 py-1.5 rounded-lg hover:border-sand transition-colors">Edit</Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'Bookmarks' && (
            bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <div className="font-heading text-6xl text-linen mb-3">—</div>
                <h3 className="font-heading text-xl">No bookmarks yet</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Save your favorite recipes here.</p>
                <Link to="/recipes" className="inline-block mt-6 bg-paprika text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-800 transition-colors">Browse recipes</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {bookmarks.map((bm, idx) => {
                  if (!bm.recipe) return null;
                  return <RecipeCard key={bm._id} recipe={bm.recipe} index={idx} isBookmarked={true}
                    onBookmarkToggle={(id, isB) => { if (!isB) setBookmarks(p => p.filter(b => b.recipe && b.recipe._id !== id)); }} />;
                })}
              </div>
            )
          )}

          {activeTab === 'Reviews' && (
            <div className="text-center py-20">
              <div className="font-heading text-6xl text-linen mb-3">—</div>
              <h3 className="font-heading text-xl">Reviews</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Your recipes have received {totalReviews} reviews total.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;