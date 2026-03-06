export const STATUS_CONFIG = {
  Pending: { color: 'bg-amber-500/15 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  'In Progress': { color: 'bg-sky-500/15 text-sky-400 border border-sky-500/20', dot: 'bg-sky-400' },
  Resolved: { color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  Closed: { color: 'bg-slate-500/15 text-slate-400 border border-slate-500/20', dot: 'bg-slate-400' },
  Rejected: { color: 'bg-red-500/15 text-red-400 border border-red-500/20', dot: 'bg-red-400' },
};

export const PRIORITY_CONFIG = {
  Low: { color: 'bg-slate-500/15 text-slate-400', label: 'Low' },
  Medium: { color: 'bg-blue-500/15 text-blue-400', label: 'Medium' },
  High: { color: 'bg-orange-500/15 text-orange-400', label: 'High' },
  Critical: { color: 'bg-red-500/15 text-red-400', label: 'Critical' },
};

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  return (
    <span className={`badge ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Medium'];
  return <span className={`badge ${cfg.color}`}>{priority}</span>;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
