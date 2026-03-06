import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate, timeAgo } from '../utils/helpers.jsx';
import { ArrowLeft, UserCheck, RefreshCw, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

const TimelineItem = ({ entry, isLast }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-500/20 flex-shrink-0 mt-1" />
      {!isLast && <div className="w-px flex-1 bg-slate-800 mt-1.5" />}
    </div>
    <div className="pb-4 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <StatusBadge status={entry.status} />
        <span className="text-xs text-slate-600">{timeAgo(entry.changedAt)}</span>
      </div>
      {entry.note && <p className="text-xs text-slate-400">{entry.note}</p>}
      <p className="text-xs text-slate-600 mt-0.5">by {entry.changedBy?.name || 'System'}</p>
    </div>
  </div>
);

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({ status: '', note: '' });
  const [assignTo, setAssignTo] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/complaints/${id}`),
      api.get('/admin/users'), // for assign dropdown — could also fetch admins
    ]).then(([cRes]) => {
      setComplaint(cRes.data.complaint);
      setStatusForm(f => ({ ...f, status: cRes.data.complaint.status }));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/complaints/${id}/status`, statusForm);
      setComplaint(res.data.complaint);
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTo) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/complaints/${id}/assign`, { adminId: assignTo });
      setComplaint(res.data.complaint);
      toast.success('Complaint assigned');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6"><div className="h-96 bg-slate-800/40 rounded-2xl animate-pulse" /></div>;
  if (!complaint) return <div className="p-6 text-slate-400">Complaint not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to complaints
      </button>

      <div className="grid grid-cols-3 gap-5">
        {/* Main */}
        <div className="col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-sm text-slate-500">{complaint.complaintId}</span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">{complaint.title}</h1>
            <p className="text-sm text-slate-400 mb-4">{complaint.category?.name} · Submitted by <span className="text-slate-300">{complaint.submittedBy?.name}</span> on {formatDate(complaint.createdAt)}</p>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-800/40 rounded-xl p-4">
              {complaint.description}
            </p>
          </div>

          {/* Timeline */}
          <div className="card p-5">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm">
              <Clock size={15} className="text-sky-400" /> Status Timeline
            </h2>
            {[...complaint.statusHistory].reverse().map((e, i, arr) => (
              <TimelineItem key={i} entry={e} isLast={i === arr.length - 1} />
            ))}
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          {/* Update Status */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <RefreshCw size={14} className="text-sky-400" /> Update Status
            </h3>
            <div className="space-y-3">
              <select className="input text-sm" value={statusForm.status}
                onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <textarea className="input text-sm resize-none" rows={3}
                placeholder="Add a note (optional)"
                value={statusForm.note}
                onChange={e => setStatusForm(f => ({ ...f, note: e.target.value }))} />
              <button onClick={handleStatusUpdate} disabled={updating} className="btn-primary w-full justify-center text-sm">
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Assign */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
              <UserCheck size={14} className="text-emerald-400" /> Assign To
            </h3>
            {complaint.assignedTo && (
              <p className="text-xs text-slate-500 mb-3">
                Currently: <span className="text-slate-300">{complaint.assignedTo.name}</span>
              </p>
            )}
            <div className="space-y-3">
              <input type="text" className="input text-sm" placeholder="Enter admin user ID"
                value={assignTo} onChange={e => setAssignTo(e.target.value)} />
              <button onClick={handleAssign} disabled={updating || !assignTo} className="btn-secondary w-full justify-center text-sm">
                Assign
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2">Tip: Copy admin MongoDB ID from the Users page.</p>
          </div>

          {/* Info */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-slate-200 text-sm mb-1">Details</h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-300">{complaint.category?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority</span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-300 text-right truncate max-w-32">{complaint.submittedBy?.email}</span>
              </div>
              {complaint.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolved</span>
                  <span className="text-slate-300">{formatDate(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
