import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json()

    if (!name && !phone && !message) {
      return NextResponse.json({ error: 'Пустая форма' }, { status: 400 })
    }

    await pool.query(
      `INSERT INTO contact_requests (name, phone, email, message) VALUES ($1, $2, $3, $4)`,
      [name || null, phone || null, email || null, message || null]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
