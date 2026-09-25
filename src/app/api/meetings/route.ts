import { NextRequest, NextResponse } from 'next/server';
import { getMeetings, saveMeetings } from '@/lib/data';
import { sendMeetingNotification } from '@/lib/email';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getMeetings());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.date || !body.time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const items = getMeetings();
    const meeting = {
      id: String(Date.now()),
      name: String(body.name).slice(0, 100),
      email: String(body.email).slice(0, 120),
      company: String(body.company || '').slice(0, 120),
      date: String(body.date),
      time: String(body.time),
      type: (body.type === 'in-person' ? 'in-person' : 'virtual') as 'virtual' | 'in-person',
      notes: String(body.notes || '').slice(0, 1000),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    items.unshift(meeting);
    saveMeetings(items);

    // Send email notification (non-blocking failure)
    const mail = await sendMeetingNotification({
      name: meeting.name,
      email: meeting.email,
      company: meeting.company,
      date: meeting.date,
      time: meeting.time,
      type: meeting.type,
      notes: meeting.notes,
    });

    return NextResponse.json({
      success: true,
      meeting,
      emailSent: mail.sent,
      emailMethod: mail.method || null,
      emailError: mail.sent ? null : mail.error || null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const items = getMeetings();
    const idx = items.findIndex((m) => m.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    items[idx] = { ...items[idx], ...body };
    saveMeetings(items);
    return NextResponse.json(items[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  saveMeetings(getMeetings().filter((m) => m.id !== id));
  return NextResponse.json({ success: true });
}
