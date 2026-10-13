import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin_users.json');
const ADMIN_SESSIONS_FILE = path.join(DATA_DIR, 'admin_sessions.json');

export interface StoredAdminUser {
  id: string;
  username: string;
  email: string;
  salt: string;
  hash: string;
  role: 'Super Admin' | 'Content Editor';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  token: string;
  userId: string;
  username: string;
  role: string;
  createdAt: number;
  expiresAt: number;
}

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
  return { salt: useSalt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

export function getAdminUsers(): StoredAdminUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ADMIN_USERS_FILE)) {
      const { salt, hash } = hashPassword('Admin@MINDH2024!');
      const defaultAdmin: StoredAdminUser = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@mindh-lab.org',
        salt,
        hash,
        role: 'Super Admin',
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf-8');
      return [defaultAdmin];
    }
    const raw = fs.readFileSync(ADMIN_USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const { salt, hash } = hashPassword('Admin@MINDH2024!');
    const fallback: StoredAdminUser = {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@mindh-lab.org',
      salt,
      hash,
      role: 'Super Admin',
      createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify([fallback], null, 2), 'utf-8');
    return [fallback];
  } catch (err) {
    console.error('Error reading admin users:', err);
    return [];
  }
}

export function saveAdminUsers(users: StoredAdminUser[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin users:', err);
  }
}

function getStoredSessions(): AdminSession[] {
  try {
    if (fs.existsSync(ADMIN_SESSIONS_FILE)) {
      const raw = fs.readFileSync(ADMIN_SESSIONS_FILE, 'utf-8');
      const list: AdminSession[] = JSON.parse(raw);
      const now = Date.now();
      return list.filter((s) => s.expiresAt > now);
    }
  } catch (err) {
    console.warn('Could not read sessions file:', err);
  }
  return [];
}

function saveStoredSessions(sessions: AdminSession[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ADMIN_SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save sessions file:', err);
  }
}

export function createSession(user: StoredAdminUser): AdminSession {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    userId: user.id,
    username: user.username,
    role: user.role,
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
  };
  const sessions = getStoredSessions();
  sessions.push(session);
  saveStoredSessions(sessions);
  return session;
}

export function invalidateSession(token: string) {
  const sessions = getStoredSessions().filter((s) => s.token !== token);
  saveStoredSessions(sessions);
}

export function getSession(token?: string): AdminSession | null {
  if (!token) return null;
  const sessions = getStoredSessions();
  const session = sessions.find((s) => s.token === token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    invalidateSession(token);
    return null;
  }
  return session;
}

export function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith('mindh_admin_token=')) {
        return decodeURIComponent(cookie.substring('mindh_admin_token='.length));
      }
    }
  }
  return null;
}

export function verifyAdminRequest(req: Request): AdminSession | null {
  const token = extractTokenFromRequest(req);
  return getSession(token || undefined);
}
