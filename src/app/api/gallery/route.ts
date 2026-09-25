import { NextRequest, NextResponse } from 'next/server';
import { getGallery, saveGallery, GalleryItem } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function GET() {
  return NextResponse.json(getGallery());
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const items = getGallery();
    const newItem: GalleryItem = {
      id: String(Date.now()),
      title: body.title || 'Untitled',
      category: body.category || 'Production',
      image: body.image || '',
    };
    items.push(newItem);
    saveGallery(items);
    return NextResponse.json(newItem);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const items = getGallery();
    const idx = items.findIndex((i) => i.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    items[idx] = { ...items[idx], ...body };
    saveGallery(items);
    return NextResponse.json(items[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    saveGallery(getGallery().filter((i) => i.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
