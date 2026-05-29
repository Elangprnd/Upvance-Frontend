import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Query params dari frontend
    const search   = searchParams.get('search') ?? ''
    const category = searchParams.get('category') ?? ''
    const is_free  = searchParams.get('is_free')
    const featured = searchParams.get('featured')
    const limit    = parseInt(searchParams.get('limit') ?? '20')
    const page     = parseInt(searchParams.get('page') ?? '1')
    const offset   = (page - 1) * limit

    // Base query — hanya ambil kolom yang diperlukan untuk card view
    let query = supabase
      .from('events')
      .select(
        'id, title, slug, category, image_url, location, is_online, is_free, price, start_date, deadline, is_verified, is_featured, organizer_id',
        { count: 'exact' }
      )
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at',  { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter opsional
    if (search)   query = query.ilike('title', `%${search}%`)
    if (category) query = query.eq('category', category)
    if (is_free  !== null && is_free  !== '') query = query.eq('is_free',   is_free  === 'true')
    if (featured !== null && featured !== '') query = query.eq('is_featured', featured === 'true')

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      meta: {
        total: count ?? 0,
        page,
        limit,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
      error: null,
    })

  } catch (err) {
    console.error('[GET /api/events]', err)
    return NextResponse.json(
      { data: null, meta: null, error: 'Gagal mengambil data events' },
      { status: 500 }
    )
  }
}