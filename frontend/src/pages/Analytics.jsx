import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6', '#a78bfa'];

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'In Progress': '#38bdf8',
  Resolved: '#34d399',
  Closed: '#94a3b8',
  Rejected: '#f87171'
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm shadow-lg">
      <p className="text-gray-700 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);

  if (loading) {

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );

  }

  const statusData = data ? [
    { name: 'Pending', value: data.stats.pending },
    { name: 'In Progress', value: data.stats.inProgress },
    { name: 'Resolved', value: data.stats.resolved },
    { name: 'Closed', value: data.stats.closed },
    { name: 'Rejected', value: data.stats.rejected },
  ].filter(d => d.value > 0) : [];

  const trendData = data?.monthlyTrend?.map(t => ({
    name: `${MONTHS[t._id.month - 1]} ${t._id.year}`,
    Complaints: t.count,
  })) || [];

  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">

        {/* header */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm flex items-center gap-3">

          <BarChart3 size={22} className="text-green-600" />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Complaint insights and trends
            </p>
          </div>

        </div>


        <div className="grid grid-cols-2 gap-5">

          {/* Status distribution */}
          <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900 mb-5">
              Status Distribution
            </h2>

            <ResponsiveContainer width="100%" height={240}>

              <PieChart>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >

                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i]} />
                  ))}

                </Pie>

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  formatter={v => (
                    <span className="text-gray-500 text-xs">{v}</span>
                  )}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>


          {/* Category breakdown */}
          <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900 mb-5">
              Complaints by Category
            </h2>

            <ResponsiveContainer width="100%" height={240}>

              <BarChart data={data?.byCategory || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />

                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="count" fill="#22c55e" radius={[6,6,0,0]} />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* Monthly trend */}
          <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900 mb-5">
              Monthly Trend (Last 6 Months)
            </h2>

            <ResponsiveContainer width="100%" height={240}>

              <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />

                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="Complaints"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          {/* Priority breakdown */}
          <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-semibold text-gray-900 mb-5">
              Complaints by Priority
            </h2>

            <ResponsiveContainer width="100%" height={240}>

              <BarChart data={data?.byPriority || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />

                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />

                <Tooltip content={<CustomTooltip />} />

                <Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]} />

              </BarChart>

            </ResponsiveContainer>

          </div>

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