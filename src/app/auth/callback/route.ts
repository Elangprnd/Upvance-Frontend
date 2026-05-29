import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const rawNext = searchParams.get('next') ?? '/dashboard'
  const safeNext =
    rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Cek apakah profile sudah ada (trigger akan membuatnya otomatis)
      // Jika tidak ada (edge case), buat manual
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_completed_onboarding')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!profile) {
        // Fallback: trigger mungkin belum jalan, buat manual
        const fullName =
          (data.user.user_metadata?.full_name as string | undefined) ||
          data.user.email?.split('@')[0] || null
        const avatarUrl =
          (data.user.user_metadata?.avatar_url as string | undefined) || null

        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: 'user',
          has_completed_onboarding: false,
        })

        // User baru → onboarding
        return NextResponse.redirect(new URL('/onboarding', origin).toString())
      }

      // User sudah ada: cek apakah onboarding sudah selesai
      if (!profile.has_completed_onboarding) {
        return NextResponse.redirect(new URL('/onboarding', origin).toString())
      }

      return NextResponse.redirect(new URL(safeNext, origin).toString())
    }
    console.error('[CALLBACK EXCHANGE ERROR]:', error)
  }

  return NextResponse.redirect(`${origin}/login?error=callback_failed`)
}