import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';
import { ARTISTS, PRIORITIES, STATUSES, daysUntil, isOverdue } from '../utils/shotUi';

export default function ShotTracker() {
  const [shots, setShots] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [artist, setArtist] = useState('All');
  const [priority, setPriority] = useState('All');

  async function load() {
    setShots(await api.shots({ search, status, artist, priority }));
  }

  useEffect(() => {
    let active = true;
    api.shots({ search: '', status, artist, priority }).then(data => {
      if (active) setShots(data);
    });
    return () => { active = false; };
  }, [status, artist, priority]);

  const filtered = useMemo(() => shots.filter(s => [s.shotCode, s.projectName, s.assignedArtist].join(' ').toLowerCase().includes(search.toLowerCase())), [shots, search]);

  async function remove(id) {
    await api.deleteShot(id);
    setShots(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="page-container space-y-5">
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="control pl-9 w-72" placeholder="Search shot, project, artist" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
          </div>
          <Select value={status} onChange={setStatus} options={['All', ...STATUSES]} />
          <Select value={artist} onChange={setArtist} options={['All', ...ARTISTS]} />
          <Select value={priority} onChange={setPriority} options={['All', ...PRIORITIES]} />
          <button className="btn-ghost" onClick={load}>Apply</button>
        </div>
        <Link className="btn-primary inline-flex items-center justify-center gap-2" to="/shots/new"><Plus size={17} /> Add Shot</Link>
      </div>

      <div className="glass-card table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {['Shot Code', 'Project Name', 'Scene', 'Assigned Artist', 'Deadline', 'Status', 'Priority', 'Version', 'Feedback Count', 'Final Delivery', 'Actions'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).map(shot => (
              <tr key={shot.id} className={isOverdue(shot) ? 'overdue-row' : ''}>
                <td className="font-mono font-black text-cyan-300">{shot.shotCode}</td>
                <td>{shot.projectName}</td>
                <td>{shot.sceneNumber}</td>
                <td>{shot.assignedArtist}</td>
                <td>
                  <div>{shot.deadline}</div>
                  <div className={`text-[11px] ${isOverdue(shot) ? 'text-red-300' : 'text-slate-500'}`}>{daysUntil(shot.deadline) < 0 ? `${Math.abs(daysUntil(shot.deadline))}d overdue` : `${daysUntil(shot.deadline)}d left`}</div>
                </td>
                <td><Badge type="status" value={shot.status} /></td>
                <td><Badge type="priority" value={shot.priority} /></td>
                <td className="font-mono">{shot.currentVersion}</td>
                <td>{shot.feedbackCount || 0}</td>
                <td>{shot.finalDeliveryLink ? <a className="text-cyan-300" href={shot.finalDeliveryLink}>Ready</a> : <span className="text-slate-500">Pending</span>}</td>
                <td>
                  <div className="flex gap-2">
                    <Link className="icon-button" to={`/shots/${shot.id}`} title="View"><Eye size={15} /></Link>
                    <button className="icon-button text-red-300" onClick={() => remove(shot.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return <select className="control" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>;
}
