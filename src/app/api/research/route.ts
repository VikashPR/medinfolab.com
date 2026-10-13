import { NextResponse } from 'next/server';
import { getResearchAreas } from '@/lib/content';

export async function GET() {
  const items = await getResearchAreas();
  const mapped = items.map((r: any) => ({
    id: r.id,
    title: r.title,
    subtitle: r.summary || "",
    description: r.description || "",
    technologies: [],
    icon: "Activity",
    status: r.status || "Active",
    orderIndex: r.order || 0
  }));
  return NextResponse.json({ success: true, research: mapped });
}