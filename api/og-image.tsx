/**
 * api/og-image — per-tithi PNG for link unfurls (?d=YYYY-MM-DD, 1200x630).
 *
 * Edge runtime + @vercel/og (Satori). Content mirrors the app hero:
 * VedaTime wordmark, giant tithi numeral, tithi/paksha/nakshatra lines,
 * sunrise/sunset, festival pill when present. Canvas + maroon/gold tokens
 * match the app theme (light canvas always — chat bubbles are light).
 *
 * Resilience: font fetch failure (or any error) 302s to the static
 * /og-image.png so a shared link NEVER 500s for a crawler.
 */
import { ImageResponse } from '@vercel/og';
import { buildOgMeta } from '../src/utils/ogMeta';
import { OgImageCard } from '../src/utils/ogImageCard';

export const config = { runtime: 'edge' };

let fontCache: Promise<Record<number, ArrayBuffer>> | null = null;

/** Noto Sans 500 + 700 woff2 via Google Fonts CSS (cached across warm invocations). */
function loadFonts(): Promise<Record<number, ArrayBuffer>> {
  if (!fontCache) {
    fontCache = (async () => {
      const css = await (
        await fetch(
          'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500;700&display=swap',
          { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VedaTime-OG/1.0)' } }
        )
      ).text();
      const out: Record<number, ArrayBuffer> = {};
      for (const block of css.split('@font-face').slice(1)) {
        const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1]);
        const url = /url\((https:[^)]+\.woff2)\)/.exec(block)?.[1];
        if ((weight === 500 || weight === 700) && url && !out[weight]) {
          out[weight] = await (await fetch(url)).arrayBuffer();
        }
      }
      if (!out[500] || !out[700]) throw new Error('missing woff2 weights');
      return out;
    })();
    // Don't poison the cache on failure — retry next cold/warm call.
    fontCache.catch(() => {
      fontCache = null;
    });
  }
  return fontCache;
}

function errorRedirect(url: URL): Response {
  return Response.redirect(new URL('/og-image.png', url).toString(), 302);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any): Promise<Response> {
  try {
    const url = new URL(req.url);
    const host = url.host;
    const meta = buildOgMeta(url.searchParams.get('d') ?? '', host);
    if (!meta.ok) return errorRedirect(url);
    const fonts = await loadFonts();

    return new ImageResponse(<OgImageCard meta={meta} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Noto Sans', data: fonts[500], weight: 500, style: 'normal' },
        { name: 'Noto Sans', data: fonts[700], weight: 700, style: 'normal' },
      ],
    });
  } catch (err) {
    try {
      const debugUrl = new URL(req.url);
      if (debugUrl.searchParams.get('debug') === '1') {
        return new Response(`OGIMGERR: ${String(err).slice(0, 300)}`, { status: 500 });
      }
      return errorRedirect(debugUrl);
    } catch {
      return new Response('error', { status: 500 });
    }
  }
}
