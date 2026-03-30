// const ProfilePage = () => <div>Profile</div>;
// export default ProfilePage;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import VerifiedBadge from '../../components/chef/VerifiedBadge';
import { updateProfileApi, changePasswordApi } from '../../api/user.api';
import useAuth from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  // password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: {
      errors: passwordErrors,
      isSubmitting: passwordSubmitting,
    },
  } = useForm();

  const onUpdateProfile = async (data) => {
    try {
      const res = await updateProfileApi(data);
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update profile'
      );
    }
  };

  const onChangePassword = async (data) => {
    try {
      await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to change password'
      );
    }
  };

  const tabs = ['profile', 'password'];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary-500
                            flex items-center justify-center
                            text-white text-2xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                {user?.isVerifiedChef && <VerifiedBadge size="md" />}
              </div>
              <p className="text-gray-500 text-sm capitalize mt-0.5">
                {user?.role}
              </p>
              {user?.bio && (
                <p className="text-gray-600 text-sm mt-1">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium
                          capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'profile' ? 'Edit Profile' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* profile tab */}
        {activeTab === 'profile' && (
          <div className="card p-6">
            <form
              onSubmit={handleProfileSubmit(onUpdateProfile)}
              className="space-y-5"
            >
              <Input
                label="Full Name"
                name="name"
                placeholder="Your full name"
                register={registerProfile('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Min 2 characters',
                  },
                })}
                error={profileErrors.name?.message}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  {...registerProfile('bio', {
                    maxLength: {
                      value: 200,
                      message: 'Max 200 characters',
                    },
                  })}
                  placeholder="Tell the community about yourself..."
                  rows={3}
                  className="input-field resize-none"
                />
                {profileErrors.bio && (
                  <span className="text-xs text-red-500">
                    {profileErrors.bio.message}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={profileSubmitting}
                  fullWidth
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* password tab */}
        {activeTab === 'password' && (
          <div className="card p-6">
            <form
              onSubmit={handlePasswordSubmit(onChangePassword)}
              className="space-y-5"
            >
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                register={registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                error={passwordErrors.currentPassword?.message}
              />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Min 6 characters"
                register={registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'Min 6 characters',
                  },
                })}
                error={passwordErrors.newPassword?.message}
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Repeat new password"
                register={registerPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) =>
                    val === watch('newPassword') ||
                    'Passwords do not match',
                })}
                error={passwordErrors.confirmPassword?.message}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={passwordSubmitting}
                  fullWidth
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ProfilePage;

