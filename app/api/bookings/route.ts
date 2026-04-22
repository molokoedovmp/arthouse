import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

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
  } as SMTPTransport.Options)
}

export async function POST(req: NextRequest) {
  try {
    const { schedule_id, name, phone, email } = await req.json()

    if (!schedule_id || !name || !phone) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query("SET LOCAL lock_timeout = '3s'")

      // 1. Блокируем строку слота и получаем название
      const slotRes = await client.query<{
        max_participants: number | null;
        status: string;
        title: string;
        start_datetime: string;
      }>(
        `SELECT max_participants, status, title, start_datetime FROM schedule WHERE id = $1 FOR UPDATE`,
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

      // 2. Считаем занятые места
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

      // 3. Сохраняем запись
      await client.query(
        `INSERT INTO bookings (schedule_id, name, phone, email) VALUES ($1, $2, $3, $4)`,
        [schedule_id, name.trim(), phone.trim(), email?.trim() || null]
      )

      await client.query('COMMIT')

      // 4. Отправляем письмо после коммита в следующем тике — ответ уходит раньше
      const mailPayload = {
        from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
        to: process.env.NEXT_PUBLIC_NODEMAILER_TO,
        subject: `Новая запись: ${slot.title}`,
        html: `
          <h2>Новая запись на занятие</h2>
          <p><strong>Занятие:</strong> ${slot.title}</p>
          <p><strong>Дата:</strong> ${new Date(slot.start_datetime).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || '—'}</p>
        `,
      }
      setImmediate(() => createTransporter().sendMail(mailPayload).catch(console.error))

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
