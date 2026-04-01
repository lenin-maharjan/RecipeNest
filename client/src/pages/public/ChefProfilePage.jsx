// const ChefProfilePage = () => <div>Chef Profile Page</div>;
// export default ChefProfilePage;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import RecipeCard from '../../components/recipe/RecipeCard';
import Spinner from '../../components/common/Spinner';
import VerifiedBadge from '../../components/chef/VerifiedBadge';
import { getUserProfileApi } from '../../api/user.api';

const ChefProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfileApi(id);
        setProfile(res.data.data);
      } catch {
        toast.error('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <Spinner />;
  if (!profile) return null;

  const { user, recipes } = profile;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* profile header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-full bg-primary-500
                            flex items-center justify-center
                            text-white text-3xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                {user?.isVerifiedChef && <VerifiedBadge size="md" />}
              </div>
              <p className="text-gray-500 capitalize mb-3">
                {user?.role}
              </p>
              {user?.bio && (
                <p className="text-gray-700 max-w-lg">{user.bio}</p>
              )}
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">
                    {recipes?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">
                    {recipes?.reduce(
                      (sum, r) => sum + (r.totalReviews || 0), 0
                    ) || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">
                    {recipes?.length > 0
                      ? (
                          recipes.reduce(
                            (sum, r) => sum + (r.averageRating || 0), 0
                          ) / recipes.length
                        ).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* recipes */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recipes by {user?.name}
          </h2>
          {recipes?.length === 0 ? (
            <p className="text-gray-400 text-center py-12">
              No recipes published yet
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 gap-6">
              {recipes?.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ChefProfilePage;