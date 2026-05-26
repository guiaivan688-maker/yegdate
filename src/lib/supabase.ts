import { createClient } from "@supabase/supabase-js";

// Browser/client Supabase client. The publishable (anon) key is public by design.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
