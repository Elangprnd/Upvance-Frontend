import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // SECURITY FIX: Validasi 'next' agar hanya menerima path relatif.
  // Mencegah Open Redirect Attack (misal: ?next=https://evil.com).
  const rawNext = searchParams.get('next') ?? '/dashboard'
  const safeNext =
    rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, origin).toString())
    }
    console.error('[CALLBACK EXCHANGE ERROR]:', error)
  }

  return NextResponse.redirect(`${origin}/login?error=callback_failed`)
}