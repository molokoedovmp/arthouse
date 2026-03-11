import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { sendUserBookingConfirmation } from '@/lib/email'

async function isAuthed(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  try { await verifyToken(token); return true } catch { return false }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'No status' }, { status: 400 })

  const res = await pool.query(
    `UPDATE event_bookings SET status = $1 WHERE id = $2
     RETURNING *, (SELECT title FROM events WHERE id = event_bookings.event_id) as event_title,
                 (SELECT event_date FROM events WHERE id = event_bookings.event_id) as event_date`,
    [status, params.id]
  )
  if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const booking = res.rows[0]
  if (status === 'confirmed' && booking.email) {
    sendUserBookingConfirmation({
      to: booking.email,
      eventTitle: booking.event_title,
      eventDate: booking.event_date,
      name: booking.name,
    }).catch(console.error)
  }

  return NextResponse.json(booking)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await pool.query('DELETE FROM event_bookings WHERE id = $1', [params.id])
  return NextResponse.json({ ok: true })
}
