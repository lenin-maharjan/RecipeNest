import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerApi } from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await registerApi(data);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success(`Welcome to RecipeNest, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'chef') navigate('/chef-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">

        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500">RecipeNest</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Input
            label="Full Name"
            name="name"
            placeholder="Lenin Maharjan"
            register={register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            register={register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            register={register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Min 6 characters' },
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            register={register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) =>
                val === watch('password') || 'Passwords do not match',
            })}
            error={errors.confirmPassword?.message}
          />

          {/* role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              I am registering as
            </label>
            <select
              {...register('role', { required: 'Please select a role' })}
              className="input-field"
            >
              <option value="">Select role...</option>
              <option value="user">Food Enthusiast (User)</option>
              <option value="chef">Professional Chef</option>
            </select>
            {errors.role && (
              <span className="text-xs text-red-500">
                {errors.role.message}
              </span>
            )}
          </div>

          <Button type="submit" fullWidth loading={isSubmitting}>
            Create Account
          </Button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-medium
                                       hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;