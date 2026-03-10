export const STATUS_CONFIG = {
  Pending: {
    color: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    dot: 'bg-yellow-500'
  },

  'In Progress': {
    color: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500'
  },

  Resolved: {
    color: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500'
  },

  Closed: {
    color: 'bg-gray-100 text-gray-600 border border-gray-200',
    dot: 'bg-gray-500'
  },

  Rejected: {
    color: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500'
  },
};


export const PRIORITY_CONFIG = {
  Low: {
    color: 'bg-gray-100 text-gray-600 border border-gray-200',
    label: 'Low'
  },

  Medium: {
    color: 'bg-blue-100 text-blue-700 border border-blue-200',
    label: 'Medium'
  },

  High: {
    color: 'bg-orange-100 text-orange-700 border border-orange-200',
    label: 'High'
  },

  Critical: {
    color: 'bg-red-100 text-red-700 border border-red-200',
    label: 'Critical'
  },
};


export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};


export const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Medium'];

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
      {priority}
    </span>
  );
};


export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });


export const timeAgo = (date) => {

  const diff = Date.now() - new Date(date);

  const m = Math.floor(diff / 60000);

  if (m < 1) return 'just now';

  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);

  if (h < 24) return `${h}h ago`;

  return `${Math.floor(h / 24)}d ago`;

};