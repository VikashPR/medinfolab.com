import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readDataFile<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

export function writeDataFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {}
    }
  }
}

// Helper to normalize objects from snake_case to camelCase
function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase());
}

export function normalizeRecord<T extends Record<string, any>>(obj: any): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const res: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    const camelK = toCamel(k);
    if (k === 'published' && typeof v === 'number') {
      res[camelK] = v === 1;
    } else if (k === 'is_featured' && typeof v === 'number') {
      res['isFeatured'] = v === 1;
    } else if (k === 'is_public' && typeof v === 'number') {
      res['isPublic'] = v === 1;
    } else if (k === 'show_email' && typeof v === 'number') {
      res['showEmail'] = v === 1;
    } else if (k === 'show_social_links' && typeof v === 'number') {
      res['showSocialLinks'] = v === 1;
    } else if (k === 'show_publications' && typeof v === 'number') {
      res['showPublications'] = v === 1;
    } else if (k === 'show_projects' && typeof v === 'number') {
      res['showProjects'] = v === 1;
    } else if (typeof v === 'string' && (v.startsWith('[') || v.startsWith('{'))) {
      try {
        res[camelK] = JSON.parse(v);
      } catch {
        res[camelK] = v;
      }
    } else {
      res[camelK] = v;
    }
  }
  return res as T;
}

export function normalizeList<T extends Record<string, any>>(list: any[]): T[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeRecord<T>);
}
