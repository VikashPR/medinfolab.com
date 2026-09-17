import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { readDataFile, writeDataFile, normalizeRecord, normalizeList } from './dataStore';
import {
  getAdminUsers,
  verifyPassword,
  createSession,
  extractToken,
  getSessionUser,
  deleteSession,
  requireAdmin
} from './auth';

export const apiRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MINDH Laboratory Backend',
    runtime: 'Node.js Express',
    version: '1.0.0'
  });
});

// -------------------------------------------------------------
// Authentication
// -------------------------------------------------------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username and password are required' });
    return;
  }

  const users = getAdminUsers();
  const user = users.find(u => u.username === username || u.email === username);
  if (!user || !verifyPassword(user, password)) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const token = createSession(user.id);
  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const token = extractToken(req);
  const user = getSessionUser(token);
  if (!user) {
    res.status(401).json({ authenticated: false, message: 'Not authenticated' });
    return;
  }
  res.json({
    authenticated: true,
    user,
    token
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const token = extractToken(req);
  deleteSession(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// News Items
// -------------------------------------------------------------
apiRouter.get('/news', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('news_items.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(i => i.published !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  res.json({ success: true, news: items });
});

apiRouter.post('/news', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  if (!data.title || !data.description) {
    res.status(400).json({ success: false, message: 'Title and description are required' });
    return;
  }

  let items = readDataFile<any[]>('news_items.json', []);
  const newItem = {
    id: data.id || `news-${Date.now()}`,
    title: data.title.trim(),
    description: data.description.trim(),
    summary: data.summary || (data.description.slice(0, 160) + '...'),
    image: data.image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Lab Update',
    linkText: data.linkText || null,
    linkUrl: data.linkUrl || null,
    published: data.published ?? true,
    orderIndex: data.orderIndex ?? items.length,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  items.unshift(newItem);
  writeDataFile('news_items.json', items);

  res.status(201).json({
    success: true,
    message: 'News item created successfully',
    item: newItem,
    news: normalizeList(items)
  });
});

apiRouter.put('/news/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body || {};
  let items = readDataFile<any[]>('news_items.json', []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `News item ${id} not found` });
    return;
  }

  const existing = normalizeRecord<any>(items[idx]);
  const updated = {
    ...existing,
    ...data,
    id,
    updatedAt: new Date().toISOString()
  };

  items[idx] = updated;
  writeDataFile('news_items.json', items);

  res.json({
    success: true,
    message: 'News item updated successfully',
    item: updated,
    news: normalizeList(items)
  });
});

apiRouter.delete('/news/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readDataFile<any[]>('news_items.json', []);
  const filtered = items.filter(i => i.id !== id);
  writeDataFile('news_items.json', filtered);

  res.json({
    success: true,
    message: 'News item deleted successfully',
    news: normalizeList(filtered)
  });
});

// -------------------------------------------------------------
// Publications
// -------------------------------------------------------------
apiRouter.get('/publications', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('publications.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(p => p.published !== false);
  }

  items.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  res.json({ success: true, publications: items });
});

apiRouter.post('/publications', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  if (!data.title || !data.authors || !data.journal || !data.year) {
    res.status(400).json({ success: false, message: 'Title, authors, journal, and year are required' });
    return;
  }

  let items = readDataFile<any[]>('publications.json', []);
  const newPub = {
    id: data.id || `pub-${Date.now()}`,
    title: data.title.trim(),
    authors: data.authors.trim(),
    journal: data.journal.trim(),
    year: Number(data.year),
    topic: data.topic || 'Physiological Monitoring',
    doiUrl: data.doiUrl || '#',
    pdfUrl: data.pdfUrl || '#',
    codeUrl: data.codeUrl || null,
    abstract: data.abstract || '',
    highlight: data.highlight || null,
    bibtex: data.bibtex || '',
    published: data.published ?? true,
    orderIndex: data.orderIndex ?? items.length,
    createdAt: new Date().toISOString()
  };

  items.unshift(newPub);
  writeDataFile('publications.json', items);

  res.status(201).json({
    success: true,
    message: 'Publication added successfully',
    publication: newPub,
    publications: normalizeList(items)
  });
});

apiRouter.put('/publications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body || {};
  let items = readDataFile<any[]>('publications.json', []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `Publication ${id} not found` });
    return;
  }

  const existing = normalizeRecord<any>(items[idx]);
  const updated = {
    ...existing,
    ...data,
    id,
    year: data.year ? Number(data.year) : existing.year
  };

  items[idx] = updated;
  writeDataFile('publications.json', items);

  res.json({
    success: true,
    message: 'Publication updated successfully',
    publication: updated,
    publications: normalizeList(items)
  });
});

