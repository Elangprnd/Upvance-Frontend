import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================
// Menggunakan struktur data Set untuk pencarian rute O(1) yang efisien memori.
const AUTH_ROUTES = new Set(['/login', '/register', '/verify-otp'])
const PROTECTED_PREFIXES = ['/dashboard', '/main', '/settings']

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // 1. INISIALISASI RESPONSE & HTTP SECURITY HEADERS
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Mencegah eksploitasi Clickjacking melalui penyematan iframe eksternal.
  response.headers.set('X-Frame-Options', 'DENY')
  // Mencegah eksploitasi MIME-type sniffing oleh peramban.
  response.headers.set('X-Content-Type-Options', 'nosniff')
  // Membatasi kebocoran informasi referrer saat melakukan navigasi cross-origin.
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  // Mengaktifkan filter XSS bawaan peramban (browser).
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // 2. INISIALISASI SUPABASE CLIENT (Manajemen Sesi Edge)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Melakukan sinkronisasi cookie ke instance respons baru.
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. VALIDASI AUTENTIKASI SERVER-SIDE
  // Menggunakan getUser() untuk memvalidasi token secara real-time ke basis data,
  // guna mencegah penggunaan token yang sudah di-revoke atau kedaluwarsa.
  const { data: { user } } = await supabase.auth.getUser()

  // 4. KONTROL AKSES RUTE (ACCESS CONTROL LOGIC)
  const isAuthRoute = AUTH_ROUTES.has(path)
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix))

  // Kondisi A: Pengguna belum terautentikasi mencoba mengakses rute terproteksi.
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    // Menyimpan path tujuan akhir untuk redirect otomatis pasca-login (mendukung retensi UX).
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // Kondisi B: Pengguna telah terautentikasi mencoba mengakses halaman pendaftaran/masuk.
  if (user && isAuthRoute) {
    url.pathname = '/dashboard'
    url.searchParams.delete('next')
    return NextResponse.redirect(url)
  }

  return response
}

// ============================================================================
// MATCHER CONFIGURATION
// ============================================================================
// Middleware ini secara eksplisit mengecualikan file statis, aset Next.js, dan 
// endpoint API internal untuk meminimalisasi latensi eksekusi pada level Edge server.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}