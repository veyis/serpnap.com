import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/docs/search";

/**
 * GET /api/docs/search
 *
 * Returns the pre-built search index for client-side search.
 * This endpoint is cached at the edge for optimal performance.
 */
export async function GET() {
  try {
    const searchIndex = await getSearchIndex();

    return NextResponse.json(searchIndex, {
      headers: {
        // Cache for 1 hour, stale-while-revalidate for 24 hours
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
        // Strong ETag based on build time
        ETag: `"${searchIndex.builtAt}"`,
      },
    });
  } catch (error) {
    console.error("Error generating search index:", error);
    return NextResponse.json(
      { error: "Failed to generate search index" },
      { status: 500 }
    );
  }
}