apiRouter.delete('/publications/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readDataFile<any[]>('publications.json', []);
  const filtered = items.filter(i => i.id !== id);
  writeDataFile('publications.json', filtered);

  res.json({
    success: true,
    message: 'Publication removed successfully',
    publications: normalizeList(filtered)
  });
});

// -------------------------------------------------------------
// Team Members
// -------------------------------------------------------------
apiRouter.get('/team', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('team_members.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(m => m.published !== false && m.isPublic !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  res.json({ success: true, members: items });
});

apiRouter.post('/team', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  if (!data.name || !data.role || !data.category) {
    res.status(400).json({ success: false, message: 'Name, role, and category are required' });
    return;
  }

  let items = readDataFile<any[]>('team_members.json', []);
  const newMember = {
    id: data.id || `member-${Date.now()}`,
    name: data.name.trim(),
    role: data.role.trim(),
    category: data.category,
    credentials: data.credentials || '',
    bio: data.bio || '',
    detailedBio: data.detailedBio || '',
    labRoleDetail: data.labRoleDetail || '',
    focus: Array.isArray(data.focus) ? data.focus : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    contributions: Array.isArray(data.contributions) ? data.contributions : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    publications: Array.isArray(data.publications) ? data.publications : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
    avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    email: data.email || null,
    scholarUrl: data.scholarUrl || null,
    orcidUrl: data.orcidUrl || null,
    researchGateUrl: data.researchGateUrl || null,
    websiteUrl: data.websiteUrl || null,
    linkedinUrl: data.linkedinUrl || null,
    githubUrl: data.githubUrl || null,
    twitterUrl: data.twitterUrl || null,
    instagramUrl: data.instagramUrl || null,
    showEmail: data.showEmail ?? true,
    showSocialLinks: data.showSocialLinks ?? true,
    showPublications: data.showPublications ?? true,
    showProjects: data.showProjects ?? true,
    isPublic: data.isPublic ?? true,
    published: data.published ?? true,
    orderIndex: data.orderIndex ?? items.length
  };

  items.push(newMember);
  writeDataFile('team_members.json', items);

  res.status(201).json({
    success: true,
    message: 'Team member added successfully',
    member: newMember,
    members: normalizeList(items)
  });
});

apiRouter.put('/team/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body || {};
  let items = readDataFile<any[]>('team_members.json', []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `Team member ${id} not found` });
    return;
  }

  const existing = normalizeRecord<any>(items[idx]);
  const updated = {
    ...existing,
    ...data,
    id
  };

  items[idx] = updated;
  writeDataFile('team_members.json', items);

  res.json({
    success: true,
    message: 'Team member updated successfully',
    member: updated,
    members: normalizeList(items)
  });
});

apiRouter.delete('/team/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readDataFile<any[]>('team_members.json', []);
  const filtered = items.filter(i => i.id !== id);
  writeDataFile('team_members.json', filtered);

  res.json({
    success: true,
    message: 'Team member removed successfully',
    members: normalizeList(filtered)
  });
});

// -------------------------------------------------------------
// Facilities
// -------------------------------------------------------------
apiRouter.get('/facilities', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('facilities.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(f => f.published !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  res.json({ success: true, facilities: items });
});

apiRouter.post('/facilities', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  if (!data.title || !data.tag || !data.desc) {
    res.status(400).json({ success: false, message: 'Title, tag, and description are required' });
    return;
  }

  let items = readDataFile<any[]>('facilities.json', []);
  const newFacility = {
    id: data.id || `fac-${Date.now()}`,
    title: data.title.trim(),
    tag: data.tag.trim(),
    desc: data.desc.trim(),
    specs: Array.isArray(data.specs) ? data.specs : [],
    status: data.status || 'Operational',
    iconName: data.iconName || 'Activity',
    imageUrl: data.imageUrl || null,
    published: data.published ?? true,
    orderIndex: data.orderIndex ?? items.length + 1
  };

  items.push(newFacility);
  writeDataFile('facilities.json', items);

  res.status(201).json({
    success: true,
    message: 'Facility added successfully',
    facility: newFacility,
    facilities: normalizeList(items)
  });
});

apiRouter.put('/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body || {};
  let items = readDataFile<any[]>('facilities.json', []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `Facility ${id} not found` });
    return;
  }

  const existing = normalizeRecord<any>(items[idx]);
  const updated = {
    ...existing,
    ...data,
    id
  };

  items[idx] = updated;
  writeDataFile('facilities.json', items);

  res.json({
    success: true,
    message: 'Facility updated successfully',
    facility: updated,
    facilities: normalizeList(items)
  });
});

