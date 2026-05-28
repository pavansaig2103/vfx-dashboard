import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Clapperboard, LayoutDashboard, LogOut, PlusCircle, Sparkles, Users } from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/shots', icon: Clapperboard, label: 'Shot Management' },
  { to: '/shots/new', icon: PlusCircle, label: 'Add Shot' },
  { to: '/calendar', icon: Calendar, label: 'Scheduling' },
  { to: '/artists', icon: Users, label: 'Artist Workload' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('cinetrack_token');
    localStorage.removeItem('cinetrack_user');
    navigate('/');
  }

  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-white/10 bg-black/45 backdrop-blur-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-glow-md">
            <Sparkles size={21} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">CineTrack Pro</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">VFX Control Room</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="glass-card p-4 mb-4">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Live Pipeline</div>
          <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
            <div className="h-full w-[72%] bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />
          </div>
          <div className="mt-2 text-xs text-slate-400">Final delivery readiness 72%</div>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
