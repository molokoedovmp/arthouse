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
    fields: ['title', 'description', 'age_group', 'price', 'duration_minutes', 'type'],
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

export async function GET(
  req: NextRequest,
  { params }: { params: { resource: string } }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = RESOURCES[params.resource]
  if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url = new URL(req.url)
  const all = url.searchParams.get('all') === 'true'
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
  const limit = 20
  const offset = (page - 1) * limit

  let rows: unknown[]
  let total: number

  if (params.resource === 'bookings') {
    const countRes = await pool.query('SELECT COUNT(*) FROM bookings')
    total = parseInt(countRes.rows[0].count)

    const query = all
      ? `SELECT b.*, s.start_datetime, sv.title AS service_title
         FROM bookings b
         JOIN schedule s ON b.schedule_id = s.id
         JOIN services sv ON s.service_id = sv.id
         ORDER BY b.created_at DESC`
      : `SELECT b.*, s.start_datetime, sv.title AS service_title
         FROM bookings b
         JOIN schedule s ON b.schedule_id = s.id
         JOIN services sv ON s.service_id = sv.id
         ORDER BY b.created_at DESC LIMIT $1 OFFSET $2`

    const res = all ? await pool.query(query) : await pool.query(query, [limit, offset])
    rows = res.rows
  } else if (params.resource === 'schedule') {
    const countRes = await pool.query('SELECT COUNT(*) FROM schedule')
    total = parseInt(countRes.rows[0].count)

    const query = all
      ? `SELECT s.*, sv.title AS service_title FROM schedule s LEFT JOIN services sv ON s.service_id = sv.id ORDER BY s.start_datetime`
      : `SELECT s.*, sv.title AS service_title FROM schedule s LEFT JOIN services sv ON s.service_id = sv.id ORDER BY s.start_datetime LIMIT $1 OFFSET $2`

    const res = all ? await pool.query(query) : await pool.query(query, [limit, offset])
    rows = res.rows
  } else {
    const countRes = await pool.query(`SELECT COUNT(*) FROM ${config.table}`)
    total = parseInt(countRes.rows[0].count)

    const query = all
      ? `SELECT * FROM ${config.table} ORDER BY id`
      : `SELECT * FROM ${config.table} ORDER BY id DESC LIMIT $1 OFFSET $2`

    const res = all ? await pool.query(query) : await pool.query(query, [limit, offset])
    rows = res.rows
  }

  return NextResponse.json({ rows, total, page, limit })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { resource: string } }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = RESOURCES[params.resource]
  if (!config || config.readOnly) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const body = await req.json()
  const fields = config.fields.filter((f) => body[f] !== undefined && body[f] !== '')
  if (fields.length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const values = fields.map((f) => body[f])
  const placeholders = fields.map((_, i) => `$${i + 1}`)

  const res = await pool.query(
    `INSERT INTO ${config.table} (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
    values
  )

  return NextResponse.json(res.rows[0], { status: 201 })
}
