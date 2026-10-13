export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Team", href: "/team" },
  { label: "Facilities", href: "/facilities" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];
