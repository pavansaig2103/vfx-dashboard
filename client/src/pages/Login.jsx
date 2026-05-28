import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('admin@cinetrack.com');
  const [password, setPassword] = useState('admin123');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      localStorage.setItem('cinetrack_token', data.token);
      localStorage.setItem('cinetrack_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch {
      setError('Login failed. Use admin@cinetrack.com / admin123.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden relative grid place-items-center p-6">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 grid lg:grid-cols-[1.1fr_.9fr] max-w-5xl w-full glass-card overflow-hidden">
        <div className="p-10 md:p-14 min-h-[560px] flex flex-col justify-between bg-[linear-gradient(135deg,rgba(124,58,237,.24),rgba(14,165,233,.08))]">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400 grid place-items-center">
              <Sparkles />
            </div>
            <div>
              <div className="text-2xl font-black">CineTrack Pro</div>
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Studio Control Room</div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200 mb-5">
              <Clapperboard size={14} /> VFX Shot Tracking Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-xl">Track every shot from assignment to final delivery.</h1>
            <p className="mt-5 text-slate-300 max-w-lg">A premium post-production workspace for deadlines, artist workload, review feedback, and version control.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {['25+ Seed Shots', 'JWT Auth', 'SQLite API'].map(item => <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-xs font-bold text-slate-300">{item}</div>)}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-black/35">
          <h2 className="text-2xl font-black">Studio Login</h2>
          <p className="text-sm text-slate-400 mt-2 mb-8">Default credentials are prefilled for demo review.</p>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
          <input className="control w-full mb-4" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
          <div className="relative mb-4">
            <input className="control w-full pr-12" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          {error && <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Enter Dashboard'}</button>
        </form>
      </motion.section>
    </main>
  );
}
