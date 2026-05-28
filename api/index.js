const ARTISTS = ['Rohan', 'Meera', 'Arjun', 'Sana', 'Vikram'];
const STATUSES = ['Not Started', 'In Progress', 'Review', 'Changes Required', 'Approved', 'Final Delivered'];
const FINAL_STATUSES = ['Approved', 'Final Delivered'];

const d = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

function seedData() {
  const rows = [
    ['SHOT_001', 'Dragonfall', 'SC_010', 'Dragon fire simulation across palace gate', 'Rohan', d(0), 'Critical', 'Review', 'v003'],
    ['SHOT_002', 'Dragonfall', 'SC_011', 'Green screen cleanup behind lead actor', 'Meera', d(-2), 'High', 'Changes Required', 'v002'],
    ['SHOT_003', 'Orion Drift', 'SC_024', 'Background matte painting for orbital city', 'Arjun', d(4), 'Medium', 'In Progress', 'v001'],
    ['SHOT_004', 'Astra Nine', 'SC_031', 'Explosion compositing with ember pass', 'Sana', d(2), 'Critical', 'In Progress', 'v004'],
    ['SHOT_005', 'Neon Raga', 'SC_008', 'Wire removal from rooftop stunt', 'Vikram', d(-5), 'High', 'Review', 'v002'],
    ['SHOT_006', 'Orion Drift', 'SC_040', 'Face tracking for helmet HUD reflections', 'Rohan', d(9), 'Medium', 'Not Started', 'v001'],
    ['SHOT_007', 'Kingdom Below', 'SC_015', 'Crowd extension in arena wide shot', 'Meera', d(6), 'High', 'Approved', 'v003'],
    ['SHOT_008', 'Metro Chase', 'SC_021', 'CGI vehicle integration through tunnel', 'Arjun', d(-1), 'Critical', 'In Progress', 'v002'],
    ['SHOT_009', 'Neon Raga', 'SC_033', 'Hologram signage replacement', 'Sana', d(12), 'Low', 'Not Started', 'v001'],
    ['SHOT_010', 'Dragonfall', 'SC_018', 'Creature shadow pass and ground contact', 'Vikram', d(1), 'High', 'Review', 'v003'],
    ['SHOT_011', 'Astra Nine', 'SC_044', 'Starfield warp tunnel comp', 'Rohan', d(17), 'Medium', 'In Progress', 'v001'],
    ['SHOT_012', 'Kingdom Below', 'SC_027', 'Digital set extension for throne hall', 'Meera', d(-7), 'Critical', 'Changes Required', 'v004'],
    ['SHOT_013', 'Metro Chase', 'SC_034', 'Muzzle flash cleanup and smoke comp', 'Arjun', d(3), 'High', 'Review', 'v002'],
    ['SHOT_014', 'Orion Drift', 'SC_049', 'Zero gravity debris simulation', 'Sana', d(8), 'Medium', 'In Progress', 'v002'],
    ['SHOT_015', 'Neon Raga', 'SC_041', 'Beauty cleanup and skin retouching', 'Vikram', d(15), 'Low', 'Approved', 'v003'],
    ['SHOT_016', 'Dragonfall', 'SC_052', 'Castle collapse FX with dust pass', 'Rohan', d(-3), 'Critical', 'In Progress', 'v003'],
    ['SHOT_017', 'Astra Nine', 'SC_057', 'Alien planet sky replacement', 'Meera', d(5), 'Medium', 'Final Delivered', 'v004'],
    ['SHOT_018', 'Metro Chase', 'SC_045', 'Rain enhancement and wet road reflections', 'Arjun', d(0), 'High', 'In Progress', 'v002'],
    ['SHOT_019', 'Kingdom Below', 'SC_063', 'Sword glow and particle trails', 'Sana', d(10), 'Medium', 'Review', 'v001'],
    ['SHOT_020', 'Orion Drift', 'SC_071', 'Spaceship landing dust simulation', 'Vikram', d(13), 'High', 'Not Started', 'v001'],
    ['SHOT_021', 'Neon Raga', 'SC_066', 'Deepfake continuity face patch', 'Rohan', d(-9), 'Critical', 'Changes Required', 'v004'],
    ['SHOT_022', 'Dragonfall', 'SC_074', 'Firelight interactive grade pass', 'Meera', d(20), 'Low', 'Approved', 'v002'],
    ['SHOT_023', 'Astra Nine', 'SC_081', 'Laser blast and wall scorch marks', 'Arjun', d(7), 'High', 'Review', 'v003'],
    ['SHOT_024', 'Metro Chase', 'SC_088', 'License plate and logo removals', 'Sana', d(22), 'Low', 'Final Delivered', 'v004'],
    ['SHOT_025', 'Kingdom Below', 'SC_092', 'Mystic portal compositing', 'Vikram', d(0), 'Critical', 'Not Started', 'v001'],
  ];

  const shots = rows.map((row, index) => ({
    id: index + 1,
    shotCode: row[0],
    projectName: row[1],
    sceneNumber: row[2],
    description: row[3],
    assignedArtist: row[4],
    deadline: row[5],
    priority: row[6],
    status: row[7],
    currentVersion: row[8],
    clientFeedback: `Client note for ${row[0]}: match final DI contrast and edge detail.`,
    internalNotes: `Supervisor note: verify alpha edges and motion blur before ${row[8]}.`,
    mediaUrl: 'https://player.vimeo.com/video/76979871',
    finalDeliveryLink: row[7] === 'Final Delivered' ? `https://delivery.cinetrack.local/${row[0]}` : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedbackCount: 1,
  }));

  const feedback = shots.map((shot, index) => ({
    id: index + 1,
    shotId: shot.id,
    shotCode: shot.shotCode,
    projectName: shot.projectName,
    feedbackText: `${shot.shotCode} needs closer integration with plate lighting and cleaner holdout edges.`,
    version: shot.currentVersion,
    revisionNotes: 'Check roto chatter, grain match, and export updated preview.',
    createdBy: 'supervisor@cinetrack.com',
    createdAt: new Date().toISOString(),
  }));

  return { shots, feedback, nextShotId: 26, nextFeedbackId: 26 };
}

