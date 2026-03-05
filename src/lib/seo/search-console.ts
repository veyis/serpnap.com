/**
 * Google Search Console Integration — stub
 * Will be implemented when GSC integration is needed.
 */

export async function getSearchConsoleData(_options?: {
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
}): Promise<null> {
  return null;
}

export async function getKeywordRankings(_options?: {
  siteUrl?: string;
  limit?: number;
}): Promise<unknown[]> {
  return [];
}
