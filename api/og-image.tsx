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

/** Noto Sans 500 + 700 woff2 (cached across warm invocations). */
function loadFonts(): Promise<Record<number, ArrayBuffer>> {
  if (!fontCache) {
    fontCache = (async () => {
      const assertWoff2 = (buf: ArrayBuffer, where: string) => {
        const magic = new Uint8Array(buf.slice(0, 4));
        const ok = magic[0] === 0x77 && magic[1] === 0x4f && magic[2] === 0x46 && magic[3] === 0x32;
        if (!ok) throw new Error(`bad font bytes @${where}`);
      };
      // Primary: fontsource direct woff2 URLs (deterministic, no parsing).
      try {
        const out: Record<number, ArrayBuffer> = {};
        for (const weight of [500, 700]) {
          const res = await fetch(
            `https://cdn.jsdelivr.net/fontsource/fonts/noto-sans@latest/latin-${weight}-normal.woff2`
          );
          if (!res.ok) throw new Error(`fontsource ${weight}: ${res.status}`);
          const buf = await res.arrayBuffer();
          assertWoff2(buf, `fontsource-${weight}`);
          out[weight] = buf;
        }
        return out;
      } catch {
        // Fallback: parse Google Fonts CSS (latin subset preferred).
      }
      const cssRes = await fetch(
        'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500;700&display=swap',
        { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VedaTime-OG/1.0)' } }
      );
      if (!cssRes.ok) throw new Error(`font css: ${cssRes.status}`);
      const css = await cssRes.text();
      // Multiple @font-face blocks per weight (latin, latin-ext, devanagari…):
      // prefer the `latin` subset, fall back to any block of the weight.
      const out: Record<number, ArrayBuffer> = {};
      const latin: Record<number, string> = {};
      const any: Record<number, string> = {};
      for (const chunk of css.split('/*')) {
        const subset = (/^\s*([\w-]+)\s*\*\//.exec(chunk)?.[1] ?? '').toLowerCase();
        const faces = chunk.match(/@font-face\s*{[^}]*}/g) ?? [];
        for (const face of faces) {
          const weight = Number(/font-weight:\s*(\d+)/.exec(face)?.[1]);
          const url = /url\((https:[^)]+\.woff2)\)/.exec(face)?.[1];
          if ((weight === 500 || weight === 700) && url) {
            if (subset === 'latin' && !latin[weight]) latin[weight] = url;
            if (!any[weight]) any[weight] = url;
          }
        }
      }
      for (const weight of [500, 700]) {
        const url = latin[weight] ?? any[weight];
        if (!url) throw new Error(`missing woff2 weight ${weight}`);
        const buf = await (await fetch(url)).arrayBuffer();
        assertWoff2(buf, `gcss-${weight}`);
        out[weight] = buf;
      }
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
