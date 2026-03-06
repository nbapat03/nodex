import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate, timeAgo } from '../utils/helpers.jsx';
import { ArrowLeft, Clock, User, Tag, CheckCircle2 } from 'lucide-react';

const TimelineItem = ({ entry, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-500/20 flex-shrink-0 mt-0.5" />
      {!isLast && <div className="w-px flex-1 bg-slate-800 mt-2" />}
    </div>
    <div className="pb-5 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <StatusBadge status={entry.status} />
        <span className="text-xs text-slate-500">{timeAgo(entry.changedAt)}</span>
      </div>
      {entry.note && <p className="text-sm text-slate-400">{entry.note}</p>}
      <p className="text-xs text-slate-600 mt-1">by {entry.changedBy?.name || 'System'}</p>
    </div>
  </div>
);

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/complaints/${id}`)
      .then(res => setComplaint(res.data.complaint))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="h-96 bg-slate-800/40 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Complaint not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-3 gap-5">
        {/* Main content */}
        <div className="col-span-2 space-y-5">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm text-slate-500">{complaint.complaintId}</span>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                </div>
                <h1 className="text-xl font-bold text-white">{complaint.title}</h1>
              </div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Clock size={16} className="text-sky-400" />
              Status Timeline
            </h2>
            {complaint.statusHistory?.length > 0 ? (
              <div>
                {[...complaint.statusHistory].reverse().map((entry, i, arr) => (
                  <TimelineItem key={i} entry={entry} isLast={i === arr.length - 1} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No status history yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h3 className="font-semibold text-slate-300 text-sm uppercase tracking-wider">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Tag size={11} /> Category</p>
                <p className="text-sm text-slate-200">{complaint.category?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User size={11} /> Submitted by</p>
                <p className="text-sm text-slate-200">{complaint.submittedBy?.name}</p>
                <p className="text-xs text-slate-500">{complaint.submittedBy?.email}</p>
              </div>
              {complaint.assignedTo && (
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User size={11} /> Assigned to</p>
                  <p className="text-sm text-slate-200">{complaint.assignedTo?.name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Clock size={11} /> Submitted</p>
                <p className="text-sm text-slate-200">{formatDate(complaint.createdAt)}</p>
              </div>
              {complaint.resolvedAt && (
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><CheckCircle2 size={11} /> Resolved</p>
                  <p className="text-sm text-slate-200">{formatDate(complaint.resolvedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
