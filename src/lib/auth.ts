import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from './supabase/server';
import { logError } from '@/lib/utils/logger';

// SECURITY HARDENING: Dev mode requires BOTH conditions:
// 1. NODE_ENV !== 'production'
// 2. ENABLE_DEV_AUTH === 'true' (explicit opt-in)
// This prevents accidental dev auth bypass in staging/preview environments
const IS_DEV = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_AUTH === 'true';

// Auth debug logs only when explicitly enabled (avoids noisy console in dev)
const DEBUG_AUTH = process.env.DEBUG_AUTH === 'true';

export type UserRole = 'admin' | 'team_member' | 'customer';

export interface UserData {
  id: string;
  role: UserRole;
  customer_id: string | null;
  email: string;
  full_name: string | null;
}

/**
 * Dev test user configurations matching seed data
 * Used to generate appropriate mock user data based on role
 */
const DEV_USER_CONFIGS: Record<string, { id: string; role: UserRole; customer_id: string | null; full_name: string }> = {
  'admin@agency.com': {
    id: 'd0000000-0000-0000-0000-000000000001',
    role: 'admin',
    customer_id: null,
    full_name: 'Agency Admin',
  },
  'manager@agency.com': {
    id: 'd0000000-0000-0000-0000-000000000002',
    role: 'team_member',
    customer_id: null,
    full_name: 'Sarah Manager',
  },
  'john@acme.com': {
    id: 'd0000000-0000-0000-0000-000000000003',
    role: 'customer',
    customer_id: 'b0000000-0000-0000-0000-000000000001',
    full_name: 'John Smith',
  },
  'jane@techstart.io': {
    id: 'd0000000-0000-0000-0000-000000000004',
    role: 'customer',
    customer_id: 'b0000000-0000-0000-0000-000000000002',
    full_name: 'Jane Developer',
  },
};

/**
 * Get dev mock user from cookies
 * Returns null if no dev auth cookie exists
 */
async function getDevMockUser(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const devEmail = cookieStore.get('dev-auth-email')?.value;
  const devRole = cookieStore.get('dev-auth-role')?.value as UserRole | undefined;

  if (!devEmail) return null;

  const config = DEV_USER_CONFIGS[devEmail];
  if (config) {
    return {
      id: config.id,
      email: devEmail,
      role: config.role,
      customer_id: config.customer_id,
      full_name: config.full_name,
    };
  }

  // Fallback for unknown dev email - use the role from cookie
  return {
    id: 'dev-user-00000000-0000-0000-0000-000000000000',
    email: devEmail,
    role: devRole || 'admin',
    customer_id: null,
    full_name: 'Dev User',
  };
}

/**
 * Get current user data including role
 * Uses React cache() for request-scoped memoization
 */
export const getCurrentUser = cache(async (): Promise<UserData | null> => {
  /**
   * DEVELOPMENT MODE AUTH BYPASS
   * 
   * ⚠️ SECURITY NOTE: This bypass ONLY works in development (NODE_ENV !== 'production')
   * 
   * Purpose: Allows local development without requiring full Supabase auth setup.
   * 
   * Security:
   * - Only active when IS_DEV === true (checked via NODE_ENV)
   * - Production builds exclude this code path entirely
   * - Never executes in production environments
   * 
   * Usage: Set dev auth cookie via development tools for local testing.
   * 
   * ⚠️ DO NOT use this in production - it will not work due to NODE_ENV check.
   */
  if (IS_DEV) {
    const devUser = await getDevMockUser();
    if (devUser) {
      return devUser;
    }
    // No dev auth cookie - fall through to check Supabase auth
    // (User might be authenticated via real Supabase in dev mode)
  }

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (DEBUG_AUTH) {
    console.log('[Auth Debug] supabase.auth.getUser result:', {
      hasUser: !!user,
      userId: user?.id || 'none',
      userEmail: user?.email || 'none',
      authError: authError?.message || 'none',
    });
  }

  if (!user) {
    if (DEBUG_AUTH) {
      console.log('[Auth Debug] No Supabase user found - returning null');
    }
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, role, customer_id, email, full_name, is_active')
    .eq('id', user.id)
    .single();

  if (DEBUG_AUTH) {
    console.log('[Auth Debug] users table query result:', {
      hasData: !!data,
      queryError: error?.message || 'none',
      role: data?.role || 'none',
      isActive: data?.is_active ?? 'unknown',
    });
  }

  if (error || !data) {
    logError('Error fetching user data', error, { action: 'getCurrentUser' });
    return null;
  }

  // Check if user is active
  if (!data.is_active) {
    logError('User profile is inactive', new Error('User profile is inactive'), {
      action: 'getCurrentUser',
      userId: user.id
    });
    return null;
  }

  return data as UserData;
});

/**
 * Get user role
 */
export const getUserRole = cache(async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();
  return user?.role ?? null;
});

/**
 * Check if the current user is an admin
 * Uses React cache() for request-scoped memoization
 */
