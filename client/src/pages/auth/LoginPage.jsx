import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginApi } from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'chef') navigate('/chef-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">

        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500">RecipeNest</h1>
          <p className="text-gray-500 mt-2">Welcome back</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
            placeholder="Your password"
            register={register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message}
          />

          <Button type="submit" fullWidth loading={isSubmitting}>
            Sign In
          </Button>

        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-medium
                                          hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;