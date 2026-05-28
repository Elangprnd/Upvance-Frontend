import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../../types'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    'https://kmhfilbxwskbynjeuwld.supabase.co',
    'sb_publishable_2Mvlh7fUsOgt0ETMEbIdvA_oK-IvTJJ',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Diabaikan jika dipanggil dari Server Component yang sifatnya read-only
          }
        },
      },
    }
  )
}