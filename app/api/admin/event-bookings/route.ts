import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function isAuthed(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  try { await verifyToken(token); return true } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
  const limit = 20
  const offset = (page - 1) * limit

  const countRes = await pool.query('SELECT COUNT(*) FROM event_bookings')
  const total = parseInt(countRes.rows[0].count)

  const res = await pool.query(
    `SELECT eb.*, e.title AS event_title, e.event_date
     FROM event_bookings eb
     JOIN events e ON eb.event_id = e.id
     ORDER BY eb.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  return NextResponse.json({ rows: res.rows, total, page, limit })
}
