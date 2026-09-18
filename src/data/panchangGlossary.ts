/**
 * PanchangGlossary - one-line meanings for the five limbs of the Panchang + Vara.
 *
 * Single source of truth for "what does this mean" copy, used by:
 * - OnboardingScreen ("What is Panchang?" step)
 * - GlossaryDialog (tap-to-explain on Today)
 * - SettingsScreen (About → glossary reference)
 *
 * Convention: English + Hindi inline (same as src/data/vedic/tithiData.ts),
 * so no i18n JSON churn. Other languages fall back to English.
 */

export interface GlossaryEntry {
  id: 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara' | 'panchang' | 'maas' | 'paksha' | 'adhik';
  name: string;
  nameHindi: string;
  /** One-line "what it is" — shown in lists and onboarding. */
  meaning: string;
  meaningHindi: string;
  /** One-line "why it matters" — shown in the dialog. */
  detail: string;
  detailHindi: string;
}

export const PANCHANG_GLOSSARY: GlossaryEntry[] = [
  {
    id: 'panchang',
    name: 'Panchang',
    nameHindi: 'पंचांग',
    meaning: '“Five limbs” — the Vedic daily almanac. Each day is described by five parts.',
    meaningHindi: '“पाँच अंग” — वैदिक दैनिक पंचांग। प्रत्येक दिन पाँच भागों से बताया जाता है।',
    detail: 'Instead of one date number, the Panchang reads the day from the Sun and Moon: tithi, nakshatra, yoga, karana, plus the weekday (vara).',
    detailHindi: 'एक तारीख के बजाय पंचांग सूर्य और चंद्रमा से दिन पढ़ता है: तिथि, नक्षत्र, योग, करण और वार।',
  },
  {
    id: 'tithi',
    name: 'Tithi',
    nameHindi: 'तिथि',
    meaning: 'Lunar day — the Moon’s angle from the Sun in 12° steps. Festivals and fasts follow tithi, not the English date.',
    meaningHindi: 'चांद्र दिवस — सूर्य से चंद्रमा की दूरी 12° के चरणों में। त्योहार और व्रत तिथि से चलते हैं, अंग्रेज़ी तारीख से नहीं।',
    detail: 'There are 30 tithis in a lunar month — 15 waxing (Shukla) and 15 waning (Krishna). Ekadashi, Purnima and Amavasya are tithis.',
    detailHindi: 'एक चांद्र मास में 30 तिथियाँ होती हैं — 15 शुक्ल और 15 कृष्ण। एकादशी, पूर्णिमा और अमावस्या तिथियाँ ही हैं।',
  },
  {
    id: 'nakshatra',
    name: 'Nakshatra',
    nameHindi: 'नक्षत्र',
    meaning: 'Star mansion — the constellation the Moon stands in, one of 27. Sets the day’s character.',
    meaningHindi: 'तारा-मंडल — 27 में से वह नक्षत्र जिसमें चंद्रमा स्थित है। दिन का स्वभाव तय करता है।',
    detail: 'Each nakshatra has a ruling deity and its own temperament — Pushya favours beginnings, Rohini favours creativity. Tap it on Today for the full story.',
    detailHindi: 'प्रत्येक नक्षत्र का अपना देवता और स्वभाव है — पुष्य आरंभ के लिए, रोहिणी रचनात्मकता के लिए शुभ। पूरी कथा Today पर टैप करें।',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    nameHindi: 'योग',
    meaning: 'Sun–Moon blend — their combined longitude in 27 parts. Colours the day’s energy.',
    meaningHindi: 'सूर्य-चंद्र संयोग — दोनों की मिली देशांतर 27 भागों में। दिन की ऊर्जा का रंग तय करता है।',
    detail: 'One of 27 yogas runs each day. Some favour new beginnings, others suit rest and routine work — check the auspiciousness badge beside it.',
    detailHindi: 'प्रतिदिन 27 में से एक योग चलता है। कुछ नई शुरुआत के लिए शुभ, कुछ विश्राम और नियमित कार्य के लिए — पास का शुभता-चिह्न देखें।',
  },
  {
    id: 'karana',
    name: 'Karana',
    nameHindi: 'करण',
    meaning: 'Half-tithi — each tithi splits in two. Tells which half of the day suits which action.',
    meaningHindi: 'आधी तिथि — प्रत्येक तिथि दो भागों में बँटती है। दिन का कौन-सा भाग किस कार्य के योग्य है, यह बताता है।',
    detail: 'There are 11 karanas in total. Fixed ones like Vishti (Bhadra) are traditionally avoided for new ventures.',
    detailHindi: 'कुल 11 करण होते हैं। विष्टि (भद्रा) जैसे स्थिर करणों में नई शुरुआत से परहेज़ किया जाता है।',
  },
  {
    id: 'vara',
    name: 'Vara',
    nameHindi: 'वार',
    meaning: 'Weekday — each day is ruled by a planet: Sunday–Sun, Monday–Moon, Tuesday–Mars, and so on. Counted from sunrise.',
    meaningHindi: 'सप्ताह का दिन — प्रत्येक दिन एक ग्रह का होता है: रविवार–सूर्य, सोमवार–चंद्र, मंगलवार–मंगल आदि। सूर्योदय से गिना जाता है।',
    detail: 'The weekday colours daily worship — Monday for Shiva, Tuesday for Hanuman, Thursday for Vishnu. It is the fifth limb alongside the four above.',
    detailHindi: 'वार दैनिक पूजा का रंग तय करता है — सोमवार शिव, मंगलवार हनुमान, गुरुवार विष्णु के लिए। यह उपरोक्त चारों के साथ पाँचवाँ अंग है।',
  },
  {
    id: 'maas',
    name: 'Maas',
    nameHindi: 'मास',
    meaning: 'Lunar month — new moon to new moon, twelve in a year: Chaitra, Vaishakha, Jyeshtha, Ashadha, Shravana, Bhadrapada, Ashwin, Kartika, Margashirsha, Pausha, Magha, Phalguna.',
    meaningHindi: 'चांद्र मास — अमावस्या से अमावस्या तक, वर्ष में बारह: चैत्र, वैशाख, ज्येष्ठ, आषाढ़, श्रावण, भाद्रपद, आश्विन, कार्तिक, मार्गशीर्ष, पौष, माघ, फाल्गुन।',
    detail: 'Each month is named for the season of the full moon within it. Festivals are fixed to months — Diwali always falls in Kartika, Holi in Phalguna.',
    detailHindi: 'प्रत्येक मास का नाम उसके भीतर की पूर्णिमा के अनुसार है। त्योहार मास से बँधे हैं — दीवाली सदा कार्तिक में, होली फाल्गुन में।',
  },
  {
    id: 'paksha',
    name: 'Paksha',
    nameHindi: 'पक्ष',
    meaning: 'Fortnight — the waxing half (Shukla, new moon to full moon) and the waning half (Krishna, full moon to new moon). Fifteen tithis each.',
    meaningHindi: 'पक्ष — शुक्ल (अमावस्या से पूर्णिमा तक बढ़ता चंद्रमा) और कृष्ण (पूर्णिमा से अमावस्या तक घटता चंद्रमा)। प्रत्येक में पंद्रह तिथियाँ।',
    detail: 'Shukla Paksha suits beginnings and growth; Krishna Paksha suits completion, remembrance, and ancestral rites like Pitru Paksha.',
    detailHindi: 'शुक्ल पक्ष आरंभ और वृद्धि के लिए शुभ; कृष्ण पक्ष समापन, स्मरण और पितृ पक्ष जैसे पितृ-कार्यों के लिए।',
  },
  {
    id: 'adhik',
    name: 'Adhik Maas',
    nameHindi: 'अधिक मास',
    meaning: 'Leap month (Purushottam Maas) — about every 32 months, a lunar month passes with no solar ingress. That extra month is Adhik, and the year runs 13 months.',
    meaningHindi: 'अधिक मास (पुरुषोत्तम मास) — लगभग हर 32 महीने में एक चांद्र मास बिना संक्रांति के बीतता है। वही अतिरिक्त मास अधिक कहलाता है, और वर्ष 13 मास का होता है।',
    detail: 'Adhik Maas is sacred for prayer, fasting, and charity to Vishnu — but weddings, housewarmings, and new ventures wait for the Nija (regular) month. Recent ones: Adhik Shravana 2023, Adhik Jyeshtha 2026.',
    detailHindi: 'अधिक मास जप, व्रत और विष्णु-सेवा के लिए पवित्र है — पर विवाह, गृहप्रवेश और नई शुरुआत निज (नियमित) मास में ही। हाल के: अधिक श्रावण 2023, अधिक ज्येष्ठ 2026।',
  },
];

export function getGlossaryEntry(id: GlossaryEntry['id']): GlossaryEntry {
  return PANCHANG_GLOSSARY.find((e) => e.id === id) ?? PANCHANG_GLOSSARY[0];
}
