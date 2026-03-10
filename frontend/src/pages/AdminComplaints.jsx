import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { Search, ArrowRight } from 'lucide-react';

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
      .then(res => {
        setComplaints(res.data.complaints);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [filters, search]);


  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* animated background */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            All Complaints
          </h1>

          <p className="text-gray-500 mt-1">
            {total} total complaints
          </p>

        </div>


        {/* FILTERS */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-sm">

          <div className="relative flex-1 min-w-48">

            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search by title or ID..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setFilters(f => ({ ...f, page: 1 }));
              }}
            />

          </div>

          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s || 'All Statuses'}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filters.priority}
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value, page: 1 }))}
          >
            {PRIORITIES.map(p => (
              <option key={p} value={p}>
                {p || 'All Priorities'}
              </option>
            ))}
          </select>

        </div>


        {/* TABLE */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl shadow-sm overflow-hidden">

          {loading ? (

            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>

          ) : complaints.length === 0 ? (

            <div className="py-16 text-center">
              <p className="text-gray-500">
                No complaints match your filters.
              </p>
            </div>

          ) : (

            <div>

              {/* table header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">

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

                <Link
                  key={c._id}
                  to={`/admin/complaints/${c._id}`}
                  className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-gray-100 hover:bg-green-50 transition-all group items-center"
                >

                  <div className="col-span-1 font-mono text-xs text-gray-400">
                    {c.complaintId}
                  </div>

                  <div className="col-span-3 text-sm text-gray-800 truncate group-hover:text-gray-900">
                    {c.title}
                  </div>

                  <div className="col-span-2 text-xs text-gray-500 truncate">
                    {c.submittedBy?.name}
                  </div>

                  <div className="col-span-1 text-xs text-gray-500">
                    {c.category?.name || '—'}
                  </div>

                  <div className="col-span-2 text-xs text-gray-500">
                    {c.assignedTo?.name || (
                      <span className="text-gray-400 italic">
                        Unassigned
                      </span>
                    )}
                  </div>

                  <div className="col-span-1">
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="col-span-1">
                    <PriorityBadge priority={c.priority} />
                  </div>

                  <div className="col-span-1 flex items-center justify-between">

                    <span className="text-xs text-gray-400">
                      {formatDate(c.createdAt)}
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-gray-300 group-hover:text-green-600 transition-colors"
                    />

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>


        {/* PAGINATION */}
        {total > 15 && (

          <div className="flex justify-center gap-2">

            {[...Array(Math.ceil(total / 15))].map((_, i) => (

              <button
                key={i}
                onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  filters.page === i + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>

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