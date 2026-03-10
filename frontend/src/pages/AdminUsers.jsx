import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { formatDate } from '../utils/helpers.jsx';
import { Users, Mail, Calendar, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const USERS_PER_PAGE = 8;

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {

    api.get('/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));

  }, []);

  const handleDelete = async (id, name) => {

    if (!confirm(`Remove user "${name}"?`)) return;

    try {

      await api.delete(`/admin/users/${id}`);

      setUsers(u => u.filter(x => x._id !== id));

      toast.success('User removed');

    } catch (err) {

      toast.error(err.response?.data?.message || 'Failed to remove user');

    }

  };

  const filteredUsers = useMemo(() => {

    return users.filter(u => {

      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        roleFilter ? u.role === roleFilter : true;

      return matchSearch && matchRole;

    });

  }, [users, search, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );


  return (

    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-green-200 blur-[120px] rounded-full -top-40 -left-40 opacity-40 animate-blob"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-300 blur-[120px] rounded-full bottom-[-150px] right-[-120px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-2xl p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={22} className="text-green-600" />
            User Management
          </h1>

          <p className="text-gray-500 mt-1">
            {filteredUsers.length} users found
          </p>

        </div>


        {/* SEARCH + FILTER */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center shadow-sm">

          <div className="relative flex-1 min-w-56">

            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search name or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

          </div>


          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={roleFilter}
            onChange={e => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

        </div>


        {/* TABLE */}
        <div className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">

            <div className="col-span-1">#</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Joined</div>
            <div className="col-span-1 text-right">Action</div>

          </div>


          {loading ? (

            <div className="p-6 space-y-3">

              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}

            </div>

          ) : (

            paginatedUsers.map((u, i) => (

              <div
                key={u._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center hover:bg-green-50 transition"
              >

                <div className="col-span-1 text-gray-400 text-sm">
                  {(page - 1) * USERS_PER_PAGE + i + 1}
                </div>


                <div className="col-span-3 flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                    {u.name?.[0]?.toUpperCase()}
                  </div>

                  <span className="text-sm text-gray-800">
                    {u.name}
                  </span>

                </div>


                <div className="col-span-4 flex items-center gap-1.5 text-sm text-gray-500">

                  <Mail size={12} className="text-gray-400" />

                  {u.email}

                </div>


                <div className="col-span-2">

                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 capitalize">
                    {u.role}
                  </span>

                </div>


                <div className="col-span-1 flex items-center gap-1 text-xs text-gray-400">

                  <Calendar size={11} />

                  {formatDate(u.createdAt)}

                </div>


                <div className="col-span-1 flex justify-end">

                  <button
                    onClick={() => handleDelete(u._id, u.name)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>

                </div>

              </div>

            ))

          )}

        </div>


        {/* PAGINATION */}
        {totalPages > 1 && (

          <div className="flex justify-center gap-2">

            {[...Array(totalPages)].map((_, i) => (

              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                  page === i + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>

            ))}

          </div>

        )}

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