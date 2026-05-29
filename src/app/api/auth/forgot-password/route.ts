import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const redirectTo =
      process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
        : `${request.nextUrl.origin}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      { redirectTo }
    )

    if (error) {
      console.error('[forgot-password] Supabase error:', error.message)
    }

    // SECURITY: Selalu kembalikan respon sukses agar email tidak bisa dienumerasi
    return NextResponse.json({
      message:
        'Jika email terdaftar, kami telah mengirimkan link reset kata sandi ke email kamu.',
      error: null,
    })
  } catch (err: unknown) {
    console.error('[CRITICAL - POST /api/auth/forgot-password]:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server internal' },
      { status: 500 }
    )
  }
}
