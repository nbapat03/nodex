import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Send, AlertCircle } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please select a category');
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
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Submit a Complaint</h1>
        <p className="text-slate-400 mt-1">Provide details about your issue for faster resolution</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Complaint Title <span className="text-red-400">*</span></label>
            <input type="text" required className="input" placeholder="Brief summary of the issue"
              maxLength={150}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
            <p className="text-xs text-slate-600 mt-1">{form.title.length}/150 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category <span className="text-red-400">*</span></label>
              <select className="input" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Description <span className="text-red-400">*</span></label>
            <textarea required className="input resize-none" rows={6}
              placeholder="Describe the issue in detail — what happened, when, and where..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/15">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80">
              Your complaint will be assigned a unique ID and reviewed by an administrator. 
              You can track its status from the My Complaints page.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              <Send size={16} />
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
