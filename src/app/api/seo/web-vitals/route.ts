import { NextResponse } from 'next/server';

/**
 * GET /api/seo/web-vitals
 * Web Vitals tracking — stub for now
 */
export async function GET() {
  return NextResponse.json(
    { error: "Web Vitals tracking not yet configured" },
    { status: 501 }
  );
}
