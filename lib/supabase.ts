import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente com a ANON KEY (leitura pública via RLS).
 * Se as variáveis não existirem, o site sobe sem catálogo (comportamento
 * defensivo) em vez de quebrar o build.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export function hasSupabase(): boolean {
  return supabase !== null;
}
