import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { schedule_id, name, phone, email } = await req.json()

    if (!schedule_id || !name || !phone) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // 1. Блокируем строку слота (FOR UPDATE нельзя с GROUP BY)
      const slotRes = await client.query<{
        max_participants: number | null;
        status: string;
      }>(
        `SELECT max_participants, status FROM schedule WHERE id = $1 FOR UPDATE`,
        [schedule_id]
      )

      const slot = slotRes.rows[0]
      if (!slot) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Занятие не найдено' }, { status: 404 })
      }
      if (slot.status !== 'active') {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Занятие недоступно для записи' }, { status: 400 })
      }

      // 2. Считаем занятые места отдельным запросом (внутри той же транзакции)
      if (slot.max_participants !== null) {
        const countRes = await client.query<{ booked: string }>(
          `SELECT COUNT(*) AS booked FROM bookings WHERE schedule_id = $1 AND status != 'cancelled'`,
          [schedule_id]
        )
        if (Number(countRes.rows[0].booked) >= slot.max_participants) {
          await client.query('ROLLBACK')
          return NextResponse.json({ error: 'К сожалению, все места уже заняты' }, { status: 409 })
        }
      }

      await client.query(
        `INSERT INTO bookings (schedule_id, name, phone, email) VALUES ($1, $2, $3, $4)`,
        [schedule_id, name.trim(), phone.trim(), email?.trim() || null]
      )

      await client.query('COMMIT')
      return NextResponse.json({ ok: true })
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
