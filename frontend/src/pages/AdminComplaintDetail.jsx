import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { StatusBadge, PriorityBadge, formatDate, timeAgo } from '../utils/helpers.jsx';
import { ArrowLeft, UserCheck, RefreshCw, Clock, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

const TimelineItem = ({ entry, isLast }) => (
  <div className="flex gap-3">

    <div className="flex flex-col items-center">
      <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-200 mt-1" />
      {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1.5" />}
    </div>

    <div className="pb-4 min-w-0">

      <div className="flex items-center gap-2 mb-0.5">
        <StatusBadge status={entry.status} />
        <span className="text-xs text-gray-400">
          {timeAgo(entry.changedAt)}
        </span>
      </div>

      {entry.note && (
        <p className="text-xs text-gray-600">{entry.note}</p>
      )}

      <p className="text-xs text-gray-400 mt-0.5">
        by {entry.changedBy?.name || 'System'}
      </p>

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
      api.get('/admin/users')
    ])
      .then(([cRes, uRes]) => {

        const comp = cRes.data.complaint;

        setComplaint(comp);
        setAdmins(uRes.data.users.filter(u => u.role !== 'user'));

        setStatusForm({
          status: comp.status || '',
          note: ''
        });

      })
      .catch(console.error)
      .finally(() => setLoading(false));

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

      const res = await api.patch(`/complaints/${id}/assign`, {
        adminId: assignTo
      });

      setComplaint(res.data.complaint);
      setAssignTo('');

      toast.success('Complaint assigned');

    } catch (err) {

      toast.error(err.response?.data?.message || 'Assignment failed');

    } finally {

      setUpdating(false);

    }

  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-6 text-gray-500">
        Complaint not found.
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-5xl mx-auto animate-fade-in">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-5"
        >
          <ArrowLeft size={16} />
          Back to complaints
        </button>


        <div className="grid grid-cols-3 gap-5">

          {/* MAIN */}
          <div className="col-span-2 space-y-5">

            <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-sm text-gray-400">
                  {complaint.complaintId}
                </span>
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {complaint.title}
              </h1>

              <p className="text-sm text-gray-500 mb-4">
                {complaint.category?.name} · Submitted by
                <span className="text-gray-700 ml-1">
                  {complaint.submittedBy?.name}
                </span>
                {' '}on {formatDate(complaint.createdAt)}
              </p>

              <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4">
                {complaint.description}
              </p>

            </div>


            {/* TIMELINE */}
            <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">

              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <Clock size={15} className="text-green-600" />
                Status Timeline
              </h2>

              {complaint.statusHistory?.length > 0 ? (
                [...complaint.statusHistory].reverse().map((e, i, arr) => (
                  <TimelineItem key={i} entry={e} isLast={i === arr.length - 1} />
                ))
              ) : (
                <p className="text-sm text-gray-400">No history yet</p>
              )}

            </div>

          </div>


          {/* SIDEBAR */}
          <div className="space-y-4">

            {/* UPDATE STATUS */}
            <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">

              <h3 className="font-semibold text-gray-700 text-sm mb-4 flex items-center gap-2">
                <RefreshCw size={14} className="text-green-600" />
                Update Status
              </h3>

              <div className="space-y-3">

                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={statusForm.status}
                  onChange={e =>
                    setStatusForm(f => ({ ...f, status: e.target.value }))
                  }
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <textarea
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Add a note"
                  value={statusForm.note}
                  onChange={e =>
                    setStatusForm(f => ({ ...f, note: e.target.value }))
                  }
                />

                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="w-full bg-green-600 text-white rounded-lg py-2"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>

              </div>

            </div>


            {/* ASSIGN */}
            <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">

              <h3 className="font-semibold text-gray-700 text-sm mb-4 flex items-center gap-2">
                <UserCheck size={14} className="text-green-600" />
                Assign To
              </h3>

              {complaint?.assignedTo?.name && (
                <p className="text-xs text-gray-500 mb-3">
                  Currently:
                  <span className="text-gray-700 ml-1">
                    {complaint.assignedTo.name}
                  </span>
                </p>
              )}

              <div className="space-y-3">

                <select
                  value={assignTo}
                  onChange={e => setAssignTo(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select admin</option>
                  {admins.map(a => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssign}
                  disabled={!assignTo || updating}
                  className="w-full border border-green-200 text-green-700 rounded-lg py-2"
                >
                  Assign
                </button>

              </div>

            </div>


            {/* DETAILS */}
            <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm space-y-3">

              <h3 className="font-semibold text-gray-700 text-sm">Details</h3>

              <div className="text-xs space-y-2">

                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-gray-700">{complaint.category?.name || '—'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <PriorityBadge priority={complaint.priority} />
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-gray-700 text-right truncate max-w-32">
                    {complaint.submittedBy?.email}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}