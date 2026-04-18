import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

type ResourceConfig = {
  table: string
  fields: string[]
  readOnly?: boolean
}

const RESOURCES: Record<string, ResourceConfig> = {
  services: {
    table: 'services',
    fields: ['title', 'description', 'age_group', 'price', 'duration_minutes', 'type', 'image'],
  },
  schedule: {
    table: 'schedule',
    fields: ['service_id', 'start_datetime', 'max_participants', 'status'],
  },
  events: {
    table: 'events',
    fields: ['title', 'description', 'event_date', 'image'],
  },
  paintings: {
    table: 'paintings',
    fields: ['title', 'description', 'year', 'size', 'technique', 'price', 'status', 'image'],
  },
  gallery: {
    table: 'gallery',
    fields: ['image', 'category', 'description'],
  },
  'contact-requests': {
    table: 'contact_requests',
    fields: ['name', 'phone', 'email', 'message'],
    readOnly: true,
  },
  bookings: {
    table: 'bookings',
    fields: ['status'],
  },
}

async function isAuthed(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  try {
    await verifyToken(token)
    return true
  } catch {
    return false
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { resource: string; id: string } }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = RESOURCES[params.resource]
  if (!config || config.readOnly) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const body = await req.json()
  const fields = config.fields.filter((f) => body[f] !== undefined)
  if (fields.length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const sets = fields.map((f, i) => `${f} = $${i + 1}`)
  const values = fields.map((f) => body[f])

  const res = await pool.query(
    `UPDATE ${config.table} SET ${sets.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, params.id]
  )

  if (res.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(res.rows[0])
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { resource: string; id: string } }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = RESOURCES[params.resource]
  if (!config) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await pool.query(`DELETE FROM ${config.table} WHERE id = $1`, [params.id])
  return NextResponse.json({ ok: true })
}
