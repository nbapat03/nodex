import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate, timeAgo } from '../utils/helpers.jsx';
import { ArrowLeft, Clock, User, Tag, CheckCircle2 } from 'lucide-react';

const TimelineItem = ({ entry, isLast }) => (
  <div className="flex gap-4">

    <div className="flex flex-col items-center">

      <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-200 flex-shrink-0 mt-0.5" />

      {!isLast && (
        <div className="w-px flex-1 bg-gray-200 mt-2" />
      )}

    </div>

    <div className="pb-5 min-w-0">

      <div className="flex items-center gap-2 mb-1">
        <StatusBadge status={entry.status} />
        <span className="text-xs text-gray-400">
          {timeAgo(entry.changedAt)}
        </span>
      </div>

      {entry.note && (
        <p className="text-sm text-gray-600">
          {entry.note}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-1">
        by {entry.changedBy?.name || 'System'}
      </p>

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
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );

  }

  if (!complaint) {

    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Complaint not found.</p>
      </div>
    );

  }


  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto animate-fade-in">

        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>


        <div className="grid grid-cols-3 gap-5">

          {/* MAIN CONTENT */}
          <div className="col-span-2 space-y-5">

            <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4 mb-4">

                <div>

                  <div className="flex items-center gap-2 mb-2">

                    <span className="font-mono text-sm text-gray-400">
                      {complaint.complaintId}
                    </span>

                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />

                  </div>

                  <h1 className="text-xl font-bold text-gray-900">
                    {complaint.title}
                  </h1>

                </div>

              </div>


              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>

            </div>


            {/* TIMELINE */}
            <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">

              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">

                <Clock size={16} className="text-green-600" />

                Status Timeline

              </h2>

              {complaint.statusHistory?.length > 0 ? (

                <div>

                  {[...complaint.statusHistory].reverse().map((entry, i, arr) => (

                    <TimelineItem
                      key={i}
                      entry={entry}
                      isLast={i === arr.length - 1}
                    />

                  ))}

                </div>

              ) : (

                <p className="text-gray-500 text-sm">
                  No status history yet.
                </p>

              )}

            </div>

          </div>


          {/* SIDEBAR */}
          <div className="space-y-4">

            <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-5 shadow-sm space-y-4">

              <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                Details
              </h3>

              <div className="space-y-3">

                <div>

                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <Tag size={11} />
                    Category
                  </p>

                  <p className="text-sm text-gray-800">
                    {complaint.category?.name || '—'}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <User size={11} />
                    Submitted by
                  </p>

                  <p className="text-sm text-gray-800">
                    {complaint.submittedBy?.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {complaint.submittedBy?.email}
                  </p>

                </div>


                {complaint.assignedTo && (

                  <div>

                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                      <User size={11} />
                      Assigned to
                    </p>

                    <p className="text-sm text-gray-800">
                      {complaint.assignedTo?.name}
                    </p>

                  </div>

                )}


                <div>

                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                    <Clock size={11} />
                    Submitted
                  </p>

                  <p className="text-sm text-gray-800">
                    {formatDate(complaint.createdAt)}
                  </p>

                </div>


                {complaint.resolvedAt && (

                  <div>

                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 size={11} />
                      Resolved
                    </p>

                    <p className="text-sm text-gray-800">
                      {formatDate(complaint.resolvedAt)}
                    </p>

                  </div>

                )}

              </div>

            </div>

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