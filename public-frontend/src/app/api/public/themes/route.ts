import { NextResponse } from 'next/server';

// Simple in-memory rate limiter per IP
const ipHits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_HITS = 60; // 60 req/min per IP

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    ipHits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= MAX_HITS) return false;
  rec.count += 1;
  return true;
}

interface ThemeRow {
  id: number | string;
  name: string;
  slug?: string;
  version?: string;
  description?: string;
  price?: number;
  is_free?: boolean | number;
  author?: string;
  banner_file_id?: number | null;
  status?: string;
}

interface ThemesResponse { success?: boolean; data?: ThemeRow[] }

export async function GET(request: Request) {
  try {
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // Basic origin check (optional tighten with exact domain in env)
    const allowed = (process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) || []) as string[];
    const origin = request.headers.get('origin') || '';
    if (allowed.length && origin && !allowed.includes(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const TM_API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

    const res = await fetch(`${TM_API}/front-req/themes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const data: ThemesResponse = await res.json().catch(() => ({} as ThemesResponse));
    if (!res.ok) {
      const errMsg = (data as unknown as { message?: string; error?: string })?.message || (data as unknown as { message?: string; error?: string })?.error || 'Failed to fetch themes';
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    // Map to public-safe fields only
    const items: ThemeRow[] = Array.isArray(data?.data) ? (data.data as ThemeRow[]) : [];
    // Only free themes
    const freeThemes = items.filter((t) => t && (t.status === 'active' || t.status === undefined) && (!!t.is_free || (t.price ?? 0) === 0));

    // Resolve image URLs server-side (optional best-effort)
    const FILES_BASE = process.env.FILES_CDN_BASE || 'https://files.iranche.com';
    const withImages = await Promise.all(freeThemes.map(async (t) => {
      let image_url: string | null = null;
      try {
        if (t.banner_file_id) {
          const fres = await fetch(`${TM_API}/front-req/files/${t.banner_file_id}`, { cache: 'no-store' });
          if (fres.ok) {
            const fdata = await fres.json().catch(() => ({}) as unknown as { data?: { storage_path?: string } });
            const storagePath = (fdata && fdata.data ? fdata.data.storage_path : undefined);
            if (storagePath) image_url = `${FILES_BASE}/${storagePath}`;
          }
        }
      } catch {}
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        version: t.version,
        description: t.description,
        price: t.price ?? 0,
        is_free: true,
        author: t.author,
        image_url,
        demo_url: (t as unknown as { demo_url?: string | null }).demo_url || null
      };
    }));

    return NextResponse.json({ success: true, data: withImages });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


