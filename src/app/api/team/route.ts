import { NextResponse } from 'next/server';
import { getTeamMembers } from '@/lib/content';

export async function GET() {
  const items = await getTeamMembers();
  // Ensure we pass through everything from Firebase Admin to frontend
  return NextResponse.json({ success: true, team: items });
}