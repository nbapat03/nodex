import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Tag } from 'lucide-react';

export default function AdminCategories() {

  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetchCats = () =>
    api.get('/categories')
      .then(res => setCategories(res.data.categories))
      .catch(console.error);

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAdd = async (e) => {

    e.preventDefault();

    if (!newCat.name.trim()) return;

    setLoading(true);

    try {

      await api.post('/categories', newCat);

      toast.success('Category added');

      setNewCat({ name: '', description: '' });

      fetchCats();

    } catch (err) {

      toast.error(err.response?.data?.message || 'Failed to add category');

    } finally {

      setLoading(false);

    }

  };

  const handleDelete = async (id, name) => {

    if (!confirm(`Deactivate "${name}"?`)) return;

    try {

      await api.delete(`/categories/${id}`);

      toast.success('Category deactivated');

      fetchCats();

    } catch {

      toast.error('Failed to deactivate');

    }

  };


  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag size={22} className="text-green-600" />
            Complaint Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Manage categories available for complaint submissions
          </p>

        </div>


        {/* ADD CATEGORY */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

          <h2 className="font-semibold text-gray-900 mb-4">
            Add New Category
          </h2>

          <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">

            <input
              type="text"
              placeholder="Category name"
              value={newCat.name}
              onChange={e =>
                setNewCat(f => ({ ...f, name: e.target.value }))
              }
              className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={newCat.description}
              onChange={e =>
                setNewCat(f => ({ ...f, description: e.target.value }))
              }
              className="flex-1 min-w-[220px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <PlusCircle size={16} />
              {loading ? 'Adding...' : 'Add'}
            </button>

          </form>

        </div>


        {/* CATEGORY CARDS */}
        {categories.length === 0 ? (

          <div className="text-center py-12 text-gray-500">
            No categories yet. Add one above.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {categories.map(cat => (

              <div
                key={cat._id}
                className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition group"
              >

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <Tag size={18} />
                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {cat.name}
                      </p>

                      {cat.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {cat.description}
                        </p>
                      )}

                    </div>

                  </div>

                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

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