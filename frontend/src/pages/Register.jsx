import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to NodeX.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative overflow-hidden">

      {/* animated blobs */}
      <div className="absolute w-[450px] h-[450px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[450px] h-[450px] bg-green-300 blur-[120px] rounded-full bottom-[-120px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 bg-gradient-to-br from-green-50 to-white border-r border-green-100 relative z-10">

        <div className="flex items-center gap-4 mb-12">
          <img src="/nodex-logo.png" alt="NodeX" className="w-14 animate-float" />
          <h1 className="text-3xl font-bold text-green-700">NodeX</h1>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-10">
          Get started in seconds
        </h2>

        {/* animated steps */}
        <div className="space-y-6">

          <div className="flex items-start gap-4 animate-slide-in">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-semibold">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-900">Create your account</p>
              <p className="text-gray-500 text-sm">Register with your basic information</p>
            </div>
          </div>

          <div className="flex items-start gap-4 animate-slide-in animation-delay-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-semibold">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-900">Submit complaints</p>
              <p className="text-gray-500 text-sm">Easily raise and track issues</p>
            </div>
          </div>

          <div className="flex items-start gap-4 animate-slide-in animation-delay-400">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 text-white font-semibold">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-900">Track resolutions</p>
              <p className="text-gray-500 text-sm">Stay updated on progress and fixes</p>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT REGISTER FORM */}
      <div className="flex flex-1 items-center justify-center px-6 relative z-10">

        <div className="w-full max-w-md animate-fade-in">

          {/* mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img src="/nodex-logo.png" alt="NodeX" className="w-16 mx-auto mb-3 animate-float" />
            <h1 className="text-2xl font-bold text-green-700">NodeX</h1>
          </div>

          {/* form card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">

            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Create account
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Join NodeX today
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-sm text-gray-600 block mb-1">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Confirm password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus size={18} />
                {loading ? 'Creating account...' : 'Create account'}
              </button>

            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-40px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity:0; transform: translateX(-20px); }
          to { opacity:1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity:0; transform: translateY(10px); }
          to { opacity:1; transform: translateY(0); }
        }

        .animate-blob { animation: blob 12s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-slide-in { animation: slideIn 0.8s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }

        .animation-delay-200 { animation-delay: .2s; }
        .animation-delay-400 { animation-delay: .4s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

    </div>
  );
}