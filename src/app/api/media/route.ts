import { NextRequest, NextResponse } from 'next/server';
import { getMedia, saveMedia } from '@/lib/data';
import fs from 'fs';
import path from 'path';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET() {
  return NextResponse.json(getMedia());
}

export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const items = getMedia();
    const item = items.find((m) => m.id === id);
    if (item) {
      // try delete file from disk
      try {
        const filePath = path.join(process.cwd(), 'public', item.url.replace(/^\//, ''));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {}
      saveMedia(items.filter((m) => m.id !== id));
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
