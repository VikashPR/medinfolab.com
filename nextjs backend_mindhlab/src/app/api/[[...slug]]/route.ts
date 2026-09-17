import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  getAdminUsers,
  saveAdminUsers,
  verifyPassword,
  hashPassword,
  createSession,
  invalidateSession,
  getSession,
} from "@/server/auth";
import {
  getNewsData,
  saveNewsData,
  sortNewsReverseChronological,
  getTeamData,
  saveTeamData,
  sortTeamMembers,
  getCollaboratorsData,
  saveCollaboratorsData,
  sortCollaborators,
  getPublicationsData,
  savePublicationsData,
  sortPublications,
  getFacilitiesData,
  saveFacilitiesData,
  sortFacilities,
  getInquiriesData,
  saveInquiriesData,
  getHomepageData,
  saveHomepageData,
  getAboutData,
  saveAboutData,
  getResearchData,
  saveResearchData,
  getGalleryData,
  saveGalleryData,
  getSettingsData,
  saveSettingsData,
  INITIAL_NEWS,
  INITIAL_TEAM,
  INITIAL_COLLABORATORS,
  INITIAL_PUBLICATIONS,
  INITIAL_FACILITIES,
} from "@/server/dataStore";
import { generateClinicalText } from "@/server/gemini";
import {
  Publication,
  LabNewsItem,
  TeamMember,
  Collaborator,
  LabFacility,
  ContactInquiry,
  ResearchPillar,
  GalleryItem,
  HomepageConfig,
  AboutConfig,
  SiteSettings,
} from "@/src/types";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  const cookie = request.cookies.get("mindh_admin_token");
  if (cookie?.value) {
    return cookie.value;
  }
  return null;
}

function checkAdminAuth(request: NextRequest): { authenticated: boolean; session?: any; response?: NextResponse } {
  const token = extractToken(request);
  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, message: "Authentication required (Next.js admin security)" },
        { status: 401 }
      ),
    };
  }

  const session = getSession(token);
  if (!session) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, message: "Session expired or invalid. Please re-authenticate." },
        { status: 401 }
      ),
    };
  }

  return { authenticated: true, session };
}

// -------------------------------------------------------------
// GET HANDLER
// -------------------------------------------------------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const route = slugParts.join("/");

  // 1. Health & Diagnostics
  if (route === "health" || route === "") {
    return NextResponse.json({
      status: "ok",
      framework: "Next.js 16 (App Router)",
      runtime: "Node.js",
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
    });
  }

  // 2. Auth Session Check (/api/auth/me)
  if (route === "auth/me") {
    const token = extractToken(request);
    const session = getSession(token || undefined);
    if (!session) {
      return NextResponse.json({ authenticated: false, message: "Not authenticated" }, { status: 401 });
    }
    const users = getAdminUsers();
    const user = users.find((u) => u.id === session.userId);
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        username: session.username,
        role: session.role,
        email: user?.email || "admin@mindh-lab.org",
        lastLogin: user?.lastLogin,
      },
    });
  }

  // 3. Publications (/api/publications)
  if (route === "publications") {
    const token = extractToken(request);
    const isAdmin = !!getSession(token || undefined);
    const list = getPublicationsData();
    const filtered = isAdmin ? list : list.filter((p) => p.published !== false);
    const sorted = sortPublications(filtered);
    return NextResponse.json({ success: true, count: sorted.length, publications: sorted });
  }

  // 4. News (/api/news)
  if (route === "news") {
    const token = extractToken(request);
    const isAdmin = !!getSession(token || undefined);
    const list = getNewsData();
    const filtered = isAdmin ? list : list.filter((n) => n.published !== false);
    const sorted = sortNewsReverseChronological(filtered);
    return NextResponse.json({ success: true, count: sorted.length, news: sorted });
  }

  // 5. Team (/api/team)
  if (route === "team") {
    const token = extractToken(request);
    const isAdmin = !!getSession(token || undefined);
    const list = getTeamData();
    const filtered = isAdmin ? list : list.filter((m) => m.published !== false && m.isPublic !== false);
    const sorted = sortTeamMembers(filtered);
    return NextResponse.json({ success: true, count: sorted.length, team: sorted });
  }

  // 6. Collaborators (/api/collaborators)
  if (route === "collaborators") {
    const token = extractToken(request);
    const isAdmin = !!getSession(token || undefined);
    const list = getCollaboratorsData();
    const filtered = isAdmin ? list : list.filter((c) => c.published !== false);
    const sorted = sortCollaborators(filtered);
    return NextResponse.json({ success: true, count: sorted.length, collaborators: sorted });
  }

  // 7. Facilities (/api/facilities)
  if (route === "facilities") {
    const token = extractToken(request);
    const isAdmin = !!getSession(token || undefined);
    const list = getFacilitiesData();
    const filtered = isAdmin ? list : list.filter((f) => f.published !== false);
    const sorted = sortFacilities(filtered);
    return NextResponse.json({ success: true, count: sorted.length, facilities: sorted });
  }

  // 8. Contact Inquiries (/api/contact or /api/admin/inquiries)
  if (route === "contact" || route === "admin/inquiries") {
    if (route === "admin/inquiries") {
      const auth = checkAdminAuth(request);
      if (!auth.authenticated) return auth.response!;
    }
    const inquiries = getInquiriesData();
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  }

  // 9. Research Pillars (/api/research)
  if (route === "research") {
    const research = getResearchData();
    return NextResponse.json({ success: true, count: research.length, research });
  }

  // 10. Gallery Items (/api/gallery)
  if (route === "gallery") {
    const gallery = getGalleryData();
    return NextResponse.json({ success: true, count: gallery.length, gallery });
  }

  // 11. Configuration Settings
  if (route === "homepage-config") {
    return NextResponse.json({ success: true, config: getHomepageData() });
  }
  if (route === "about-config") {
    return NextResponse.json({ success: true, config: getAboutData() });
  }
  if (route === "settings") {
    return NextResponse.json({ success: true, settings: getSettingsData() });
  }

  return NextResponse.json(
    { success: false, message: `GET /api/${route} not found on Next.js server` },
    { status: 404 }
  );
}

