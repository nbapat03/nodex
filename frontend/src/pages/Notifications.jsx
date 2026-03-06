import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { timeAgo } from '../utils/helpers.jsx';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then(res => setNotifications(res.data.notifications))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/mark-read');
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
    toast.success('All marked as read');
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm">
            <CheckCheck size={15} />
            Mark all read
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <BellOff size={44} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`flex gap-4 p-5 border-b border-slate-800/40 transition-all cursor-pointer hover:bg-slate-800/30 ${
                !n.isRead ? 'bg-sky-500/5' : ''
              }`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-sky-400' : 'bg-slate-700'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!n.isRead ? 'text-slate-200' : 'text-slate-400'}`}>{n.message}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-600">{timeAgo(n.createdAt)}</span>
                  {n.complaint && (
                    <Link to={`/complaints/${n.complaint._id}`}
                      className="text-xs text-sky-500 hover:text-sky-400 font-mono"
                      onClick={e => e.stopPropagation()}>
                      {n.complaint.complaintId}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
