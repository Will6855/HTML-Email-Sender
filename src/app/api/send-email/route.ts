import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { smtpServer, port, email, password, to, subject, htmlContent } = await request.json();

  let transporter = nodemailer.createTransport({
    host: smtpServer,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for port 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: email,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: error || 'Failed to send email' }, { status: 500 });
  }
}
