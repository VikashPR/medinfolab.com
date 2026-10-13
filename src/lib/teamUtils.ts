import { TeamMember, TeamCategory } from '@/types';

export const TEAM_PRIORITY_CATEGORIES = [
  { key: 'ALL', label: 'All Team' },
  { key: 'Professor', label: 'Professor' },
  { key: 'Post Doc', label: 'Post Doc' },
  { key: 'PhD', label: 'PhD' },
  { key: 'M.tech', label: 'M.Tech' },
  { key: 'Interns', label: 'Interns' },
  { key: 'Project Staff', label: 'Project Staff' },
  { key: 'Alumni', label: 'Alumni' },
] as const;

export type CategoryFilterKey = (typeof TEAM_PRIORITY_CATEGORIES)[number]['key'];
export type SubFilterKey = 'ALL' | 'Regular' | 'External';

export const CATEGORY_PRIORITY_ORDER: Record<string, number> = {
  'Professor': 1,
  'Faculty': 1,
  'Post Doc': 2,
  'Researchers': 2,
  'PhD': 3,
  'PhD Scholars': 3,
  'M.tech': 4,
  'Students': 4,
  'Interns': 5,
  'Inters': 5,
  'Project Staff': 6,
  'Alumni': 7,
  'Collaborators': 8,
};

export function getCategoryPriority(category: string): number {
  return CATEGORY_PRIORITY_ORDER[category] ?? 99;
}

export function isExternalTrack(member: TeamMember): boolean {
  if (member.subType === 'External') return true;
  const roleLower = (member.role || '').toLowerCase();
  const credsLower = (member.credentials || '').toLowerCase();
  return roleLower.includes('external') || credsLower.includes('external');
}

export function sortTeamMembersByPriority(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => {
    const prioA = getCategoryPriority(a.category);
    const prioB = getCategoryPriority(b.category);
    if (prioA !== prioB) return prioA - prioB;

    // Within PhD or M.Tech: Regular first, then External
    const extA = isExternalTrack(a);
    const extB = isExternalTrack(b);
    if (!extA && extB) return -1;
    if (extA && !extB) return 1;

    return (a.orderIndex ?? 999) - (b.orderIndex ?? 999);
  });
}

export function getTeamCategoryBadge(member: TeamMember) {
  const isExt = isExternalTrack(member);

  if (member.category === 'PhD' || member.category === 'PhD Scholars') {
    if (isExt) {
      return {
        label: 'External PhD',
        colorClass: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/80',
      };
    }
    return {
      label: 'Regular PhD',
      colorClass: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/80',
    };
  }

  if (member.category === 'M.tech' || member.category === 'Students') {
    if (isExt) {
      return {
        label: 'External M.Tech',
        colorClass: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/80',
      };
    }
    return {
      label: 'Regular M.Tech',
      colorClass: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/80',
    };
  }

  if (member.category === 'Professor' || member.category === 'Faculty') {
    return {
      label: 'Professor',
      colorClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80',
    };
  }

  if (member.category === 'Post Doc' || member.category === 'Researchers') {
    return {
      label: 'Post Doc',
      colorClass: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80',
    };
  }

  if (member.category === 'Interns') {
    return {
      label: 'Intern',
      colorClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80',
    };
  }

  if (member.category === 'Project Staff') {
    return {
      label: 'Project Staff',
      colorClass: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/80',
    };
  }

  if (member.category === 'Alumni') {
    return {
      label: 'Alumni',
      colorClass: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    };
  }

  return {
    label: member.category,
    colorClass: 'bg-maroon-50 text-maroon-800 border-maroon-200 dark:bg-maroon-950/80 dark:text-maroon-300 dark:border-maroon-800/80',
  };
}

export function filterTeamMembers(
  members: TeamMember[],
  activeCategory: string,
  subFilter: SubFilterKey,
  searchQuery: string
): TeamMember[] {
  const query = searchQuery.trim().toLowerCase();

  return members.filter((member) => {
    if (member.isPublic === false) return false;

    // Category match
    if (activeCategory !== 'ALL') {
      if (activeCategory === 'Professor') {
        if (member.category !== 'Professor' && member.category !== 'Faculty') return false;
      } else if (activeCategory === 'Post Doc') {
        if (member.category !== 'Post Doc' && member.category !== 'Researchers') return false;
      } else if (activeCategory === 'PhD') {
        if (member.category !== 'PhD' && member.category !== 'PhD Scholars') return false;
      } else if (activeCategory === 'M.tech') {
        if (member.category !== 'M.tech' && member.category !== 'Students') return false;
      } else if (activeCategory === 'Interns') {
        if (member.category !== 'Interns') return false;
      } else if (activeCategory === 'Project Staff') {
        if (member.category !== 'Project Staff') return false;
      } else if (activeCategory === 'Alumni') {
        if (member.category !== 'Alumni') return false;
      } else if (member.category !== activeCategory) {
        return false;
      }
    }

    // Sub-filter match for PhD and M.tech
    if (activeCategory === 'PhD' || activeCategory === 'M.tech') {
      const isExt = isExternalTrack(member);
      if (subFilter === 'Regular' && isExt) return false;
      if (subFilter === 'External' && !isExt) return false;
    }

    // Search query match
    if (query) {
      const name = (member.name || '').toLowerCase();
      const role = (member.role || '').toLowerCase();
      const bio = (member.bio || '').toLowerCase();
      const creds = (member.credentials || '').toLowerCase();
      const focus = (member.focus || []).some((f) => f.toLowerCase().includes(query));
      const skills = (member.skills || []).some((s) => s.toLowerCase().includes(query));
      const match = name.includes(query) || role.includes(query) || bio.includes(query) || creds.includes(query) || focus || skills;
      if (!match) return false;
    }

    return true;
  });
}
