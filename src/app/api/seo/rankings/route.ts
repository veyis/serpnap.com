import { NextResponse } from 'next/server';

/**
 * GET /api/seo/rankings
 * Search Console rankings — stub for now
 */
export async function GET() {
  return NextResponse.json(
    { error: "Search Console integration not yet configured" },
    { status: 501 }
  );
}
