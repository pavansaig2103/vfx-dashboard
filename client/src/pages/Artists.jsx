import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clapperboard, TimerReset } from 'lucide-react';
import { api } from '../services/api';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  useEffect(() => { api.artists().then(data => setArtists(data.artists)); }, []);

  return (
    <div className="page-container">
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
        {artists.map(artist => (
          <div key={artist.name} className="glass-card p-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 grid place-items-center font-black mb-4">
              {artist.name.slice(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-black">{artist.name}</h2>
            <p className="text-sm text-slate-500 mb-5">VFX Artist</p>
            <Metric icon={Clapperboard} label="Total assigned shots" value={artist.totalAssigned} color="text-cyan-300" />
            <Metric icon={TimerReset} label="In progress shots" value={artist.inProgress} color="text-blue-300" />
            <Metric icon={CheckCircle2} label="Review shots" value={artist.review} color="text-yellow-300" />
            <Metric icon={AlertTriangle} label="Overdue shots" value={artist.overdue} color="text-red-300" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 mb-3">
      <div className="flex items-center gap-2 text-sm text-slate-400"><Icon size={16} className={color} /> {label}</div>
      <div className={`font-black ${color}`}>{value}</div>
    </div>
  );
}
