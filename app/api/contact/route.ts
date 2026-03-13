import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json()

    if (!name && !phone && !message) {
      return NextResponse.json({ error: 'Пустая форма' }, { status: 400 })
    }

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_NODEMAILER_USER,
      to: process.env.NEXT_PUBLIC_NODEMAILER_TO,
      subject: `Новая заявка от ${name || 'Без имени'}`,
      html: `
        <h2>Новая заявка с сайта Арт Хаус</h2>
        <p><strong>Имя:</strong> ${name || '—'}</p>
        <p><strong>Телефон:</strong> ${phone || '—'}</p>
        <p><strong>Email:</strong> ${email || '—'}</p>
        <p><strong>Сообщение:</strong> ${message || '—'}</p>
      `,
    })

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
