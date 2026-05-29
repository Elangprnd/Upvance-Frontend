import { CookieOptions } from '@supabase/ssr'

/**
 * Supabase SSR chunks cookies into ~3KB pieces. If a session is 15KB, it creates 5 chunks.
 * This function intercepts the chunks, reassembles them, strips the bloat from the JSON,
 * and splits it back into smaller chunks to prevent HTTP 431 errors on Vercel/Next.js.
 */
export function optimizeCookies(
  cookiesToSet: { name: string; value: string; options: CookieOptions }[],
  chunkPrefix: string
): { name: string; value: string; options: CookieOptions }[] {
  try {
    // 1. Group chunks for the auth token
    const authChunks = cookiesToSet.filter(c => c.name.startsWith(chunkPrefix))
    if (authChunks.length === 0) return cookiesToSet

    // Sort chunks by index (.0, .1, .2)
    authChunks.sort((a, b) => {
      const idxA = parseInt(a.name.split('.').pop() || '0')
      const idxB = parseInt(b.name.split('.').pop() || '0')
      return idxA - idxB
    })

    // 2. Reassemble the base64 string
    const fullBase64 = authChunks.map(c => c.value).join('')
    if (!fullBase64.startsWith('base64-')) return cookiesToSet

    // 3. Decode and parse
    const jsonStr = Buffer.from(fullBase64.replace('base64-', ''), 'base64').toString('utf8')
    const session = JSON.parse(jsonStr)

    // 4. STRIP THE BLOAT! (This is what causes 15KB sessions)
    if (session && session.user) {
      // Remove OAuth provider tokens if they exist
      delete session.provider_token
      delete session.provider_refresh_token
      
      // Strip identities which contains massive Google OAuth payloads
      if (session.user.identities) {
        session.user.identities = []
      }
      
      // If user_metadata is suspiciously large, strip non-essentials
      if (session.user.user_metadata) {
        // Keep only what's needed for the UI (name, avatar)
        const keep = {
          full_name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url,
          email: session.user.user_metadata.email
        }
        session.user.user_metadata = keep
      }
    }

    // 5. Re-encode
    const optimizedJson = JSON.stringify(session)
    const optimizedBase64 = 'base64-' + Buffer.from(optimizedJson, 'utf8').toString('base64')

    // 6. Re-chunk (Supabase default is ~3100 chars per chunk)
    const chunkSize = 3100
    const newChunks = []
    
    for (let i = 0; i < Math.ceil(optimizedBase64.length / chunkSize); i++) {
      newChunks.push({
        name: `${chunkPrefix}.${i}`,
        value: optimizedBase64.slice(i * chunkSize, (i + 1) * chunkSize),
        options: authChunks[0].options // copy options from original
      })
    }

    // 7. Add Max-Age=0 for old chunks that are no longer needed
    for (let i = newChunks.length; i < authChunks.length; i++) {
      newChunks.push({
        name: `${chunkPrefix}.${i}`,
        value: '',
        options: { ...authChunks[0].options, maxAge: 0 }
      })
    }

    // 8. Return optimized chunks combined with any non-auth cookies
    const nonAuthCookies = cookiesToSet.filter(c => !c.name.startsWith(chunkPrefix))
    return [...nonAuthCookies, ...newChunks]

  } catch (error) {
    console.error('Cookie optimizer failed, falling back to original:', error)
    return cookiesToSet
  }
}
