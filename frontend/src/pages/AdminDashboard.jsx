import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { FileText, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/complaints?limit=6'),
    ]).then(([analyticsRes, complaintsRes]) => {
      setStats(analyticsRes.data.stats);
      setRecentComplaints(complaintsRes.data.complaints);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-0.5">System overview and complaint management</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FileText size={18} className="text-slate-300" />} label="Total Complaints" value={stats?.totalComplaints} color="bg-slate-700/60" />
            <StatCard icon={<Clock size={18} className="text-amber-400" />} label="Pending" value={stats?.pending} color="bg-amber-500/15" />
            <StatCard icon={<TrendingUp size={18} className="text-sky-400" />} label="In Progress" value={stats?.inProgress} color="bg-sky-500/15" />
            <StatCard icon={<CheckCircle size={18} className="text-emerald-400" />} label="Resolved" value={stats?.resolved} color="bg-emerald-500/15" />
            <StatCard icon={<AlertTriangle size={18} className="text-red-400" />} label="Rejected" value={stats?.rejected} color="bg-red-500/15" />
            <StatCard icon={<FileText size={18} className="text-slate-400" />} label="Closed" value={stats?.closed} color="bg-slate-700/40" />
            <StatCard icon={<Users size={18} className="text-indigo-400" />} label="Total Users" value={stats?.totalUsers} color="bg-indigo-500/15" />
            <StatCard
              icon={<Clock size={18} className="text-purple-400" />}
              label="Avg. Resolution"
              value={stats?.avgResolutionTime ? `${stats.avgResolutionTime}h` : 'N/A'}
              sub="Average hours to resolve"
              color="bg-purple-500/15"
            />
          </div>

          {/* Recent complaints */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Recent Complaints</h2>
              <Link to="/admin/complaints" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div>
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/60 mb-1">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">Title</div>
                <div className="col-span-2">From</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-1">Date</div>
              </div>
              {recentComplaints.map(c => (
                <Link key={c._id} to={`/admin/complaints/${c._id}`}
                  className="grid grid-cols-12 gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-800/40 transition-all group items-center">
                  <div className="col-span-1 font-mono text-xs text-slate-500">{c.complaintId}</div>
                  <div className="col-span-3 text-sm text-slate-200 truncate group-hover:text-white">{c.title}</div>
                  <div className="col-span-2 text-sm text-slate-400 truncate">{c.submittedBy?.name}</div>
                  <div className="col-span-2 text-sm text-slate-400">{c.category?.name || '—'}</div>
                  <div className="col-span-2"><StatusBadge status={c.status} /></div>
                  <div className="col-span-1"><PriorityBadge priority={c.priority} /></div>
                  <div className="col-span-1 text-xs text-slate-500">{formatDate(c.createdAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
