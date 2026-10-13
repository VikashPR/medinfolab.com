import { NextResponse } from 'next/server';
import { getFacilities } from '@/lib/content';

export async function GET() {
  const items = await getFacilities();
  const mapped = items.map((f: any) => ({
    id: f.id,
    title: f.name || f.slug,
    tag: f.category || "General",
    desc: f.summary || f.description || "",
    specs: [],
    status: f.availability || "Operational",
    imageUrl: f.imageUrl || "",
    orderIndex: f.order || 0
  }));
  return NextResponse.json({ success: true, facilities: mapped });
}