apiRouter.delete('/facilities/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readDataFile<any[]>('facilities.json', []);
  const filtered = items.filter(i => i.id !== id);
  writeDataFile('facilities.json', filtered);

  res.json({
    success: true,
    message: 'Facility removed successfully',
    facilities: normalizeList(filtered)
  });
});

apiRouter.put('/facilities-reorder', requireAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ success: false, message: 'orderedIds must be an array of IDs' });
    return;
  }

  let items = readDataFile<any[]>('facilities.json', []);
  const idMap = new Map(items.map(i => [i.id, normalizeRecord<any>(i)]));

  orderedIds.forEach((id, index) => {
    const it = idMap.get(id);
    if (it) {
      it.orderIndex = index + 1;
    }
  });

  const updated = Array.from(idMap.values()).sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  writeDataFile('facilities.json', updated);

  res.json({
    success: true,
    message: 'Facilities reordered successfully',
    facilities: updated
  });
});

// -------------------------------------------------------------
// Collaborators
// -------------------------------------------------------------
apiRouter.get('/collaborators', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('collaborators.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(c => c.published !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  res.json({ success: true, collaborators: items });
});

apiRouter.post('/collaborators', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  if (!data.name || !data.category || !data.location || !data.description) {
    res.status(400).json({ success: false, message: 'Name, category, location, and description are required' });
    return;
  }

  let items = readDataFile<any[]>('collaborators.json', []);
  const newCollab = {
    id: data.id || `collab-${Date.now()}`,
    name: data.name.trim(),
    shortName: data.shortName?.trim() || null,
    category: data.category,
    location: data.location.trim(),
    logoUrl: data.logoUrl?.trim() || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
    description: data.description.trim(),
    jointFocus: Array.isArray(data.jointFocus) ? data.jointFocus : [],
    keyContacts: Array.isArray(data.keyContacts) ? data.keyContacts : [],
    activeTrials: Array.isArray(data.activeTrials) ? data.activeTrials : [],
    websiteUrl: data.websiteUrl?.trim() || null,
    isFeatured: data.isFeatured ?? true,
    published: data.published ?? true,
    orderIndex: data.orderIndex ?? items.length + 1
  };

  items.push(newCollab);
  writeDataFile('collaborators.json', items);

  res.status(201).json({
    success: true,
    message: 'Collaborator added successfully',
    collaborator: newCollab,
    collaborators: normalizeList(items)
  });
});

apiRouter.put('/collaborators/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body || {};
  let items = readDataFile<any[]>('collaborators.json', []);
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `Collaborator ${id} not found` });
    return;
  }

  const existing = normalizeRecord<any>(items[idx]);
  const updated = {
    ...existing,
    ...data,
    id
  };

  items[idx] = updated;
  writeDataFile('collaborators.json', items);

  res.json({
    success: true,
    message: 'Collaborator updated successfully',
    collaborator: updated,
    collaborators: normalizeList(items)
  });
});

apiRouter.delete('/collaborators/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readDataFile<any[]>('collaborators.json', []);
  const filtered = items.filter(i => i.id !== id);
  writeDataFile('collaborators.json', filtered);

  res.json({
    success: true,
    message: 'Collaborator removed successfully',
    collaborators: normalizeList(filtered)
  });
});

apiRouter.put('/collaborators-reorder', requireAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ success: false, message: 'orderedIds must be an array of IDs' });
    return;
  }

  let items = readDataFile<any[]>('collaborators.json', []);
  const idMap = new Map(items.map(i => [i.id, normalizeRecord<any>(i)]));

  orderedIds.forEach((id, index) => {
    const it = idMap.get(id);
    if (it) {
      it.orderIndex = index + 1;
    }
  });

  const updated = Array.from(idMap.values()).sort((a, b) => (a.orderIndex ?? 999) - (b.orderIndex ?? 999));
  writeDataFile('collaborators.json', updated);

  res.json({
    success: true,
    message: 'Collaborators reordered successfully',
    collaborators: updated
  });
});

// -------------------------------------------------------------
// Contact & Inquiries
// -------------------------------------------------------------
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, message, affiliation, role, interestType } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    return;
  }

  let inquiries = readDataFile<any[]>('contact_inquiries.json', []);
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    affiliation: affiliation?.trim() || null,
    role: role?.trim() || null,
    interestType: interestType || 'General Inquiry',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'New'
  };

  inquiries.unshift(newInquiry);
  writeDataFile('contact_inquiries.json', inquiries);

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting MINDH Lab! Your inquiry has been securely logged.',
    inquiry: newInquiry
  });
});

apiRouter.get('/contact', (_req: Request, res: Response) => {
  const inquiries = readDataFile<any[]>('contact_inquiries.json', []);
  res.json({ success: true, inquiries: normalizeList(inquiries) });
});

