import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types'

// ============================================
// VALIDASI INPUT LOGIN
// ============================================
function validateLoginInput(data: { email?: string; password?: string }): string | null {
  const { email, password } = data

  if (!email?.trim())          return 'Email wajib diisi'
  if (!password)               return 'Password wajib diisi'

  return null
}

// ============================================
// RATE LIMITING SEDERHANA
// ============================================
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 menit
  const maxAttempts = 5

  const record = loginAttempts.get(ip)

  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (now - record.lastAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (record.count >= maxAttempts) {
    const waitSeconds = Math.ceil((windowMs - (now - record.lastAttempt)) / 1000)
    return { allowed: false, waitSeconds }
  }

  record.count++
  record.lastAttempt = now
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          data: null,
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.waitSeconds} detik.`,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    const validationError = validateLoginInput({ email, password })
    if (validationError) {
      return NextResponse.json(
        { data: null, error: validationError },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { data: null, error: 'Email belum diverifikasi, cek inbox kamu' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { data: null, error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    loginAttempts.delete(ip)

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', data.user.id)
      .single()

    type ProfileRow = Database['public']['Tables']['profiles']['Row']
    const userProfile = profile as ProfileRow | null

    const userRole = (userProfile as any)?.role ?? 'user'
    const fullName = (userProfile as any)?.full_name ?? (data.user.user_metadata?.full_name as string | null) ?? null
    const avatarUrl = (userProfile as any)?.avatar_url ?? null

    return NextResponse.json({
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          avatar_url: avatarUrl,
          role: userRole,
        },
      },
      error: null,
      message: 'Login berhasil!',
    })

  } catch (err: unknown) {
    console.error('[CRITICAL - POST /api/auth/login]:', err)
    return NextResponse.json(
      { data: null, error: 'Terjadi kesalahan pada server internal' },
      { status: 500 }
    )
  }
}