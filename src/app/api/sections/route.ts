import { NextRequest, NextResponse } from 'next/server';
import { getSections, saveSections } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET() {
  return NextResponse.json(getSections());
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    // body can be full sections or { key, data } for one section
    if (body.key && body.data !== undefined) {
      const sections = getSections();
      sections[body.key] = body.data;
      saveSections(sections);
      return NextResponse.json(sections);
    }
    saveSections(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
