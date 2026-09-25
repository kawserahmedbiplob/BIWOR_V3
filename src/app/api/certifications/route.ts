import { NextRequest, NextResponse } from 'next/server';
import { getCertifications, saveCertifications } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET() {
  return NextResponse.json(getCertifications());
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    saveCertifications(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const items = getCertifications();
    const item = {
      id: String(Date.now()),
      name: body.name || 'Certification',
      purpose: body.purpose || '',
      logo: body.logo || '',
      logoHeight: body.logoHeight || 48,
      order: items.length + 1,
      visible: true,
    };
    items.push(item);
    saveCertifications(items);
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  saveCertifications(getCertifications().filter((c) => c.id !== id));
  return NextResponse.json({ success: true });
}
