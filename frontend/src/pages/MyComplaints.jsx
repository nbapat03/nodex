import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { FileText, Search, Filter, ArrowRight, PlusCircle } from 'lucide-react';

const STATUSES = ['', 'Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', page: 1 });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: filters.page, limit: 10 });
    if (filters.status) params.append('status', filters.status);

    api.get(`/complaints/my?${params}`)
      .then(res => { setComplaints(res.data.complaints); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Complaints</h1>
          <p className="text-slate-400 mt-0.5">{total} complaint{total !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          <PlusCircle size={16} />
          New Complaint
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-500" />
          <span className="text-sm text-slate-400">Filter by status:</span>
        </div>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilters({ status: s, page: 1 })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filters.status === s
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={44} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No complaints found</p>
            <Link to="/complaints/new" className="text-sky-400 text-sm mt-2 inline-block hover:text-sky-300">
              Submit your first complaint →
            </Link>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-2">Date</div>
            </div>
            {complaints.map(c => (
              <Link key={c._id} to={`/complaints/${c._id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/40 hover:bg-slate-800/30 transition-all group items-center">
                <div className="col-span-1">
                  <span className="font-mono text-xs text-slate-500">{c.complaintId}</span>
                </div>
                <div className="col-span-4">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">{c.title}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-slate-400">{c.category?.name || '—'}</span>
                </div>
                <div className="col-span-2">
                  <StatusBadge status={c.status} />
                </div>
                <div className="col-span-1">
                  <PriorityBadge priority={c.priority} />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.ceil(total / 10))].map((_, i) => (
            <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                filters.page === i + 1 ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
