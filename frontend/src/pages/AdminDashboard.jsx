import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { FileText, Users, Clock, CheckCircle, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

const StatCard = ({ icon, label, value, sub, color }) => (

  <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">

    <div className="flex items-start justify-between mb-3">

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>

    </div>

    <p className="text-3xl font-bold text-gray-900">
      {value ?? '—'}
    </p>

    <p className="text-sm text-gray-500 mt-0.5">
      {label}
    </p>

    {sub && (
      <p className="text-xs text-gray-400 mt-1">
        {sub}
      </p>
    )}

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
    ])

      .then(([analyticsRes, complaintsRes]) => {

        setStats(analyticsRes.data.stats);
        setRecentComplaints(complaintsRes.data.complaints);

      })

      .catch(console.error)

      .finally(() => setLoading(false));

  }, []);

  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            System overview and complaint management
          </p>

        </div>


        {loading ? (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {[...Array(8)].map((_, i) => (

              <div
                key={i}
                className="h-28 bg-gray-100 rounded-2xl animate-pulse"
              />

            ))}

          </div>

        ) : (

          <>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              <StatCard
                icon={<FileText size={18} className="text-gray-600" />}
                label="Total Complaints"
                value={stats?.totalComplaints}
                color="bg-gray-100"
              />

              <StatCard
                icon={<Clock size={18} className="text-amber-500" />}
                label="Pending"
                value={stats?.pending}
                color="bg-amber-50"
              />

              <StatCard
                icon={<TrendingUp size={18} className="text-blue-500" />}
                label="In Progress"
                value={stats?.inProgress}
                color="bg-blue-50"
              />

              <StatCard
                icon={<CheckCircle size={18} className="text-green-600" />}
                label="Resolved"
                value={stats?.resolved}
                color="bg-green-50"
              />

              <StatCard
                icon={<AlertTriangle size={18} className="text-red-500" />}
                label="Rejected"
                value={stats?.rejected}
                color="bg-red-50"
              />

              <StatCard
                icon={<FileText size={18} className="text-gray-500" />}
                label="Closed"
                value={stats?.closed}
                color="bg-gray-100"
              />

              <StatCard
                icon={<Users size={18} className="text-indigo-500" />}
                label="Total Users"
                value={stats?.totalUsers}
                color="bg-indigo-50"
              />

              <StatCard
                icon={<Clock size={18} className="text-purple-500" />}
                label="Avg. Resolution"
                value={stats?.avgResolutionTime ? `${stats.avgResolutionTime}h` : 'N/A'}
                sub="Average hours to resolve"
                color="bg-purple-50"
              />

            </div>


            {/* RECENT COMPLAINTS */}
            <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-5">

                <h2 className="font-semibold text-gray-900">
                  Recent Complaints
                </h2>

                <Link
                  to="/admin/complaints"
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                >

                  View all

                  <ArrowRight size={14} />

                </Link>

              </div>


              <div>

                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 mb-1 bg-gray-50 rounded-t-lg">

                  <div className="col-span-1">ID</div>
                  <div className="col-span-3">Title</div>
                  <div className="col-span-2">From</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-1">Date</div>

                </div>


                {recentComplaints.map(c => (

                  <Link
                    key={c._id}
                    to={`/admin/complaints/${c._id}`}
                    className="grid grid-cols-12 gap-4 px-4 py-3.5 rounded-xl hover:bg-green-50 transition-all group items-center"
                  >

                    <div className="col-span-1 font-mono text-xs text-gray-400">
                      {c.complaintId}
                    </div>

                    <div className="col-span-3 text-sm text-gray-800 truncate group-hover:text-gray-900">
                      {c.title}
                    </div>

                    <div className="col-span-2 text-sm text-gray-500 truncate">
                      {c.submittedBy?.name}
                    </div>

                    <div className="col-span-2 text-sm text-gray-500">
                      {c.category?.name || '—'}
                    </div>

                    <div className="col-span-2">
                      <StatusBadge status={c.status} />
                    </div>

                    <div className="col-span-1">
                      <PriorityBadge priority={c.priority} />
                    </div>

                    <div className="col-span-1 text-xs text-gray-400">
                      {formatDate(c.createdAt)}
                    </div>

                  </Link>

                ))}

              </div>

            </div>

          </>

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