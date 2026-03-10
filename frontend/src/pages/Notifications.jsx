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

    setNotifications(n =>
      n.map(x => x._id === id ? { ...x, isRead: true } : x)
    );

  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* animated background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-2xl mx-auto space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-gray-500 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : 'All caught up'}
            </p>

          </div>

          {unreadCount > 0 && (

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >

              <CheckCheck size={16} />

              Mark all read

            </button>

          )}

        </div>


        {/* NOTIFICATION LIST */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl shadow-sm overflow-hidden">

          {loading ? (

            <div className="p-6 space-y-3">

              {[...Array(4)].map((_, i) => (

                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-xl animate-pulse"
                />

              ))}

            </div>

          ) : notifications.length === 0 ? (

            <div className="py-16 text-center">

              <BellOff
                size={44}
                className="text-gray-300 mx-auto mb-3"
              />

              <p className="text-gray-500">
                No notifications yet
              </p>

            </div>

          ) : (

            notifications.map(n => (

              <div
                key={n._id}
                onClick={() => !n.isRead && markRead(n._id)}
                className={`flex gap-4 p-5 border-b border-gray-100 transition-all cursor-pointer hover:bg-green-50 ${
                  !n.isRead ? 'bg-green-50/60' : ''
                }`}
              >

                {/* unread indicator */}
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !n.isRead ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />

                <div className="flex-1 min-w-0">

                  <p
                    className={`text-sm ${
                      !n.isRead
                        ? 'text-gray-800 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5">

                    <span className="text-xs text-gray-400">
                      {timeAgo(n.createdAt)}
                    </span>

                    {n.complaint && (

                      <Link
                        to={`/complaints/${n.complaint._id}`}
                        className="text-xs text-green-600 hover:text-green-700 font-mono"
                        onClick={e => e.stopPropagation()}
                      >

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