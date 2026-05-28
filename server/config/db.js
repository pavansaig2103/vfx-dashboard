import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let db;

const d = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const seedShots = [
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

export async function initDb() {
  db = await open({
    filename: process.env.VERCEL ? '/tmp/cinetrack.sqlite' : path.join(__dirname, '..', 'cinetrack.sqlite'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS shots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shotCode TEXT UNIQUE NOT NULL,
      projectName TEXT NOT NULL,
      sceneNumber TEXT NOT NULL,
      description TEXT,
      assignedArtist TEXT NOT NULL,
      deadline TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      currentVersion TEXT NOT NULL,
      clientFeedback TEXT,
      internalNotes TEXT,
      mediaUrl TEXT,
      finalDeliveryLink TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shotId INTEGER NOT NULL,
      feedbackText TEXT NOT NULL,
      version TEXT NOT NULL,
      revisionNotes TEXT,
      createdBy TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (shotId) REFERENCES shots(id)
    );
  `);

  const existingUser = await db.get('SELECT id FROM users WHERE email = ?', 'admin@cinetrack.com');
  if (!existingUser) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (name, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?)',
      'Studio Manager', 'admin@cinetrack.com', passwordHash, 'admin', new Date().toISOString()
    );
  }

  const count = await db.get('SELECT COUNT(*) AS count FROM shots');
  if (count.count === 0) {
    for (const shot of seedShots) {
      const now = new Date().toISOString();
      const result = await db.run(
        `INSERT INTO shots (shotCode, projectName, sceneNumber, description, assignedArtist, deadline, priority, status, currentVersion, clientFeedback, internalNotes, mediaUrl, finalDeliveryLink, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ...shot,
        `Client note for ${shot[0]}: match final DI contrast and edge detail.`,
        `Supervisor note: verify alpha edges and motion blur before ${shot[8]}.`,
        'https://player.vimeo.com/video/76979871',
        shot[7] === 'Final Delivered' ? `https://delivery.cinetrack.local/${shot[0]}` : '',
        now,
        now
      );
      await db.run(
        'INSERT INTO feedback (shotId, feedbackText, version, revisionNotes, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        result.lastID,
        `${shot[0]} needs closer integration with plate lighting and cleaner holdout edges.`,
        shot[8],
        'Check roto chatter, grain match, and export updated preview.',
        'supervisor@cinetrack.com',
        now
      );
    }
  }
}

export function getDb() {
  if (!db) throw new Error('Database has not been initialized');
  return db;
}
