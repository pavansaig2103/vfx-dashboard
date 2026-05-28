import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Film, PackageCheck, TimerReset } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import Badge from '../components/Badge';
import { isOverdue } from '../utils/shotUi';

const colors = ['#94a3b8', '#60a5fa', '#facc15', '#fb7185', '#34d399', '#22d3ee'];

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
      <div className="flex items-center justify-between">
        <div className="h-11 w-11 rounded-2xl bg-white/5 grid place-items-center"><Icon size={20} /></div>
        <div className="text-3xl font-black">{value}</div>
      </div>
      <div className="mt-4 text-sm font-bold text-slate-200">{label}</div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    Promise.all([api.dashboard(), api.artists()]).then(([dashboard, artistStats]) => {
      setData(dashboard);
      setArtists(artistStats.artists);
    });
  }, []);

  if (!data) return <div className="page-container text-slate-400">Loading CineTrack control room...</div>;

  const stats = data.summary;
  const statCards = [
    [Film, 'Total Shots', stats.totalShots, 'from-violet-500 to-blue-500'],
    [Clock, 'Pending Shots', stats.pendingShots, 'from-slate-400 to-slate-600'],
    [TimerReset, 'In Progress Shots', stats.inProgressShots, 'from-blue-400 to-cyan-400'],
    [AlertTriangle, 'Review Shots', stats.reviewShots, 'from-yellow-300 to-orange-400'],
    [CheckCircle2, 'Approved Shots', stats.approvedShots, 'from-emerald-400 to-green-500'],
    [PackageCheck, 'Final Delivered', stats.finalDeliveredShots, 'from-cyan-300 to-blue-500'],
    [AlertTriangle, 'Overdue Shots', stats.overdueShots, 'from-rose-400 to-red-600'],
  ];

  return (
    <div className="page-container space-y-6">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {statCards.map(([Icon, label, value, tone]) => <Stat key={label} icon={Icon} label={label} value={value} tone={tone} />)}
      </div>

      <div className="grid xl:grid-cols-[1.25fr_.75fr] gap-6">
        <section className="glass-card p-6">
          <h2 className="font-black mb-1">Shot Status Pipeline</h2>
          <p className="text-sm text-slate-500 mb-5">Current distribution across post-production stages</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.statusPipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#090914', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
              <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                {data.statusPipeline.map((_, i) => <Cell key={i} fill={colors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="glass-card p-6">
          <h2 className="font-black mb-1">Artist Workload</h2>
          <p className="text-sm text-slate-500 mb-5">Assigned shot load by artist</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={artists} dataKey="totalAssigned" nameKey="name" innerRadius={58} outerRadius={96} stroke="none">
                {artists.map((_, i) => <Cell key={i} fill={colors[(i + 1) % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#090914', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <List title="Today's Deadlines" shots={data.todayDeadlines} empty="No shots due today." />
        <List title="High Priority Shots" shots={data.highPriorityShots} empty="No critical/high shots open." />
        <section className="glass-card p-5">
          <h2 className="font-black mb-4">Recent Feedback</h2>
          <div className="space-y-3">
            {data.recentFeedback.map(item => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="flex justify-between gap-3 text-xs mb-2">
                  <span className="font-mono text-cyan-300">{item.shotCode}</span>
                  <span className="text-slate-500">{item.version}</span>
                </div>
                <p className="text-sm text-slate-300">{item.feedbackText}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function List({ title, shots, empty }) {
  return (
    <section className="glass-card p-5">
      <h2 className="font-black mb-4">{title}</h2>
      <div className="space-y-3">
        {shots.length === 0 && <div className="text-sm text-slate-500">{empty}</div>}
        {shots.map(shot => (
          <div key={shot.id} className={`rounded-2xl border border-white/10 bg-white/[0.035] p-3 ${isOverdue(shot) ? 'border-red-400/30' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-black text-cyan-300">{shot.shotCode}</span>
              <Badge type="priority" value={shot.priority} />
            </div>
            <div className="mt-2 text-sm font-semibold">{shot.description}</div>
            <div className="mt-1 text-xs text-slate-500">{shot.assignedArtist} · {shot.deadline}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
