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
      console.log(`[Set RESEND_API_KEY in your .env to send real emails]\n`);
      
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

    // Call Resend REST API directly - extremely simple and clean with no dependencies!
    const mailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromSender,
        to: recipient,
        reply_to: email,
        subject: `CSS Contact: ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #111;">
            <h2>New Message for CS Society Lead</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin-top: 20px;">
              <p style="white-space: pre-wrap; margin: 0;">${message}</p>
            </div>
          </div>
        `
      })
    });

    if (mailRes.ok) {
      const data = await mailRes.json();
      return new Response(JSON.stringify({ ok: true, id: data.id }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } else {
      const errData = await mailRes.json();
      console.error("Resend API failed:", errData);
      return new Response(JSON.stringify({ error: errData.message || 'Resend failed' }), { status: 500 });
    }
  } catch (err) {
    console.error("Contact API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
