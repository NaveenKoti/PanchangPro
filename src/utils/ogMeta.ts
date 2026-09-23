/**
 * Open-Graph meta for share-tithi links (?d=YYYY-MM-DD).
 *
 * Pure + fully tested: validates the date, computes the day's panchang
 * with the real engine (Delhi reference city — links carry no location),
 * and returns crawler meta + the browser redirect target. The thin
 * api/og.tsx + api/og-image.tsx handlers only serialize this.
 */
import { PanchangEngine } from '../engine/panchang';
import { parseDayParam, formatDayParam } from './dayLink';

export interface OgMeta {
  ok: true;
  /** e.g. "Parsva Ekadashi · 22 Sep 2026". */
  title: string;
  /** e.g. "Shukla Paksha · Bharani · Sunrise 06:27 — open in VedaTime". */
  description: string;
  /** Absolute PNG url for og:image. */
  imageUrl: string;
  /** Self url (og:url). */
  pageUrl: string;
  /** Where browsers go (the app, deep-linked day). */
  redirectUrl: string;
  /** Tithi + festival, for the rendered image. */
  tithiName: string;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  nakshatraName: string;
  sunrise: string;
  sunset: string;
  dateLabel: string;
  festivalName: string | null;
}

const DELHI = {
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
  name: 'Delhi',
};

const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const fmtDate = (d: Date) =>
  `${d.getDate()} ${d.toLocaleDateString('en-GB', { month: 'short' })} ${d.getFullYear()}`;

export function buildOgMeta(dateISO: string, host: string): OgMeta | { ok: false } {
  const date = parseDayParam(dateISO.startsWith('?') || dateISO.includes('=') ? dateISO : `?d=${dateISO}`);
  if (!date) return { ok: false };
  const iso = formatDayParam(date);
  const engine = new PanchangEngine(DELHI);
  const noon = new Date(date);
  noon.setHours(12, 0, 0, 0);
  const p = engine.calculate(noon);
  const festival = p.festivals?.[0];
  const festivalName = festival ? festival.name : null;
  const dateLabel = fmtDate(date);
  const title = `${p.tithi.name} · ${dateLabel}`;
  const description =
    `${festivalName ? `${festivalName} · ` : ''}` +
    `${p.tithi.paksha} Paksha · ${p.nakshatra.name} · ` +
    `Sunrise ${fmtTime(p.sunrise)} — open in VedaTime`;
  return {
    ok: true,
    title,
    description,
    imageUrl: `https://${host}/api/og-image?d=${iso}`,
    pageUrl: `https://${host}/api/og?d=${iso}`,
    redirectUrl: `https://${host}/?d=${iso}`,
    tithiName: p.tithi.name,
    tithiNumber: p.tithi.number,
    paksha: p.tithi.paksha,
    nakshatraName: p.nakshatra.name,
    sunrise: fmtTime(p.sunrise),
    sunset: fmtTime(p.sunset),
    dateLabel,
    festivalName,
  };
}
