import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { full_name, institution, major, semester, interests, goals, account_type, bio } = body

    // Validasi minimal
    if (!interests || interests.length === 0) {
      return NextResponse.json({ error: 'Pilih minimal 1 minat' }, { status: 400 })
    }
    if (!goals || goals.length === 0) {
      return NextResponse.json({ error: 'Pilih minimal 1 tujuan' }, { status: 400 })
    }

    const updates = {
      full_name: full_name?.trim() || null,
      institution: institution?.trim() || null,
      major: major?.trim() || null,
      semester: semester ? parseInt(semester) : null,
      interests: interests || [],
      goals: goals || [],
      account_type: account_type || 'regular_user',
      bio: bio?.trim() || null,
      has_completed_onboarding: true,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/onboarding]', err)
    return NextResponse.json({ error: 'Gagal menyimpan data onboarding' }, { status: 500 })
  }
}
