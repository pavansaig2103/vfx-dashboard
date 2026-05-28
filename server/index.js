import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDb, getDb } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cinetrack-dev-secret';
const ARTISTS = ['Rohan', 'Meera', 'Arjun', 'Sana', 'Vikram'];
const FINAL_STATUSES = ['Approved', 'Final Delivered'];

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  if (process.env.VERCEL && req.url.startsWith('/auth')) req.url = `/api${req.url}`;
  if (process.env.VERCEL && req.url.startsWith('/shots')) req.url = `/api${req.url}`;
  if (process.env.VERCEL && req.url.startsWith('/stats')) req.url = `/api${req.url}`;
  next();
});

let dbReady;

function ensureDb(req, res, next) {
  dbReady ??= initDb();
  dbReady.then(() => next()).catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Database initialization failed' });
  });
}

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
}

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing authorization token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const shotSelect = `
  SELECT s.*,
    COUNT(f.id) AS feedbackCount,
    MAX(f.createdAt) AS lastFeedbackAt
  FROM shots s
  LEFT JOIN feedback f ON f.shotId = s.id
`;

function dashboardStats(shots, feedback) {
  const today = new Date().toISOString().slice(0, 10);
  const counts = Object.fromEntries(['Not Started', 'In Progress', 'Review', 'Changes Required', 'Approved', 'Final Delivered'].map(s => [s, 0]));
  shots.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1; });
  const openShots = shots.filter(s => !FINAL_STATUSES.includes(s.status));
  return {
    summary: {
      totalShots: shots.length,
      pendingShots: counts['Not Started'] || 0,
      inProgressShots: counts['In Progress'] || 0,
      reviewShots: counts.Review || 0,
      approvedShots: counts.Approved || 0,
      finalDeliveredShots: counts['Final Delivered'] || 0,
      overdueShots: openShots.filter(s => s.deadline < today).length,
    },
    todayDeadlines: openShots.filter(s => s.deadline === today).slice(0, 6),
    highPriorityShots: openShots.filter(s => ['High', 'Critical'].includes(s.priority)).slice(0, 6),
    statusPipeline: Object.entries(counts).map(([status, count]) => ({ status, count })),
    recentFeedback: feedback.slice(0, 6),
  };
}

app.get('/', (_req, res) => res.json({ name: 'CineTrack Pro API', status: 'online' }));

app.use('/api', ensureDb);

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getDb().get('SELECT * FROM users WHERE email = ?', email);
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token: signUser(user), user: safeUser });
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await getDb().get('SELECT id, name, email, role, createdAt FROM users WHERE id = ?', req.user.id);
  res.json({ user });
});

