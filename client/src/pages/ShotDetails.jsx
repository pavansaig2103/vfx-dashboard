import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquarePlus, Upload } from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/Badge';
import { ARTISTS, PRIORITIES, STATUSES, daysUntil, nextAction } from '../utils/shotUi';

export default function ShotDetails() {
  const { id } = useParams();
  const [shot, setShot] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [note, setNote] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [version, setVersion] = useState('v001');

  useEffect(() => {
    let active = true;
    api.shot(id).then(data => {
      if (!active) return;
      setShot(data.shot);
      setFeedback(data.feedback);
      setVersion(data.shot.currentVersion);
    });
    return () => { active = false; };
  }, [id]);
  if (!shot) return <div className="page-container text-slate-400">Loading shot details...</div>;

  async function update(field, value) {
    const updated = await api.updateShot(id, { [field]: value });
    setShot(updated);
  }

  async function addFeedback(event) {
    event.preventDefault();
    const items = await api.addFeedback(id, { feedbackText: note, revisionNotes, version });
    setFeedback(items);
    setNote('');
    setRevisionNotes('');
    const data = await api.shot(id);
    setShot(data.shot);
  }

  return (
    <div className="page-container grid xl:grid-cols-[1fr_380px] gap-6">
      <section className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-cyan-300 font-black">{shot.shotCode}</div>
              <h2 className="text-3xl font-black mt-2">{shot.projectName} · {shot.sceneNumber}</h2>
              <p className="text-slate-400 mt-3 max-w-3xl">{shot.description}</p>
            </div>
            <div className="flex gap-2"><Badge type="status" value={shot.status} /><Badge type="priority" value={shot.priority} /></div>
          </div>
          <div className="grid sm:grid-cols-4 gap-3 mt-6">
            <Info label="Artist" value={shot.assignedArtist} />
            <Info label="Deadline" value={`${daysUntil(shot.deadline)} days`} sub={shot.deadline} />
            <Info label="Version" value={shot.currentVersion} />
            <Info label="Feedback" value={feedback.length} />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-black mb-4">Media Preview</h3>
          <div className="aspect-video rounded-2xl border border-white/10 bg-black/50 grid place-items-center overflow-hidden">
            {shot.mediaUrl ? <iframe title="media-preview" src={shot.mediaUrl} className="w-full h-full" /> : <div className="text-slate-500">No media URL attached</div>}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-black mb-4">Feedback History & Version Tracking</h3>
          <div className="space-y-3">
            {feedback.map(item => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex justify-between gap-3 mb-2">
                  <span className="font-mono text-cyan-300 font-black">{item.version}</span>
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-300">{item.feedbackText}</p>
                {item.revisionNotes && <p className="text-xs text-slate-500 mt-2">Revision notes: {item.revisionNotes}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="glass-card p-5">
          <h3 className="font-black mb-4">Update Shot</h3>
          <div className="space-y-3">
            <Select label="Status" value={shot.status} options={STATUSES} onChange={v => update('status', v)} />
            <Select label="Priority" value={shot.priority} options={PRIORITIES} onChange={v => update('priority', v)} />
            <Select label="Artist" value={shot.assignedArtist} options={ARTISTS} onChange={v => update('assignedArtist', v)} />
            <Select label="Current Version" value={shot.currentVersion} options={['v001', 'v002', 'v003', 'v004']} onChange={v => update('currentVersion', v)} />
          </div>
        </div>

        <div className="glass-card p-5 border-cyan-300/20">
          <h3 className="font-black mb-2">Recommended Next Action</h3>
          <p className="text-sm text-cyan-100">{nextAction(shot.status)}</p>
        </div>

        <form onSubmit={addFeedback} className="glass-card p-5">
          <h3 className="font-black mb-4 flex items-center gap-2"><MessageSquarePlus size={18} /> Add Feedback</h3>
          <Select label="Feedback Version" value={version} options={['v001', 'v002', 'v003', 'v004']} onChange={setVersion} />
          <textarea required className="control textarea w-full mt-3" placeholder="Supervisor/client feedback" value={note} onChange={e => setNote(e.target.value)} />
          <textarea className="control textarea w-full mt-3" placeholder="Revision notes" value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)} />
          <button className="btn-primary w-full mt-3 flex items-center justify-center gap-2"><Upload size={17} /> Save Version Feedback</button>
        </form>

        <div className="glass-card p-5">
          <h3 className="font-black mb-3">Notes</h3>
          <p className="text-sm text-slate-400 mb-3">{shot.internalNotes || 'No internal notes.'}</p>
          <p className="text-sm text-slate-400">{shot.clientFeedback || 'No client feedback.'}</p>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value, sub }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="text-xs uppercase tracking-widest text-slate-500">{label}</div><div className="text-lg font-black mt-1">{value}</div>{sub && <div className="text-xs text-slate-500">{sub}</div>}</div>;
}

function Select({ label, value, options, onChange }) {
  return <label className="block"><span className="block mb-2 text-xs font-black uppercase tracking-widest text-slate-500">{label}</span><select className="control w-full" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>;
}
