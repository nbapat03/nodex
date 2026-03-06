import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { Search, Filter, ArrowRight } from 'lucide-react';

const STATUSES = ['', 'Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
const PRIORITIES = ['', 'Low', 'Medium', 'High', 'Critical'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', page: 1 });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: filters.page, limit: 15 });
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (search) params.append('search', search);

    api.get(`/admin/complaints?${params}`)
      .then(res => { setComplaints(res.data.complaints); setTotal(res.data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, search]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">All Complaints</h1>
        <p className="text-slate-400 mt-0.5">{total} total complaints</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by title or ID..."
            className="input pl-9 py-2 text-sm"
            value={search}
            onChange={e => { setSearch(e.target.value); setFilters(f => ({...f, page: 1})); }} />
        </div>
        <select className="input w-auto py-2 text-sm" value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select className="input w-auto py-2 text-sm" value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400">No complaints match your filters.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1">ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-2">User</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-2">Assigned</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Date</div>
            </div>
            {complaints.map(c => (
              <Link key={c._id} to={`/admin/complaints/${c._id}`}
                className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-slate-800/30 hover:bg-slate-800/30 transition-all group items-center">
                <div className="col-span-1 font-mono text-xs text-slate-500">{c.complaintId}</div>
                <div className="col-span-3 text-sm text-slate-200 truncate group-hover:text-white">{c.title}</div>
                <div className="col-span-2 text-xs text-slate-400 truncate">{c.submittedBy?.name}</div>
                <div className="col-span-1 text-xs text-slate-400">{c.category?.name || '—'}</div>
                <div className="col-span-2 text-xs text-slate-400">{c.assignedTo?.name || <span className="text-slate-600 italic">Unassigned</span>}</div>
                <div className="col-span-1"><StatusBadge status={c.status} /></div>
                <div className="col-span-1"><PriorityBadge priority={c.priority} /></div>
                <div className="col-span-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
                  <ArrowRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {total > 15 && (
        <div className="flex justify-center gap-2">
          {[...Array(Math.ceil(total / 15))].map((_, i) => (
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
