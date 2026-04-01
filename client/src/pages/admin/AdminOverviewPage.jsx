// const AdminOverviewPage = () => <div>Admin Overview</div>;
// export default AdminOverviewPage;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Spinner from '../../components/common/Spinner';
import { getAdminStatsApi } from '../../api/admin.api';

const StatCard = ({ label, value, color, bg, to }) => (
  <Link to={to || '#'}
    className={`${bg} rounded-2xl p-6 block
                hover:opacity-90 transition-opacity`}>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-600 mt-1 font-medium">{label}</p>
  </Link>
);

const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStatsApi();
        setStats(res.data.data);
      } catch {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Panel
          </h1>
          <p className="text-gray-500 mt-1">
            Manage users, recipes and platform content
          </p>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers || 0}
            color="text-primary-500"
            bg="bg-primary-50"
            to="/admin/users"
          />
          <StatCard
            label="Total Recipes"
            value={stats?.totalRecipes || 0}
            color="text-blue-500"
            bg="bg-blue-50"
            to="/admin/recipes"
          />
          <StatCard
            label="Total Reviews"
            value={stats?.totalReviews || 0}
            color="text-green-500"
            bg="bg-green-50"
          />
          <StatCard
            label="Verified Chefs"
            value={stats?.verifiedChefs || 0}
            color="text-yellow-500"
            bg="bg-yellow-50"
            to="/admin/users"
          />
        </div>

        {/* quick actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/users"
              className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl
                                flex items-center justify-center
                                flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Manage Users
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View all users, verify chefs, change roles
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/admin/recipes"
              className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl
                                flex items-center justify-center
                                flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Moderate Recipes
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Publish, unpublish or delete any recipe
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default AdminOverviewPage;