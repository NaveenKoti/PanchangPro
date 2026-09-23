/**
 * api/og — unfurl page for share-tithi links (?d=YYYY-MM-DD).
 *
 * EDGE runtime (the engine chain demonstrably loads there; the Node
 * runtime sibling 500s on this project — see og-image diagnosis).
 * Crawlers (WhatsApp/Telegram/X) fetch this HTML and read the og:* meta
 * (title/description/per-tithi PNG). Real browsers bounce straight to the
 * app via meta-refresh + JS redirect. Invalid dates 302 to `/`.
 * `?debug=1` returns the throw as text. All tithi content comes from
 * buildOgMeta (real engine) — never hand-written.
 */
import { buildOgMeta } from '../src/utils/ogMeta';

export const config = { runtime: 'edge' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any): Promise<Response> {
  const url = new URL(req.url);
  const debug = url.searchParams.get('debug') === '1';
  try {
    const host = req.headers.get('x-forwarded-host') ?? url.host;
    const meta = buildOgMeta(url.searchParams.get('d') ?? '', host);
    if (!meta.ok) {
      return Response.redirect(new URL('/', url).toString(), 302);
    }
    const esc = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(meta.title)} — VedaTime</title>
<meta name="description" content="${esc(meta.description)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="VedaTime" />
<meta property="og:title" content="${esc(meta.title)} — VedaTime" />
<meta property="og:description" content="${esc(meta.description)}" />
<meta property="og:url" content="${esc(meta.pageUrl)}" />
<meta property="og:image" content="${esc(meta.imageUrl)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(meta.title)} — VedaTime" />
<meta name="twitter:description" content="${esc(meta.description)}" />
<meta name="twitter:image" content="${esc(meta.imageUrl)}" />
<link rel="canonical" href="${esc(meta.pageUrl)}" />
<meta http-equiv="refresh" content="0;url=${esc(meta.redirectUrl)}" />
</head>
<body>
<p><a href="${esc(meta.redirectUrl)}">Open ${esc(meta.title)} in VedaTime</a></p>
<script>window.location.replace(${JSON.stringify(meta.redirectUrl)});</script>
</body>
</html>`;
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    if (debug) return new Response(`OGERR: ${String(err).slice(0, 300)}`, { status: 500 });
    return Response.redirect(new URL('/', url).toString(), 302);
  }
}
