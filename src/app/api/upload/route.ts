import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addMedia } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || '.jpg';

    let subdir = 'uploads';
    let filename = `${Date.now()}${ext}`;

    if (type === 'logo') {
      filename = `logo${ext}`;
    } else if (type === 'favicon') {
      filename = 'favicon.ico';
    } else if (type === 'og') {
      filename = `og-image${ext}`;
    } else if (type === 'hero') {
      subdir = 'uploads/hero';
      filename = `hero-${Date.now()}${ext}`;
    } else if (type === 'product') {
      subdir = 'uploads/products';
      filename = `${Date.now()}${ext}`;
    } else if (type === 'gallery') {
      subdir = 'uploads/gallery';
      filename = `${Date.now()}${ext}`;
    } else if (type === 'media') {
      subdir = 'uploads/library';
      filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }

    const dir = path.join(process.cwd(), 'public', subdir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);

    const url = `/${subdir}/${filename}`.replace(/\\/g, '/');

    // Register in media library
    const mediaItem = addMedia({
      id: String(Date.now()),
      url,
      name: file.name,
      type: type || 'general',
      size: buffer.length,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, url, media: mediaItem });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
