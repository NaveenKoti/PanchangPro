/**
 * OgImageCard structure test (no edge runtime needed): renders the 1200x630
 * layout to static markup and asserts the unfurl carries the right content.
 */
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { OgImageCard } from '../ogImageCard';
import { buildOgMeta } from '../ogMeta';

describe('OgImageCard', () => {
  it('Dussehra card carries name, numeral, timings, festival pill', () => {
    const meta = buildOgMeta('2026-10-20', 'x.test');
    expect(meta.ok).toBe(true);
    if (!meta.ok) return;
    const html = renderToStaticMarkup(<OgImageCard meta={meta} />);
    expect(html).toContain('VedaTime');
    expect(html).toContain(meta.tithiName);
    expect(html).toContain(`${meta.tithiNumber}`);
    expect(html).toContain(meta.sunrise);
    expect(html).toContain(meta.sunset);
    expect(html).toContain('Dussehra');
  });

  it('plain day omits the festival pill', () => {
    // 2026-09-23 is Vamana Jayanti (Bhadrapada Shukla Dwadashi) since the
    // festival data was extended — use 2026-09-22, which has no festival.
    const meta = buildOgMeta('2026-09-22', 'x.test');
    expect(meta.ok).toBe(true);
    if (!meta.ok) return;
    expect(meta.festivalName).toBeNull();
    const html = renderToStaticMarkup(<OgImageCard meta={meta} />);
    expect(html).toContain(meta.tithiName);
    expect(html).not.toContain('Dussehra');
  });
});
