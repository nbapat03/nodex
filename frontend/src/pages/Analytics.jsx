import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fb923c', '#f472b6', '#a78bfa'];
const STATUS_COLORS = {
  Pending: '#f59e0b', 'In Progress': '#38bdf8', Resolved: '#34d399',
  Closed: '#94a3b8', Rejected: '#f87171'
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value}</p>
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

  if (loading) return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => <div key={i} className="h-72 bg-slate-800/40 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

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
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <BarChart3 size={22} className="text-sky-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Complaint insights and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Status distribution */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                paddingAngle={3} dataKey="value">
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span className="text-slate-400 text-xs">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.byCategory || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">Monthly Trend (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Complaints" stroke="#38bdf8" strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">Complaints by Priority</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.byPriority || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
