import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log(body)
    const { email, counselorName, date, time, meetingType } = body;

    if (!email || !counselorName || !date || !time || !meetingType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    console.log('Email:', email);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_MAIL_ADD,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_PASS,
      },
    });

    // Define email content
    const mailOptions = {
      from: process.env.NEXT_PUBLIC_MAIL_ADD,
      to: email,
      subject: 'Counseling Session Scheduled',
      text: `Hello,

    Your counseling session has been successfully scheduled.

    Details:
    - Counselor: ${counselorName}
    - Date: ${date}
    - Time: ${time}
    - Meeting Type: ${meetingType === 'video' ? 'Video Call' : 'Chat Session'}

    Thank you for using our service!

    Best regards,
    Counseling Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email', error: error },
      { status: 500 }
    );
  }
};
