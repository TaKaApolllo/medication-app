import { createBrowserClient } from '@supabase/ssr';

/**
 * ブラウザ用Supabaseクライアント
 * Client Componentで使用
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// シングルトンクライアント
export const supabase = createClient();