export const isAgencyAdmin = cache(async (): Promise<boolean> => {
  // DEV BYPASS: Check role from dev user first
  if (IS_DEV) {
    const devUser = await getDevMockUser();
    if (devUser) {
      return devUser.role === 'admin';
    }
    // No dev auth cookie - fall through to check real Supabase auth
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('is_admin', {
    p_user_id: user.id,
  });

  if (error) {
    logError('Error checking admin', error, { action: 'isAgencyAdmin' });
    return false;
  }

  return data === true;
});

/**
 * Check if user is admin or team member (can access admin dashboard)
 */
export const isTeamMember = cache(async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === 'admin' || role === 'team_member';
});

/**
 * Require admin/team access - redirects appropriately if not authorized
 */
export async function requireTeamAccess() {
  const user = await getCurrentUser();

  // No profile means either not authenticated or profile doesn't exist
  if (!user) {
    redirect('/sign-in?error=access_denied');
  }

  // User exists but is a customer, not team member
  if (user.role === 'customer') {
    redirect('/portal');
  }

  // User must be admin or team_member to reach here
  if (user.role !== 'admin' && user.role !== 'team_member') {
    redirect('/sign-in?error=invalid_role');
  }

  return true;
}

// ============================================================================
// Owner-based access helpers (Phase 3 — dual-column transition)
// ============================================================================

/**
 * Get website IDs owned by a user (via owner_id column)
 * Falls back to customer_id-based lookup during transition
 */
export const getOwnedWebsiteIds = cache(async (userId?: string): Promise<string[]> => {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();

  // Primary: owner_id based
  const { data: owned } = await supabase
    .from('websites')
    .select('id')
    .eq('owner_id' as string, user.id)
    .is('deleted_at', null);

  const ownedIds = new Set((owned ?? []).map(w => w.id));

  // Transitional fallback: customer_id based (for users with customer_id)
  const fullUser = await getCurrentUser();
  if (fullUser?.customer_id) {
    const { data: customerWebsites } = await supabase
      .from('websites')
      .select('id')
      .eq('customer_id', fullUser.customer_id)
      .is('deleted_at', null);

    for (const w of customerWebsites ?? []) {
      ownedIds.add(w.id);
    }
  }

  return Array.from(ownedIds);
});

/**
 * Get all accessible website IDs for a user (owned + team-assigned)
 */
export const getAccessibleWebsiteIds = cache(async (userId?: string): Promise<string[]> => {
  const user = userId ? { id: userId } : await getCurrentUser();
  if (!user) return [];

  const fullUser = await getCurrentUser();
  if (!fullUser) return [];

  // Admin sees all
  if (fullUser.role === 'admin') {
    const supabase = await createClient();
    const { data } = await supabase
      .from('websites')
      .select('id')
      .is('deleted_at', null);
    return (data ?? []).map(w => w.id);
  }

  // Start with owned websites
  const owned = await getOwnedWebsiteIds(user.id);
  const ids = new Set(owned);

  // Add team-assigned websites
  if (fullUser.role === 'team_member') {
    const supabase = await createClient();
    const { data: assignments } = await supabase
      .from('team_assignments')
      .select('website_id, customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null);

    // Add directly-assigned website IDs
    const customerIds: string[] = [];
    for (const a of assignments ?? []) {
      if (a.website_id) {
        ids.add(a.website_id);
      }
      if (a.customer_id) {
        customerIds.push(a.customer_id);
      }
    }

    // Batch-fetch websites for all assigned customers (avoids N+1)
    if (customerIds.length > 0) {
      const { data: customerWebsites } = await supabase
        .from('websites')
        .select('id')
        .in('customer_id', customerIds)
        .is('deleted_at', null);
      for (const w of customerWebsites ?? []) {
        ids.add(w.id);
      }
    }
  }

  return Array.from(ids);
});

/**
 * Require admin/team access — returns UserData, redirects if not authorized
 */
export async function requireAdminAccess(): Promise<UserData> {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  if (user.role === 'customer') redirect('/portal');
  if (user.role !== 'admin' && user.role !== 'team_member') redirect('/sign-in?error=invalid_role');
  return user;
}

/**
 * Require portal access — customers always allowed, admins allowed in preview mode
 */
export async function requirePortalAccess(): Promise<UserData & { isPreview?: boolean }> {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  if (user.role === 'admin' || user.role === 'team_member') {
    return { ...user, isPreview: true };
  }
  return user;
}

/**
 * Require access to a specific website — redirects if no access
 */
export async function requireWebsiteAccess(websiteId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in?error=access_denied');
  }

  // Admin always has access
  if (user.role === 'admin' || user.role === 'team_member') {
    return true;
  }

  const accessibleIds = await getAccessibleWebsiteIds(user.id);
  if (!accessibleIds.includes(websiteId)) {
    redirect('/portal?error=no_access');
  }

  return true;
}

