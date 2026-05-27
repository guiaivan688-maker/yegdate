import { createClient } from "@supabase/supabase-js";

// Supabase project. The publishable key is PUBLIC by design — it ships in the client
// bundle and relies on Row-Level Security — so it's safe to hardcode as a fallback.
// This makes the app work in prod without depending on Vercel env config; the
// NEXT_PUBLIC_* env vars still take priority if set (cleaner for rotation later).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://guvyforoptoxcoetqcsh.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_5hlQOfQ5F_NGvukwsO5y7Q_wK9GGq1B";

export const supabase = createClient(url, anonKey);
