import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  const { event_id, name, phone, email } = await req.json()

  if (!event_id || !name || !phone) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Проверяем лимит мест если задан
    const eventRes = await client.query<{ max_participants: number | null }>(
      'SELECT max_participants FROM events WHERE id = $1 FOR UPDATE',
      [event_id]
    )
    if (eventRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Мероприятие не найдено' }, { status: 404 })
    }

    const { max_participants } = eventRes.rows[0]
    if (max_participants !== null) {
      const countRes = await client.query<{ count: string }>(
        "SELECT COUNT(*) FROM event_bookings WHERE event_id = $1",
        [event_id]
      )
      const booked = parseInt(countRes.rows[0].count)
      if (booked >= max_participants) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Мест нет' }, { status: 409 })
      }
    }

    const result = await client.query(
      `INSERT INTO event_bookings (event_id, name, phone, email) VALUES ($1, $2, $3, $4) RETURNING id`,
      [event_id, name, phone, email || null]
    )
    await client.query('COMMIT')
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  } finally {
    client.release()
  }
}
