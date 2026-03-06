import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, PlusCircle, Bell, LogOut,
  ShieldCheck, Users, BarChart3, Settings, ChevronRight
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/60">
    <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
      <span className="text-white font-bold text-sm font-mono">NX</span>
    </div>
    <div>
      <span className="font-bold text-lg text-white tracking-tight">NodeX</span>
      <p className="text-xs text-slate-500 -mt-0.5">Issue Management</p>
    </div>
  </div>
);

const navItem = (to, icon, label) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
        isActive
          ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
      }`
    }
  >
    {icon}
    <span>{label}</span>
    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
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
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-slate-900/80 border-r border-slate-800/60 backdrop-blur-sm">
      <Logo />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {isAdmin ? (
          <>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">Admin</p>
            {navItem('/admin/dashboard', <LayoutDashboard size={17} />, 'Dashboard')}
            {navItem('/admin/complaints', <FileText size={17} />, 'All Complaints')}
            {navItem('/admin/analytics', <BarChart3 size={17} />, 'Analytics')}
            {navItem('/admin/users', <Users size={17} />, 'Users')}
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2 mt-4">Settings</p>
            {navItem('/admin/categories', <Settings size={17} />, 'Categories')}
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">Menu</p>
            {navItem('/dashboard', <LayoutDashboard size={17} />, 'Dashboard')}
            {navItem('/complaints/new', <PlusCircle size={17} />, 'New Complaint')}
            {navItem('/complaints', <FileText size={17} />, 'My Complaints')}
            {navItem('/notifications', <Bell size={17} />, 'Notifications')}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
