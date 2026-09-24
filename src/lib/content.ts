import { getCollection } from "./firestore";

export type ResearchArea = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: string;
  order?: number;
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
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  summary: string;
  initials: string;
  order?: number;
};

export const navigation = [
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Facilities", href: "/facilities" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export async function getResearchAreas(): Promise<ResearchArea[]> {
  return getCollection<ResearchArea>("research");
}

export async function getPublications(): Promise<Publication[]> {
  return getCollection<Publication>("publications");
}

export async function getFacilities(): Promise<Facility[]> {
  return getCollection<Facility>("facilities");
}

export async function getNewsItems(): Promise<NewsItem[]> {
  return getCollection<NewsItem>("news");
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return getCollection<TeamMember>("team");
}
