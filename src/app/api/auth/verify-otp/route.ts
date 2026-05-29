import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    // 1. Validasi input basic
    if (!email || !otp) {
      return NextResponse.json(
        { data: null, error: 'Email dan kode OTP wajib diisi' },
        { status: 400 }
      )
    }

    if (otp.length !== 8) {
      return NextResponse.json(
        { data: null, error: 'Kode OTP harus 8 digit angka' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 2. Tembak fungsi verifikasi OTP bawaan Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otp,
      type: 'signup', // Penting: type-nya harus 'signup' untuk verifikasi akun baru
    })

    if (error) {
      // SECURITY FIX: Pesan error ambigu agar tidak memancing brute-force
      return NextResponse.json(
        { data: null, error: 'Kode OTP salah atau sudah kedaluwarsa' },
        { status: 401 }
      )
    }

    // 3. Jika OTP benar, Supabase otomatis memvalidasi akun dan membuat session
    return NextResponse.json({
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        session: data.session,
      },
      error: null,
      message: 'Verifikasi sukses! Akun kamu sudah aktif.',
    })

  } catch (err) {
    console.error('[CRITICAL - POST /api/auth/verify-otp]:', err)
    return NextResponse.json(
      { data: null, error: 'Terjadi kesalahan pada server internal' },
      { status: 500 }
    )
  }
}
