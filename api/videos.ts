export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

function isValidR2(u: string) {
  return /^https:\/\/(pub-[a-f0-9]{32}\.r2\.dev\/|4800fba8ac6b8daf44aabeb4ee1867f2\.r2\.cloudflarestorage\.com\/staro-videos-prod\/)/.test(u);
}

export default async function handler() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), {
      status: 500, 
      headers: { 'content-type': 'application/json' }
    });
  }

  const query = 'select=id,created_at,title,tags,category,width,height,duration_seconds,resolution,video_url,thumbnail_url&is_public=eq.true&video_url=not.is.null&order=created_at.desc&limit=50';
  
  const r = await fetch(SUPABASE_URL + '/rest/v1/videos?' + query, {
    headers: {
      'content-type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
    }
  });

  if (!r.ok) {
    const text = await r.text();
    return new Response(JSON.stringify({ error: text }), {
      status: r.status, 
      headers: { 'content-type': 'application/json' }
    });
  }

  const data = await r.json();
  const safe = (data || []).filter((v: any) => v.video_url && isValidR2(v.video_url));

  return new Response(JSON.stringify({ data: safe }), {
    headers: { 
      'content-type': 'application/json', 
      'cache-control': 'public, max-age=30'
    }
  });
}
