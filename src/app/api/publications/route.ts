import { NextResponse } from 'next/server';
import { getPublications } from '@/lib/content';

export async function GET() {
  const items = await getPublications();
  const mapped = items.map((p: any) => ({
    id: p.id,
    title: p.title,
    authors: p.authors ? p.authors.join(", ") : "",
    journal: p.venue || "",
    year: p.year || "",
    topic: p.type || "Research",
    abstract: p.abstract || "",
    doiUrl: p.url || "",
    orderIndex: p.order || 0
  }));
  return NextResponse.json({ success: true, publications: mapped });
}