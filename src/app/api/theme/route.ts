import { NextRequest, NextResponse } from 'next/server';
import { getTheme, saveTheme } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET() {
  return NextResponse.json(getTheme());
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    saveTheme(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
