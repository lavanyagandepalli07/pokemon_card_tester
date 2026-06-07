import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

function initSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a no-op client to prevent errors
    if (process.env.NODE_ENV === 'production' && !supabaseUrl) {
      console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL not set during build.');
      // Return a dummy client to allow build to complete
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    console.warn('⚠️  Supabase env vars missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');
}

export const supabase = initSupabase();
