import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  const rawCookie = request.headers.get('cookie') || ''
  
  return NextResponse.json({
    totalBytes: rawCookie.length,
    count: cookies.length,
    cookies: cookies.map(c => ({ name: c.name, size: c.value.length })),
  })
}
