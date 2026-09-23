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
import React from 'react';
import { buildOgMeta } from '../src/utils/ogMeta';
import { OgImageCard } from '../src/utils/ogImageCard';

export const config = { runtime: 'edge' };

let fontCache: Promise<Record<number, ArrayBuffer>> | null = null;

/** Noto Sans 500 + 700 as TTF (cached across warm invocations). */
function loadFonts(): Promise<Record<number, ArrayBuffer>> {
  if (!fontCache) {
    fontCache = (async () => {
      const assertTtf = (buf: ArrayBuffer, where: string) => {
        const magic = new Uint8Array(buf.slice(0, 4));
        const ttf =
          (magic[0] === 0x00 && magic[1] === 0x01 && magic[2] === 0x00 && magic[3] === 0x00) ||
          (magic[0] === 0x4f && magic[1] === 0x54 && magic[2] === 0x54 && magic[3] === 0x4f);
        if (!ttf) throw new Error(`bad font bytes @${where}`);
      };
      // NOTE: the Satori/resvg stack behind @vercel/og rejects WOFF2
      // ("Unsupported OpenType signature wOF2") — fetch TTF by requesting
      // the css2 API WITHOUT a browser UA (returns truetype URLs).
      const cssRes = await fetch(
        'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500;700&display=swap'
      );
      if (!cssRes.ok) throw new Error(`font css: ${cssRes.status}`);
      const css = await cssRes.text();
      const out: Record<number, ArrayBuffer> = {};
      for (const block of css.split('@font-face').slice(1)) {
        const weight = Number(/font-weight:\s*(\d+)/.exec(block)?.[1]);
        const url = /url\((https:[^)]+\.ttf)\)/.exec(block)?.[1];
        if ((weight === 500 || weight === 700) && url && !out[weight]) {
          const buf = await (await fetch(url)).arrayBuffer();
          assertTtf(buf, `gcss-${weight}`);
          out[weight] = buf;
        }
      }
      if (!out[500] || !out[700]) throw new Error('missing ttf weights');
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
    if (url.searchParams.get('debug') === '1') {
      const magic = (b: ArrayBuffer) =>
        Array.from(new Uint8Array(b.slice(0, 4)))
          .map((x) => x.toString(16))
          .join('');
      // Full render probe (bytes) — Satori failures surface here as text.
      const F = (s: object, ...kids: React.ReactNode[]) =>
        React.createElement('div', { style: s }, ...kids);
      const attempt = async (el: React.ReactNode): Promise<string> => {
        try {
          const buf = await new ImageResponse(el as never, {
            width: 1200,
            height: 630,
            fonts: [
              { name: 'Noto Sans', data: fonts[500], weight: 500, style: 'normal' },
              { name: 'Noto Sans', data: fonts[700], weight: 700, style: 'normal' },
            ],
          }).arrayBuffer();
          return `${buf.byteLength}b`;
        } catch (e) {
          return `ERR:${String(e).slice(0, 120)}`;
        }
      };
      return Response.json({
        sha: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'local').slice(0, 7),
        font500bytes: fonts[500]?.byteLength ?? -1,
        font700bytes: fonts[700]?.byteLength ?? -1,
        magic500: fonts[500] ? magic(fonts[500]) : 'missing',
        magic700: fonts[700] ? magic(fonts[700]) : 'missing',
        title: meta.title,
        fullBytes: await attempt(
          F(
            { display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
            React.createElement(OgImageCard, { meta })
          )
        ),
      });
    }

    return new ImageResponse(<OgImageCard meta={meta} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Noto Sans', data: fonts[500], weight: 500, style: 'normal' },
        { name: 'Noto Sans', data: fonts[700], weight: 700, style: 'normal' },
      ],
    }).arrayBuffer().then(
      (buf) =>
        new Response(buf, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
            // One date = one immutable image: render once per date, serve
            // from the edge cache afterwards (cold-start cost amortized).
            'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
          },
        }),
      (renderErr: unknown) => {
        throw new Error(`render: ${String(renderErr).slice(0, 200)}`);
      }
    );
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
