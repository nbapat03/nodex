import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'user' ? '/dashboard' : '/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 rounded-full blur-[120px] opacity-40 -top-40 -left-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 rounded-full blur-[120px] opacity-40 bottom-[-120px] right-[-120px] animate-blob animation-delay-2000"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-100 rounded-full blur-[120px] opacity-40 top-[40%] left-[30%] animate-blob animation-delay-4000"></div>

      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 bg-gradient-to-br from-green-50 to-white border-r border-green-100 relative z-10">

        <div className="flex items-center gap-4 mb-10">
          <img
            src="/logo.png"
            alt="NodeX"
            className="w-60 animate-float"
          />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 leading-tight">
          Smart complaint tracking <br />
          for modern teams
        </h2>

        <p className="text-gray-600 mt-6 text-lg max-w-md">
          Register issues, track progress, and resolve problems faster
          with a clean and reliable system built for organizations.
        </p>

        <div className="mt-10 text-gray-500 text-sm">
          Fast • Organized • Reliable
        </div>

      </div>

      {/* RIGHT LOGIN AREA */}
      <div className="flex flex-1 items-center justify-center px-6 relative z-10">

        <div className="w-full max-w-md animate-fade-in">

          {/* MOBILE LOGO */}
          <div className="lg:hidden text-center mb-10">
            <img
              src="/nodex-logo.png"
              alt="NodeX"
              className="w-16 mx-auto mb-3 animate-float"
            />
            <h1 className="text-2xl font-bold text-green-700">
              NodeX
            </h1>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">

            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Sign in
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Access your NodeX dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Email address
                </label>

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn size={18} />
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

            </form>

            {/* REGISTER */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Create one
              </Link>
            </p>

          </div>

        </div>

      </div>

      {/* animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob {
          animation: blob 12s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>

    </div>
  );
}