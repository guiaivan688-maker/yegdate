import { createClient } from "@supabase/supabase-js";

// Browser/client Supabase client. The publishable (anon) key is public by design.
// Fallback placeholders keep the production build from crashing if the env vars
// aren't set yet (e.g. on Vercel before they're added). Real calls work once set.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(url, anonKey);
