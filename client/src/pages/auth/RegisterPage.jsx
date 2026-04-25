import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerApi } from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await registerApi({ ...data, role });
      const { token, user } = res.data.data;
      login(token, user);
      toast.success(`Welcome to RecipeNest, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <h1 className="font-heading text-3xl mb-8">Create account.</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Role picker */}
            <div className="mb-6">
              <div className="editorial-label mb-3">I am a...</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {v:'user', icon:'🍳', name:'Food Enthusiast', desc:'Browse, review and save'},
                  {v:'chef', icon:'👨‍🍳', name:'Professional Chef', desc:'Publish and build portfolio'},
                ].map(r => (
                  <button type="button" key={r.v} onClick={() => setRole(r.v)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role===r.v
                        ? 'border-paprika bg-red-50'
                        : 'border-linen hover:border-sand'}`}>
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="text-lg">{r.icon}</span>
                      <div className={`w-3 h-3 rounded-full border transition-colors ${
                        role===r.v ? 'bg-paprika border-paprika' : 'border-sand'}`} />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-snug">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="editorial-label block mb-1.5">Full name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Gordon Ramsay"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                  className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                    focus:outline-none focus:border-sand bg-stone-50 transition-colors" 
                />
                {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
              </div>

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
                  placeholder="Min 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                    focus:outline-none focus:border-sand bg-stone-50 transition-colors" 
                />
                {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
              </div>

              <div>
                <label className="editorial-label block mb-1.5">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === watch('password') || 'Passwords mismatch',
                  })}
                  className="w-full border border-linen rounded-lg px-4 py-3 text-sm
                    focus:outline-none focus:border-sand bg-stone-50 transition-colors" 
                />
                {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-paprika text-white text-sm font-medium py-3
                  rounded-lg hover:bg-red-800 transition-colors mt-2 flex
                  items-center justify-center gap-2"
              >
                {isSubmitting && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {isSubmitting ? 'Creating account...' : 'Create account →'}
              </button>
            </div>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-paprika underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;