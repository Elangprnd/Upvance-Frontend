import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Cek role admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if ((profile as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Hitung stats platform
    const [eventsRes, usersRes, pendingRes, bookmarksRes] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('bookmarks').select('id', { count: 'exact', head: true }),
    ])

    // Ambil 5 event terbaru
    const { data: recentEvents } = await supabase
      .from('events')
      .select('id, title, category, is_published, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalEvents: eventsRes.count ?? 0,
        totalUsers: usersRes.count ?? 0,
        pendingEvents: pendingRes.count ?? 0,
        totalBookmarks: bookmarksRes.count ?? 0,
      },
      recentEvents: recentEvents ?? [],
    })
  } catch (err) {
    console.error('[GET /api/admin/stats]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
