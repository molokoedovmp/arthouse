import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
  },
})

export async function sendAdminBookingNotification({
  eventTitle,
  eventDate,
  name,
  phone,
  email,
}: {
  eventTitle: string
  eventDate: string | null
  name: string
  phone: string
  email?: string | null
}) {
  const dateStr = eventDate ? new Date(eventDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  await transporter.sendMail({
    from: `"Арт Хаус" <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
    to: process.env.NEXT_PUBLIC_NODEMAILER_TO,
    subject: `Новая запись на мероприятие: ${eventTitle}`,
    html: `
      <h2>Новая запись на мероприятие</h2>
      <p><b>Мероприятие:</b> ${eventTitle}${dateStr ? ` (${dateStr})` : ''}</p>
      <p><b>Имя:</b> ${name}</p>
      <p><b>Телефон:</b> ${phone}</p>
      ${email ? `<p><b>Email:</b> ${email}</p>` : ''}
      <hr/>
      <p>Войдите в <a href="https://art-territory.ru/admin">админ-панель</a>, чтобы подтвердить запись.</p>
    `,
  })
}

export async function sendUserBookingConfirmation({
  to,
  eventTitle,
  eventDate,
  name,
}: {
  to: string
  eventTitle: string
  eventDate: string | null
  name: string
}) {
  const dateStr = eventDate ? new Date(eventDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  await transporter.sendMail({
    from: `"Арт Хаус" <${process.env.NEXT_PUBLIC_NODEMAILER_USER}>`,
    to,
    subject: `Ваша запись подтверждена — ${eventTitle}`,
    html: `
      <h2>Запись подтверждена!</h2>
      <p>Здравствуйте, ${name}!</p>
      <p>Ваша запись на мероприятие <b>«${eventTitle}»</b>${dateStr ? ` (${dateStr})` : ''} подтверждена.</p>
      <p>Ждём вас! Если есть вопросы — напишите нам или позвоните.</p>
      <br/>
      <p>С уважением,<br/>Команда Арт Хаус</p>
    `,
  })
}
