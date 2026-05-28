import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TITLES = {
  '/dashboard': ['Dashboard', 'Studio overview, deadlines, pipeline, and feedback'],
  '/shots': ['Shot Management', 'Search, filter, sort, and update VFX shots'],
  '/shots/new': ['Add Shot', 'Create a new shot assignment'],
  '/calendar': ['Scheduling', 'Deadline calendar and delivery risk'],
  '/artists': ['Artist Workload', 'Capacity view for Rohan, Meera, Arjun, Sana, and Vikram'],
};

export default function Topbar() {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || (pathname.startsWith('/shots/') ? ['Shot Details', 'Versioning, feedback, notes, and next action'] : ['CineTrack Pro', '']);
  const user = JSON.parse(localStorage.getItem('cinetrack_user') || '{}');

  return (
    <header className="shrink-0 border-b border-white/10 bg-[#070710]/75 backdrop-blur-xl px-4 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-black tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="control pl-9 w-56" placeholder="Search studio..." />
        </div>
        <button className="icon-button"><Bell size={16} /></button>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center text-[11px] font-bold">SM</div>
          <div className="text-xs">
            <div className="font-semibold">{user.name || 'Studio Manager'}</div>
            <div className="text-slate-500">{user.role || 'admin'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
