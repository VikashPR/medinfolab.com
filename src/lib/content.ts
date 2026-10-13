import { getCollection } from "./firestore";

export type ResearchArea = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  order?: number;
  imageUrl?: string;
};

export type Publication = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  abstract: string;
  url: string;
  order?: number;
};

export type Facility = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  availability: string;
  order?: number;
  imageUrl?: string;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  url: string;
  order?: number;
  imageUrl?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  summary: string;
  initials: string;
  order?: number;
  avatarUrl?: string;
  category?: string;
  subType?: string;
  credentials?: string;
  bio?: string;
  detailedBio?: string;
  labRoleDetail?: string;
  focus?: string[];
  skills?: string[];
  contributions?: string[];
  social?: any;
};

export { navigation } from "./navigation";

export async function getResearchAreas(): Promise<ResearchArea[]> {
  const fromFirestore = await getCollection<ResearchArea>("research");
  return fromFirestore || [];
}

export async function getPublications(): Promise<Publication[]> {
  const fromFirestore = await getCollection<Publication>("publications");
  return fromFirestore || [];
}

export async function getFacilities(): Promise<Facility[]> {
  const fromFirestore = await getCollection<Facility>("facilities");
  return fromFirestore || [];
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const fromFirestore = await getCollection<NewsItem>("news");
  return fromFirestore || [];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const fromFirestore = await getCollection<TeamMember>("team");
  return fromFirestore || [];
}

