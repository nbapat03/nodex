import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate } from '../utils/helpers.jsx';
import { Users, Mail, Calendar } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users size={22} className="text-sky-400" /> User Management
        </h1>
        <p className="text-slate-400 mt-0.5">{users.length} registered users</p>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-800/60 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-1">Joined</div>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : users.map((u, i) => (
          <div key={u._id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/30 items-center hover:bg-slate-800/20 transition-all">
            <div className="col-span-1 text-slate-600 text-sm">{i + 1}</div>
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-sm flex-shrink-0">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-200">{u.name}</span>
            </div>
            <div className="col-span-4 flex items-center gap-1.5 text-sm text-slate-400">
              <Mail size={12} className="text-slate-600" />
              {u.email}
            </div>
            <div className="col-span-2">
              <span className="badge bg-slate-700/50 text-slate-300 capitalize">{u.role}</span>
            </div>
            <div className="col-span-1 flex items-center gap-1 text-xs text-slate-500">
              <Calendar size={11} />
              {formatDate(u.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
