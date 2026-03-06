import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Tag } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetchCats = () =>
    api.get('/categories').then(res => setCategories(res.data.categories)).catch(console.error);

  useEffect(() => { fetchCats(); }, []);

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
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Tag size={22} className="text-sky-400" /> Complaint Categories
        </h1>
        <p className="text-slate-400 mt-0.5">Manage categories available for complaint submissions</p>
      </div>

      {/* Add form */}
      <div className="card p-6 mb-5">
        <h2 className="font-semibold text-slate-200 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input type="text" className="input flex-1" placeholder="Category name"
            value={newCat.name} onChange={e => setNewCat(f => ({ ...f, name: e.target.value }))} />
          <input type="text" className="input flex-1" placeholder="Description (optional)"
            value={newCat.description} onChange={e => setNewCat(f => ({ ...f, description: e.target.value }))} />
          <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
            <PlusCircle size={16} />
            Add
          </button>
        </form>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-12 text-center text-slate-500">No categories yet. Add one above.</div>
        ) : categories.map(cat => (
          <div key={cat._id} className="flex items-center justify-between px-6 py-4 border-b border-slate-800/40 hover:bg-slate-800/20 transition-all">
            <div>
              <p className="text-sm font-medium text-slate-200">{cat.name}</p>
              {cat.description && <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>}
            </div>
            <button onClick={() => handleDelete(cat._id, cat.name)} className="btn-danger text-sm px-3 py-2">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
