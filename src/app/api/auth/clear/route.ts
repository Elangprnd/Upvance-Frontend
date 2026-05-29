import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'All auth cookies cleared' })
  
  // Clear possible chunked cookies up to 10 chunks to be safe
  for (let i = 0; i < 10; i++) {
    response.cookies.set(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}-auth-token.${i}`, '', {
      maxAge: 0,
      path: '/',
      httpOnly: false, // matches how Supabase sets them
      sameSite: 'lax'
    })
  }

  // Clear non-chunked cookie just in case
  response.cookies.set(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}-auth-token`, '', {
    maxAge: 0,
    path: '/',
    httpOnly: false,
    sameSite: 'lax'
  })

  return response
}
