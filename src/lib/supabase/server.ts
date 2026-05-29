import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from '../../types'
import { optimizeCookies } from './cookie-optimizer'

export const createClient = async () => {
  const cookieStore = await cookies()
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('//')[1].split('.')[0]
  const chunkPrefix = `sb-${projectId}-auth-token`

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            const optimized = optimizeCookies(cookiesToSet, chunkPrefix)
            optimized.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Diabaikan jika dipanggil dari Server Component (read-only)
          }
        },
      },
    }
  )
}