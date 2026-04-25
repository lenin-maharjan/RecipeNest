import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginApi } from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

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
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page-enter min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-parchment border-r border-linen
        flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full
          bg-peach opacity-40 translate-x-1/3 translate-y-1/3" />
        <div className="font-heading text-xl tracking-tight">
          Recipe<span className="text-paprika italic">·</span>Nest
        </div>
        <div>
          <h2 className="font-heading text-4xl leading-tight">
            Join the <em className="text-paprika">culinary</em><br/>community.
          </h2>
          <div className="mt-8 space-y-3">
            {['Verified chef profiles','Curated recipe portfolios','Honest reviews and ratings'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-gray-500 text-sm">
                <span className="text-paprika font-medium">—</span>{f}
              </div>
            ))}
          </div>
        </div>
        <div className="editorial-label">Est. 2026</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-heading text-3xl mb-8">Welcome back.</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="editorial-label block mb-1.5">Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
                className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                  focus:outline-none focus:border-sand bg-stone-50 transition-colors" 
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
            </div>
            <div>
              <label className="editorial-label block mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder="Your password"
                {...register('password', { required: 'Password is required' })}
                className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                  focus:outline-none focus:border-sand bg-stone-50 transition-colors" 
              />
              {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-paprika text-white text-sm font-medium py-3
                rounded-lg hover:bg-red-800 transition-colors mt-2 flex
                items-center justify-center gap-2"
            >
              {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isSubmitting ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-paprika underline underline-offset-4">Join free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;