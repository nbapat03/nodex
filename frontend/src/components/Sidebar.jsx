import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, PlusCircle, Bell, LogOut,
  Users, BarChart3, Settings, ChevronRight
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
    <img src="/nodex-logo.png" className="w-9 h-9" />

    <div>
      <span className="font-bold text-lg text-gray-900 tracking-tight">
        NodeX
      </span>
      <p className="text-xs text-gray-500 -mt-0.5">
        Issue Management
      </p>
    </div>
  </div>
);

const navItem = (to, icon, label) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
      }`
    }
  >
    {icon}
    <span>{label}</span>

    <ChevronRight
      size={14}
      className="ml-auto opacity-0 group-hover:opacity-50 transition"
    />
  </NavLink>
);
export default function Sidebar() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-gray-200">

      <Logo />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {isAdmin ? (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
              Admin
            </p>

            {navItem('/admin/dashboard', <LayoutDashboard size={17} />, 'Dashboard')}
            {navItem('/admin/complaints', <FileText size={17} />, 'All Complaints')}
            {navItem('/admin/analytics', <BarChart3 size={17} />, 'Analytics')}
            {navItem('/admin/users', <Users size={17} />, 'Users')}

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2 mt-4">
              Settings
            </p>

            {navItem('/admin/categories', <Settings size={17} />, 'Categories')}

          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
              Menu
            </p>

            {navItem('/dashboard', <LayoutDashboard size={17} />, 'Dashboard')}
            {navItem('/complaints/new', <PlusCircle size={17} />, 'New Complaint')}
            {navItem('/complaints', <FileText size={17} />, 'My Complaints')}
            {navItem('/notifications', <Bell size={17} />, 'Notifications')}
          </>
        )}

      </nav>

      {/* USER PANEL */}
      <div className="p-4 border-t border-gray-200">

        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 mb-3">

          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>

      </div>

    </aside>
  );
}