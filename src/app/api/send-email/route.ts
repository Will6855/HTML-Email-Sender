import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const smtpServer = formData.get('smtpServer') as string;
  const port = formData.get('port') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const to = formData.get('to') as string;
  const subject = formData.get('subject') as string;
  const htmlContent = formData.get('htmlContent') as string;
  const senderName = formData.get('senderName') as string;
  const attachments = formData.getAll('attachments') as File[];

  let transporter = nodemailer.createTransport({
    host: smtpServer,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465,
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `${senderName} <${email}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: await Promise.all(attachments.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))),
    });
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to send email' }, { status: 500 });
  }
}