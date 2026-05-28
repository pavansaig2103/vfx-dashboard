import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';

export default function CalendarPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.calendar().then(setData); }, []);
  if (!data) return <div className="page-container text-slate-400">Loading scheduling data...</div>;

  return (
    <div className="page-container space-y-6">
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-cyan-400/10 text-cyan-300 grid place-items-center"><CalendarDays /></div>
        <div>
          <h2 className="text-2xl font-black">Deadline Calendar / List View</h2>
          <p className="text-sm text-slate-500">Shots grouped by due today, this week, overdue, and upcoming deadlines.</p>
        </div>
      </div>
      <div className="grid xl:grid-cols-4 gap-5">
        <Column title="Due Today" shots={data.dueToday} tone="border-cyan-300/25" />
        <Column title="Due This Week" shots={data.dueThisWeek} tone="border-blue-300/25" />
        <Column title="Overdue Shots" shots={data.overdue} tone="border-red-300/30" />
        <Column title="Upcoming Deadlines" shots={data.upcoming} tone="border-violet-300/25" />
      </div>
    </div>
  );
}

function Column({ title, shots, tone }) {
  return (
    <section className={`glass-card p-4 ${tone}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black">{title}</h3>
        <span className="text-xs rounded-full bg-white/10 px-2 py-1">{shots.length}</span>
      </div>
      <div className="space-y-3">
        {shots.length === 0 && <div className="text-sm text-slate-500">Nothing scheduled.</div>}
        {shots.map(shot => (
          <Link to={`/shots/${shot.id}`} key={shot.id} className="block rounded-2xl border border-white/10 bg-white/[0.035] p-3 hover:bg-white/[0.07]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-cyan-300 font-black text-sm">{shot.shotCode}</span>
              <Badge type="priority" value={shot.priority} />
            </div>
            <div className="text-sm font-semibold mt-2">{shot.projectName}</div>
            <div className="text-xs text-slate-500 mt-1">{shot.assignedArtist} · {shot.deadline}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
