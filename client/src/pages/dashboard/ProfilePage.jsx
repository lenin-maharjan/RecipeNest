import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import { updateProfileApi, changePasswordApi } from '../../api/user.api';
import { uploadImageApi } from '../../api/recipe.api';
import useAuth from '../../hooks/useAuth';

const inputClass = "w-full bg-white border border-linen rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-sand transition-colors";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, setValue: setProfileValue, getValues: getProfileValues, watch, formState: { errors: profileErrors, isSubmitting: profileSubmitting } } = useForm({
    defaultValues: { name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' },
  });
  const avatarValue = watch('avatar');

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch: watchPassword, formState: { errors: passwordErrors, isSubmitting: passwordSubmitting } } = useForm();

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { return toast.error('Image must be less than 5MB'); }
    try {
      setUploadingAvatar(true);
      const formData = new FormData(); formData.append('image', file);
      const uploadRes = await uploadImageApi(formData);
      const imageUrl = uploadRes.data.data.imageUrl;

      setProfileValue('avatar', imageUrl, { shouldDirty: true });

      // Persist avatar immediately so it is available across pages/sessions.
      const { name, bio } = getProfileValues();
      const profileRes = await updateProfileApi({ name, bio, avatar: imageUrl });
      updateUser(profileRes.data.data.user);
      toast.success('Profile photo updated');
    } catch { toast.error('Failed to upload image'); } finally { setUploadingAvatar(false); }
  };

  const onUpdateProfile = async (data) => {
    try {
      const res = await updateProfileApi(data);
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile'); }
  };

  const onChangePassword = async (data) => {
    try {
      await changePasswordApi({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      resetPassword();
      toast.success('Password changed successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
  };

  return (
    <Layout>
      <div className="page-enter">
        {/* Profile Header */}
        <div className="bg-white border-b border-linen">
          <div className="max-w-5xl mx-auto px-6">
            <div className="h-20 bg-gradient-to-r from-peach via-warm1 to-parchment rounded-none" />
            <div className="flex items-end gap-5 -mt-7 pb-6">
              <div className="relative group">
                <div className="w-14 h-14 rounded-xl bg-paprika text-white font-heading text-2xl flex items-center justify-center border-3 border-white shrink-0 overflow-hidden cursor-pointer">
                  {avatarValue ? <img src={avatarValue} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} disabled={uploadingAvatar} />
                  </label>
                </div>
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center gap-2.5 mb-1">
                  <h1 className="font-heading text-2xl">{user?.name}</h1>
                  {user?.isVerifiedChef && <span className="badge-verified">✓ Verified</span>}
                </div>
                <div className="editorial-label">
                  {user?.role === 'chef'
                    ? 'Professional Chef'
                    : user?.role === 'admin'
                      ? 'Admin'
                      : 'Food Enthusiast'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-linen">
          <div className="max-w-5xl mx-auto px-6 flex">
            {['profile','password'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-sm px-0 py-3.5 mr-7 border-b-2 transition-colors capitalize ${
                  activeTab===tab ? 'border-paprika text-gray-900 font-medium' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                {tab === 'profile' ? 'Edit Profile' : 'Change Password'}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-5">
              <input type="hidden" {...registerProfile('avatar')} />
              <div>
                <label className="editorial-label block mb-1.5">Full Name</label>
                <input {...registerProfile('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} className={inputClass} />
                {profileErrors.name && <span className="text-xs text-red-500 mt-1 block">{profileErrors.name.message}</span>}
              </div>
              <div>
                <label className="editorial-label block mb-1.5">Bio</label>
                <textarea {...registerProfile('bio', { maxLength: { value: 200, message: 'Max 200 characters' } })} placeholder="Tell the community about yourself..." rows={3} className={`${inputClass} resize-none`} />
                {profileErrors.bio && <span className="text-xs text-red-500 mt-1 block">{profileErrors.bio.message}</span>}
              </div>
              <button type="submit" disabled={profileSubmitting} className="w-full bg-paprika text-white text-sm font-medium py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                {profileSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {profileSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-5">
              <div>
                <label className="editorial-label block mb-1.5">Current Password</label>
                <input type="password" placeholder="Enter current password" {...registerPassword('currentPassword', { required: 'Current password is required' })} className={inputClass} />
                {passwordErrors.currentPassword && <span className="text-xs text-red-500 mt-1 block">{passwordErrors.currentPassword.message}</span>}
              </div>
              <div>
                <label className="editorial-label block mb-1.5">New Password</label>
                <input type="password" placeholder="Min 6 characters" {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className={inputClass} />
                {passwordErrors.newPassword && <span className="text-xs text-red-500 mt-1 block">{passwordErrors.newPassword.message}</span>}
              </div>
              <div>
                <label className="editorial-label block mb-1.5">Confirm New Password</label>
                <input type="password" placeholder="Repeat new password" {...registerPassword('confirmPassword', { required: 'Please confirm', validate: v => v === watchPassword('newPassword') || 'Passwords do not match' })} className={inputClass} />
                {passwordErrors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{passwordErrors.confirmPassword.message}</span>}
              </div>
              <button type="submit" disabled={passwordSubmitting} className="w-full bg-paprika text-white text-sm font-medium py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                {passwordSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {passwordSubmitting ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
