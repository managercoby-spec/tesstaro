export const config = { runtime: 'edge' };

function allowed(u: string) {
  return u.startsWith('https://pub-') && u.includes('.r2.dev/');
}

export default async function handler(req: Request) {
  const url = new URL(req.url).searchParams.get('url') || '';
  
  if (!allowed(url)) {
    return new Response(JSON.stringify({ error: 'invalid url' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  const r = await fetch(url, { method: 'GET' });

  if (!r.ok || !r.body) {
    const text = await r.text();
    return new Response('R2 error: ' + r.status + ' - ' + text, {
      status: r.status,
      headers: { 'content-type': 'text/plain' }
    });
  }

  const name = decodeURIComponent(url.split('/').pop() || 'file');
  const headers = new Headers();
  
  headers.set('content-type', r.headers.get('content-type') || 'video/mp4');
  headers.set('content-disposition', 'attachment; filename="' + name + '"');
  headers.set('cache-control', 'public, max-age=3600');
  headers.set('access-control-allow-origin', '*');

  return new Response(r.body, { headers });
}
