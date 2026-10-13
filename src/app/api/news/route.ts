import { NextResponse } from 'next/server';
import { getNewsItems } from '@/lib/content';

export async function GET() {
  const items = await getNewsItems();
  const mapped = items.map((n: any) => ({
    id: n.id,
    title: n.title,
    summary: n.summary,
    description: n.description || "",
    date: n.date || "",
    category: n.category || "General",
    image: n.imageUrl || "",
    linkUrl: n.url || n.linkUrl || "#",
    orderIndex: n.order || 0
  }));
  return NextResponse.json({ success: true, news: mapped });
}
