import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import {
  getAllUsersApi,
  toggleVerifyChefApi,
  changeUserRoleApi,
  deleteUserApi,
} from '../../api/admin.api';
import useAuth from '../../hooks/useAuth';

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-700',
  chef: 'bg-orange-100 text-orange-700',
  user: 'bg-gray-100 text-gray-700',
};

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllUsersApi({
        page,
        limit: 15,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
      });
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pagination.pages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerify = async (userId) => {
    try {
      const res = await toggleVerifyChefApi(userId);
      const { isVerifiedChef } = res.data.data.user;
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isVerifiedChef } : u
        )
      );
      toast.success(
        isVerifiedChef ? 'Chef verified!' : 'Verification removed'
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await changeUserRoleApi(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u))
      );
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(
      'Delete this user and all their data? This cannot be undone.'
    )) return;
    try {
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            {users.length} users shown
          </p>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field flex-1 min-w-48"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="input-field w-auto"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="chef">Chef</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* table */}
        {loading ? (
          <Spinner fullScreen={false} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found"
            message="Try adjusting your search filters"
          />
        ) : (
          <>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider hidden
                                     sm:table-cell">
                        Joined
                      </th>
                      <th className="text-left px-4 py-3 text-xs
                                     font-semibold text-gray-500
                                     uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u._id}
                        className="hover:bg-gray-50 transition-colors">
                        {/* user info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full
                                            bg-primary-100 flex
                                            items-center justify-center
                                            text-primary-600 text-sm
                                            font-semibold flex-shrink-0">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium
                                               text-gray-900">
                                  {u.name}
                                </p>
                                {u.isVerifiedChef && (
                                  <span className="text-xs
                                    bg-green-100 text-green-700
                                    px-1.5 py-0.5 rounded-full
                                    font-medium">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* role */}
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            disabled={u._id === currentUser?._id}
                            className={`text-xs font-medium px-2 py-1
                              rounded-full border-0 cursor-pointer
                              ${ROLE_COLORS[u.role]}`}
                          >
                            <option value="user">User</option>
                            <option value="chef">Chef</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* joined date */}
                        <td className="px-4 py-3 text-sm text-gray-500
                                       hidden sm:table-cell">
                          {new Date(u.createdAt)
                            .toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                        </td>

                        {/* actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {u.role === 'chef' && (
                              <button
                                onClick={() => handleVerify(u._id)}
                                className={`text-xs font-medium px-2.5
                                  py-1 rounded-lg transition-colors ${
                                  u.isVerifiedChef
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {u.isVerifiedChef
                                  ? '✓ Verified'
                                  : 'Verify'}
                              </button>
                            )}
                            {u._id !== currentUser?._id && (
                              <button
                                onClick={() => handleDelete(u._id)}
                                className="text-xs font-medium px-2.5
                                           py-1 rounded-lg bg-red-100
                                           text-red-600 hover:bg-red-200
                                           transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm
                                 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsersPage;