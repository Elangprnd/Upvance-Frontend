import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, confirmPassword } = body

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password dan konfirmasi password wajib diisi' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password dan konfirmasi password tidak cocok' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Cek apakah user sudah punya session aktif (dari link reset password di email)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Sesi tidak valid atau sudah kedaluwarsa. Silakan minta link reset ulang.' },
        { status: 401 }
      )
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengubah password. Coba minta link reset ulang.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Password berhasil diubah! Silakan login dengan password baru kamu.',
      error: null,
    })
  } catch (err: unknown) {
    console.error('[CRITICAL - POST /api/auth/reset-password]:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server internal' },
      { status: 500 }
    )
  }
}
