/**
 * Ekadashi name resolver — pure (lunar-month, paksha, adhik) → name.
 *
 * REPLACES the old date-keyed verified table (verifiedEkadashis.ts, deleted):
 * observance DATES are computed by the engine from tithi mechanics
 * (Udaya / Dashami-viddha / arunodaya-viddha / Mahadwadashi); only NAMES
 * come from this table, so any year — past or future — resolves without
 * hardcoded dates. Display names follow Drik Panchang short forms; Hindi
 * forms follow Padma-Purana-based vedic data (completeEkadashiData.ts).
 *
 * Adhik Maas: an Ekadashi falling in an Adhik (intercalary) month is
 * Parama (Krishna) / Padmini (Shukla) regardless of the month number.
 */

export interface ResolvedEkadashiName {
  name: string;
  nameHindi: string;
}

type Paksha = 'Shukla' | 'Krishna';

const NAMES: Record<number, Record<Paksha, ResolvedEkadashiName>> = {
  1: {
    Krishna: { name: 'Papmochani Ekadashi', nameHindi: 'पापमोचनी एकादशी' },
    Shukla: { name: 'Kamada Ekadashi', nameHindi: 'कामदा एकादशी' },
  },
  2: {
    Krishna: { name: 'Varuthini Ekadashi', nameHindi: 'वारुथिनी एकादशी' },
    Shukla: { name: 'Mohini Ekadashi', nameHindi: 'मोहिनी एकादशी' },
  },
  3: {
    Krishna: { name: 'Apara Ekadashi', nameHindi: 'अपा एकादशी' },
    Shukla: { name: 'Nirjala Ekadashi', nameHindi: 'निर्जला एकादशी' },
  },
  4: {
    Krishna: { name: 'Yogini Ekadashi', nameHindi: 'योगिनी एकादशी' },
    Shukla: { name: 'Devshayani Ekadashi', nameHindi: 'शयनी एकादशी' },
  },
  5: {
    Krishna: { name: 'Kamika Ekadashi', nameHindi: 'कामिका एकादशी' },
    Shukla: { name: 'Shravana Putrada Ekadashi', nameHindi: 'पुत्रदा एकादशी' },
  },
  6: {
    Krishna: { name: 'Aja Ekadashi', nameHindi: 'अजा एकादशी' },
    Shukla: { name: 'Parsva Ekadashi', nameHindi: 'परिवर्तिनी एकादशी' },
  },
  7: {
    Krishna: { name: 'Indira Ekadashi', nameHindi: 'इंदिरा एकादशी' },
    Shukla: { name: 'Papankusha Ekadashi', nameHindi: 'पापांकुशा एकादशी' },
  },
  8: {
    Krishna: { name: 'Rama Ekadashi', nameHindi: 'रामा एकादशी' },
    Shukla: { name: 'Devutthana Ekadashi', nameHindi: 'देवउत्थानी एकादशी' },
  },
  9: {
    Krishna: { name: 'Utpanna Ekadashi', nameHindi: 'उत्पन्ना एकादशी' },
    Shukla: { name: 'Mokshada Ekadashi', nameHindi: 'मोक्षदा एकादशी' },
  },
  10: {
    Krishna: { name: 'Safala Ekadashi', nameHindi: 'सफला एकादशी' },
    Shukla: { name: 'Vaikuntha Ekadashi', nameHindi: 'वैकुंठ एकादशी' },
  },
  11: {
    Krishna: { name: 'Shattila Ekadashi', nameHindi: 'षट्तिला एकादशी' },
    Shukla: { name: 'Jaya Ekadashi', nameHindi: 'जया एकादशी' },
  },
  12: {
    Krishna: { name: 'Vijaya Ekadashi', nameHindi: 'विजया एकादशी' },
    Shukla: { name: 'Amalaki Ekadashi', nameHindi: 'आमलकी एकादशी' },
  },
};

const ADHIK_NAMES: Record<Paksha, ResolvedEkadashiName> = {
  Krishna: { name: 'Parama Ekadashi', nameHindi: 'परमा एकादशी' },
  Shukla: { name: 'Padmini Ekadashi', nameHindi: 'पद्मिनी एकादशी' },
};

/**
 * Resolve the Ekadashi name for an amanta lunar month + paksha.
 * @param amantaMonth 1-12 (Chaitra=1 … Phalguna=12); null/0 → null.
 * @param isAdhikMonth true when the enclosing lunar month is Adhik Maas.
 */
export function resolveEkadashiName(
  amantaMonth: number | null,
  paksha: Paksha,
  isAdhikMonth: boolean
): ResolvedEkadashiName | null {
  if (isAdhikMonth) return ADHIK_NAMES[paksha];
  if (!amantaMonth || amantaMonth < 1 || amantaMonth > 12) return null;
  return NAMES[amantaMonth][paksha] ?? null;
}