apiRouter.get('/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  const inquiries = readDataFile<any[]>('contact_inquiries.json', []);
  res.json({ success: true, inquiries: normalizeList(inquiries) });
});

apiRouter.all('/admin/inquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    res.status(400).json({ success: false, message: 'Status is required' });
    return;
  }

  let inquiries = readDataFile<any[]>('contact_inquiries.json', []);
  const idx = inquiries.findIndex(i => i.id === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: `Inquiry ${id} not found` });
    return;
  }

  inquiries[idx].status = status;
  writeDataFile('contact_inquiries.json', inquiries);

  res.json({
    success: true,
    message: 'Status updated successfully',
    inquiry: normalizeRecord(inquiries[idx])
  });
});

apiRouter.delete('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  let inquiries = readDataFile<any[]>('contact_inquiries.json', []);
  const filtered = inquiries.filter(i => i.id !== id);
  writeDataFile('contact_inquiries.json', filtered);

  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

// -------------------------------------------------------------
// Site Settings & Configs
// -------------------------------------------------------------
apiRouter.get('/homepage-config', (_req: Request, res: Response) => {
  const list = readDataFile<any[]>('homepage_config.json', []);
  const cfg = list[0] ? normalizeRecord(list[0]) : {};
  res.json({ success: true, config: cfg });
});

apiRouter.put('/homepage-config', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  let list = readDataFile<any[]>('homepage_config.json', []);
  const existing = list[0] ? normalizeRecord<any>(list[0]) : { id: 'default' };
  const updated = { ...existing, ...data, id: 'default' };
  writeDataFile('homepage_config.json', [updated]);
  res.json({ success: true, message: 'Homepage configuration updated', config: updated });
});

apiRouter.get('/about-config', (_req: Request, res: Response) => {
  const list = readDataFile<any[]>('about_config.json', []);
  const cfg = list[0] ? normalizeRecord(list[0]) : {};
  res.json({ success: true, config: cfg });
});

apiRouter.put('/about-config', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  let list = readDataFile<any[]>('about_config.json', []);
  const existing = list[0] ? normalizeRecord<any>(list[0]) : { id: 'default' };
  const updated = { ...existing, ...data, id: 'default' };
  writeDataFile('about_config.json', [updated]);
  res.json({ success: true, message: 'About configuration updated', config: updated });
});

apiRouter.get('/research', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('research_pillars.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(r => r.published !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  res.json({ success: true, pillars: items });
});

apiRouter.get('/gallery', (req: Request, res: Response) => {
  const token = extractToken(req);
  const isAdmin = Boolean(getSessionUser(token));

  let items = readDataFile<any[]>('gallery_items.json', []);
  items = normalizeList(items);

  if (!isAdmin) {
    items = items.filter(g => g.published !== false);
  }

  items.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  res.json({ success: true, items });
});

apiRouter.get('/settings', (_req: Request, res: Response) => {
  const list = readDataFile<any[]>('site_settings.json', []);
  const sett = list[0] ? normalizeRecord(list[0]) : {};
  res.json({ success: true, settings: sett });
});

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  const data = req.body || {};
  let list = readDataFile<any[]>('site_settings.json', []);
  const existing = list[0] ? normalizeRecord<any>(list[0]) : { id: 'default' };
  const updated = { ...existing, ...data, id: 'default' };
  writeDataFile('site_settings.json', [updated]);
  res.json({ success: true, message: 'Site settings updated successfully', settings: updated });
});

// -------------------------------------------------------------
// Uploads
// -------------------------------------------------------------
apiRouter.post('/admin/upload', requireAdmin, (req: Request, res: Response) => {
  const { filename, base64Data } = req.body || {};
  if (!filename || !base64Data) {
    res.status(400).json({ success: false, message: 'Filename and base64Data are required' });
    return;
  }

  try {
    const ext = path.extname(filename) || '.png';
    const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    // Strip prefix if data url (e.g. data:image/png;base64,)
    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > 10 * 1024 * 1024) {
      res.status(413).json({ success: false, message: 'File exceeds 10MB limit' });
      return;
    }

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${safeName}`;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      url: publicUrl,
      filename: safeName
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to process file upload' });
  }
});

apiRouter.delete('/admin/upload', requireAdmin, (req: Request, res: Response) => {
  const { url } = req.body || {};
  if (!url || !url.startsWith('/uploads/')) {
    res.status(400).json({ success: false, message: 'Valid upload url is required' });
    return;
  }

  const filename = path.basename(url);
  const filePath = path.join(UPLOADS_DIR, filename);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Error unlinking file:', e);
    }
  }

  res.json({ success: true, message: 'File deleted successfully' });
});
