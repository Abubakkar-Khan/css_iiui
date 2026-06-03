import { Resend } from 'resend';
import db from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const recipient = process.env.ADMIN_EMAIL || 'abusart2023@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log(`\n[DEMO EMAIL SIMULATION]`);
      console.log(`To: ${recipient}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`[no RESEND_API_KEY]\n`);
      
      return new Response(JSON.stringify({ ok: true, simulated: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    let fromEmailAddress = 'onboarding@resend.dev';
    const envFrom = process.env.RESEND_FROM_EMAIL;
    if (envFrom) {
      const match = envFrom.match(/<([^>]+)>/);
      if (match) {
        fromEmailAddress = match[1];
      } else {
        fromEmailAddress = envFrom;
      }
    }
    const fromSender = `${name} <${fromEmailAddress}>`;

    const resend = new Resend(resendApiKey);

    // Call Resend Node.js SDK
    const { data, error } = await resend.emails.send({
      from: fromSender,
      to: recipient,
      replyTo: email,
      subject: `CSS Contact: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111;">
          <h2>Message for CSS Lead</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin-top: 20px;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("Resend SDK failed:", error);
      return new Response(JSON.stringify({ error: error.message || 'Resend failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
