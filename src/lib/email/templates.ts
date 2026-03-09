/**
 * Email Templates — SerpNap
 * Stub for now. SEO report emails will be implemented when needed.
 */

export async function sendSEOReportEmail(_options: {
  to: string;
  url: string;
  score: number;
  reportUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  console.log("[email] SEO report email sending not yet implemented");
  return { success: true };
}
