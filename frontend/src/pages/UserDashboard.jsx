import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate } from '../utils/helpers.jsx';
import { PlusCircle, FileText, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/80 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-4">

    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50">
      {icon}
    </div>

    <div>
      <p className="text-2xl font-bold text-gray-900">
        {value ?? '—'}
      </p>
      <p className="text-sm text-gray-500">
        {label}
      </p>
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
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background animation */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">

        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},
              <span className="text-green-600 ml-1">
                {user?.name?.split(' ')[0]}
              </span>
            </h1>

            <p className="text-gray-500 mt-1">
              Track and manage your complaints efficiently
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


        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            icon={<FileText size={20} className="text-gray-600" />}
            label="Total Complaints"
            value={counts.total}
          />

          <StatCard
            icon={<Clock size={20} className="text-amber-500" />}
            label="Pending"
            value={counts.pending}
          />

          <StatCard
            icon={<AlertCircle size={20} className="text-blue-500" />}
            label="In Progress"
            value={counts.inProgress}
          />

          <StatCard
            icon={<CheckCircle size={20} className="text-green-600" />}
            label="Resolved"
            value={counts.resolved}
          />

        </div>


        {/* RECENT COMPLAINTS */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <h2 className="font-semibold text-gray-900 text-lg">
              Recent Complaints
            </h2>

            <Link
              to="/complaints"
              className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
            >
              View all
              <ArrowRight size={14} />
            </Link>

          </div>


          {loading ? (

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>

          ) : complaints.length === 0 ? (

            <div className="text-center py-14">

              <FileText
                size={44}
                className="text-gray-300 mx-auto mb-4"
              />

              <p className="text-gray-500">
                No complaints yet
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