const store = globalThis.__cinetrackStore || (globalThis.__cinetrackStore = seedData());

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.end(JSON.stringify(payload));
}

async function body(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  return raw ? JSON.parse(raw) : {};
}

function tokenFor(user) {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, demo: true })).toString('base64url');
}

function authorized(req) {
  return req.headers.authorization?.startsWith('Bearer ');
}

function withFeedbackCount(shot) {
  return { ...shot, feedbackCount: store.feedback.filter(f => f.shotId === shot.id).length };
}

function dashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const counts = Object.fromEntries(STATUSES.map(status => [status, 0]));
  store.shots.forEach(shot => { counts[shot.status] = (counts[shot.status] || 0) + 1; });
  const open = store.shots.filter(shot => !FINAL_STATUSES.includes(shot.status));
  return {
    summary: {
      totalShots: store.shots.length,
      pendingShots: counts['Not Started'] || 0,
      inProgressShots: counts['In Progress'] || 0,
      reviewShots: counts.Review || 0,
      approvedShots: counts.Approved || 0,
      finalDeliveredShots: counts['Final Delivered'] || 0,
      overdueShots: open.filter(shot => shot.deadline < today).length,
    },
    todayDeadlines: open.filter(shot => shot.deadline === today).slice(0, 6).map(withFeedbackCount),
    highPriorityShots: open.filter(shot => ['High', 'Critical'].includes(shot.priority)).slice(0, 6).map(withFeedbackCount),
    statusPipeline: Object.entries(counts).map(([status, count]) => ({ status, count })),
    recentFeedback: [...store.feedback].sort((a, b) => b.id - a.id).slice(0, 6),
  };
}

