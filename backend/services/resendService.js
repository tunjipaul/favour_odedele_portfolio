const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendWaitlistConfirmationEmail({ email, name, bookTitle, whatsappUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn('Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.');
    return { sent: false, skipped: true };
  }

  const recipientName = name?.trim() || 'there';
  const title = bookTitle || 'Success Leaves Cues';
  const groupUrl = whatsappUrl || 'https://chat.whatsapp.com/KynBTrAHf4YBIuPcyAkAb0?mode=gi_t';

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: `You're on the waitlist for ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">You're on the waitlist!</h2>
          <p>Hi ${recipientName},</p>
          <p>Thanks for joining the waitlist for <strong>${title}</strong>.</p>
          <p>We'll keep you updated as soon as there is news to share.</p>
          <div style="margin: 24px 0;">
            <a href="${groupUrl}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Join the WhatsApp Community &rarr;
            </a>
          </div>
          <p style="margin-top: 24px;">- Favour Odedele</p>
        </div>
      `,
      text: `Hi ${recipientName},\n\nThanks for joining the waitlist for ${title}.\nWe'll keep you updated as soon as there is news to share.\n\nJoin the WhatsApp Community: ${groupUrl}\n\n- Favour Odedele`,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send waitlist confirmation email');
  }

  return { sent: true, id: data.id || null };
}
