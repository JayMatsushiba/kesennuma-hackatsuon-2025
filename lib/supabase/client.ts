/**
 * Supabase client configuration
 * Used for both server-side and client-side data fetching
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Server-side, no session persistence needed
    },
  }
);

/**
 * Server-side client (for API routes)
 * Uses service role key for elevated permissions when needed
 */
export function createServerClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Fallback to anon key if service role not provided
    return supabase;
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