function artistStats() {
  const today = new Date().toISOString().slice(0, 10);
  return ARTISTS.map(name => {
    const assigned = store.shots.filter(shot => shot.assignedArtist === name);
    return {
      name,
      totalAssigned: assigned.length,
      inProgress: assigned.filter(shot => shot.status === 'In Progress').length,
      review: assigned.filter(shot => shot.status === 'Review').length,
      overdue: assigned.filter(shot => shot.deadline < today && !FINAL_STATUSES.includes(shot.status)).length,
    };
  });
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {});

  try {
    const path = req.url.split('?')[0].replace(/^\/api/, '') || '/';
    const user = { id: 1, name: 'Studio Manager', email: 'admin@cinetrack.com', role: 'admin' };

    if (req.method === 'GET' && path === '/') return json(res, 200, { name: 'CineTrack Pro API', status: 'online' });

    if (req.method === 'POST' && path === '/auth/login') {
      const payload = await body(req);
      if (payload.email === 'admin@cinetrack.com' && payload.password === 'admin123') {
        return json(res, 200, { token: tokenFor(user), user });
      }
      return json(res, 401, { message: 'Invalid email or password' });
    }

    if (!authorized(req)) return json(res, 401, { message: 'Missing authorization token' });
    if (req.method === 'GET' && path === '/auth/me') return json(res, 200, { user });
    if (req.method === 'GET' && path === '/stats/dashboard') return json(res, 200, dashboard());
    if (req.method === 'GET' && path === '/stats/artists') return json(res, 200, { artists: artistStats() });
    if (req.method === 'GET' && path === '/stats/calendar') {
      const today = new Date();
      const todayKey = today.toISOString().slice(0, 10);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      const weekKey = weekEnd.toISOString().slice(0, 10);
      const open = store.shots.filter(shot => !FINAL_STATUSES.includes(shot.status));
      return json(res, 200, {
        dueToday: open.filter(shot => shot.deadline === todayKey).map(withFeedbackCount),
        dueThisWeek: open.filter(shot => shot.deadline >= todayKey && shot.deadline <= weekKey).map(withFeedbackCount),
        overdue: open.filter(shot => shot.deadline < todayKey).map(withFeedbackCount),
        upcoming: open.filter(shot => shot.deadline > weekKey).slice(0, 12).map(withFeedbackCount),
      });
    }

    if (req.method === 'GET' && path === '/shots') {
      const url = new URL(req.url, 'https://cinetrack.local');
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const status = url.searchParams.get('status') || 'All';
      const artist = url.searchParams.get('artist') || 'All';
      const priority = url.searchParams.get('priority') || 'All';
      const shots = store.shots
        .filter(shot => !search || `${shot.shotCode} ${shot.projectName} ${shot.assignedArtist}`.toLowerCase().includes(search))
        .filter(shot => status === 'All' || shot.status === status)
        .filter(shot => artist === 'All' || shot.assignedArtist === artist)
        .filter(shot => priority === 'All' || shot.priority === priority)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .map(withFeedbackCount);
      return json(res, 200, { shots });
    }

    const shotMatch = path.match(/^\/shots\/(\d+)(?:\/feedback)?$/);
    if (shotMatch) {
      const id = Number(shotMatch[1]);
      const shot = store.shots.find(item => item.id === id);
      if (!shot) return json(res, 404, { message: 'Shot not found' });
      const isFeedback = path.endsWith('/feedback');

      if (req.method === 'GET' && isFeedback) return json(res, 200, { feedback: store.feedback.filter(f => f.shotId === id).sort((a, b) => b.id - a.id) });
      if (req.method === 'POST' && isFeedback) {
        const payload = await body(req);
        const item = {
          id: store.nextFeedbackId++,
          shotId: id,
          shotCode: shot.shotCode,
          projectName: shot.projectName,
          feedbackText: payload.feedbackText,
          version: payload.version || shot.currentVersion,
          revisionNotes: payload.revisionNotes || '',
          createdBy: user.email,
          createdAt: new Date().toISOString(),
        };
        store.feedback.unshift(item);
        shot.currentVersion = item.version;
        shot.updatedAt = item.createdAt;
        return json(res, 201, { feedback: store.feedback.filter(f => f.shotId === id) });
      }
      if (req.method === 'GET') return json(res, 200, { shot: withFeedbackCount(shot), feedback: store.feedback.filter(f => f.shotId === id).sort((a, b) => b.id - a.id) });
      if (req.method === 'PUT') {
        Object.assign(shot, await body(req), { updatedAt: new Date().toISOString() });
        return json(res, 200, { shot: withFeedbackCount(shot) });
      }
      if (req.method === 'DELETE') {
        store.shots = store.shots.filter(item => item.id !== id);
        store.feedback = store.feedback.filter(item => item.shotId !== id);
        return json(res, 200, { message: 'Shot deleted' });
      }
    }

    if (req.method === 'POST' && path === '/shots') {
      const payload = await body(req);
      const now = new Date().toISOString();
      const shot = { id: store.nextShotId++, ...payload, createdAt: now, updatedAt: now, feedbackCount: 0 };
      store.shots.push(shot);
      return json(res, 201, { shot });
    }

    return json(res, 404, { message: 'Route not found', path });
  } catch (error) {
    return json(res, 500, { message: 'Serverless API error', detail: error.message });
  }
}
