import researchData from "../../data/research.json";
import publicationData from "../../data/publications.json";
import facilityData from "../../data/facilities.json";
import newsData from "../../data/news.json";
import teamData from "../../data/team.json";

export type ResearchArea = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: string;
};

export type Publication = (typeof publicationData)[number];
export type Facility = (typeof facilityData)[number];
export type NewsItem = (typeof newsData)[number];
export type TeamMember = (typeof teamData)[number];

export const researchAreas: ResearchArea[] = researchData;
export const publications: Publication[] = publicationData;
export const facilities: Facility[] = facilityData;
export const newsItems: NewsItem[] = newsData;
export const teamMembers: TeamMember[] = teamData;

export const navigation = [
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Facilities", href: "/facilities" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];
