import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addMedia } from '@/lib/data';

function isAuth(req: NextRequest) {
  return req.cookies.get('biwor_admin')?.value === 'authenticated';
}

async function saveOne(file: File, type: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.jpg';

  let subdir = 'uploads/library';
  let filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  if (type === 'logo') {
    subdir = 'uploads';
    filename = `logo${ext}`;
  } else if (type === 'favicon') {
    subdir = 'uploads';
    filename = 'favicon.ico';
  } else if (type === 'hero') {
    subdir = 'uploads/hero';
    filename = `hero-${Date.now()}${ext}`;
  } else if (type === 'product') {
    subdir = 'uploads/products';
  } else if (type === 'gallery') {
    subdir = 'uploads/gallery';
  } else if (type === 'cert') {
    subdir = 'uploads/certs';
  }

  const dir = path.join(process.cwd(), 'public', subdir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);

  const url = `/${subdir}/${filename}`.replace(/\\/g, '/');
  const mediaItem = addMedia({
    id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
    url,
    name: file.name,
    type: type || 'media',
    size: buffer.length,
    createdAt: new Date().toISOString(),
  });
  return { url, media: mediaItem };
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const type = (formData.get('type') as string) || 'media';

    // Bulk: multiple files under "files"
    const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
    const single = formData.get('file');
    if (single instanceof File && single.size > 0) files.push(single);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const results = [];
    for (const file of files) {
      results.push(await saveOne(file, type));
    }

    if (results.length === 1) {
      return NextResponse.json({ success: true, url: results[0].url, media: results[0].media });
    }
    return NextResponse.json({
      success: true,
      urls: results.map((r) => r.url),
      media: results.map((r) => r.media),
      count: results.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
