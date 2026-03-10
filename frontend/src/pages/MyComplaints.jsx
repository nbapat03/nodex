import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { FileText, Filter, ArrowRight, PlusCircle } from 'lucide-react';

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
      .then(res => {
        setComplaints(res.data.complaints);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* animated background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Complaints
            </h1>

            <p className="text-gray-500 mt-1">
              {total} complaint{total !== 1 ? 's' : ''} submitted
            </p>
          </div>

          <Link
            to="/complaints/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium shadow hover:bg-green-700 transition"
          >
            <PlusCircle size={18} />
            New Complaint
          </Link>

        </div>


        {/* FILTERS */}
        <div className="bg-white/80 backdrop-blur border border-green-100 rounded-2xl p-5 shadow-sm flex flex-wrap gap-3 items-center">

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Filter size={16} />
            Filter by status:
          </div>

          {STATUSES.map(s => (

            <button
              key={s}
              onClick={() => setFilters({ status: s, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.status === s
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s || 'All'}
            </button>

          ))}

        </div>


        {/* COMPLAINT LIST */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

          {loading ? (

            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>

          ) : complaints.length === 0 ? (

            <div className="text-center py-16">

              <FileText
                size={44}
                className="text-gray-300 mx-auto mb-4"
              />

              <p className="text-gray-500 font-medium">
                No complaints found
              </p>

              <Link
                to="/complaints/new"
                className="text-green-600 hover:text-green-700 text-sm mt-2 inline-block font-medium"
              >
                Submit your first complaint →
              </Link>

            </div>

          ) : (

            <div className="space-y-3">

              {complaints.map(c => (

                <Link
                  key={c._id}
                  to={`/complaints/${c._id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all group"
                >

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2 mb-1">

                      <span className="font-mono text-xs text-gray-400">
                        {c.complaintId}
                      </span>

                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />

                    </div>

                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {c.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.category?.name} · {formatDate(c.createdAt)}
                    </p>

                  </div>

                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-green-600 transition-colors"
                  />

                </Link>

              ))}

            </div>

          )}

        </div>


        {/* PAGINATION */}
        {total > 10 && (

          <div className="flex justify-center gap-2">

            {[...Array(Math.ceil(total / 10))].map((_, i) => (

              <button
                key={i}
                onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
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