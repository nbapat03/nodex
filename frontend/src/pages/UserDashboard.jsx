import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { PlusCircle, FileText, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  </div>
);

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/my?limit=5')
      .then(res => setComplaints(res.data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
            <span className="text-sky-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-0.5">Here&apos;s your complaint overview</p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <PlusCircle size={16} />
          New Complaint
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText size={20} className="text-slate-300" />} label="Total" value={counts.total} color="bg-slate-700/60" />
        <StatCard icon={<Clock size={20} className="text-amber-400" />} label="Pending" value={counts.pending} color="bg-amber-500/15" />
        <StatCard icon={<AlertCircle size={20} className="text-sky-400" />} label="In Progress" value={counts.inProgress} color="bg-sky-500/15" />
        <StatCard icon={<CheckCircle size={20} className="text-emerald-400" />} label="Resolved" value={counts.resolved} color="bg-emerald-500/15" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Complaints</h2>
          <Link to="/complaints" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No complaints yet</p>
            <Link to="/complaints/new" className="text-sky-400 hover:text-sky-300 text-sm mt-2 inline-block">
              Submit your first complaint →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {complaints.map(c => (
              <Link key={c._id} to={`/complaints/${c._id}`}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-700/50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-slate-500">{c.complaintId}</span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  <p className="text-sm font-medium text-slate-200 truncate">{c.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.category?.name} · {formatDate(c.createdAt)}</p>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
