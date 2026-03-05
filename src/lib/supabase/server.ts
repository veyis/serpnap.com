import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

/**
 * Create a Supabase server client with cookie-based auth
 * Used in Server Components, Server Actions, and Route Handlers
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = config.supabase.url;
  const supabaseAnonKey = config.supabase.anonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}

/**
 * Create an admin client that bypasses RLS (for server-only operations)
 */
export function createAdminClient() {
  const supabaseUrl = config.supabase.url;
  const serviceRoleKey = config.supabase.serviceRoleKey;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role key for admin operations.");
  }

  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(supabaseUrl, serviceRoleKey);
}