// -------------------------------------------------------------
// POST HANDLER
// -------------------------------------------------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const route = slugParts.join("/");

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // 1. Auth: Login
  if (route === "auth/login") {
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password required" }, { status: 400 });
    }

    const users = getAdminUsers();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === String(username).toLowerCase() ||
        u.email.toLowerCase() === String(username).toLowerCase()
    );

    if (!user || !verifyPassword(password, user.salt, user.hash)) {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 });
    }

    user.lastLogin = new Date().toISOString();
    saveAdminUsers(users);

    const session = createSession(user);
    const response = NextResponse.json({
      success: true,
      message: "Login successful (Next.js)",
      token: session.token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("mindh_admin_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  }

  // 2. Auth: Logout
  if (route === "auth/logout") {
    const token = extractToken(request);
    if (token) {
      invalidateSession(token);
    }
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.delete("mindh_admin_token");
    return response;
  }

  // 3. Auth: Change Password
  if (route === "auth/change-password") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Both current and new password required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });
    }

    const users = getAdminUsers();
    const user = users.find((u) => u.id === auth.session.userId);
    if (!user || !verifyPassword(currentPassword, user.salt, user.hash)) {
      return NextResponse.json({ success: false, message: "Current password does not match" }, { status: 400 });
    }

    const { salt, hash } = hashPassword(newPassword);
    user.salt = salt;
    user.hash = hash;
    saveAdminUsers(users);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  }

  // 4. Publications: Create
  if (route === "publications") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { title, authors, journal, year, topic, doiUrl, pdfUrl, codeUrl, abstract, highlight, bibtex, published, orderIndex } = body;
    if (!title || !authors || !journal || !year) {
      return NextResponse.json({ success: false, message: "Missing required fields (title, authors, journal, year)" }, { status: 400 });
    }

    const list = getPublicationsData();
    const newPub: Publication = {
      id: `pub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      authors: String(authors).trim(),
      journal: String(journal).trim(),
      year: Number(year) || new Date().getFullYear(),
      topic: topic || "Physiological Monitoring",
      doiUrl: doiUrl ? String(doiUrl).trim() : "",
      pdfUrl: pdfUrl ? String(pdfUrl).trim() : "",
      codeUrl: codeUrl ? String(codeUrl).trim() : undefined,
      abstract: abstract ? String(abstract).trim() : "",
      highlight: highlight ? String(highlight).trim() : undefined,
      bibtex: bibtex ? String(bibtex).trim() : "",
      published: published !== false,
      orderIndex: typeof orderIndex === "number" ? orderIndex : list.length + 1,
      createdAt: new Date().toISOString(),
    };

    list.push(newPub);
    savePublicationsData(list);
    return NextResponse.json({ success: true, message: "Publication created successfully", publication: newPub }, { status: 201 });
  }

  // 5. Publications: Reset
  if (route === "publications/reset") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;
    savePublicationsData(INITIAL_PUBLICATIONS);
    return NextResponse.json({ success: true, message: "Publications reset to default seeds", publications: INITIAL_PUBLICATIONS });
  }

  // 6. News: Create
  if (route === "news") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { title, description, summary, image, date, category, linkText, linkUrl, published } = body;
    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const list = getNewsData();
    const newItem: LabNewsItem = {
      id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      description: String(description).trim(),
      summary: summary ? String(summary).trim() : undefined,
      image: image ? String(image).trim() : undefined,
      date: date || new Date().toISOString().split("T")[0],
      category: category || "Lab Update",
      linkText: linkText ? String(linkText).trim() : undefined,
      linkUrl: linkUrl ? String(linkUrl).trim() : undefined,
      published: published !== false,
      createdAt: new Date().toISOString(),
    };

    list.unshift(newItem);
    saveNewsData(list);
    return NextResponse.json({ success: true, message: "News item created successfully", newsItem: newItem }, { status: 201 });
  }

  // 7. News: Reset
  if (route === "news/reset") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;
    saveNewsData(INITIAL_NEWS);
    return NextResponse.json({ success: true, message: "News reset to default seeds", news: INITIAL_NEWS });
  }

  // 8. Team: Create
  if (route === "team") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { name, role, category, credentials, bio, avatarUrl } = body;
    if (!name || !role) {
      return NextResponse.json({ success: false, message: "Name and role are required" }, { status: 400 });
    }

    const list = getTeamData();
    const newMember: TeamMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: String(name).trim(),
      role: String(role).trim(),
      category: category || "Researchers",
      credentials: credentials || "",
      bio: bio || "",
      avatarUrl:
        avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      focus: Array.isArray(body.focus) ? body.focus : [],
      skills: Array.isArray(body.skills) ? body.skills : [],
      contributions: Array.isArray(body.contributions) ? body.contributions : [],
      projects: Array.isArray(body.projects) ? body.projects : [],
      publications: Array.isArray(body.publications) ? body.publications : [],
      awards: Array.isArray(body.awards) ? body.awards : [],
      email: body.email || undefined,
      scholarUrl: body.scholarUrl || undefined,
      orcidUrl: body.orcidUrl || undefined,
      linkedinUrl: body.linkedinUrl || undefined,
      websiteUrl: body.websiteUrl || undefined,
      showEmail: body.showEmail !== false,
      showSocialLinks: body.showSocialLinks !== false,
      showPublications: body.showPublications !== false,
      showProjects: body.showProjects !== false,
      isPublic: body.isPublic !== false,
      published: body.published !== false,
      orderIndex: typeof body.orderIndex === "number" ? body.orderIndex : list.length + 1,
    };

    list.push(newMember);
    saveTeamData(list);
    return NextResponse.json({ success: true, message: "Team member added successfully", member: newMember }, { status: 201 });
  }

  // 9. Team: Reset
  if (route === "team/reset") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;
    saveTeamData(INITIAL_TEAM);
    return NextResponse.json({ success: true, message: "Team roster reset to default seeds", team: INITIAL_TEAM });
  }

  // 10. Collaborators: Create
  if (route === "collaborators") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { name, category, location, description, websiteUrl, logoUrl, jointFocus, keyContacts, activeTrials, isFeatured, published } = body;
    if (!name || !description) {
      return NextResponse.json({ success: false, message: "Name and description are required" }, { status: 400 });
    }

    const list = getCollaboratorsData();
    const newCollab: Collaborator = {
      id: `collab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: String(name).trim(),
      shortName: body.shortName ? String(body.shortName).trim() : undefined,
      category: category || "Clinical & Hospital",
      location: location || "Global",
      description: String(description).trim(),
      websiteUrl: websiteUrl ? String(websiteUrl).trim() : undefined,
      logoUrl:
        logoUrl ||
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
      jointFocus: Array.isArray(jointFocus) ? jointFocus : [],
      keyContacts: Array.isArray(keyContacts) ? keyContacts : [],
      activeTrials: Array.isArray(activeTrials) ? activeTrials : [],
      isFeatured: Boolean(isFeatured),
      published: published !== false,
      orderIndex: typeof body.orderIndex === "number" ? body.orderIndex : list.length + 1,
    };

    list.push(newCollab);
    saveCollaboratorsData(list);
    return NextResponse.json({ success: true, message: "Collaborator added successfully", collaborator: newCollab }, { status: 201 });
  }

  // 11. Collaborators: Reset
  if (route === "collaborators/reset") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;
    saveCollaboratorsData(INITIAL_COLLABORATORS);
    return NextResponse.json({ success: true, message: "Collaborators reset to default seeds", collaborators: INITIAL_COLLABORATORS });
  }

  // 12. Facilities: Create
  if (route === "facilities") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { title, tag, desc, specs, status, iconName, imageUrl, published, orderIndex } = body;
    if (!title || !desc) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const list = getFacilitiesData();
    const newFacility: LabFacility = {
      id: `fac-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      tag: tag || "Instrument Testbench",
      desc: String(desc).trim(),
      specs: Array.isArray(specs) ? specs : [],
      status: status || "Operational",
      iconName: iconName || "Layers",
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
      published: published !== false,
      orderIndex: typeof orderIndex === "number" ? orderIndex : list.length + 1,
    };

    list.push(newFacility);
    saveFacilitiesData(list);
    return NextResponse.json({ success: true, message: "Facility added successfully", facility: newFacility }, { status: 201 });
  }

  // 13. Facilities: Reset
  if (route === "facilities/reset") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;
    saveFacilitiesData(INITIAL_FACILITIES);
    return NextResponse.json({ success: true, message: "Facilities reset to default seeds", facilities: INITIAL_FACILITIES });
  }

  // 14. Contact Inquiry Submission (Public)
  if (route === "contact") {
    const { name, email, message, interestType, affiliation, role } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please provide your full name, email address, and message description." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address." }, { status: 400 });
    }

    const inquiries = getInquiriesData();
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: String(name).trim(),
      email: String(email).trim(),
      affiliation: affiliation ? String(affiliation).trim() : undefined,
      role: role ? String(role).trim() : undefined,
      interestType: interestType || "General Research Collaboration",
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: "New",
    };

    inquiries.unshift(newInquiry);
    saveInquiriesData(inquiries);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your collaboration inquiry has been routed to the MINDH laboratory review board.",
        inquiryId: newInquiry.id,
      },
      { status: 201 }
    );
  }

  // 15. Research Pillars: Create
  if (route === "research") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { title, subtitle, description, technologies, metrics, icon, grantNumber, status, published, orderIndex } = body;
    if (!title || !description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const list = getResearchData();
    const newPillar: ResearchPillar = {
      id: `pillar-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : "",
      description: String(description).trim(),
      technologies: Array.isArray(technologies) ? technologies : [],
      metrics: Array.isArray(metrics) ? metrics : [],
      icon: icon || "Activity",
      grantNumber: grantNumber ? String(grantNumber).trim() : undefined,
      status: status || "Active",
      published: published !== false,
      orderIndex: typeof orderIndex === "number" ? orderIndex : list.length,
    };

    list.push(newPillar);
    saveResearchData(list);
    return NextResponse.json({ success: true, message: "Research pillar added successfully", pillar: newPillar }, { status: 201 });
  }

  // 16. Gallery Items: Create
  if (route === "gallery") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { title, caption, category, imageUrl, date, published, orderIndex } = body;
    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, message: "Title and imageUrl are required" }, { status: 400 });
    }

    const list = getGalleryData();
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: String(title).trim(),
      caption: caption ? String(caption).trim() : "",
      category: category || "Experimental Setup",
      imageUrl: String(imageUrl).trim(),
      date: date || new Date().toISOString().split("T")[0],
      published: published !== false,
      orderIndex: typeof orderIndex === "number" ? orderIndex : list.length,
    };

    list.push(newItem);
    saveGalleryData(list);
    return NextResponse.json({ success: true, message: "Gallery item added successfully", item: newItem }, { status: 201 });
  }

  // 17. File Uploads (/api/upload & /api/admin/upload)
  if (route === "upload" || route === "admin/upload") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { filename, base64Data, mimeType } = body;
    if (!base64Data || !mimeType) {
      return NextResponse.json({ success: false, message: "Missing base64Data or mimeType" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `File type '${mimeType}' is not permitted.` },
        { status: 400 }
      );
    }

    const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
    const fileBuffer = Buffer.from(cleanBase64, "base64");

    if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: "File exceeds maximum allowed size of 10MB." },
        { status: 400 }
      );
    }

    const rawName = (filename || "uploaded-file").replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(rawName) || (mimeType === "application/pdf" ? ".pdf" : ".png");
    const baseWithoutExt = path.basename(rawName, ext);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${baseWithoutExt}${ext}`;

    const targetPath = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(targetPath, fileBuffer);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Next.js storage",
      url: `/uploads/${uniqueName}`,
      filename: uniqueName,
      sizeBytes: fileBuffer.length,
      mimeType,
    });
  }

  // 18. File Delete (/api/upload/delete)
  if (route === "upload/delete") {
    const auth = checkAdminAuth(request);
    if (!auth.authenticated) return auth.response!;

    const { url, filename } = body;
    const targetFile = filename || (url ? path.basename(url) : null);
    if (!targetFile) {
      return NextResponse.json({ success: false, message: "filename or url required" }, { status: 400 });
    }

    const safeName = path.basename(targetFile);
    const fullPath = path.join(UPLOADS_DIR, safeName);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return NextResponse.json({ success: true, message: "File removed from disk" });
  }

  // 19. Gemini Clinical AI Assistant (/api/ai/generate)
  if (route === "ai/generate") {
    const { prompt } = body;
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ success: false, message: "Missing prompt in request body" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "GEMINI_API_KEY is not configured in the server environment.",
        },
        { status: 503 }
      );
    }

    try {
      const generated = await generateClinicalText(prompt);
      return NextResponse.json({
        success: true,
        text: generated,
        model: "gemini-3.8-flash",
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err?.message || "Failed to generate AI response." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, message: `POST /api/${route} not found on Next.js server` },
    { status: 404 }
  );
}

// -------------------------------------------------------------
// PUT HANDLER
// -------------------------------------------------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const route = slugParts.join("/");

  const auth = checkAdminAuth(request);
  if (!auth.authenticated) return auth.response!;

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // 1. Reordering endpoints
  if (route === "publications-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getPublicationsData();
    const updated = list.map((pub) => {
      const match = items.find((i: any) => i.id === pub.id);
      return match && typeof match.orderIndex === "number" ? { ...pub, orderIndex: match.orderIndex } : pub;
    });
    savePublicationsData(updated);
    return NextResponse.json({ success: true, message: "Publications reordered", publications: sortPublications(updated) });
  }

  if (route === "news-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getNewsData();
    const updated = list.map((item) => {
      const match = items.find((i: any) => i.id === item.id);
      return match && typeof match.orderIndex === "number" ? { ...item, orderIndex: match.orderIndex } : item;
    });
    saveNewsData(updated);
    return NextResponse.json({ success: true, message: "News reordered", news: sortNewsReverseChronological(updated) });
  }

  if (route === "team-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getTeamData();
    const updated = list.map((member) => {
      const match = items.find((i: any) => i.id === member.id);
      return match && typeof match.orderIndex === "number" ? { ...member, orderIndex: match.orderIndex } : member;
    });
    saveTeamData(updated);
    return NextResponse.json({ success: true, message: "Team members reordered", team: sortTeamMembers(updated) });
  }

  if (route === "collaborators-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getCollaboratorsData();
    const updated = list.map((c) => {
      const match = items.find((i: any) => i.id === c.id);
      return match && typeof match.orderIndex === "number" ? { ...c, orderIndex: match.orderIndex } : c;
    });
    saveCollaboratorsData(updated);
    return NextResponse.json({ success: true, message: "Collaborators reordered", collaborators: sortCollaborators(updated) });
  }

  if (route === "facilities-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getFacilitiesData();
    const updated = list.map((fac) => {
      const match = items.find((i: any) => i.id === fac.id);
      return match && typeof match.orderIndex === "number" ? { ...fac, orderIndex: match.orderIndex } : fac;
    });
    saveFacilitiesData(updated);
    return NextResponse.json({ success: true, message: "Facilities reordered", facilities: sortFacilities(updated) });
  }

  if (route === "research-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getResearchData();
    const updated = list.map((p) => {
      const match = items.find((i: any) => i.id === p.id);
      return match && typeof match.orderIndex === "number" ? { ...p, orderIndex: match.orderIndex } : p;
    });
    saveResearchData(updated);
    return NextResponse.json({ success: true, message: "Research pillars reordered", research: updated });
  }

  if (route === "gallery-reorder") {
    const { items } = body;
    if (!Array.isArray(items)) return NextResponse.json({ success: false, message: "items must be an array" }, { status: 400 });
    const list = getGalleryData();
    const updated = list.map((g) => {
      const match = items.find((i: any) => i.id === g.id);
      return match && typeof match.orderIndex === "number" ? { ...g, orderIndex: match.orderIndex } : g;
    });
    saveGalleryData(updated);
    return NextResponse.json({ success: true, message: "Gallery reordered", gallery: updated });
  }

  // 2. Configuration Settings Updates
  if (route === "homepage-config") {
    const current = getHomepageData();
    const updated: HomepageConfig = { ...current, ...body };
    saveHomepageData(updated);
    return NextResponse.json({ success: true, message: "Homepage config updated", config: updated });
  }

  if (route === "about-config") {
    const current = getAboutData();
    const updated: AboutConfig = { ...current, ...body };
    saveAboutData(updated);
    return NextResponse.json({ success: true, message: "About config updated", config: updated });
  }

  if (route === "settings") {
    const current = getSettingsData();
    const updated: SiteSettings = {
      ...current,
      ...body,
      socialLinks: {
        ...current.socialLinks,
        ...(body.socialLinks || {}),
      },
    };
    saveSettingsData(updated);
    return NextResponse.json({ success: true, message: "Settings updated", settings: updated });
  }

  // 3. Admin Inquiry Status Update (/api/admin/inquiries/:id/status)
  if (slugParts[0] === "admin" && slugParts[1] === "inquiries" && slugParts[3] === "status") {
    const id = slugParts[2];
    const { status } = body;
    const validStatuses = ["New", "Reviewed", "Replied", "Archived", "Pending"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }
    const inquiries = getInquiriesData();
    const inq = inquiries.find((i) => i.id === id);
    if (!inq) return NextResponse.json({ success: false, message: "Inquiry not found" }, { status: 404 });
    inq.status = status;
    saveInquiriesData(inquiries);
    return NextResponse.json({ success: true, message: "Status updated", inquiry: inq });
  }

  // 4. Entity Update by ID
  const entity = slugParts[0];
  const id = slugParts[1];

  if (entity === "publications" && id) {
    const list = getPublicationsData();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Publication not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id, year: body.year ? Number(body.year) : list[index].year };
    list[index] = updated;
    savePublicationsData(list);
    return NextResponse.json({ success: true, message: "Publication updated", publication: updated });
  }

  if (entity === "news" && id) {
    const list = getNewsData();
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "News item not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id, updatedAt: new Date().toISOString() };
    list[index] = updated;
    saveNewsData(list);
    return NextResponse.json({ success: true, message: "News item updated", newsItem: updated });
  }

  if (entity === "team" && id) {
    const list = getTeamData();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id };
    list[index] = updated;
    saveTeamData(list);
    return NextResponse.json({ success: true, message: "Team member updated", member: updated });
  }

  if (entity === "collaborators" && id) {
    const list = getCollaboratorsData();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Collaborator not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id };
    list[index] = updated;
    saveCollaboratorsData(list);
    return NextResponse.json({ success: true, message: "Collaborator updated", collaborator: updated });
  }

  if (entity === "facilities" && id) {
    const list = getFacilitiesData();
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Facility not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id };
    list[index] = updated;
    saveFacilitiesData(list);
    return NextResponse.json({ success: true, message: "Facility updated", facility: updated });
  }

  if (entity === "research" && id) {
    const list = getResearchData();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Research pillar not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id };
    list[index] = updated;
    saveResearchData(list);
    return NextResponse.json({ success: true, message: "Research pillar updated", pillar: updated });
  }

  if (entity === "gallery" && id) {
    const list = getGalleryData();
    const index = list.findIndex((g) => g.id === id);
    if (index === -1) return NextResponse.json({ success: false, message: "Gallery item not found" }, { status: 404 });
    const updated = { ...list[index], ...body, id };
    list[index] = updated;
    saveGalleryData(list);
    return NextResponse.json({ success: true, message: "Gallery item updated", item: updated });
  }

  return NextResponse.json(
    { success: false, message: `PUT /api/${route} not found on Next.js server` },
    { status: 404 }
  );
}

// -------------------------------------------------------------
// DELETE HANDLER
// -------------------------------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slugParts = resolvedParams.slug || [];
  const route = slugParts.join("/");

  const auth = checkAdminAuth(request);
  if (!auth.authenticated) return auth.response!;

  // Admin Inquiries Delete (/api/admin/inquiries/:id)
  if (slugParts[0] === "admin" && slugParts[1] === "inquiries" && slugParts[2]) {
    const id = slugParts[2];
    const inquiries = getInquiriesData();
    const filtered = inquiries.filter((i) => i.id !== id);
    if (filtered.length === inquiries.length) {
      return NextResponse.json({ success: false, message: "Inquiry not found" }, { status: 404 });
    }
    saveInquiriesData(filtered);
    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" });
  }

  // Admin Upload Delete (/api/admin/upload)
  if (route === "admin/upload") {
    let body: any = {};
    try {
      body = await request.json();
    } catch {}
    const { url, filename } = body;
    const target = filename || (url ? path.basename(url) : null);
    if (target) {
      const fullPath = path.join(UPLOADS_DIR, path.basename(target));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    return NextResponse.json({ success: true, message: "File removed" });
  }

  const entity = slugParts[0];
  const id = slugParts[1];

  if (entity === "publications" && id) {
    const list = getPublicationsData();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Publication not found" }, { status: 404 });
    savePublicationsData(filtered);
    return NextResponse.json({ success: true, message: "Publication deleted" });
  }

  if (entity === "news" && id) {
    const list = getNewsData();
    const filtered = list.filter((n) => n.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "News item not found" }, { status: 404 });
    saveNewsData(filtered);
    return NextResponse.json({ success: true, message: "News item deleted" });
  }

  if (entity === "team" && id) {
    const list = getTeamData();
    const filtered = list.filter((m) => m.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
    saveTeamData(filtered);
    return NextResponse.json({ success: true, message: "Team member deleted" });
  }

  if (entity === "collaborators" && id) {
    const list = getCollaboratorsData();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Collaborator not found" }, { status: 404 });
    saveCollaboratorsData(filtered);
    return NextResponse.json({ success: true, message: "Collaborator deleted" });
  }

  if (entity === "facilities" && id) {
    const list = getFacilitiesData();
    const filtered = list.filter((f) => f.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Facility not found" }, { status: 404 });
    saveFacilitiesData(filtered);
    return NextResponse.json({ success: true, message: "Facility deleted" });
  }

  if (entity === "research" && id) {
    const list = getResearchData();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Research pillar not found" }, { status: 404 });
    saveResearchData(filtered);
    return NextResponse.json({ success: true, message: "Research pillar deleted" });
  }

  if (entity === "gallery" && id) {
    const list = getGalleryData();
    const filtered = list.filter((g) => g.id !== id);
    if (filtered.length === list.length) return NextResponse.json({ success: false, message: "Gallery item not found" }, { status: 404 });
    saveGalleryData(filtered);
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  }

  return NextResponse.json(
    { success: false, message: `DELETE /api/${route} not found on Next.js server` },
    { status: 404 }
  );
}
