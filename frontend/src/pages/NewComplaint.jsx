import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Send, AlertCircle } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function NewComplaint() {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.category)
      return toast.error('Please select a category');

    setLoading(true);

    try {

      const res = await api.post('/complaints', form);

      toast.success(`Complaint ${res.data.complaint.complaintId} submitted!`);

      navigate('/complaints');

    } catch (err) {

      toast.error(err.response?.data?.message || 'Submission failed');

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-2xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Submit a Complaint
          </h1>

          <p className="text-gray-500 mt-1">
            Provide details about your issue for faster resolution
          </p>

        </div>


        {/* FORM CARD */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TITLE */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Title
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                required
                maxLength={150}
                placeholder="Brief summary of the issue"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />

              <p className="text-xs text-gray-400 mt-1">
                {form.title.length}/150 characters
              </p>

            </div>


            {/* CATEGORY + PRIORITY */}
            <div className="grid grid-cols-2 gap-4">

              {/* CATEGORY */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">

                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >

                    <option value="">Select category</option>

                    {categories.map(cat => (
                      <option
                        key={cat._id}
                        value={cat._id}
                        className="bg-white text-gray-800"
                      >
                        {cat.name}
                      </option>
                    ))}

                  </select>

                  {form.category && (

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 animate-pulse">

                      {categories.find(c => c._id === form.category)?.name || 'Selected'}

                    </span>

                  )}

                </div>

              </div>


              {/* PRIORITY */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>

                <div className="relative">

                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >

                    {PRIORITIES.map(p => (
                      <option
                        key={p}
                        value={p}
                        className="bg-white text-gray-800"
                      >
                        {p}
                      </option>
                    ))}

                  </select>

                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-full animate-pulse
                      ${form.priority === 'Low' && 'bg-green-100 text-green-700'}
                      ${form.priority === 'Medium' && 'bg-yellow-100 text-yellow-700'}
                      ${form.priority === 'High' && 'bg-red-100 text-red-700'}
                      ${form.priority === 'Critical' && 'bg-purple-100 text-purple-700'}
                    `}
                  >
                    {form.priority}
                  </span>

                </div>

              </div>

            </div>


            {/* DESCRIPTION */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                required
                rows={6}
                placeholder="Describe the issue in detail — what happened, when, and where..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

            </div>


            {/* INFO BOX */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">

              <AlertCircle
                size={16}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />

              <p className="text-xs text-amber-700">
                Your complaint will be assigned a unique ID and reviewed by an administrator.
                You can track its status from the My Complaints page.
              </p>

            </div>


            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex-1 text-sm font-medium"
              >

                <Send size={16} />
                {loading ? 'Submitting...' : 'Submit Complaint'}

              </button>

            </div>

          </form>

        </div>

      </div>


      <style jsx>{`

        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-40px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }

        @keyframes fadeIn {
          from { opacity:0; transform: translateY(10px); }
          to { opacity:1; transform: translateY(0); }
        }

        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }

      `}</style>

    </div>

  );
}