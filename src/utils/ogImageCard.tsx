/**
 * OgImageCard — the 1200x630 unfurl image layout (rendered by @vercel/og
 * in api/og-image.tsx). Kept here (not inline in the handler) so tests can
 * render it to static markup and assert structure without the edge runtime.
 *
 * Satori subset only: flex, fontSize/Weight, color, backgroundColor,
 * border, borderRadius, padding, margin, lineHeight. No emoji, no Hindi
 * (single Noto Sans latin file on the edge function).
 */
import React from 'react';
import type { OgMeta } from './ogMeta';

const INK = '#221C15';
const MUTED = 'rgba(34,28,21,0.62)';
const ACCENT = '#7C2D12';
const CANVAS = '#FAF7F2';
const CARD = '#FFFFFF';
const DIVIDER = 'rgba(34,28,21,0.12)';
const ACCENT_SOFT = 'rgba(124,45,18,0.08)';

export const OgImageCard: React.FC<{ meta: Extract<OgMeta, { ok: true }> }> = ({ meta }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: CANVAS,
      padding: 64,
      fontFamily: 'Noto Sans',
    }}
  >
    {/* Wordmark */}
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, color: ACCENT, fontWeight: 700 }}>
      <div>VedaTime</div>
      <div style={{ marginLeft: 16, fontSize: 24, color: MUTED, fontWeight: 500 }}>
        Sacred Rhythms of Time
      </div>
    </div>

    {/* Hero row: name + giant numeral */}
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 88, fontWeight: 700, color: INK, lineHeight: 1 }}>
          {meta.tithiName}
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: MUTED, marginTop: 12 }}>
          {meta.paksha} Paksha · {meta.nakshatraName} · {meta.dateLabel}
        </div>
      </div>
      <div style={{ marginLeft: 'auto', fontSize: 200, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
        {String(meta.tithiNumber)}
      </div>
    </div>

    {/* Timings card */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: 36,
        backgroundColor: CARD,
        border: `2px solid ${DIVIDER}`,
        borderRadius: 16,
        padding: '24px 32px',
        fontSize: 30,
        color: INK,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>Sunrise&nbsp;</div>
        <div style={{ fontWeight: 700 }}>{meta.sunrise}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 48 }}>
        <div>Sunset&nbsp;</div>
        <div style={{ fontWeight: 700 }}>{meta.sunset}</div>
      </div>
      {meta.festivalName ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
            backgroundColor: ACCENT_SOFT,
            border: `2px solid ${ACCENT}`,
            color: ACCENT,
            borderRadius: 999,
            padding: '10px 28px',
            fontWeight: 700,
          }}
        >
          {meta.festivalName}
        </div>
      ) : null}
    </div>

    {/* Footer */}
    <div style={{ display: 'flex', marginTop: 'auto', fontSize: 26, color: MUTED }}>
      Open this day in the app — VedaTime Panchang
    </div>
  </div>
);
