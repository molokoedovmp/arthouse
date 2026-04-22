import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
      pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
    },
  })
}

export async function POST(req: NextRequest) {
  const { event_id, name, phone, email } = await req.json()

  if (!event_id || !name || !phone) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Проверяем лимит мест если задан
    const eventRes = await client.query<{ max_participants: number | null; title: string; event_date: string | null }>(
      'SELECT max_participants, title, event_date FROM events WHERE id = $1 FOR UPDATE',
      [event_id]
    )
    if (eventRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Мероприятие не найдено' }, { status: 404 })
    }

    const { max_participants, title, event_date } = eventRes.rows[0]
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

    const mailPayload = {
      from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
      to: process.env.NEXT_PUBLIC_NODEMAILER_TO,
      subject: `Новая запись на мероприятие: ${title}`,
      html: `
        <h2>Новая запись на мероприятие</h2>
        <p><strong>Мероприятие:</strong> ${title}</p>
        ${event_date ? `<p><strong>Дата:</strong> ${new Date(event_date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || '—'}</p>
      `,
    }
    setImmediate(() => createTransporter().sendMail(mailPayload).catch(console.error))

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  } finally {
    client.release()
  }
}
