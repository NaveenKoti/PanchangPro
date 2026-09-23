/**
 * api/og — unfurl page for share-tithi links (?d=YYYY-MM-DD).
 *
 * Crawlers (WhatsApp/Telegram/X) fetch this HTML and read the og:* meta
 * (title/description/per-tithi PNG). Real browsers are bounced straight to
 * the app via meta-refresh + JS redirect. Invalid dates 302 to `/`.
 * All tithi content comes from buildOgMeta (real engine) — never hand-written.
 *
 * NOTE: static import (not dynamic) — Vercel file-tracing must bundle the
 * engine chain or this 302s every request; `?debug=1` returns the throw.
 */
import { buildOgMeta } from '../src/utils/ogMeta';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const debug =
    (Array.isArray(req.query?.debug) ? req.query.debug[0] : req.query?.debug) === '1';
  try {
    const host =
      (req.headers?.['x-forwarded-host'] as string) ||
      (req.headers?.host as string) ||
      'panchang-pro.vercel.app';
    const d = Array.isArray(req.query?.d) ? req.query.d[0] : (req.query?.d as string | undefined);
    const meta = buildOgMeta(d ?? '', host);
    if (!meta.ok) {
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Unfurl content is date-specific and immutable-ish; crawlers re-fetch
    // per distinct URL, so a short cache is safe and cheap.
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.status(200).send(html);
  } catch (err) {
    if (debug) {
      res.status(500).send(`OGERR: ${String(err).slice(0, 300)}`);
      return;
    }
    res.writeHead(302, { Location: '/' });
    res.end();
  }
}
