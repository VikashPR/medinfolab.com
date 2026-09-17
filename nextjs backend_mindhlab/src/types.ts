export type PublicationTopic = 'Physiological Monitoring' | 'Clinical AI' | 'Signal Processing' | 'Digital Health';

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  topic: PublicationTopic;
  doiUrl: string;
  pdfUrl: string;
  codeUrl?: string;
  abstract: string;
  highlight?: string;
  bibtex: string;
  published?: boolean;
  orderIndex?: number;
  createdAt?: string;
}

export interface ResearchPillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  icon: string;
  grantNumber?: string;
  status?: string;
  published?: boolean;
  orderIndex?: number;
}

export interface LabNewsItem {
  id: string;
  title: string;
  description: string;
  summary?: string;
  image?: string;
  date: string;
  category?: 'Paper Accepted' | 'Grant Award' | 'Clinical Pilot' | 'Keynote' | 'Lab Update' | string;
  linkText?: string;
  linkUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  orderIndex?: number;
}

export type TeamCategory = 'Faculty' | 'Researchers' | 'PhD Scholars' | 'Students' | 'Alumni' | 'Collaborators';

export type CollaboratorCategory =
  | 'Clinical & Hospital'
  | 'Academic Institution'
  | 'Industry & Technology'
  | 'Grant & Funding';

export interface Collaborator {
  id: string;
  name: string;
  shortName?: string;
  category: CollaboratorCategory;
  location: string;
  logoUrl?: string;
  description: string;
  jointFocus: string[];
  keyContacts?: string[];
  activeTrials?: string[];
  websiteUrl?: string;
  isFeatured?: boolean;
  published?: boolean;
  orderIndex?: number;
}

export interface ProjectItem {
  id?: string;
  title: string;
  status: 'Active' | 'Completed' | string;
  description?: string;
  link?: string;
}

export interface PublicationItem {
  id?: string;
  title: string;
  year: number | string;
  journalOrConference: string;
  link?: string;
  doi?: string;
}

export interface AwardItem {
  id?: string;
  title: string;
  year?: string | number;
  organization?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: TeamCategory;
  credentials: string;
  bio: string;
  detailedBio?: string;
  labRoleDetail?: string;
  focus: string[];
  skills?: string[];
  contributions?: string[];
  projects?: ProjectItem[];
  publications?: PublicationItem[];
  awards?: AwardItem[];
  avatarUrl: string;
  // External & social links
  email?: string;
  scholarUrl?: string;
  orcidUrl?: string;
  researchGateUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  // Visibility toggles
  showEmail?: boolean;
  showSocialLinks?: boolean;
  showPublications?: boolean;
  showProjects?: boolean;
  isPublic?: boolean;
  published?: boolean;
  orderIndex?: number;
}

export interface LabFacility {
  id: string;
  title: string;
  tag: string;
  desc: string;
  specs: string[];
  status: 'Operational' | '24/7 Compute' | 'Active Protocols' | 'Clinical Trials' | string;
  iconName?: string;
  imageUrl?: string;
  published?: boolean;
  orderIndex?: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  affiliation?: string;
  role?: string;
  interestType: string;
  message: string;
  createdAt: string;
  status?: 'New' | 'Reviewed' | 'Archived' | 'Replied';
}

export interface HomepageConfig {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  stats: { label: string; value: string; detail: string }[];
  calloutTitle: string;
  calloutSubtitle: string;
  calloutButtonText: string;
  calloutButtonLink: string;
}

export interface AboutConfig {
  missionTitle: string;
  missionDescription: string;
  translationPhilosophy: string;
  directorName: string;
  directorRole: string;
  directorBio: string;
  directorImage: string;
  milestones: { year: string; title: string; desc: string }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'Experimental Setup' | 'Conference' | 'Clinical Site' | 'Lab Life' | string;
  imageUrl: string;
  date?: string;
  published?: boolean;
  orderIndex?: number;
}

export interface SiteSettings {
  labName: string;
  tagline: string;
  headerLogoUrl?: string;
  footerLogoUrl?: string;
  bottomRightLogoUrl?: string;
  bottomRightLogoText?: string;
  bottomRightLogoLink?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  roomLocation: string;
  visitingHours: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    scholar: string;
    youtube: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'Super Admin' | 'Content Editor';
  createdAt: string;
  lastLogin?: string;
}
