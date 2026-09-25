import { getSettings } from './data';

export type MeetingMailPayload = {
  name: string;
  email: string;
  company: string;
  date: string;
  time: string;
  type: string;
  notes: string;
};

function buildHtml(m: MeetingMailPayload) {
  return `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
    <h2 style="margin:0 0 8px;color:#0f766e">New meeting request</h2>
    <p style="color:#64748b;margin:0 0 20px">Someone requested a meeting on your BIWORSOURCING website.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#64748b;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(m.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(m.email)}">${escapeHtml(m.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Company</td><td style="padding:8px 0">${escapeHtml(m.company || '—')}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Type</td><td style="padding:8px 0;text-transform:capitalize">${escapeHtml(m.type)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Date</td><td style="padding:8px 0;font-weight:600">${escapeHtml(m.date)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Time</td><td style="padding:8px 0;font-weight:600">${escapeHtml(m.time)}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;vertical-align:top">Notes</td><td style="padding:8px 0">${escapeHtml(m.notes || '—')}</td></tr>
    </table>
    <p style="margin-top:24px;font-size:12px;color:#94a3b8">Reply directly to this email to contact the requester (if your provider supports Reply-To).</p>
  </div>`;
}

function buildText(m: MeetingMailPayload) {
  return `New meeting request

Name: ${m.name}
Email: ${m.email}
Company: ${m.company || '—'}
Type: ${m.type}
Date: ${m.date}
Time: ${m.time}
Notes: ${m.notes || '—'}
`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Send meeting notification. Returns { sent, method, error? } */
export async function sendMeetingNotification(m: MeetingMailPayload): Promise<{
  sent: boolean;
  method?: string;
  error?: string;
}> {
  const s = getSettings() as any;
  const to = (s.meetingNotifyEmail || s.email || '').trim();
  if (!to) {
    return { sent: false, error: 'No notification email set in Admin → Meetings / SEO' };
  }

  const subject = `Meeting request: ${m.name} — ${m.date} ${m.time}`;
  const html = buildHtml(m);
  const text = buildText(m);
  const fromName = s.companyName || 'BIWORSOURCING';

  // 1) Resend API (recommended — free tier available)
  const resendKey = (s.resendApiKey || process.env.RESEND_API_KEY || '').trim();
  if (resendKey) {
    try {
      const from = (s.emailFrom || 'onboarding@resend.dev').trim();
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${from}>`,
          to: [to],
          reply_to: m.email,
          subject,
          html,
          text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { sent: false, method: 'resend', error: data.message || `Resend HTTP ${res.status}` };
      }
      return { sent: true, method: 'resend' };
    } catch (e: any) {
      return { sent: false, method: 'resend', error: e.message || 'Resend failed' };
    }
  }

  // 2) Optional webhook (Zapier / Make / n8n / custom)
  const webhook = (s.meetingWebhookUrl || '').trim();
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'meeting_request', to, subject, ...m }),
      });
      if (!res.ok) {
        return { sent: false, method: 'webhook', error: `Webhook HTTP ${res.status}` };
      }
      return { sent: true, method: 'webhook' };
    } catch (e: any) {
      return { sent: false, method: 'webhook', error: e.message || 'Webhook failed' };
    }
  }

  // 3) Try nodemailer SMTP if package is installed and SMTP is configured
  const smtpHost = (s.smtpHost || '').trim();
  const smtpUser = (s.smtpUser || '').trim();
  const smtpPass = (s.smtpPass || '').trim();
  if (smtpHost && smtpUser && smtpPass) {
    try {
      // dynamic import — works only if nodemailer is installed
      const nodemailer = await import('nodemailer');
      const port = Number(s.smtpPort) || 587;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: s.emailFrom || smtpUser,
        to,
        replyTo: m.email,
        subject,
        text,
        html,
      });
      return { sent: true, method: 'smtp' };
    } catch (e: any) {
      return {
        sent: false,
        method: 'smtp',
        error: e.message || 'SMTP failed (install nodemailer: npm i nodemailer)',
      };
    }
  }

  return {
    sent: false,
    error:
      'Email not configured. Set Resend API key or SMTP in Admin → Meetings (Email notifications).',
  };
}