app.get('/api/shots', auth, async (req, res) => {
  const { search = '', status, artist, priority, sort = 'deadline' } = req.query;
  const where = [];
  const params = [];
  if (search) {
    where.push('(shotCode LIKE ? OR projectName LIKE ? OR assignedArtist LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status && status !== 'All') { where.push('status = ?'); params.push(status); }
  if (artist && artist !== 'All') { where.push('assignedArtist = ?'); params.push(artist); }
  if (priority && priority !== 'All') { where.push('priority = ?'); params.push(priority); }
  const order = sort === 'deadline_desc' ? 'deadline DESC' : 'deadline ASC';
  const rows = await getDb().all(`${shotSelect} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} GROUP BY s.id ORDER BY ${order}`, params);
  res.json({ shots: rows });
});

app.get('/api/shots/:id', auth, async (req, res) => {
  const shot = await getDb().get(`${shotSelect} WHERE s.id = ? GROUP BY s.id`, req.params.id);
  if (!shot) return res.status(404).json({ message: 'Shot not found' });
  const feedback = await getDb().all('SELECT * FROM feedback WHERE shotId = ? ORDER BY createdAt DESC', req.params.id);
  res.json({ shot, feedback });
});

app.post('/api/shots', auth, async (req, res) => {
  const body = req.body;
  const now = new Date().toISOString();
  const result = await getDb().run(
    `INSERT INTO shots (shotCode, projectName, sceneNumber, description, assignedArtist, deadline, priority, status, currentVersion, clientFeedback, internalNotes, mediaUrl, finalDeliveryLink, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    body.shotCode, body.projectName, body.sceneNumber, body.description, body.assignedArtist, body.deadline, body.priority,
    body.status, body.currentVersion || 'v001', body.clientFeedback || '', body.internalNotes || '', body.mediaUrl || '', body.finalDeliveryLink || '', now, now
  );
  const shot = await getDb().get(`${shotSelect} WHERE s.id = ? GROUP BY s.id`, result.lastID);
  res.status(201).json({ shot });
});

app.put('/api/shots/:id', auth, async (req, res) => {
  const current = await getDb().get('SELECT * FROM shots WHERE id = ?', req.params.id);
  if (!current) return res.status(404).json({ message: 'Shot not found' });
  const body = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  await getDb().run(
    `UPDATE shots SET shotCode=?, projectName=?, sceneNumber=?, description=?, assignedArtist=?, deadline=?, priority=?, status=?, currentVersion=?, clientFeedback=?, internalNotes=?, mediaUrl=?, finalDeliveryLink=?, updatedAt=? WHERE id=?`,
    body.shotCode, body.projectName, body.sceneNumber, body.description, body.assignedArtist, body.deadline, body.priority, body.status,
    body.currentVersion, body.clientFeedback, body.internalNotes, body.mediaUrl, body.finalDeliveryLink, body.updatedAt, req.params.id
  );
  const shot = await getDb().get(`${shotSelect} WHERE s.id = ? GROUP BY s.id`, req.params.id);
  res.json({ shot });
});

app.delete('/api/shots/:id', auth, async (req, res) => {
  await getDb().run('DELETE FROM feedback WHERE shotId = ?', req.params.id);
  await getDb().run('DELETE FROM shots WHERE id = ?', req.params.id);
  res.json({ message: 'Shot deleted' });
});

app.get('/api/shots/:id/feedback', auth, async (req, res) => {
  const feedback = await getDb().all('SELECT * FROM feedback WHERE shotId = ? ORDER BY createdAt DESC', req.params.id);
  res.json({ feedback });
});

app.post('/api/shots/:id/feedback', auth, async (req, res) => {
  const { feedbackText, version, revisionNotes } = req.body;
  const now = new Date().toISOString();
  await getDb().run(
    'INSERT INTO feedback (shotId, feedbackText, version, revisionNotes, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    req.params.id, feedbackText, version, revisionNotes || '', req.user.email, now
  );
  if (version) {
    await getDb().run('UPDATE shots SET currentVersion = ?, updatedAt = ? WHERE id = ?', version, now, req.params.id);
  }
  const feedback = await getDb().all('SELECT * FROM feedback WHERE shotId = ? ORDER BY createdAt DESC', req.params.id);
  res.status(201).json({ feedback });
});

app.get('/api/stats/dashboard', auth, async (_req, res) => {
  const shots = await getDb().all(`${shotSelect} GROUP BY s.id ORDER BY deadline ASC`);
  const feedback = await getDb().all(`
    SELECT f.*, s.shotCode, s.projectName FROM feedback f
    JOIN shots s ON s.id = f.shotId
    ORDER BY f.createdAt DESC
  `);
  res.json(dashboardStats(shots, feedback));
});

app.get('/api/stats/artists', auth, async (_req, res) => {
  const shots = await getDb().all('SELECT * FROM shots');
  const today = new Date().toISOString().slice(0, 10);
  const artists = ARTISTS.map(name => {
    const assigned = shots.filter(s => s.assignedArtist === name);
    return {
      name,
      totalAssigned: assigned.length,
      inProgress: assigned.filter(s => s.status === 'In Progress').length,
      review: assigned.filter(s => s.status === 'Review').length,
      overdue: assigned.filter(s => s.deadline < today && !FINAL_STATUSES.includes(s.status)).length,
    };
  });
  res.json({ artists });
});

app.get('/api/stats/calendar', auth, async (_req, res) => {
  const shots = await getDb().all(`${shotSelect} GROUP BY s.id ORDER BY deadline ASC`);
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const weekKey = weekEnd.toISOString().slice(0, 10);
  const open = shots.filter(s => !FINAL_STATUSES.includes(s.status));
  res.json({
    dueToday: open.filter(s => s.deadline === todayKey),
    dueThisWeek: open.filter(s => s.deadline >= todayKey && s.deadline <= weekKey),
    overdue: open.filter(s => s.deadline < todayKey),
    upcoming: open.filter(s => s.deadline > weekKey).slice(0, 12),
  });
});

if (!process.env.VERCEL) {
  await initDb();
  app.listen(PORT, () => console.log(`CineTrack Pro API running on http://localhost:${PORT}`));
}

export default app;
