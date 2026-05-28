import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { api } from '../services/api';
import { ARTISTS, PRIORITIES, STATUSES } from '../utils/shotUi';

const initial = {
  shotCode: '',
  projectName: '',
  sceneNumber: '',
  description: '',
  assignedArtist: 'Rohan',
  deadline: new Date().toISOString().slice(0, 10),
  priority: 'Medium',
  status: 'Not Started',
  currentVersion: 'v001',
  clientFeedback: '',
  internalNotes: '',
  mediaUrl: '',
  finalDeliveryLink: '',
};

export default function AddShot() {
  const [form, setForm] = useState(initial);
  const navigate = useNavigate();

  function set(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const shot = await api.createShot(form);
    navigate(`/shots/${shot.id}`);
  }

  return (
    <div className="page-container">
      <form onSubmit={submit} className="glass-card p-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Shot Code" value={form.shotCode} onChange={v => set('shotCode', v)} placeholder="SHOT_026" required />
          <Field label="Project Name" value={form.projectName} onChange={v => set('projectName', v)} placeholder="Dragonfall" required />
          <Field label="Scene Number" value={form.sceneNumber} onChange={v => set('sceneNumber', v)} placeholder="SC_101" required />
          <Select label="Assigned Artist" value={form.assignedArtist} onChange={v => set('assignedArtist', v)} options={ARTISTS} />
          <Field label="Deadline" type="date" value={form.deadline} onChange={v => set('deadline', v)} required />
          <Select label="Priority" value={form.priority} onChange={v => set('priority', v)} options={PRIORITIES} />
          <Select label="Status" value={form.status} onChange={v => set('status', v)} options={STATUSES} />
          <Select label="Current Version" value={form.currentVersion} onChange={v => set('currentVersion', v)} options={['v001', 'v002', 'v003', 'v004']} />
          <Field label="Media/File URL" value={form.mediaUrl} onChange={v => set('mediaUrl', v)} placeholder="https://..." />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Area label="Shot Description" value={form.description} onChange={v => set('description', v)} />
          <Area label="Client Feedback" value={form.clientFeedback} onChange={v => set('clientFeedback', v)} />
          <Area label="Internal Notes" value={form.internalNotes} onChange={v => set('internalNotes', v)} />
          <Area label="Final Delivery Link" value={form.finalDeliveryLink} onChange={v => set('finalDeliveryLink', v)} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={() => navigate('/shots')}>Cancel</button>
          <button className="btn-primary inline-flex items-center gap-2"><Save size={17} /> Save Shot</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, ...props }) {
  return <label className="block"><span className="block mb-2 text-xs font-black uppercase tracking-widest text-slate-500">{label}</span><input className="control w-full" value={value} onChange={e => onChange(e.target.value)} {...props} /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="block"><span className="block mb-2 text-xs font-black uppercase tracking-widest text-slate-500">{label}</span><select className="control w-full" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>;
}

function Area({ label, value, onChange }) {
  return <label className="block"><span className="block mb-2 text-xs font-black uppercase tracking-widest text-slate-500">{label}</span><textarea className="control textarea w-full" value={value} onChange={e => onChange(e.target.value)} /></label>;
}
