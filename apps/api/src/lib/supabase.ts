import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Auth will not work.'
  );
}

/**
 * Admin client — uses the service role key to bypass RLS.
 * NEVER expose this to the frontend.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Verify a JWT access token from the frontend (issued by Supabase Auth).
 * Returns the decoded user payload, or null if invalid.
 */
export async function verifyAccessToken(token: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
