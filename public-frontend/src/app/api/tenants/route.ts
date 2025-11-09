'use server';

import { NextResponse } from 'next/server';

// Proxy base URL for tenant-manager. Prefer explicit env, fallback to localhost, then docker service.
const TENANT_MANAGER_URL = process.env.TENANT_MANAGER_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const upstream = await fetch(`${TENANT_MANAGER_URL}/api/tenants`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    console.error('Proxy error:', err);
    const message = err instanceof Error ? err.message : 'Failed to proxy request';
    return NextResponse.json({ error: 'Proxy Error', message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Support two GET modes:
  // 1) /api/tenants?.... -> list
  // 2) /api/tenants?check=subdomain&value=foo -> availability check
  const url = new URL(request.url);
  const search = url.search || '';
  const check = url.searchParams.get('check');
  const value = url.searchParams.get('value');
  try {
    if (check === 'subdomain' && value) {
      const upstream = await fetch(`${TENANT_MANAGER_URL}/api/tenants/check-subdomain/${encodeURIComponent(value)}`, { cache: 'no-store' });
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstream.status });
    }

    const upstream = await fetch(`${TENANT_MANAGER_URL}/api/tenants${search}`, { cache: 'no-store' });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to proxy request';
    return NextResponse.json({ error: 'Proxy Error', message }, { status: 500 });
  }
}


