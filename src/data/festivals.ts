/**
 * Festival Database
 * Why: Static data for major Hindu festivals with dates and significance
 */

import { Festival } from '../types';

export type FestivalVyapti = 'udaya' | 'madhyahna' | 'pradosh' | 'nishita' | 'aparahna' | 'moonrise';

export interface FestivalData {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  significance: string;
  rituals?: string[];
  deity?: string;
  // Translators fill `i18n` later; English top-level fields stay canonical.
  i18n?: { [lang in 'hi'|'sa'|'kn'|'te'|'ta']?: { name?: string; description?: string; significance?: string; rituals?: string[]; deity?: string } };
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  month: number; // 1-12 (Chaitra=1, Vaishakha=2, ..., Phalguna=12)
  type: 'major' | 'minor' | 'regional';
  region?: string[];
  date?: Date;
  /**
   * Which moment of the day the tithi must prevail for observance:
   * - udaya (default): tithi at sunrise — Ekadashi, Purnima, most festivals
   * - madhyahna: tithi at midday — Ganesh Chaturthi (born at midday)
   * - pradosh: tithi at sunset — Pradosh vrat (evening worship), Lakshmi Puja
   * - nishita: tithi at midnight — Maha Shivratri (great night of Shiva)
   * - aparahna: tithi in the afternoon (sunrise + 0.7 x daylength) — Bhai Dooj
   *   (Dwitiya blessings are given in the afternoon, not at dawn)
   * - moonrise: tithi at moonrise (sunrise.ts calculateMoonrise) — Karva Chauth
   *   (fast broken at moonrise); null when the moon does not rise that day
   *   (engine treats uncomputable moonrise as no-match on the ADD path)
   * Non-udaya rules are evaluated by the engine (panchang.ts vyapti pass),
   * which can compute tithi at arbitrary moments. Keep this field in sync
   * with shastra: a wrong vyapti shifts the festival by a day (e.g. Ganesh
   * Chaturthi 2026: Udaya says Sep 15, Madhyahna correctly says Sep 14).
   */
  vyapti?: FestivalVyapti;
  /**
   * Which lunar-month reckoning the rule's `month` is expressed in (engine
   * month gates are amanta throughout; getFestivalsForDate accepts an
   * explicit purnimanta month for the purnimanta-basis fallback):
   * - 'amanta' (default): month ends with Amavasya (Dakshin/Maharashtra
   *   convention). Correct for Shukla-paksha and most festivals.
   * - 'purnimanta': month ends with Purnima (North Indian convention).
   *   REQUIRED for Kartika-Krishna festivals (Diwali, Karva Chauth, Ahoi):
   *   their Amavasya/Chaturthi/Ashtami falls in amanta Ashwin (month 7) but
   *   purnimanta Kartika (month 8). For Shukla paksha both agree, so the
   *   flag only changes Krishna-paksha gating. Computed as: Shukla -> amanta
   *   month; Krishna -> amanta month + 1 (mod 12).
   */
  monthBasis?: 'amanta' | 'purnimanta';
  /**
   * Drik-style exception: ALSO keep the Udaya-matched day even when the
   * vyapti moment fails there. Used by:
   * - holika-dahan: Drik's "Pradosh without Udaya Vyapini Purnima" (TOI Feb
   *   2026): 2026 Purnima ran Mar 2 17:55 -> Mar 3 17:07, but Bhadra covered
   *   the Mar 2 pradosh, so Holika Dahan moved to the Mar 3 Udaya-Purnima
   *   evening (muhurat 18:22-20:50). The pradosh-Purnima day (Mar 2) still
   *   fires via the ADD path — matching the published regional split
   *   (Maharashtra/MP/Rajasthan observe Mar 2, others Mar 3; News18 Mar 2026).
   *   Vishti (Bhadra) windows are UNCOMPUTED — no Bhadra time is invented;
   *   the flag only preserves both candidate days for the household calendar.
   * - karwa-chauth: the vrat IS the Udaya-Chaturthi day (fast broken AT
   *   moonrise, which usually falls in Panchami, e.g. Oct 10 2025: Chaturthi
   *   ends 19:38, moonrise 20:13 per Drik). Moonrise remains the parana
   *   moment and the ADD-path catch for post-sunrise Chaturthi onsets.
   * Such rules are also exempt from the vriddhi consecutive-day dedupe, so
   * the exception day is never erased (Holika Mar 2 + Mar 3 both stand).
   */
  keepUdayaMatch?: boolean;
  /**
   * Aparahna-viddha direction for multi-day vyapti matches (engine vriddhi
   * dedupe). Default (absent) keeps the LATER day — Bhai Dooj para-viddha:
   * when Dwitiya prevails at Aparahna on two consecutive days, Drik
   * observes the second. Set `preferFirst: true` for purva-viddha rules:
   * Vijayadashami (Dussehra) — when Dashami prevails at Aparahna on two
   * days (Oct 20 + 21 in 2026: Dashami Oct 20 13:00 → Oct 21 ~15:00),
   * Drik observes the FIRST (Oct 20). Only meaningful with a non-udaya
   * vyapti; ignored otherwise.
   */
  preferFirst?: boolean;
}

export const FESTIVALS: FestivalData[] = [
  // Major Festivals
  {
    id: 'diwali',
    name: 'Diwali',
    nameHindi: 'दीपावली',
    i18n: {
      hi: {
        name: 'दीपावली',
        description: 'प्रकाश का पर्व',
        significance: 'वनवास के बाद राम की अयोध्या वापसी और लक्ष्मी पूजन का उत्सव; यह अंधकार पर प्रकाश की विजय का प्रतीक है। पूजन प्रदोष काल में अमावस्या व्याप्त होने पर होता है।',
        rituals: ['सूर्यास्त के बाद दीये और दीप जलाएं', 'लक्ष्मी और गणेश का संयुक्त पूजन करें', 'परिवार से मिठाई और उपहार बाँटें', 'लक्ष्मी स्तोत्र और आरती का पाठ करें'],
        deity: 'लक्ष्मी',
      },
      sa: {
        name: 'दीपावलिः',
        description: 'दीपानां महोत्सवः',
        significance: 'रामस्य अयोध्याप्रत्यागमनं लक्ष्मीपूजनं च अत्र उत्सव्यते। तमसः उपरि ज्योतिषः विजयः अयम्। प्रदोषकाले अमावास्यायां व्याप्तायां लक्ष्मीपूजा क्रियते।',
        rituals: ['सूर्यास्तानन्तरं दीपप्रज्वालनम्', 'लक्ष्मीगणेशयोः संयुक्तपूजनम्', 'कुटुम्बेन सह मिष्टान्नदानम्', 'लक्ष्मीस्तोत्रारार्तिकपठनम्'],
        deity: 'लक्ष्मीः',
      },
      kn: {
        name: 'ದೀಪಾವಳಿ',
        description: 'ಬೆಳಕಿನ ಹಬ್ಬ',
        significance: 'ರಾಮನು ವನವಾಸದಿಂದ ಅಯೋಧ್ಯೆಗೆ ಹಿಂದಿರುಗಿದ್ದರ ಸಂಭ್ರಮ. ಲಕ್ಷ್ಮಿಯ ಆರಾಧನೆಯೊಂದಿಗೆ ಕತ್ತಲೆಯ ಮೇಲೆ ಬೆಳಕಿನ ವಿಜಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಲಕ್ಷ್ಮೀ ಪೂಜೆಯನ್ನು ಸಂಜೆ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ ಮಾಡಲಾಗುತ್ತದೆ.',
        rituals: ['ಸೂರ್ಯಾಸ್ತದ ನಂತರ ದೀಪ ಹಚ್ಚಿ', 'ಲಕ್ಷ್ಮಿ ಮತ್ತು ಗಣೇಶರನ್ನು ಒಟ್ಟಿಗೆ ಪೂಜಿಸಿ', 'ಕುಟುಂಬದೊಂದಿಗೆ ಸಿಹಿ ಮತ್ತು ಉಡುಗೊರೆ ಹಂಚಿ', 'ಲಕ್ಷ್ಮೀ ಸ್ತೋತ್ರ ಮತ್ತು ಆರತಿ ಹಾಡಿ'],
        deity: 'ಲಕ್ಷ್ಮಿ',
      },
      te: {
        name: 'దీపావళి',
        description: 'వెలుగుల పండుగ',
        significance: 'రాముడు వనవాసం ముగించి అయోధ్యకు తిరిగి వచ్చిన ఆనందానికి గుర్తుగా జరుపుకుంటారు. లక్ష్మీదేవి ఆరాధనకు, చీకటిపై వెలుగు విజయానికి ప్రతీక. ప్రదోషకాలంలో లక్ష్మీపూజ చేస్తారు.',
        rituals: ['సూర్యాస్తమయం తర్వాత దీపాలు వెలిగించండి', 'లక్ష్మీ గణపతులను కలిపి పూజించండి', 'కుటుంబంతో స్వీట్లు బహుమతులు పంచుకోండి', 'లక్ష్మీ స్తోత్రాలు హారతి పఠించండి'],
        deity: 'లక్ష్మి',
      },
      ta: {
        name: 'தீபாவளி',
        description: 'ஒளித் திருவிழா',
        significance: 'அயோத்திக்கு ராமர் திரும்பியதைக் கொண்டாடும் விழா. லட்சுமி வழிபாட்டிற்குரிய நாள்; இருள் நீங்கி ஒளி வெல்வதன் அடையாளம். மாலையில் லட்சுமி பூஜை செய்யப்படுகிறது.',
        rituals: ['மாலையில் தீபங்கள் ஏற்று', 'லட்சுமி விநாயகரை சேர்த்து வழிபடு', 'இனிப்பு பரிசுகளைப் பகிர்ந்துகொள்', 'லட்சுமி துதிகள் ஆரத்தி பாடு'],
        deity: 'லட்சுமி',
      },
    },
    description: 'Festival of Lights',
    significance: 'Celebrates the return of Lord Rama to Ayodhya after 14 years of exile. Also associated with Goddess Lakshmi and the victory of light over darkness. Lakshmi Puja is performed in Pradosh Kaal (after sunset) while Amavasya prevails — so the eve, not the Udaya-Amavasya morning, is Diwali (2026: Nov 8 eve, Amavasya 11:27 Nov 8 → 12:31 Nov 9 per Drik; Udaya Amavasya falls Nov 9). प्रदोष काल में अमावस्या व्याप्त होने पर लक्ष्मी पूजा होती है — उदया तिथि वाला दिन नहीं।',
    rituals: ['Light diyas and lamps after sunset', 'Perform Lakshmi and Ganesha puja together', 'Exchange sweets and gifts with family', 'Recite Lakshmi stotras and aarti'],
    deity: 'Lakshmi',
    tithiNumber: 15,
    paksha: 'Krishna',
    month: 8, // Kartika (month 8 = index 7 + 1)
    type: 'major',
    vyapti: 'pradosh', // Lakshmi Puja is an evening rite (Drik: Pradosh Kaal muhurat)
    monthBasis: 'purnimanta', // Kartika Amavasya = amanta Ashwin; purnimanta Kartika
  },
  {
    id: 'holika-dahan',
    name: 'Holika Dahan',
    nameHindi: 'होलिका दहन',
    i18n: {
      hi: {
        name: 'होलिका दहन',
        description: 'होली की पूर्व संध्या का अग्नि उत्सव',
        significance: 'भक्त प्रह्लाद की रक्षा और होलिका के दहन की स्मृति; बुराई पर भक्ति की विजय का प्रतीक। पूजन भद्रा समाप्त होने के बाद प्रदोष काल में पूर्णिमा व्याप्त होने पर होता है।',
        rituals: ['सूर्यास्त से पहले होलिका और प्रह्लाद का पूजन करें', 'भद्रा समाप्त होने के बाद होलिका अग्नि जलाएं', 'गेहूँ की बालें और नारियल अर्पित करें', 'परिवार सहित अग्नि की परिक्रमा करें'],
        deity: 'होलिका और प्रह्लाद',
      },
      sa: {
        name: 'होलिकादहनम्',
        description: 'होलिकायाः पूर्वसन्ध्यायां वह्न्युत्सवः',
        significance: 'प्रह्लादभक्तेः विजयाय होलिकादहनं क्रियते। पूर्णिमायां व्याप्तायां प्रदोषकाले भद्रानन्तरं वह्निः प्रज्वाल्यते।',
        rituals: ['सूर्यास्तात् पूर्वं होलिकाप्रह्लादपूजनम्', 'भद्रानन्तरं वह्निप्रज्वालनम्', 'गोधूमानां नारिकेलस्य च अर्पणम्', 'कुटुम्बेन सह अग्निप्रदक्षिणा'],
        deity: 'होलिका',
      },
      kn: {
        name: 'ಹೋಲಿಕಾ ದಹನ',
        description: 'ಹೋಳಿಯ ಹಿಂದಿನ ದಿನದ ಬೆಂಕಿ',
        significance: 'ಹೋಲಿಕೆಯ ದಹನವು ಪ್ರಹ್ಲಾದನ ಭಕ್ತಿಯ ವಿಜಯ ಮತ್ತು ಕೆಡುಕಿನ ನಾಶವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಪೂರ್ಣಿಮೆ ಇರುವಾಗ ಸಂಜೆ ಪ್ರದೋಷ ಕಾಲದಲ್ಲಿ, ಭದ್ರಾ ಮುಗಿದ ನಂತರ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಸೂರ್ಯಾಸ್ತಕ್ಕೆ ಮುನ್ನ ಹೋಲಿಕಾ ಮತ್ತು ಪ್ರಹ್ಲಾದರನ್ನು ಪೂಜಿಸಿ', 'ಭದ್ರಾ ಮುಗಿದ ನಂತರ ಬೆಂಕಿ ಹಚ್ಚಿ', 'ಗೋಧಿ ತೆನೆ ಮತ್ತು ತೆಂಗಿನಕಾಯಿ ಅರ್ಪಿಸಿ', 'ಕುಟುಂಬದೊಂದಿಗೆ ಬೆಂಕಿಗೆ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ'],
        deity: 'ಹೋಲಿಕಾ ಮತ್ತು ಪ್ರಹ್ಲಾದ',
      },
      te: {
        name: 'హోలికా దహనం',
        description: 'హోలీ ముందురోజు మంట',
        significance: 'భక్తుడైన ప్రహ్లాదుని కాపాడి హోలిక దహనమైన కథకు గుర్తు. చెడుపై భక్తి విజయానికి ప్రతీక. ప్రదోషకాలంలో భద్ర ముగిశాక మంట వెలిగిస్తారు.',
        rituals: ['సూర్యాస్తమయానికి ముందు హోలికా ప్రహ్లాదులను పూజించండి', 'భద్ర తీరాక మంట వెలిగించండి', 'గోధుమ కంకులు కొబ్బరికాయ సమర్పించండి', 'కుటుంబంతో కలిసి మంట చుట్టూ ప్రదక్షిణ చేయండి'],
        deity: 'హోలిక మరియు ప్రహ్లాదుడు',
      },
      ta: {
        name: 'ஹோலிகா தகனம்',
        description: 'ஹோலிக்கு முந்தைய நாள் சுடர் விழா',
        significance: 'பக்தன் பிரகலாதனின் பக்தி தீமையை வென்றதன் அடையாளமாக மூட்டப்படும் புனித நெருப்பு. மாலை வேளையில் பிரதோஷத்தில் கொண்டாடப்படுகிறது.',
        rituals: ['மாலைக்கு முன் ஹோலிகா பிரகலாதனை வழிபடு', 'நெருப்பை மூட்டி வழிபடு', 'கோதுமை தேங்காய் படைத்திடு', 'குடும்பத்துடன் நெருப்பை வலம் வா'],
        deity: 'ஹோலிகா மற்றும் பிரகலாதன்',
      },
    },
    description: 'Bonfire on the eve of Holi',
    significance: 'The ceremonial bonfire symbolising the burning of Holika and the victory of devotion (Prahlad) over evil. Performed in Pradosh Kaal while Purnima prevails, strictly after Bhadra ends — Bhadra occupies the first half of Purnima, so when it covers the pradosh the observance moves to the Udaya-Purnima evening (Drik 2026: Mar 3, muhurat 18:22–20:50; regional calendars observing the pradosh-Purnima light on Mar 2). No Bhadra/Vishti time is computed here — this rule keeps both candidate days; consult a panchang for the Bhadra window. भद्रा के बाद प्रदोष काल में होलिका दहन; भद्रा समय की गणना यहाँ नहीं की गई है।',
    rituals: ['Worship Holika and Prahlada before sunset', 'Light bonfire after Bhadra ends', 'Offer wheat ears and coconut', 'Circumambulate fire with family'],
    deity: 'Holika and Prahlada',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 12, // Phalguna (month 12 = index 11 + 1)
    type: 'major',
    vyapti: 'pradosh',
    keepUdayaMatch: true, // Drik "Pradosh without Udaya Vyapini Purnima" exception — see field docs
  },
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    nameHindi: 'भाई दूज',
    i18n: {
      hi: {
        name: 'भाई दूज',
        description: 'बहनों द्वारा भाइयों को आशीर्वाद',
        significance: 'पांच दिवसीय दीपावली पर्व का समापन; बहनें अपराह्न काल में भाई को तिलक लगाकर आशीर्वाद देती हैं।',
        rituals: ['चावल से तिलक लगाएं', 'भाइयों की आरती उतारें', 'मिठाई और festive भोजन बाँटें', 'भाई उपहार देकर प्रत्युत्तर दें'],
        deity: 'यम और यमुना',
      },
      sa: {
        name: 'भ्रातृद्वितीया',
        description: 'भगिनीनां भ्रातृभ्यः आशीर्वाददिवसः',
        significance: 'कार्तिकशुक्लद्वितीयायाम् अपराह्णकाले भगिन्यः भ्रातृभ्यः तिलकं कृत्वा आशीर्वादं ददति। एषा दीपावलीपर्वणः समापनदिवसः।',
        rituals: ['भगिन्या अक्षतैः सह तिलकधारणम्', 'भ्रातृभ्यः आरार्तिककरणम्', 'मिष्टान्नभोजनविनिमयः', 'भ्रातृभिः उपहारदानम्'],
        deity: 'यमः',
      },
      kn: {
        name: 'ಭಾಯಿ ದೂಜ್',
        description: 'ಸಹೋದರಿಯರು ಸಹೋದರರನ್ನು ಹರಸುವ ಹಬ್ಬ',
        significance: 'ಐದು ದಿನಗಳ ದೀಪಾವಳಿಯ ಸಮಾರೋಪ. ಸಹೋದರಿಯರು ಮಧ್ಯಾಹ್ನದ ನಂತರ ಸಹೋದರರಿಗೆ ತಿಲಕವಿಟ್ಟು ಆಶೀರ್ವದಿಸುತ್ತಾರೆ. ದ್ವಿತೀಯಾ ಮಧ್ಯಾಹ್ನದ ವೇಳೆಗೆ ಇರಬೇಕು.',
        rituals: ['ಅಕ್ಕಿಯೊಂದಿಗೆ ಸಹೋದರರಿಗೆ ತಿಲಕವಿಡಿ', 'ಸಹೋದರರಿಗೆ ಆರತಿ ಮಾಡಿ', 'ಸಿಹಿ ಹಂಚಿ ಹಬ್ಬದ ಊಟ ಮಾಡಿ', 'ಸಹೋದರರು ಪ್ರತಿಯಾಗಿ ಉಡುಗೊರೆ ನೀಡಿ'],
        deity: 'ಯಮ ಮತ್ತು ಯಮುನಾ',
      },
      te: {
        name: 'భాయ్ దూజ్',
        description: 'సోదరీమణులు సోదరులను దీవించే పండుగ',
        significance: 'దీపావళి ఐదురోజుల వేడుకకు ముగింపు. సోదరీమణులు మధ్యాహ్నం తిలకం దిద్ది సోదరులను దీవిస్తారు. అన్నాచెల్లెళ్ల అనుబంధానికి ప్రతీక.',
        rituals: ['బియ్యంతో సోదరునికి తిలకం దిద్దండి', 'సోదరునికి హారతి ఇవ్వండి', 'స్వీట్లు పంచుకుని విందు చేయండి', 'సోదరులు బహుమతులు ఇవ్వండి'],
        deity: 'యముడు మరియు యమున',
      },
      ta: {
        name: 'பாய் தூஜ்',
        description: 'சகோதரிகள் சகோதரர்களை வாழ்த்தும் நாள்',
        significance: 'தீபாவளியை நிறைவு செய்யும் நாள். பிற்பகலில் சகோதரிகள் சகோதரர்களுக்கு திலகமிட்டு வாழ்த்துகின்றனர்; உடன்பிறப்பு அன்பைப் போற்றும் விழா.',
        rituals: ['அரிசியுடன் திலகமிடு', 'சகோதரருக்கு ஆரத்தி எடு', 'இனிப்பு விருந்து பகிர்ந்துண்', 'சகோதரரிடம் பரிசு பெறு'],
        deity: 'யமன் மற்றும் யமுனை',
      },
    },
    description: 'Sisters bless brothers (Diwali close)',
    significance: 'Kartika Shukla Dwitiya — sisters apply tilak and bless their brothers in the afternoon (Aparahna), closing the five-day Diwali festival. Dwitiya must prevail at Aparahna (sunrise + 0.7 × daylength), not merely at dawn. अपराह्न काल में द्वितीया होने पर भाई दूज मनाई जाती है।',
    rituals: ['Sisters apply tilak with rice', 'Perform aarti for brothers', 'Share sweets and festive meal', 'Brothers give gifts in return'],
    deity: 'Yama and Yamuna',
    tithiNumber: 2,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major',
    vyapti: 'aparahna',
    monthBasis: 'purnimanta',
  },
  {
    id: 'ahoi-ashtami',
    name: 'Ahoi Ashtami',
    nameHindi: 'अहोई अष्टमी',
    i18n: {
      hi: {
        name: 'अहोई अष्टमी',
        description: 'संतान के लिए माताओं का व्रत',
        significance: 'माताएं संतान के कल्याण के लिए व्रत रखती हैं; व्रत शाम की पूजा के बाद तारों के दर्शन से तोड़ा जाता है, चंद्रोदय से नहीं।',
        rituals: ['दिनभर व्रत रखें', 'दीवार चित्र बनाकर अहोई माता पूजें', 'करवा और गेहूँ अर्पित करें', 'तारों के दर्शन से व्रत तोड़ें'],
        deity: 'अहोई माता',
      },
      sa: {
        name: 'अहोईअष्टमी',
        description: 'पुत्रहिताय मातॄणां व्रतम्',
        significance: 'कार्तिककृष्णाष्टम्यां मातरः पुत्रकल्याणाय व्रतं चरन्ति। सायं पूजानन्तरं तारादर्शनेन व्रतभङ्गः क्रियते, न चन्द्रोदये।',
        rituals: ['मातॄणां दिवाव्रतधारणम्', 'भित्तिचित्रेण सह अहोईमातृपूजनम्', 'करवागोधूमानां अर्पणम्', 'तारादर्शने व्रतभङ्गः'],
        deity: 'अहोईमाता',
      },
      kn: {
        name: 'ಅಹೋಯಿ ಅಷ್ಟಮಿ',
        description: 'ಮಕ್ಕಳಿಗಾಗಿ ತಾಯಂದಿರ ಉಪವಾಸ',
        significance: 'ಮಕ್ಕಳ ಕ್ಷೇಮಕ್ಕಾಗಿ ತಾಯಂದಿರು ಆಚರಿಸುವ ಉಪವಾಸ. ಸಂಜೆ ಪೂಜೆಯ ನಂತರ ನಕ್ಷತ್ರ ದರ್ಶನದಲ್ಲಿ ಉಪವಾಸ ಮುರಿಯಲಾಗುತ್ತದೆ, ಚಂದ್ರೋದಯದಲ್ಲಿ ಅಲ್ಲ. ಅಷ್ಟಮಿ ಸಂಜೆ ಇರುವ ದಿನವೇ ಆಚರಣೆ.',
        rituals: ['ತಾಯಂದಿರು ಹಗಲು ಉಪವಾಸವಿರಿ', 'ಗೋಡೆ ಚಿತ್ರದೊಂದಿಗೆ ಅಹೋಯಿ ಮಾತೆಯನ್ನು ಪೂಜಿಸಿ', 'ಕರ್ವಾ ಮತ್ತು ಗೋಧಿ ಅರ್ಪಿಸಿ', 'ನಕ್ಷತ್ರ ಕಾಣಿಸಿದಾಗ ಉಪವಾಸ ಮುರಿಯಿರಿ'],
        deity: 'ಅಹೋಯಿ ಮಾತಾ',
      },
      te: {
        name: 'అహోయి అష్టమి',
        description: 'పిల్లల కోసం తల్లులు చేసే ఉపవాసం',
        significance: 'పిల్లల క్షేమం కోసం తల్లులు చేసే ఉపవాసం. సాయంత్రం పూజ తర్వాత నక్షత్ర దర్శనంతో ఉపవాసం విరమిస్తారు, చంద్రోదయం వరకు వేచి ఉండరు.',
        rituals: ['రోజంతా ఉపవాసం ఉండండి', 'గోడ చిత్రంతో అహోయిమాతను పూజించండి', 'కర్వా గోధుమలు సమర్పించండి', 'నక్షత్రాలు చూశాక ఉపవాసం విడవండి'],
        deity: 'అహోయి మాత',
      },
      ta: {
        name: 'அஹோய் அஷ்டமி',
        description: 'குழந்தைகளுக்காக அன்னையர் நோற்கும் விரதம்',
        significance: 'குழந்தைகளின் நலனுக்காக அன்னையர் நோற்கும் விரதம். மாலை வழிபாட்டிற்குப் பின் நட்சத்திர தரிசனத்தில் விரதம் முடிக்கப்படுகிறது.',
        rituals: ['பகலில் விரதம் இரு', 'அஹோய் மாதாவை வழிபடு', 'கர்வா கோதுமை படைத்திடு', 'நட்சத்திரம் கண்டு விரதம் முடி'],
        deity: 'அஹோய் மாதா',
      },
    },
    description: 'Mothers fast for children',
    significance: 'Kartika Krishna Ashtami fast kept by mothers for their children’s welfare. The fast is broken at star-sighting (tara darshan) after the evening puja — NOT at moonrise, which falls near midnight (2026: Ashtami Nov 1 14:52 → Nov 2 13:11, moonrise ~23:52 IST per Prokerala/Drik listings; observance Nov 1, when Ashtami holds the sunset). व्रत तारों के दर्शन के बाद तोड़ा जाता है, चंद्रोदय पर नहीं।',
    rituals: ['Mothers keep daytime fast', 'Worship Ahoi Mata with wall painting', 'Offer karwa and wheat', 'Break fast at star sighting'],
    deity: 'Ahoi Mata',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 8, // Kartika (purnimanta; = amanta Ashwin Krishna Ashtami)
    type: 'minor',
    vyapti: 'pradosh', // Ashtami must hold the evening (sunset/twilight of Nov 1, not Udaya of Nov 2)
    monthBasis: 'purnimanta',
  },
  {
    id: 'holi',
    name: 'Holi',
    nameHindi: 'होली',
    i18n: {
      hi: {
        name: 'होली',
        description: 'रंगों का पर्व',
        significance: 'वसंत का उत्सव; प्रह्लाद की रक्षा और भक्ति की विजय की स्मृति, ब्रज में कृष्ण और राधा के प्रेम का उल्लास।',
        rituals: ['सूखा गुलाल और जल से खेलें', 'समुदाय संग गायन-वादन में जुड़ें', 'गुझिया, ठंडाई और मिठाई बनाएं', 'मित्रों से मिलकर शुभकामनाएं बाँटें'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'होलिकोत्सवः',
        description: 'वर्णानां वसन्तोत्सवः',
        significance: 'फाल्गुनपूर्णिमायां वसन्तोत्सवः। प्रह्लादस्य रक्षणं होलिकायाः दहनं च भक्तेः विजयं सूचयति। व्रजे कृष्णराधयोः क्रीडा अपि स्मर्यते।',
        rituals: ['शुष्कगुलालेन जलेन च क्रीडा', 'सामूहिकसङ्गीतवाद्यभागित्वम्', 'गुझियाठण्डाईमिष्टान्ननिर्माणम्', 'मित्रदर्शनं शुभाशंसाविनिमयश्च'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಹೋಳಿ',
        description: 'ಬಣ್ಣಗಳ ಹಬ್ಬ',
        significance: 'ವಸಂತದ ಹಬ್ಬ. ಪ್ರಹ್ಲಾದನು ಬೆಂಕಿಯಿಂದ ಪಾರಾದ ಕಥೆಯು ಭಕ್ತಿಯು ದಬ್ಬಾಳಿಕೆಯನ್ನು ಗೆಲ್ಲುವುದನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಬ್ರಜ್ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಕೃಷ್ಣ ಮತ್ತು ರಾಧೆಯ ಪ್ರೇಮವನ್ನು ಸಂಭ್ರಮಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಒಣ ಗುಲಾಲ್ ಮತ್ತು ನೀರಿನಿಂದ ಆಡಿ', 'ಸಮುದಾಯ ಗಾಯನ ಮತ್ತು ಡೋಲಿನಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ', 'ಗುಜಿಯಾ, ಠಂಡಾಯಿ ಮತ್ತು ಸಿಹಿ ತಯಾರಿಸಿ', 'ಸ್ನೇಹಿತರನ್ನು ಭೇಟಿ ಮಾಡಿ ಶುಭ ಹಾರೈಸಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'హోలీ',
        description: 'రంగుల పండుగ',
        significance: 'వసంతకాలపు పండుగ. ప్రహ్లాదుని భక్తి హోలిక దుష్టత్వంపై గెలిచిన కథకు గుర్తు. బ్రజ్ సంప్రదాయంలో కృష్ణుడు రాధ ప్రేమను కూడా జరుపుకుంటారు.',
        rituals: ['రంగులు నీళ్లతో ఆడుకోండి', 'సంగీతం డోలుతో సంబరంలో పాల్గొనండి', 'గుజియా ఠండాయ్ స్వీట్లు చేయండి', 'స్నేహితులను కలిసి శుభాకాంక్షలు చెప్పండి'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'ஹோலி',
        description: 'வண்ணங்களின் திருவிழா',
        significance: 'இளவேனிலை வரவேற்கும் விழா. பிரகலாதனின் பக்தியையும், கிருஷ்ணர் ராதையின் அன்பு விளையாட்டையும் நினைவூட்டுகிறது. வண்ணம் இசை உணவால் புத்துணர்வைக் கொண்டாடும் நாள்.',
        rituals: ['வண்ணப்பொடி நீரால் விளையாடு', 'பாட்டு மேளத்தில் கலந்துகொள்', 'குஜியா தண்டை இனிப்பு செய்', 'நண்பர்களைச் சந்தித்து வாழ்த்து'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Festival of Colors',
    significance: 'The spring festival closing the Phalguna full moon cycle. Its legend recalls Vishnu devotee Prahlada surviving the fire that consumed Holika, symbolising devotion overcoming tyranny. In Braj tradition it also celebrates Krishna and Radha\'s playful love. Communities mark seasonal renewal through colour, music, and shared food.',
    rituals: ['Play with dry gulal and water', 'Join community singing and drums', 'Prepare gujiya, thandai and sweets', 'Visit friends and share greetings'],
    deity: 'Krishna',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 12, // Phalguna (month 12 = index 11 + 1)
    type: 'major'
  },
  {
    id: 'navratri',
    name: 'Navratri',
    nameHindi: 'नवरात्रि',
    i18n: {
      hi: {
        name: 'नवरात्रि',
        description: 'देवी दुर्गा की नौ रातें',
        significance: 'दुर्गा के नौ रूपों की नौ रातों तक उपासना; महिषासुर पर विजय और शक्ति द्वारा व्यवस्था की पुनर्स्थापना का प्रतीक।',
        rituals: ['कलश स्थापित कर जौ बोएं', 'प्रतिदिन एक नवदुर्गा रूप पूजें', 'नौ दिन का व्रत रखें', 'दुर्गा सप्तशती का पाठ करें', 'अंतिम दिनों में कन्या पूजन करें'],
        deity: 'दुर्गा',
      },
      sa: {
        name: 'नवरात्रिः',
        description: 'दुर्गायाः नवरात्रपूजा',
        significance: 'नवरात्रौ दुर्गायाः नवरूपाणां पूजनं क्रियते। देवीमाहात्म्ये दुर्गा महिषासुरं हन्ति। शक्तेः विजयः अयम्।',
        rituals: ['कलशस्थापनं यववपनं च', 'प्रतिदिनं एकरूपपूजनम्', 'नवरात्रव्रतधारणम्', 'दुर्गासप्तशतीपठनम्', 'अन्तिमदिनेषु कन्यापूजनम्'],
        deity: 'दुर्गा',
      },
      kn: {
        name: 'ನವರಾತ್ರಿ',
        description: 'ದುರ್ಗೆಯ ಒಂಬತ್ತು ರಾತ್ರಿಗಳು',
        significance: 'ದುರ್ಗೆಯ ಒಂಬತ್ತು ರೂಪಗಳನ್ನು ಒಂಬತ್ತು ರಾತ್ರಿ ಗೌರವಿಸಿ ಕೊನೆಯಲ್ಲಿ ದಸರಾ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಮಹಿಷಾಸುರನ ಮೇಲಿನ ವಿಜಯವು ಅರಾಜಕತೆಯ ಮೇಲೆ ಶಕ್ತಿಯ ಗೆಲುವನ್ನು ಸಾರುತ್ತದೆ.',
        rituals: ['ಕಳಸ ಸ್ಥಾಪಿಸಿ ಜವೆ ಬಿತ್ತಿ', 'ಪ್ರತಿದಿನ ಒಂದೊಂದು ದುರ್ಗಾ ರೂಪವನ್ನು ಪೂಜಿಸಿ', 'ಒಂಬತ್ತು ದಿನ ಉಪವಾಸವಿರಿ', 'ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಠಿಸಿ', 'ಕೊನೆಯ ದಿನಗಳಲ್ಲಿ ಕನ್ಯಾ ಪೂಜೆ ಮಾಡಿ'],
        deity: 'ದುರ್ಗಾ',
      },
      te: {
        name: 'నవరాత్రి',
        description: 'దుర్గాదేవి తొమ్మిది రాత్రులు',
        significance: 'దుర్గాదేవి తొమ్మిది రూపాలను తొమ్మిది రాత్రులు పూజిస్తారు. మహిషాసురునిపై దుర్గ విజయానికి, చెడుపై శక్తి విజయానికి గుర్తు.',
        rituals: ['కలశం పెట్టి యవలు నాటండి', 'రోజుకో దుర్గా రూపాన్ని పూజించండి', 'తొమ్మిది రోజులు ఉపవాసం ఉండండి', 'దుర్గా సప్తశతి పఠించండి', 'చివరి రోజుల్లో కన్యాపూజ చేయండి'],
        deity: 'దుర్గ',
      },
      ta: {
        name: 'நவராத்திரி',
        description: 'துர்கை அம்மனின் ஒன்பது இரவுகள்',
        significance: 'துர்கையின் ஒன்பது வடிவங்களைப் போற்றும் ஒன்பது இரவுகள். மகிஷாசுரனை வென்ற சக்தியின் வெற்றியைக் குறிக்கிறது; தீமை மீது தெய்வீக சக்தி வெல்வதன் அடையாளம்.',
        rituals: ['கலசம் வைத்து முளைப்பயிர் வளர்', 'நாள்தோறும் ஒரு துர்கை வடிவை வழிபடு', 'ஒன்பது நாள் விரதம் இரு', 'துர்கா சப்தசதி பாராயணம் செய்', 'இறுதி நாட்களில் கன்னிகா பூஜை செய்'],
        deity: 'துர்கா',
      },
    },
    description: 'Nine Nights of Goddess Durga',
    significance: 'Nine nights honouring Durga in her nine Navadurga forms, closing with Dussehra. Rooted in the Devi Mahatmya\'s account of Durga slaying Mahishasura, and in Rama\'s pre-battle invocation of the goddess, it affirms shakti overcoming disorder. Regional forms include Ghatasthapana fasting, Garba-Dandiya dance, and Durga Puja.',
    rituals: ['Install kalash and sow barley', 'Worship one Navadurga form daily', 'Keep nine-day fast', 'Recite Durga Saptashati verses', 'Perform Kanya Puja on final days'],
    deity: 'Durga',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 7, // Ashwin (month 7 = index 6 + 1)
    type: 'major'
  },
  {
    id: 'dussehra',
    name: 'Dussehra',
    nameHindi: 'दशहरा',
    i18n: {
      hi: {
        name: 'दशहरा',
        description: 'विजयादशमी',
        significance: 'राम की रावण पर और दुर्गा की महिषासुर पर विजय की स्मृति; नवरात्रि उपासना के बाद अपराह्न काल के विधानों का दिन।',
        rituals: ['अपराजिता और शमी पूजन करें', 'रावण, कुंभकर्ण, मेघनाद के पुतले जलाएं', 'आप्टा पत्ते सोने के प्रतीक दें', 'नए कार्य या विद्या आरंभ करें'],
        deity: 'राम और दुर्गा',
      },
      sa: {
        name: 'विजयादशमी',
        description: 'विजयादशम्युत्सवः',
        significance: 'अस्यां तिथौ रामः रावणं जघान दुर्गा च महिषासुरम्। धर्मस्य विजयः अयम्। अपराह्णे अपराजिताशमीपूजा क्रियते।',
        rituals: ['अपराजिताशमीपूजनम्', 'रावणकुम्भकर्णमेघनादप्रतिमादहनम्', 'आप्तापत्राणां सुवर्णरूपेण विनिमयः', 'नवकार्याणां विद्यारम्भस्य च आरम्भः'],
        deity: 'रामः',
      },
      kn: {
        name: 'ದಸರಾ',
        description: 'ವಿಜಯದಶಮಿ',
        significance: 'ರಾವಣನ ಮೇಲೆ ರಾಮನ ವಿಜಯ ಮತ್ತು ಮಹಿಷಾಸುರನ ಮೇಲೆ ದುರ್ಗೆಯ ವಿಜಯದ ಸಂಕೇತ. ನವರಾತ್ರಿಯ ನಂತರ ಮಧ್ಯಾಹ್ನದ ಶುಭ ವಿಧಿಗಳೊಂದಿಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಅಪರಾಜಿತಾ ಮತ್ತು ಶಮೀ ಪೂಜೆ ಮಾಡಿ', 'ರಾವಣ, ಕುಂಭಕರ್ಣ, ಮೇಘನಾದರ ಪ್ರತಿಕೃತಿ ಸುಡಿ', 'ಆಪ್ತ ಎಲೆಗಳನ್ನು ಬಂಗಾರವೆಂದು ಹಂಚಿ', 'ಹೊಸ ಕೆಲಸ ಅಥವಾ ವಿದ್ಯೆ ಆರಂಭಿಸಿ'],
        deity: 'ರಾಮ ಮತ್ತು ದುರ್ಗಾ',
      },
      te: {
        name: 'దసరా',
        description: 'విజయదశమి',
        significance: 'రావణునిపై రాముని విజయానికి, మహిషాసురునిపై దుర్గ విజయానికి గుర్తు. నవరాత్రుల తర్వాత ధర్మం గెలిచిన శుభదినంగా జరుపుకుంటారు.',
        rituals: ['అపరాజితా శమీ పూజ చేయండి', 'రావణ దహనంలో పాల్గొనండి', 'జమ్మి ఆకులు బంగారంగా పంచుకోండి', 'కొత్త పనులు విద్యలు ప్రారంభించండి'],
        deity: 'రామ మరియు దుర్గ',
      },
      ta: {
        name: 'தசரா',
        description: 'விஜயதசமி',
        significance: 'ராமர் ராவணனை வென்றதையும், துர்கை மகிஷாசுரனை வென்றதையும் குறிக்கும் வெற்றித் திருநாள். நவராத்திரி வழிபாட்டின் நிறைவாக பிற்பகல் வழிபாடுகளுடன் கொண்டாடப்படுகிறது.',
        rituals: ['அபராஜிதா சமி பூஜை செய்', 'ராவணன் உருவங்களை எரித்திடு', 'ஆப்த இலைகளைப் பரிமாறிக்கொள்', 'புது முயற்சி கல்வியைத் தொடங்கு'],
        deity: 'ராமர் மற்றும் துர்கா',
      },
    },
    description: 'Vijayadashami',
    significance: 'Vijayadashami marks Rama\'s victory over Ravana in the Ramayana and Durga\'s victory over Mahishasura, twin emblems of order restored. Observed after nine nights of Navratri worship, it centres on afternoon rites such as Aparajita and Shami puja, effigy burning in the north, and processions seeking an auspicious start.',
    rituals: ['Perform Aparajita and Shami puja', 'Burn Ravana, Kumbhakarna, Meghnad effigies', 'Exchange apta leaves as gold', 'Begin new ventures or learning'],
    deity: 'Rama and Durga',
    tithiNumber: 10,
    paksha: 'Shukla',
    month: 7, // Ashwin (month 7 = index 6 + 1)
    type: 'major',
    vyapti: 'aparahna', // Vijayadashami = Dashami prevailing at Aparahna, not merely at dawn
    preferFirst: true, // purva-viddha: two Aparahna-Dashamis keep the FIRST day (2026: Oct 20, not 21)
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    i18n: {
      hi: {
        name: 'गणेश चतुर्थी',
        description: 'गणेश का जन्मोत्सव',
        significance: 'विघ्नहर्ता गणेश का जन्मदिन; मध्याह्न जन्म बेला में मिट्टी की मूर्ति स्थापित कर दस दिन पूजन होता है।',
        rituals: ['मध्याह्न में मिट्टी की मूर्ति स्थापित करें', 'मोदक, दूर्वा और फूल अर्पित करें', 'अथर्वशीर्ष और आरती का पाठ करें', 'अनंत चतुर्दशी को विसर्जन करें'],
        deity: 'गणेश',
      },
      sa: {
        name: 'गणेशचतुर्थी',
        description: 'गणेशजन्मदिवसः',
        significance: 'गणेशस्य जन्मतिथिः एषा। विघ्नहर्ता सर्वकार्येषु प्रथमं पूज्यते। मध्याह्ने जन्मकालस्मरणेन मृण्मयप्रतिमास्थापना क्रियते।',
        rituals: ['मध्याह्ने मृण्मयप्रतिमास्थापनम्', 'मोदकदूर्वापुष्पार्पणम्', 'अथर्वशीर्षारार्तिकपठनम्', 'अनन्तचतुर्दश्यां विसर्जनम्'],
        deity: 'गणेशः',
      },
      kn: {
        name: 'ಗಣೇಶ ಚತುರ್ಥಿ',
        description: 'ಗಣೇಶನ ಜನ್ಮದಿನ',
        significance: 'ವಿಘ್ನನಿವಾರಕ ಗಣೇಶನ ಜನ್ಮದಿನ. ಹತ್ತು ದಿನ ಮಣ್ಣಿನ ಮೂರ್ತಿ ಸ್ಥಾಪಿಸಿ ಪೂಜಿಸಲಾಗುತ್ತದೆ. ಮಧ್ಯಾಹ್ನದ ಪೂಜೆಯು ಜನ್ಮ ಸಮಯವನ್ನು ನೆನಪಿಸುತ್ತದೆ, ಮೋದಕ, ಗರಿಕೆ ಮತ್ತು ಸ್ತೋತ್ರಗಳೊಂದಿಗೆ.',
        rituals: ['ಮಧ್ಯಾಹ್ನ ಮಣ್ಣಿನ ಗಣೇಶ ಮೂರ್ತಿ ಸ್ಥಾಪಿಸಿ', 'ಮೋದಕ, ಗರಿಕೆ ಮತ್ತು ಹೂವು ಅರ್ಪಿಸಿ', 'ಅಥರ್ವಶೀರ್ಷ ಮತ್ತು ಆರತಿ ಹಾಡಿ', 'ಅನಂತ ಚತುರ್ದಶಿಯಂದು ಮೂರ್ತಿ ವಿಸರ್ಜಿಸಿ'],
        deity: 'ಗಣೇಶ',
      },
      te: {
        name: 'వినాయక చవితి',
        description: 'వినాయకుని జన్మదినం',
        significance: 'ఆటంకాలు తొలగించే వినాయకుని జన్మదినం. ఇంట్లో మట్టి విగ్రహం పెట్టి పది రోజులు పూజించి నిమజ్జనం చేస్తారు. మధ్యాహ్న పూజ విశేషం.',
        rituals: ['మధ్యాహ్నం మట్టి విగ్రహం ప్రతిష్ఠించండి', 'ఉండ్రాళ్లు గరిక పూలు సమర్పించండి', 'అథర్వశీర్షం హారతి పఠించండి', 'చవితి తర్వాత విగ్రహం నిమజ్జనం చేయండి'],
        deity: 'గణేశ్',
      },
      ta: {
        name: 'விநாயகர் சதுர்த்தி',
        description: 'விநாயகர் பிறந்த நாள்',
        significance: 'இடையூறுகளை நீக்கும் விநாயகரின் பிறந்த நாள். வீடுகளிலும் தெருக்களிலும் மண் சிலை வைத்துப் பத்து நாட்கள் வழிபட்டு நிறைவில் கரைக்கப்படுகிறது. நண்பகல் வழிபாடு பிறந்த நேரத்தை நினைவூட்டுகிறது.',
        rituals: ['நண்பகலில் மண் சிலை நிறுவு', 'கொழுக்கட்டை அருகு மலர் படை', 'அதர்வசீர்ஷம் ஆரத்தி பாடு', 'நிறைவில் சிலையைக் கரைத்திடு'],
        deity: 'விநாயகர்',
      },
    },
    description: 'Birth of Lord Ganesha',
    significance: 'Birth anniversary of Ganesha, remover of obstacles and patron of beginnings, described in the Ganesha and Skanda Puranas. Households and neighbourhoods install clay images for worship over ten days ending in immersion. The midday rite recalls his birth hour, with modak offerings, durva grass, and Vedic hymns.',
    rituals: ['Install clay Ganesha idol midday', 'Offer modak, durva and flowers', 'Recite Atharvashirsha and aarti', 'Immerse idol on Anant Chaturdashi'],
    deity: 'Ganesha',
    tithiNumber: 4,
    paksha: 'Shukla',
    month: 6, // Bhadrapada (month 6 = index 5 + 1)
    type: 'major',
    vyapti: 'madhyahna', // Born at midday: Chaturthi must prevail at noon (Sep 14, not 15, in 2026)
  },
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    nameHindi: 'जन्माष्टमी',
    i18n: {
      hi: {
        name: 'जन्माष्टमी',
        description: 'कृष्ण का जन्मोत्सव',
        significance: 'विष्णु के आठवें अवतार कृष्ण का मध्यरात्रि जन्म; भक्त दिनभर व्रत रखकर रात्रि में बाल रूप का पूजन करते हैं।',
        rituals: ['बिना अन्न दिनभर व्रत रखें', 'बाल कृष्ण को स्नान कराकर झूला झुलाएं', 'मध्यरात्रि में भजन सहित पूजन करें', 'भागवत पुराण के दशम स्कंध का पाठ करें'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'जन्माष्टमी',
        description: 'कृष्णजन्मदिवसः',
        significance: 'श्रीकृष्णः विष्णोः अष्टमः अवतारः। भागवतपुराणे तस्य मध्यरात्रौ मथुरायां जन्म वर्ण्यते। भक्ताः दिवा उपोष्य रात्रौ बालकृष्णं पूजयन्ति।',
        rituals: ['दिवा धान्यरहितव्रतम्', 'बालकृष्णस्नापनदोलोत्सवः', 'मध्यरात्रौ सङ्गीतेन पूजनम्', 'भागवतदशमस्कन्धपठनम्'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಜನ್ಮಾಷ್ಟಮಿ',
        description: 'ಕೃಷ್ಣನ ಜನ್ಮದಿನ',
        significance: 'ವಿಷ್ಣುವಿನ ಅವತಾರ ಕೃಷ್ಣನ ಜನ್ಮದಿನ. ದೇವಕಿ ಮತ್ತು ವಸುದೇವರಿಗೆ ಸೆರೆಮನೆಯಲ್ಲಿ ಮಧ್ಯರಾತ್ರಿ ಜನಿಸಿದ ಕಥೆ. ಭಕ್ತರು ಹಗಲು ಉಪವಾಸವಿದ್ದು ರಾತ್ರಿ ಬಾಲಕೃಷ್ಣನನ್ನು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ಧಾನ್ಯವಿಲ್ಲದೆ ಹಗಲು ಉಪವಾಸವಿರಿ', 'ಬಾಲಕೃಷ್ಣನನ್ನು ಸ್ನಾನ ಮಾಡಿಸಿ ತೊಟ್ಟಿಲಲ್ಲಿಡಿ', 'ಮಧ್ಯರಾತ್ರಿ ಭಜನೆಯೊಂದಿಗೆ ಪೂಜಿಸಿ', 'ಭಾಗವತದ ಹತ್ತನೇ ಸ್ಕಂಧ ಪಠಿಸಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'జన్మాష్టమి',
        description: 'కృష్ణుని జన్మదినం',
        significance: 'విష్ణు అవతారమైన కృష్ణుడు అర్ధరాత్రి జన్మించిన రోజు. భక్తులు రోజంతా ఉపవాసం ఉండి రాత్రి చిన్నికృష్ణుని పూజిస్తారు.',
        rituals: ['ధాన్యం లేకుండా రోజంతా ఉపవాసం ఉండండి', 'చిన్నికృష్ణుని స్నానం చేయించి ఊయలలో వేయండి', 'అర్ధరాత్రి భజనలతో పూజించండి', 'భాగవతం దశమ స్కంధం పఠించండి'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'ஜென்மாஷ்டமி',
        description: 'கிருஷ்ணர் பிறந்த நாள்',
        significance: 'விஷ்ணுவின் அவதாரமான கிருஷ்ணர் நள்ளிரவில் பிறந்ததைக் கொண்டாடும் நாள். பக்தர்கள் பகலில் விரதமிருந்து இரவில் குழந்தை வடிவை வழிபடுகின்றனர்.',
        rituals: ['தானியமின்றிப் பகல் விரதம் இரு', 'குழந்தை கிருஷ்ணரை நீராட்டித் தொட்டிலிடு', 'நள்ளிரவில் பாட்டுடன் வழிபடு', 'பாகவத தசம ஸ்கந்தம் படித்திடு'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Birth of Lord Krishna',
    significance: 'Birth anniversary of Krishna, eighth avatar of Vishnu, narrated in the Bhagavata Purana\'s account of his midnight birth to Devaki and Vasudeva in Mathura prison. Devotees fast through the day and worship the infant form at night. Temples stage recitations, devotional singing, cradle ceremonies, and Dahi Handi sport.',
    rituals: ['Keep daytime fast without grains', 'Bathe and cradle infant Krishna', 'Worship at midnight with songs', 'Recite Bhagavata Purana tenth canto'],
    deity: 'Krishna',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 5, // Shravana (month 5 = index 4 + 1)
    type: 'major'
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    nameHindi: 'राम नवमी',
    i18n: {
      hi: {
        name: 'राम नवमी',
        description: 'राम का जन्मोत्सव',
        significance: 'अयोध्या में कौशल्या नंदन राम का जन्मदिन; मर्यादा और कर्तव्य के आदर्श के रूप में रामकथा का पाठ होता है।',
        rituals: ['दिनभर व्रत रखें', 'मध्याह्न में राम-सीता-लक्ष्मण विग्रह स्नान कराएं', 'रामायण या रामकथा का पाठ करें', 'मंदिर शोभायात्रा और भजन में जुड़ें'],
        deity: 'राम',
      },
      sa: {
        name: 'रामनवमी',
        description: 'रामजन्मदिवसः',
        significance: 'रामः विष्णोः सप्तमः अवतारः। अयोध्यायां कौसल्यायाः दशरथस्य च पुत्ररूपेण तस्य जन्म अभवत्। सः धर्ममर्यादायाः आदर्शः।',
        rituals: ['दिवाव्रतधारणम्', 'मध्याह्ने रामसीतालक्ष्मणस्नापनालङ्कारः', 'रामायणपठनम्', 'मन्दिरशोभायात्राभजनभागित्वम्'],
        deity: 'रामः',
      },
      kn: {
        name: 'ರಾಮ ನವಮಿ',
        description: 'ರಾಮನ ಜನ್ಮದಿನ',
        significance: 'ವಿಷ್ಣುವಿನ ಅವತಾರ ರಾಮನ ಜನ್ಮದಿನ. ಕೌಸಲ್ಯೆ ಮತ್ತು ದಶರಥರಿಗೆ ಅಯೋಧ್ಯೆಯಲ್ಲಿ ಜನಿಸಿದ ರಾಮ ಕರ್ತವ್ಯದ ಆದರ್ಶ. ಭಕ್ತರು ಉಪವಾಸವಿದ್ದು ಮಧ್ಯಾಹ್ನ ಮೂರ್ತಿ ಪೂಜಿಸಿ ರಾಮಕಥೆ ಪಠಿಸುತ್ತಾರೆ.',
        rituals: ['ಹಗಲು ಉಪವಾಸವಿರಿ', 'ಮಧ್ಯಾಹ್ನ ರಾಮ-ಸೀತಾ-ಲಕ್ಷ್ಮಣ ಮೂರ್ತಿಗಳಿಗೆ ಸ್ನಾನ ಮಾಡಿಸಿ', 'ರಾಮಾಯಣ ಅಥವಾ ರಾಮಕಥೆ ಪಠಿಸಿ', 'ದೇವಸ್ಥಾನದ ಮೆರವಣಿಗೆ ಮತ್ತು ಭಜನೆಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ'],
        deity: 'ರಾಮ',
      },
      te: {
        name: 'రామనవమి',
        description: 'రాముని జన్మదినం',
        significance: 'విష్ణు అవతారమైన రాముడు అయోధ్యలో జన్మించిన రోజు. ధర్మానికి ఆదర్శంగా రాముని జీవితాన్ని స్మరిస్తూ ఉపవాసం రామాయణ పారాయణం చేస్తారు.',
        rituals: ['రోజంతా ఉపవాసం ఉండండి', 'మధ్యాహ్నం రామ సీత లక్ష్మణులను అలంకరించండి', 'రామాయణం రామకథ పఠించండి', 'గుడి ఊరేగింపు భజనల్లో పాల్గొనండి'],
        deity: 'రామ',
      },
      ta: {
        name: 'ராம நவமி',
        description: 'ராமர் பிறந்த நாள்',
        significance: 'ராமாயண நாயகன் ராமர் அயோத்தியில் பிறந்த நாள். அறம் கடமையின் சிறந்த எடுத்துக்காட்டாகப் போற்றப்படுகிறார். பக்தர்கள் விரதமிருந்து நண்பகலில் வழிபட்டு ராம கதை படிக்கின்றனர்.',
        rituals: ['பகலில் விரதம் இரு', 'நண்பகலில் ராமர் சிலைகளை நீராட்டு', 'ராமாயணம் ராம கதை படித்திடு', 'கோயில் ஊர்வல பஜனையில் கலந்துகொள்'],
        deity: 'ராமர்',
      },
    },
    description: 'Birth of Lord Rama',
    significance: 'Birth anniversary of Rama, seventh avatar of Vishnu and hero of the Ramayana, born to Kaushalya and Dasharatha in Ayodhya. Revered as the ideal of duty and restraint, his life anchors readings of the epic. Devotees fast, bathe and adorn temple images at midday, recite Rama narratives, and hold processions.',
    rituals: ['Keep daytime fast', 'Bathe Rama-Sita-Lakshmana images midday', 'Recite Ramayana or Rama narratives', 'Join temple procession and bhajans'],
    deity: 'Rama',
    tithiNumber: 9,
    paksha: 'Shukla',
    month: 1, // Chaitra (month 1 = index 0 + 1)
    type: 'major'
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    nameHindi: 'महाशिवरात्रि',
    i18n: {
      hi: {
        name: 'महाशिवरात्रि',
        description: 'शिव की महान रात्रि',
        significance: 'शिव-पार्वती विवाह और ज्योतिर्लिंग प्राकट्य की स्मृति; भक्त व्रत रखकर चारों प्रहर लिंग अभिषेक और जागरण करते हैं।',
        rituals: ['दिन-रात व्रत रखें', 'लिंग का दूध-जल से अभिषेक करें', 'बेलपत्र और फूल अर्पित करें', 'रातभर ॐ नमः शिवाय जपें'],
        deity: 'शिव',
      },
      sa: {
        name: 'महाशिवरात्रिः',
        description: 'शिवस्य महारात्रिः',
        significance: 'माघकृष्णचतुर्दश्यां शिवस्य महारात्रिः। शिवपार्वत्योः विवाहः शिवताण्डवं लिङ्गप्राकट्यं च अत्र स्मर्यन्ते। भक्ताः उपोष्य रात्रौ जागरणं कुर्वन्ति।',
        rituals: ['दिवारात्रव्रतधारणम्', 'दुग्धजलेन लिङ्गाभिषेकः', 'बिल्वपत्रपुष्पार्पणम्', 'रात्रौ ओम्-नमः-शिवाय-जपः'],
        deity: 'शिवः',
      },
      kn: {
        name: 'ಮಹಾ ಶಿವರಾತ್ರಿ',
        description: 'ಶಿವನ ಮಹಾ ರಾತ್ರಿ',
        significance: 'ಶಿವನ ಮಹಾ ರಾತ್ರಿ. ಶಿವ-ಪಾರ್ವತಿ ವಿವಾಹ, ತಾಂಡವ ಮತ್ತು ಲಿಂಗೋದ್ಭವದೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದೆ. ಭಕ್ತರು ಉಪವಾಸವಿದ್ದು ರಾತ್ರಿ ಜಾಗರಣೆ ಮಾಡಿ ನಾಲ್ಕು ಜಾವಗಳಲ್ಲಿ ಲಿಂಗವನ್ನು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ಹಗಲಿರುಳು ಉಪವಾಸವಿರಿ', 'ಹಾಲು ಮತ್ತು ನೀರಿನಿಂದ ಲಿಂಗಕ್ಕೆ ಅಭಿಷೇಕ ಮಾಡಿ', 'ಬಿಲ್ವಪತ್ರೆ ಮತ್ತು ಹೂವು ಅರ್ಪಿಸಿ', 'ರಾತ್ರಿಯಿಡೀ ಓಂ ನಮಃ ಶಿವಾಯ ಜಪಿಸಿ'],
        deity: 'ಶಿವ',
      },
      te: {
        name: 'మహా శివరాత్రి',
        description: 'శివుని మహారాత్రి',
        significance: 'శివపార్వతుల కల్యాణానికి, శివుని విశ్వనాట్యానికి గుర్తుగా చేసే రాత్రి పూజ. భక్తులు ఉపవాసం జాగరణ చేసి లింగానికి అభిషేకం చేస్తారు.',
        rituals: ['రోజు రాత్రి ఉపవాసం ఉండండి', 'లింగానికి పాలు నీళ్లతో అభిషేకం చేయండి', 'మారేడు దళాలు పూలు సమర్పించండి', 'రాత్రంతా ఓం నమః శివాయ జపించండి'],
        deity: 'శివ',
      },
      ta: {
        name: 'மகா சிவராத்திரி',
        description: 'சிவனின் பெரும் இரவு',
        significance: 'சிவனுக்குரிய பெரும் இரவு. சிவ பார்வதி திருமணம், சிவனின் ஆனந்த நடனம், லிங்க வெளிப்பாடு ஆகியவற்றுடன் தொடர்புடையது. பக்தர்கள் விரதமிருந்து இரவெல்லாம் விழித்து லிங்கத்தை வழிபடுகின்றனர்.',
        rituals: ['இரவு பகல் விரதம் இரு', 'லிங்கத்திற்குப் பால் நீர் அபிஷேகம் செய்', 'வில்வ இலை மலர் படைத்திடு', 'இரவெல்லாம் ஓம் நமச்சிவாயம் சொல்'],
        deity: 'சிவன்',
      },
    },
    description: 'Great Night of Lord Shiva',
    significance: 'Great night of Shiva, observed on the waning fourteenth of late winter. Traditions associate it with Shiva\'s marriage to Parvati, his cosmic dance, and the manifestation of the linga. Devotees fast, keep night vigil, and offer water, milk, bel leaves, and chants to the linga across four night watches.',
    rituals: ['Keep day and night fast', 'Abhisheka linga with milk, water', 'Offer bel leaves and flowers', 'Chant Om Namah Shivaya overnight'],
    deity: 'Shiva',
    tithiNumber: 14,
    paksha: 'Krishna',
    month: 11, // Magha (month 11 = index 10 + 1)
    type: 'major',
    vyapti: 'nishita', // Great NIGHT: Chaturdashi must prevail at midnight (Feb 15, not 16, in 2026)
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षाबंधन',
    i18n: {
      hi: {
        name: 'रक्षाबंधन',
        description: 'रक्षा का बंधन',
        significance: 'बहन भाई की कलाई पर राखी बाँधकर दीर्घायु की कामना करती है; भाई रक्षा का वचन देता है।',
        rituals: ['भद्रा समाप्त होने पर राखी बाँधें', 'टीका लगाकर भाई की आरती करें', 'मिठाई और festive भोजन परोसें', 'भाई उपहार देकर प्रत्युत्तर दें', 'ब्राह्मण यज्ञोपवीत बदलें'],
      },
      sa: {
        name: 'रक्षाबन्धनम्',
        description: 'रक्षासूत्रबन्धनम्',
        significance: 'श्रावणपूर्णिमायां भगिन्यः भ्रातृभ्यः रक्षासूत्रं बध्नन्ति। सूत्रं रक्षाशक्तेः प्रतीकम्। ब्राह्मणाः अस्मिन् दिने उपाकर्म कुर्वन्ति।',
        rituals: ['भद्रानन्तरं राखीबन्धनम्', 'तिलकेन सह भ्रातुः आरार्तिकम्', 'मिष्टान्नभोजनविनिमयः', 'भ्रातृभिः उपहारदानम्', 'ब्राह्मणानां यज्ञोपवीतपरिवर्तनम्'],
      },
      kn: {
        name: 'ರಕ್ಷಾ ಬಂಧನ',
        description: 'ರಕ್ಷಣೆಯ ಬಂಧ',
        significance: 'ಶ್ರಾವಣ ಪೂರ್ಣಿಮೆಯಂದು ಆಚರಿಸಲಾಗುತ್ತದೆ. ಸಹೋದರಿಯರು ಸಹೋದರರ ದೀರ್ಘಾಯುಷ್ಯಕ್ಕಾಗಿ ರಾಖಿ ಕಟ್ಟಿದರೆ ಸಹೋದರರು ರಕ್ಷಣೆಯ ಮಾತು ನೀಡುತ್ತಾರೆ. ರಕ್ಷಾ ದಾರವನ್ನು ರಕ್ಷಣಾ ಶಕ್ತಿಯೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಭದ್ರಾ ಮುಗಿದ ನಂತರ ರಾಖಿ ಕಟ್ಟಿ', 'ತಿಲಕವಿಟ್ಟು ಸಹೋದರನಿಗೆ ಆರತಿ ಮಾಡಿ', 'ಸಿಹಿ ನೀಡಿ ಹಬ್ಬದ ಊಟ ಮಾಡಿ', 'ಸಹೋದರರು ಉಡುಗೊರೆ ನೀಡಿ', 'ಬ್ರಾಹ್ಮಣರು ಯಜ್ಞೋಪವೀತ ಬದಲಿಸಿ'],
      },
      te: {
        name: 'రక్షాబంధన్',
        description: 'రక్షణ బంధం',
        significance: 'అన్నాచెల్లెళ్ల అనుబంధానికి గుర్తు. సోదరీమణులు సోదరుని చేతికి రాఖీ కట్టి ఆయుష్షు కోరుకుంటారు, సోదరులు రక్షణ మాట ఇస్తారు.',
        rituals: ['భద్ర తీరాక రాఖీ కట్టండి', 'సోదరునికి తిలకం హారతి ఇవ్వండి', 'స్వీట్లు విందు పంచుకోండి', 'సోదరులు బహుమతులు ఇవ్వండి', 'బ్రాహ్మణులు యజ్ఞోపవీతం మార్చుకోండి'],
      },
      ta: {
        name: 'ரக்ஷா பந்தன்',
        description: 'பாதுகாப்பின் பிணைப்பு',
        significance: 'சகோதரிகள் சகோதரர்களுக்கு ராக்கி கட்டி நீண்ட ஆயுள் வேண்டும் நாள்; சகோதரர்கள் காக்க உறுதி தருகின்றனர். நூல் காப்புச் சக்தியாகக் கருதப்படுகிறது.',
        rituals: ['ராக்கியைக் கட்டு', 'சகோதரருக்கு திலக ஆரத்தி செய்', 'இனிப்பு விருந்து பகிர்ந்துண்', 'பரிசுகள் வழங்கிப் பெறு', 'பூணூல் மாற்றும் சடங்கு செய்'],
      },
    },
    description: 'Bond of Protection',
    significance: 'Observed on Shravana Purnima, sisters tie a rakhi thread praying for their brothers\' long life while brothers pledge protection in return. Vedic texts treat the thread as Raksha, a protective power; Brahmin communities also change the sacred thread as Upakarma on this day.',
    rituals: ['Tie rakhi after Bhadra ends', 'Perform brother\'s aarti with tika', 'Offer sweets and festive meal', 'Brothers give gifts in return', 'Brahmins change sacred thread'],
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 5, // Shravana (month 5 = index 4 + 1)
    type: 'major'
  },
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    i18n: {
      hi: {
        name: 'करवा चौथ',
        description: 'विवाहित स्त्रियों का पर्व',
        significance: 'पति की दीर्घायु के लिए सूर्योदय से चंद्रोदय तक निर्जल व्रत; शाम को पार्वती-शिव पूजन और कथा होती है।',
        rituals: ['सूर्योदय से चंद्रोदय तक निर्जल व्रत रखें', 'मेहंदी लगाएं; शृंगार करें', 'शाम को पार्वती-शिव पूजन करें', 'वीरवती व्रत कथा सुनें', 'छलनी से चंद्र देखकर व्रत तोड़ें'],
        deity: 'पार्वती',
      },
      sa: {
        name: 'करवाचतुर्थी',
        description: 'पतिव्रतानां पतिहिताय व्रतम्',
        significance: 'कार्तिककृष्णचतुर्थ्यां पतिव्रताः सूर्योदयात् चन्द्रोदयपर्यन्तं निर्जलव्रतं चरन्ति। पतुः दीर्घायुषः कृते अयं व्रतः।',
        rituals: ['सूर्योदयात् चन्द्रोदयपर्यन्तं निर्जलव्रतम्', 'मेहन्दीधारणं वधूवेषश्च', 'सायं पार्वतीशिवपूजनम्', 'वीरावतीव्रतकथाश्रवणम्', 'चालनेन चन्द्रदर्शनं व्रतभङ्गश्च'],
        deity: 'पार्वती',
      },
      kn: {
        name: 'ಕರ್ವಾ ಚೌತ್',
        description: 'ವಿವಾಹಿತ ಮಹಿಳೆಯರ ಹಬ್ಬ',
        significance: 'ವಿವಾಹಿತ ಮಹಿಳೆಯರು ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ನೀರಿಲ್ಲದೆ ಉಪವಾಸವಿರುವ ವ್ರತ. ಪತಿಯ ದೀರ್ಘಾಯುಷ್ಯ, ಮಕ್ಕಳು ಮತ್ತು ಕುಟುಂಬದ ಸಮೃದ್ಧಿಗಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ನಿರ್ಜಲ ಉಪವಾಸವಿರಿ', 'ಮೆಹಂದಿ ಹಚ್ಚಿ ಮದುಮಗಳಂತೆ ಅಲಂಕರಿಸಿ', 'ಸಂಜೆ ಪಾರ್ವತಿ ಮತ್ತು ಶಿವರನ್ನು ಪೂಜಿಸಿ', 'ವೀರಾವತಿ ವ್ರತ ಕಥೆ ಕೇಳಿ', 'ಜರಡಿಯಿಂದ ಚಂದ್ರನನ್ನು ನೋಡಿ ಉಪವಾಸ ಮುರಿಯಿರಿ'],
        deity: 'ಪಾರ್ವತಿ',
      },
      te: {
        name: 'కర్వా చౌత్',
        description: 'వివాహితల పండుగ',
        significance: 'భర్త ఆయుష్షు కుటుంబ శ్రేయస్సు కోసం వివాహితలు చేసే ఉపవాసం. తెల్లవారు నుండి చంద్రోదయం వరకు నీరు కూడా తీసుకోకుండా ఉపవాసం ఉంటారు.',
        rituals: ['సూర్యోదయం నుండి చంద్రోదయం వరకు నిర్జల ఉపవాసం ఉండండి', 'మెహందీ పెట్టుకుని పెళ్లికూతురిలా అలంకరించుకోండి', 'సాయంత్రం పార్వతీ శివులను పూజించండి', 'వ్రత కథ వినండి', 'జల్లెడలో చంద్రుని చూసి ఉపవాసం విడవండి'],
        deity: 'పార్వతి',
      },
      ta: {
        name: 'கர்வா சௌத்',
        description: 'திருமணப் பெண்களின் விழா',
        significance: 'கணவரின் நீண்ட ஆயுள், குடும்பச் செழிப்பு வேண்டி மணமான பெண்கள் சூரிய உதயம் முதல் நிலவு தோன்றும் வரை உணவு நீரின்றி நோற்கும் விரதம்.',
        rituals: ['சூரிய உதயம் முதல் நிலவு வரை விரதம் இரு', 'மருதாணி இட்டு மணப்பெண்போல் அணி', 'மாலையில் பார்வதி சிவனை வழிபடு', 'விரதக் கதை கேட்டிடு', 'சல்லடையில் நிலவு கண்டு விரதம் முடி'],
        deity: 'பார்வதி',
      },
    },
    description: 'Festival for Married Women',
    significance: 'North Indian vrat on Kartika Krishna Chaturthi (coinciding with Sankashti Chaturthi) where married women fast without food or water from sunrise to moonrise. Called Karaka Chaturthi in Dharmasindhu and Vratraj, it seeks the husband\'s long life plus sons, wealth, and family prosperity.',
    rituals: ['Nirjala fast sunrise to moonrise', 'Apply mehndi; dress as bride', 'Evening Parvati and Shiva puja', 'Hear Veeravati vrat katha', 'Sight moon through sieve; break fast'],
    deity: 'Parvati (Gaura/Chauth Mata)',
    tithiNumber: 4,
    paksha: 'Krishna',
    month: 8, // Kartika (purnimanta; = amanta Ashwin Krishna Chaturthi)
    type: 'major',
    vyapti: 'moonrise',
    monthBasis: 'purnimanta',
    keepUdayaMatch: true, // vrat day is Udaya Chaturthi; moonrise is the parana — see field docs
  },
  {
    id: 'sankashti-chaturthi',
    name: 'Sankashti Chaturthi',
    nameHindi: 'संकष्टी चतुर्थी',
    i18n: {
      hi: {
        name: 'संकष्टी चतुर्थी',
        description: 'गणेश का मासिक उत्सव',
        significance: 'कष्टों से मुक्ति देने वाला गणेश का मासिक व्रत; सूर्योदय से चंद्रोदय तक उपवास होता है। मंगलवार को अंगारकी कहलाता है।',
        rituals: ['सूर्योदय से चंद्रोदय तक व्रत रखें', 'दूर्वा, मोदक, लाल फूल अर्पित करें', 'ॐ गं गणपतये नमः जपें', 'संकष्टी कथा सुनें या पढ़ें', 'चंद्र को अर्घ्य देकर व्रत तोड़ें'],
        deity: 'गणेश',
      },
      sa: {
        name: 'सङ्कष्टीचतुर्थी',
        description: 'मासिकगणेशव्रतम्',
        significance: 'प्रतिमासं कृष्णचतुर्थ्यां गणेशव्रतं क्रियते। सङ्कष्टी नाम कष्टात् मोचनम्। सूर्योदयात् चन्द्रोदयपर्यन्तं व्रतं धार्यते।',
        rituals: ['सूर्योदयात् चन्द्रोदयपर्यन्तं व्रतम्', 'दूर्वामोदकरक्तपुष्पार्पणम्', 'ओम्-गं-गणपतये-नमः-जपः', 'सङ्कष्टीकथाश्रवणम्', 'चन्द्रार्घ्यदानं व्रतभङ्गश्च'],
        deity: 'गणेशः',
      },
      kn: {
        name: 'ಸಂಕಷ್ಟಿ ಚತುರ್ಥಿ',
        description: 'ಪ್ರತಿ ತಿಂಗಳ ಗಣೇಶ ಹಬ್ಬ',
        significance: 'ಪ್ರತಿ ತಿಂಗಳು ಬರುವ ಗಣೇಶನ ವ್ರತ, ವಿಘ್ನಗಳನ್ನು ನಿವಾರಿಸುವವನು. ಸಂಕಷ್ಟಿ ಎಂದರೆ ಸಂಕಟಗಳಿಂದ ಮುಕ್ತಿ. ಮಂಗಳವಾರ ಬಂದರೆ ಅಂಗಾರಕಿ ಸಂಕಷ್ಟಿ, ಅತ್ಯಂತ ಪುಣ್ಯಕರ.',
        rituals: ['ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ಉಪವಾಸವಿರಿ', 'ಗರಿಕೆ, ಮೋದಕ, ಕೆಂಪು ಹೂವು ಅರ್ಪಿಸಿ', 'ಓಂ ಗಂ ಗಣಪತಯೇ ನಮಃ ಜಪಿಸಿ', 'ಸಂಕಷ್ಟಿ ಕಥೆ ಕೇಳಿ ಅಥವಾ ಓದಿ', 'ಚಂದ್ರನಿಗೆ ಅರ್ಘ್ಯ ನೀಡಿ ಉಪವಾಸ ಮುರಿಯಿರಿ'],
        deity: 'ಗಣೇಶ',
      },
      te: {
        name: 'సంకష్టి చతుర్థి',
        description: 'నెలవారీ వినాయక పండుగ',
        significance: 'ప్రతి నెల కష్టాలు తొలగాలని వినాయకుని కోసం చేసే ఉపవాసం. సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం ఉంటారు. మంగళవారం వస్తే అంగారకీ సంకష్టి అంటారు.',
        rituals: ['సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం ఉండండి', 'గరిక ఉండ్రాళ్లు ఎర్రపూలు సమర్పించండి', 'ఓం గం గణపతయే నమః జపించండి', 'సంకష్టి కథ వినండి', 'చంద్రునికి అర్ఘ్యం ఇచ్చి ఉపవాసం విడవండి'],
        deity: 'గణేశ్',
      },
      ta: {
        name: 'சங்கடஹர சதுர்த்தி',
        description: 'மாதந்தோறும் விநாயகர் விழா',
        significance: 'இடையூறுகளை நீக்கும் விநாயகருக்கான மாத விரதம். சங்கடம் என்றால் துன்பத்திலிருந்து விடுதலை. சூரிய உதயம் முதல் நிலவு வரை விரதம் இருக்கப்படுகிறது.',
        rituals: ['சூரிய உதயம் முதல் நிலவு வரை விரதம் இரு', 'அருகு கொழுக்கட்டை சிவப்பு மலர் படை', 'ஓம் கம் கணபதயே நமः சொல்', 'விரதக் கதை கேட்டிடு', 'நிலவுக்கு அர்க்கியம் தந்து விரதம் முடி'],
        deity: 'விநாயகர்',
      },
    },
    description: 'Monthly Ganesha Festival',
    significance: 'Monthly Krishna Paksha Chaturthi vrat for Ganesha, remover of obstacles; sankashti means deliverance from troubles. Observed most widely in Maharashtra and Tamil Nadu with a sunrise-to-moonrise fast. When it falls on Tuesday it is Angarki Sankashti, considered especially meritorious.',
    rituals: ['Fast from sunrise to moonrise', 'Offer durva, modak, red flowers', 'Chant Om Gam Ganapataye Namah', 'Hear or read Sankashti katha', 'Offer moon arghya; break fast'],
    deity: 'Ganesha',
    tithiNumber: 4,
    paksha: 'Krishna',
    month: 0, // Observed every month (special handling)
    type: 'minor'
  },
  
  // Regional Festivals
  {
    id: 'pongal',
    name: 'Pongal',
    nameHindi: 'पोंगल',
    i18n: {
      hi: {
        name: 'पोंगल',
        description: 'तमिलनाडु का फसल पर्व',
        significance: 'सूर्य और पशुधन के प्रति चार दिवसीय कृतज्ञता उत्सव; नया धान दूध-गुड़ से उबालकर सूर्य को अर्पित होता है।',
        rituals: ['पुरानी वस्तुओं की भोगी अलाव जलाएं', 'पोंगल व्यंजन उफनने तक पकाएं', 'पहला भाग सूर्य को अर्पित करें', 'पशुओं को सजाकर स्नान कराएं', 'कोलम बनाएं; मिठाई बाँटें'],
        deity: 'सूर्य',
      },
      sa: {
        name: 'पोंगलः',
        description: 'तमिलनाडोः सस्योत्सवः',
        significance: 'तमिलनाडोः चतुर्दिनात्मकः सस्योत्सवः। सूर्याय पशुभ्यश्च कृतज्ञता अर्प्यते। पोंगलपाकः उफानपर्यन्तं पच्यते।',
        rituals: ['भोगीहोमे पुरातनवस्तुदहनम्', 'उफानपर्यन्तं पोंगलपाकः', 'सूर्याय प्रथमांशार्पणम्', 'पशूनां स्नापनालङ्कारः', 'कोलमलेखनं मिष्टान्नविनिमयश्च'],
        deity: 'सूर्यः',
      },
      kn: {
        name: 'ಪೊಂಗಲ್',
        description: 'ತಮಿಳುನಾಡಿನ ಸುಗ್ಗಿ ಹಬ್ಬ',
        significance: 'ತಮಿಳುನಾಡಿನ ನಾಲ್ಕು ದಿನಗಳ ಸುಗ್ಗಿ ಕೃತಜ್ಞತಾ ಹಬ್ಬ. ಹಳೆಯದನ್ನು ಬೆಂಕಿಯಲ್ಲಿ ಸುಡುವುದು, ಹೊಸ ಅಕ್ಕಿಯ ಪೊಂಗಲ್ ಉಕ್ಕಿಸುವುದು, ದನಗಳನ್ನು ಗೌರವಿಸುವುದು ಮತ್ತು ಕುಟುಂಬ ಮಿಲನದಿಂದ ಕೂಡಿದೆ.',
        rituals: ['ಹಳೆಯ ವಸ್ತುಗಳಿಂದ ಭೋಗಿ ಬೆಂಕಿ ಹಚ್ಚಿ', 'ಪೊಂಗಲ್ ಉಕ್ಕುವವರೆಗೆ ಕುದಿಸಿ', 'ಮೊದಲ ಪಾಲನ್ನು ಸೂರ್ಯನಿಗೆ ಅರ್ಪಿಸಿ', 'ದನಗಳನ್ನು ಸ್ನಾನ ಮಾಡಿಸಿ ಅಲಂಕರಿಸಿ', 'ಕೋಲಂ ಹಾಕಿ ಸಿಹಿ ಹಂಚಿ'],
        deity: 'ಸೂರ್ಯ',
      },
      te: {
        name: 'పొంగల్',
        description: 'తమిళనాడు పంటల పండుగ',
        significance: 'సూర్యునికి పశువులకు కృతజ్ఞత చెప్పే నాలుగు రోజుల పంటల పండుగ. కొత్త బియ్యం పాలు బెల్లంతో పొంగలి వండి పంచుకుంటారు.',
        rituals: ['పాత వస్తువులతో భోగి మంట వేయండి', 'పొంగలి పొంగేవరకు వండండి', 'మొదటి భాగం సూర్యునికి సమర్పించండి', 'పశువులను కడిగి అలంకరించండి', 'ముగ్గులు వేసి స్వీట్లు పంచుకోండి'],
        deity: 'సూర్య',
      },
      ta: {
        name: 'பொங்கல்',
        description: 'தமிழ்நாட்டின் அறுவடைத் திருவிழா',
        significance: 'சூரியனுக்கும் கால்நடைகளுக்கும் நன்றி சொல்லும் நான்கு நாள் அறுவடை விழா. பழையதை நீக்கும் போகி, புது அரிசிப் பொங்கல், மாட்டுப் பொங்கல், உறவுகள் கூடும் காணும் பொங்கல் ஆகியவை அடங்கும்.',
        rituals: ['பழைய பொருள் நெருப்பு மூட்டு', 'பொங்கல் பொங்கும் வரை காய்ச்சு', 'முதல் பங்கைச் சூரியனுக்குப் படை', 'மாடுகளைக் குளிப்பாட்டி அலங்கரி', 'கோலமிட்டு இனிப்பு பகிர்ந்துண்'],
        deity: 'சூரியன்',
      },
    },
    description: 'Harvest Festival of Tamil Nadu',
    significance: 'Tamil Nadu\'s four-day harvest thanksgiving to Surya and cattle at the start of Thai month: Bhogi discards the old in bonfires, Thai Pongal boils new rice with milk and jaggery till it overflows, Mattu Pongal honors cattle, and Kaanum Pongal reunites families.',
    rituals: ['Light Bhogi bonfire of old items', 'Boil pongal dish till overflowing', 'Offer first portion to Surya', 'Bathe and adorn cattle festively', 'Draw kolams; share sweets'],
    deity: 'Surya',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 10, // Pausha (usually mid-January)
    type: 'regional',
    region: ['Tamil Nadu', 'South India']
  },
  {
    id: 'onam',
    name: 'Onam',
    nameHindi: 'ओणम',
    i18n: {
      hi: {
        name: 'ओणम',
        description: 'केरल का फसल पर्व',
        significance: 'फसल और राजा महाबलि के वार्षिक आगमन का दस दिवसीय उत्सव; घरों में पूकलम सजते हैं।',
        rituals: ['प्रतिदिन पूकलम फूल कालीन बिछाएं', 'ओणतप्पन विग्रह स्थापित कर पूजें', 'केले के पत्ते पर ओणसद्या परोसें', 'ओणक्कोडी नए वस्त्र पहनें', 'वल्लमकली नौका दौड़ देखें'],
        deity: 'वामन (विष्णु)',
      },
      sa: {
        name: 'ओणम्',
        description: 'केरळस्य सस्योत्सवः',
        significance: 'केरळस्य दशदिनात्मकः उत्सवः। महाबलिचक्रवर्तिनः वार्षिकप्रत्यागमनं अत्र उत्सव्यते। वामनावतारः अपि स्मर्यते।',
        rituals: ['प्रतिदिनं पूक्कलमपुष्पालङ्कारः', 'ओणत्थप्पन्प्रतिमापूजनम्', 'कदलीपत्रे ओणसद्याभोजनम्', 'ओणक्कोडिनववस्त्रधारणम्', 'वल्लम्कलिनौकास्पर्धादर्शनम्'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ಓಣಂ',
        description: 'ಕೇರಳದ ಸುಗ್ಗಿ ಹಬ್ಬ',
        significance: 'ಕೇರಳದ ಹತ್ತು ದಿನಗಳ ಹಬ್ಬ. ಸುಗ್ಗಿ ಮತ್ತು ಮಹಾಬಲಿಯ ವಾರ್ಷಿಕ ಆಗಮನವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಮನೆಗಳಲ್ಲಿ ಹೂವಿನ ಪೂಕಳಂ ಹಾಕಲಾಗುತ್ತದೆ, ಹಾವು ದೋಣಿ ಸ್ಪರ್ಧೆಗಳು ಪ್ರಸಿದ್ಧ.',
        rituals: ['ಪ್ರತಿದಿನ ಪೂಕಳಂ ಹೂವಿನ ರಂಗೋಲಿ ಹಾಕಿ', 'ಓಣತ್ತಪ್ಪನ್ ಮೂರ್ತಿ ಸ್ಥಾಪಿಸಿ ಪೂಜಿಸಿ', 'ಬಾಳೆ ಎಲೆಯಲ್ಲಿ ಓಣಸದ್ಯ ಊಟ ಬಡಿಸಿ', 'ಹೊಸ ಹಬ್ಬದ ಬಟ್ಟೆ ಧರಿಸಿ', 'ಹಾವು ದೋಣಿ ಸ್ಪರ್ಧೆ ವೀಕ್ಷಿಸಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'ఓణం',
        description: 'కేరళ పంటల పండుగ',
        significance: 'మహాబలి చక్రవర్తి ఏటా ఇంటికి వచ్చే పండుగగా పది రోజులు జరుపుకుంటారు. పూలతో అత్తపూవు వేస్తారు, పడవ పందేలు ప్రసిద్ధం.',
        rituals: ['రోజూ పూలతో అత్తపూవు వేయండి', 'ఓణత్తప్పన్ విగ్రహాలు పెట్టి పూజించండి', 'అరటి ఆకులో ఓణసద్య వడ్డించండి', 'కొత్త బట్టలు ధరించండి', 'పడవ పందేలు చూడండి'],
        deity: 'విష్ణు',
      },
      ta: {
        name: 'ஓணம்',
        description: 'கேரளாவின் அறுவடைத் திருவிழா',
        significance: 'மகாபலியின் ஆண்டு வருகையையும் அறுவடையையும் கொண்டாடும் கேரளாவின் பத்து நாள் விழா. வீடுகளில் பூக்களம் இடப்படுகிறது; படகுப் போட்டிகள் புகழ்பெற்றவை.',
        rituals: ['நாள்தோறும் பூக்களம் இடு', 'ஓணத்தப்பனை வைத்து வழிபடு', 'இலையில் ஓணசத்யா விருந்துண்', 'புத்தாடை அணிந்துகொள்', 'படகுப் போட்டி கண்டுகளி'],
        deity: 'விஷ்ணு',
      },
    },
    description: 'Harvest Festival of Kerala',
    significance: 'Kerala\'s ten-day Chingam festival from Atham to Thiruvonam (Shravana nakshatra) marking the harvest and the annual homecoming of Asura king Mahabali, blessed by Vishnu\'s Vamana avatar. Homes lay growing pookalams, and the season is famed for vallam kali snake-boat races.',
    rituals: ['Lay daily pookalam flower carpets', 'Install and worship Onathappan idols', 'Serve Onasadya feast on banana leaf', 'Wear Onakkodi new festive clothes', 'Watch vallam kali boat races'],
    deity: 'Vamana (Vishnu)',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 5, // Shravana (usually August-September)
    type: 'regional',
    region: ['Kerala']
  },
  {
    id: 'ugadi',
    name: 'Ugadi',
    nameHindi: 'युगादि',
    i18n: {
      hi: {
        name: 'युगादि',
        description: 'कर्नाटक, आंध्र, तेलंगाना का नववर्ष',
        significance: 'चांद्र-सौर संवत्सर का आरंभ; जीवन के सुख-दुःख का प्रतीक छह रसों वाली उगादि पच्चड़ी चखी जाती है।',
        rituals: ['तेल स्नान कर नए वस्त्र पहनें', 'छह रसों वाली उगादि पच्चड़ी चखें', 'नववर्ष का पंचांग श्रवण करें', 'द्वार आम पत्तों से सजाएं', 'मंदिर जाएं; शुभकामनाएं बाँटें'],
        deity: 'ब्रह्मा',
      },
      sa: {
        name: 'युगादिः',
        description: 'दाक्षिणात्यनववर्षम्',
        significance: 'चैत्रशुक्लप्रतिपदि कर्णाटकान्ध्रतेलङ्गानानां नववर्षम्। संवत्सरारम्भे ब्रह्मणः सृष्टिः स्मर्यते। षड्रसपाचडी जीवनस्य प्रतीकम्।',
        rituals: ['तैलस्नानं नववस्त्रधारणं च', 'षड्रसपाचडीआस्वादनम्', 'नववर्षपञ्चाङ्गश्रवणम्', 'आम्रपत्रैः द्वारालङ्कारः', 'मन्दिरदर्शनं शुभाशंसाश्च'],
        deity: 'ब्रह्मा',
      },
      kn: {
        name: 'ಉಗಾದಿ',
        description: 'ಕರ್ನಾಟಕ, ಆಂಧ್ರ, ತೆಲಂಗಾಣದ ಹೊಸ ವರ್ಷ',
        significance: 'ದಕ್ಷಿಣದ ಹೊಸ ವರ್ಷ, ಚಾಂದ್ರಮಾನ ಸಂವತ್ಸರದ ಆರಂಭ. ಬ್ರಹ್ಮನ ಸೃಷ್ಟಿಯ ಸಂಕೇತ. ಆರು ರುಚಿಗಳ ಪಚ್ಚಡಿಯು ಜೀವನದ ಸುಖ-ದುಃಖಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
        rituals: ['ಎಣ್ಣೆ ಸ್ನಾನ ಮಾಡಿ ಹೊಸ ಬಟ್ಟೆ ಧರಿಸಿ', 'ಆರು ರುಚಿಯ ಪಚ್ಚಡಿ ಸವಿಯಿರಿ', 'ಹೊಸ ವರ್ಷದ ಪಂಚಾಂಗ ಶ್ರವಣ ಕೇಳಿ', 'ಮಾವಿನ ತೋರಣದಿಂದ ಬಾಗಿಲು ಅಲಂಕರಿಸಿ', 'ದೇವಸ್ಥಾನಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಶುಭ ಹಾರೈಸಿ'],
        deity: 'ಬ್ರಹ್ಮ',
      },
      te: {
        name: 'ఉగాది',
        description: 'కర్ణాటక ఆంధ్ర తెలంగాణ కొత్త సంవత్సరం',
        significance: 'చాంద్రమాన కొత్త సంవత్సరం. బ్రహ్మ సృష్టి ప్రారంభించిన రోజుగా భావిస్తారు. జీవితంలోని కష్టసుఖాలకు గుర్తుగా షడ్రుచుల పచ్చడి తింటారు.',
        rituals: ['తలంటి కొత్త బట్టలు కట్టుకోండి', 'షడ్రుచుల ఉగాది పచ్చడి తినండి', 'పంచాంగ శ్రవణం వినండి', 'మామిడి తోరణాలు కట్టండి', 'గుడికి వెళ్లి శుభాకాంక్షలు చెప్పండి'],
        deity: 'బ్రహ్మ',
      },
      ta: {
        name: 'யுகாதி',
        description: 'கர்நாடக ஆந்திர தெலுங்கானா புத்தாண்டு',
        significance: 'தக்காணப் புத்தாண்டு; சந்திர சூரிய ஆண்டின் தொடக்கம். வாழ்வின் இன்ப துன்பங்களைக் குறிக்கும் அறுசுவை யுகாதி பச்சடி இதன் அடையாளம்.',
        rituals: ['எண்ணெய் குளித்துப் புத்தாடை அணி', 'அறுசுவை யுகாதி பச்சடி சுவைத்திடு', 'புத்தாண்டுப் பஞ்சாங்கம் கேட்டிடு', 'மாவிலையால் வாயில் அலங்கரி', 'கோயில் சென்று வாழ்த்துப் பரிமாறு'],
        deity: 'பிரம்மா',
      },
    },
    description: 'New Year for Karnataka, Andhra, Telangana',
    significance: 'Deccan New Year on Chaitra Shukla Pratipada for Karnataka, Andhra Pradesh, and Telangana, marking the start of the lunisolar samvatsara and traditionally Brahma\'s creation. Its emblem is Ugadi pachadi, a six-taste dish symbolizing life\'s joys and sorrows.',
    rituals: ['Take oil bath; wear new clothes', 'Taste six-flavour Ugadi pachadi', 'Hear new-year panchanga shravana', 'Decorate doors with mango leaves', 'Visit temples; exchange greetings'],
    deity: 'Brahma',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'regional',
    region: ['Karnataka', 'Andhra Pradesh', 'Telangana']
  },
  {
    id: 'gudi-padwa',
    name: 'Gudi Padwa',
    nameHindi: 'गुड़ी पड़वा',
    i18n: {
      hi: {
        name: 'गुड़ी पड़वा',
        description: 'महाराष्ट्र का नववर्ष',
        significance: 'चांद्र-सौर संवत्सर का आरंभ; विजय पताका के रूप में घरों पर गुड़ी फहराई जाती है।',
        rituals: ['तेल स्नान कर पारंपरिक वस्त्र पहनें', 'कलश सहित गुड़ी फहराएं', 'फूलों से गुड़ी पूजन करें', 'नीम पत्ती का मीठा प्रसाद खाएं', 'श्रीखंड और पूरण पोली बनाएं'],
        deity: 'ब्रह्मा',
      },
      sa: {
        name: 'गुडीपाडवा',
        description: 'महाराष्ट्रस्य नववर्षम्',
        significance: 'चैत्रशुक्लप्रतिपदि महाराष्ट्रस्य नववर्षम्। गृहेषु गुडी ध्वजरूपेण उत्तोल्यते। सा धर्मविजयस्य प्रतीकम्।',
        rituals: ['तैलस्नानं पारम्परिकवेषश्च', 'कलशसहिता गुड्युत्तोलनम्', 'पुष्पैः गुडीपूजनम्', 'निम्बपत्रमिष्टान्नप्रसादभक्षणम्', 'श्रीखण्डपुरणपोलीपाकः'],
        deity: 'ब्रह्मा',
      },
      kn: {
        name: 'ಗುಡಿ ಪಾಡ್ವ',
        description: 'ಮಹಾರಾಷ್ಟ್ರದ ಹೊಸ ವರ್ಷ',
        significance: 'ಮಹಾರಾಷ್ಟ್ರದ ಹೊಸ ವರ್ಷ, ಸಂವತ್ಸರದ ಆರಂಭ. ಕುಟುಂಬಗಳು ಗುಡಿ ಏರಿಸುತ್ತಾರೆ, ಇದು ಒಳಿತಿನ ವಿಜಯ ಧ್ವಜ. ಕೋಲಿನ ಮೇಲೆ ಕಳಸ, ರೇಷ್ಮೆ ಬಟ್ಟೆ, ಬೇವು ಮತ್ತು ಮಾವಿನ ಎಲೆಗಳಿಂದ ಅಲಂಕರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಎಣ್ಣೆ ಸ್ನಾನ ಮಾಡಿ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಗೆ ಧರಿಸಿ', 'ಕಳಸವಿರುವ ಗುಡಿ ಏರಿಸಿ', 'ಹೂವುಗಳಿಂದ ಗುಡಿ ಪೂಜೆ ಮಾಡಿ', 'ಬೆಲ್ಲದ ಬೇವಿನ ಪ್ರಸಾದ ಸೇವಿಸಿ', 'ಶ್ರೀಖಂಡ ಮತ್ತು ಪುರನ್ ಪೋಳಿ ಮಾಡಿ'],
        deity: 'ಬ್ರಹ್ಮ',
      },
      te: {
        name: 'గుడి పడ్వా',
        description: 'మహారాష్ట్ర కొత్త సంవత్సరం',
        significance: 'మహారాష్ట్ర కొత్త సంవత్సరం. ఇంటిపై గుడి ఎగురవేసి విజయానికి, మంచి చెడుపై గెలుపుకు గుర్తుగా జరుపుకుంటారు.',
        rituals: ['తలంటి సంప్రదాయ దుస్తులు ధరించండి', 'కలశంతో గుడి ఎగురవేయండి', 'పూలతో గుడిపూజ చేయండి', 'వేపాకు ప్రసాదం తినండి', 'శ్రీఖండ్ పూరణ్ పోళీ వండండి'],
        deity: 'బ్రహ్మ',
      },
      ta: {
        name: 'குடி பாட்வா',
        description: 'மகாராஷ்டிரப் புத்தாண்டு',
        significance: 'மகாராஷ்டிரப் புத்தாண்டு; ஆண்டின் தொடக்க நாள். குடும்பங்கள் வெற்றிக் கொடியாகக் குடியை உயர்த்துகின்றனர்; தீமை மீது நன்மை வெல்வதன் அடையாளம்.',
        rituals: ['எண்ணெய் குளித்துப் பாரம்பரிய உடை அணி', 'கலசத்துடன் குடி உயர்த்து', 'மலரால் குடி பூஜை செய்', 'வேப்பிலை இனிப்புப் பிரசாதம் உண்', 'ஸ்ரீகண்ட் பூரண்போளி சமைத்திடு'],
        deity: 'பிரம்மா',
      },
    },
    description: 'Maharashtrian New Year',
    significance: 'Maharashtra\'s New Year on Chaitra Shukla Pratipada opening the lunisolar samvatsara, same day as Ugadi in the Deccan. Families hoist a gudi, an inverted kalash on a bamboo pole with silk cloth, neem, and mango leaves, as a victory banner of good over evil.',
    rituals: ['Oil bath; wear traditional attire', 'Hoist gudi with kalash atop', 'Perform Gudi puja with flowers', 'Eat sweetened neem-leaf prasad', 'Cook shrikhand and puran poli'],
    deity: 'Brahma',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'regional',
    region: ['Maharashtra']
  },
  {
    id: 'bihu',
    name: 'Bihu',
    nameHindi: 'बिहू',
    i18n: {
      hi: {
        name: 'बिहू',
        description: 'असमिया नववर्ष और फसल पर्व',
        significance: 'असम के तीन कृषि उत्सव; वसंत बोहाग बिहू नववर्ष खोलता है, नृत्य और गमछा उपहार इसकी शोभा हैं।',
        rituals: ['पशुओं को नहलाकर खिलाएं', 'ढोल-पेपा पर बिहू नाचें', 'पीठा और जलपान का भोज करें', 'हाथबुना गमछा उपहार दें', 'भोजन लेकर संबंधियों से मिलें'],
      },
      sa: {
        name: 'बिहू',
        description: 'असमस्य नववर्षसस्योत्सवौ',
        significance: 'असमस्य त्रयः कृष्युत्सवाः। वसन्ते बोहागबिहू नववर्षं सस्यवपनं च आरभते। नृत्यगीतगामछादानैः उत्सवः शोभते।',
        rituals: ['पशूनां स्नापनपोषणोत्सवः', 'ढोलपेपावाद्येन बिहूनृत्यम्', 'पिठाजोलपानभक्षणम्', 'गामछावस्त्रदानम्', 'बन्धुदर्शनम् आहारदानं च'],
      },
      kn: {
        name: 'ಬಿಹು',
        description: 'ಅಸ್ಸಾಮಿ ಹೊಸ ವರ್ಷ ಮತ್ತು ಸುಗ್ಗಿ ಹಬ್ಬ',
        significance: 'ಅಸ್ಸಾಂನ ಮೂರು ಕೃಷಿ ಹಬ್ಬಗಳು. ವಸಂತದ ಬೋಹಾಗ್ ಬಿಹು ಹೊಸ ವರ್ಷ ತೆರೆಯುತ್ತದೆ, ಕಟಿ ಬಿಹು ಬೆಳೆಗೆ ಪ್ರಾರ್ಥಿಸುತ್ತದೆ, ಚಳಿಗಾಲದ ಮಾಘ ಬಿಹು ಸುಗ್ಗಿಯ ಭೋಜನ. ದನಗಳ ಪೂಜೆ, ನೃತ್ಯ ಮತ್ತು ಗಮೋಸಾ ವಿಶೇಷ.',
        rituals: ['ದನಗಳನ್ನು ಸ್ನಾನ ಮಾಡಿಸಿ ಮೇವು ನೀಡಿ', 'ಡೋಲ್-ಪೆಪಾ ವಾದ್ಯಕ್ಕೆ ಬಿಹು ಕುಣಿಯಿರಿ', 'ಪಿಠಾ ಮತ್ತು ಜೊಲ್ಪಾನ್ ತಿಂಡಿ ಸವಿಯಿರಿ', 'ಕೈಮಗ್ಗದ ಗಮೋಸಾ ಉಡುಗೊರೆ ನೀಡಿ', 'ಆಹಾರದೊಂದಿಗೆ ಸಂಬಂಧಿಕರನ್ನು ಭೇಟಿ ಮಾಡಿ'],
      },
      te: {
        name: 'బిహు',
        description: 'అస్సాం కొత్త సంవత్సరం పంటల పండుగ',
        significance: 'అస్సాం వ్యవసాయ పండుగలు. వసంతంలో బోహాగ్ బిహుతో కొత్త సంవత్సరం, నాట్లు, పెరుగుతున్న వరికి పూజ, శీతకాలంలో కోతల విందు జరుపుకుంటారు.',
        rituals: ['పశువులను కడిగి మేపండి', 'డోలు పెప్పా వాయిద్యంతో బిహు నృత్యం చేయండి', 'పీఠా జోల్పాన్ ఫలహారాలు తినండి', 'గమోసా తువ్వాళ్లు బహుమతిగా ఇవ్వండి', 'బంధువులను కలిసి ఆహారం పంచుకోండి'],
      },
      ta: {
        name: 'பிஹு',
        description: 'அசாமியப் புத்தாண்டு அறுவடை விழா',
        significance: 'அசாமின் மூன்று வேளாண் விழாக்கள். இளவேனில் பிஹு புத்தாண்டையும் விதைப்பையும் தொடங்குகிறது; மற்றவை வளரும் நெல்லையும் அறுவடை விருந்தையும் கொண்டாடுகின்றன.',
        rituals: ['மாடுகளைக் குளிப்பாட்டி உணவளி', 'மேள தாளத்துடன் பிஹு ஆடு', 'பிட்டா பலகாரம் விருந்துண்', 'கைத்தறி காமோசா பரிசளி', 'உணவுடன் உறவினரைச் சந்தித்திடு'],
      },
    },
    description: 'Assamese New Year and Harvest Festival',
    significance: 'Assam\'s trio of farming festivals: spring Bohag (Rongali) Bihu opens the Assamese New Year and sowing season, Kati Bihu prays over growing paddy, and winter Magh (Bhogali) Bihu feasts after harvest. Rongali\'s Goru Bihu bathes cattle; husori dance troupes and gamosa gifts mark the week.',
    rituals: ['Bathe and feed cattle festively', 'Dance Bihu to dhol-pepa rhythm', 'Feast on pitha and jolpan snacks', 'Gift handwoven gamosa scarves', 'Visit relatives bearing food gifts'],
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 1, // Chaitra (Bohag Bihu) (month 1 = index 0 + 1)
    type: 'regional',
    region: ['Assam']
  },
  {
    id: 'lohri',
    name: 'Lohri',
    nameHindi: 'लोहड़ी',
    i18n: {
      hi: {
        name: 'लोहड़ी',
        description: 'पंजाबी शीत उत्सव',
        significance: 'शीत की विदाई और रबी फसल का अग्नि उत्सव; समुदाय लोकगीत गाकर सूर्य के उत्तरायण का स्वागत करता है।',
        rituals: ['सांझ को सामुदायिक अलाव जलाएं', 'तिल, मूंगफली, मक्का, रेवड़ी अर्पित करें', 'लोकगीत गाएं; भांगड़ा-गिद्दा नाचें', 'सरसों साग, मक्की रोटी जीमें', 'नवजात और नवविवाहितों का विशेष सम्मान करें'],
        deity: 'अग्नि',
      },
      sa: {
        name: 'लोहडी',
        description: 'पञ्जाबस्य शीतर्तूत्सवः',
        significance: 'मकरसङ्क्रान्तेः पूर्वसन्ध्यायां पञ्जाबस्य वह्न्युत्सवः। शीतनिवृत्तिः रबिसस्यं च अत्र उत्सव्येते। अग्निं परितः लोकगीतगायनं क्रियते।',
        rituals: ['सायं सामूहिकवह्निप्रज्वालनम्', 'तिलमूङ्गफलीपॉपकॉर्नरेवडीअर्पणम्', 'लोकगीतगायनं भाङ्गडागिद्दानृत्यं च', 'सर्षपशाकमक्की रोटीभोजनम्', 'नवजातवरवध्वोः विशेषसत्कारः'],
        deity: 'अग्निः',
      },
      kn: {
        name: 'ಲೋಹ್ರಿ',
        description: 'ಪಂಜಾಬಿ ಚಳಿಗಾಲದ ಹಬ್ಬ',
        significance: 'ಪಂಜಾಬ್ ಮತ್ತು ಉತ್ತರ ಭಾರತದ ಬೆಂಕಿ ಹಬ್ಬ. ಚಳಿಗಾಲದ ಅಂತ್ಯ ಮತ್ತು ರಬಿ ಸುಗ್ಗಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ, ಸೂರ್ಯನ ಉತ್ತರಾಯಣವನ್ನು ಗೌರವಿಸುತ್ತದೆ. ಹೊಸ ಮಗು ಅಥವಾ ನವದಂಪತಿಯ ಮೊದಲ ಲೋಹ್ರಿಯನ್ನು ಅದ್ಧೂರಿಯಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಸಂಜೆ ಸಮುದಾಯದ ಬೆಂಕಿ ಹಚ್ಚಿ', 'ಎಳ್ಳು, ಕಡಲೆ, ಪಾಪ್‌ಕಾರ್ನ್, ರೇವಡಿ ಅರ್ಪಿಸಿ', 'ಜಾನಪದ ಹಾಡು ಹಾಡಿ ಭಾಂಗ್ರಾ-ಗਿੱਦಾ ಕುಣಿಯಿರಿ', 'ಸರ್ಸೋಂ ಸಾಗ್, ಮಕ್ಕೆ ರೊಟ್ಟಿ ಸವಿಯಿರಿ', 'ಹೊಸ ಮಕ್ಕಳು ಮತ್ತು ನವದಂಪತಿಯನ್ನು ಗೌರವಿಸಿ'],
        deity: 'ಅಗ್ನಿ',
      },
      te: {
        name: 'లోహ్రీ',
        description: 'పంజాబీ శీతకాల పండుగ',
        significance: 'చలికాలం ముగింపుకు, రబీ పంటకు గుర్తుగా మంట చుట్టూ జరుపుకునే పండుగ. సూర్యుని ఉత్తరాయణానికి కృతజ్ఞత చెబుతారు.',
        rituals: ['సాయంత్రం మంట వెలిగించండి', 'నువ్వులు వేరుశెనగ పాప్‌కార్న్ సమర్పించండి', 'పాటలు పాడి భంగ్రా గిద్దా ఆడండి', 'సర్సోం సాగ్ మక్కీ రోటీ తినండి', 'పసిపిల్లలను కొత్త జంటలను సత్కరించండి'],
        deity: 'అగ్ని',
      },
      ta: {
        name: 'லோஹ்ரி',
        description: 'பஞ்சாபின் குளிர்கால விழா',
        significance: 'குளிர் விலகி ரபி அறுவடை வருவதைக் குறிக்கும் நெருப்பு விழா; சூரியனின் வட திசைப் பயணத்தைப் போற்றுகிறது. புது மணமக்கள் குழந்தைகளின் முதல் லோஹ்ரி சிறப்பாகக் கொண்டாடப்படுகிறது.',
        rituals: ['மாலையில் சமூக நெருப்பு மூட்டு', 'எள் வேர்க்கடலை பொரி படைத்திடு', 'பாடி ஆடிக் கொண்டாடு', 'சாக் ரொட்டி விருந்துண்', 'புதியவர்களைச் சிறப்பித்திடு'],
        deity: 'அக்னி',
      },
    },
    description: 'Punjabi Winter Festival',
    significance: 'Punjab and North India\'s bonfire festival the evening before Makar Sankranti, marking winter\'s retreat and the rabi harvest while honoring Surya\'s northward turn. Communities circle the Agni fire singing folk songs; a newborn\'s or newlywed couple\'s first Lohri is celebrated grandly.',
    rituals: ['Light community evening bonfire', 'Offer til, peanuts, popcorn, rewri', 'Sing folk songs; dance bhangra-gidda', 'Feast on sarson saag, makki roti', 'Honor newborns and newlyweds specially'],
    deity: 'Agni',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 10, // Pausha
    type: 'regional',
    region: ['Punjab', 'North India']
  },
  {
    id: 'basant-panchami',
    name: 'Basant Panchami',
    nameHindi: 'बसंत पंचमी',
    i18n: {
      hi: {
        name: 'बसंत पंचमी',
        description: 'वसंत पर्व और सरस्वती पूजन',
        significance: 'वसंत का आगमन और सरस्वती जयंती; विद्या, कला और अज्ञान निवारण हेतु देवी की उपासना होती है।',
        rituals: ['पूर्वाह्न में सरस्वती पूजन करें', 'पीले-सफेद वस्त्र पहनें', 'गेंदा और सरसों के फूल अर्पित करें', 'बच्चों का विद्या आरंभ कराएं', 'पतंग उड़ाएं; विद्यालय पूजन करें'],
        deity: 'सरस्वती',
      },
      sa: {
        name: 'वसन्तपञ्चमी',
        description: 'वसन्तागमः सरस्वतीपूजा च',
        significance: 'माघशुक्लपञ्चम्यां वसन्तागमनं सरस्वतीजयन्ती च। ज्ञानकलायै सरस्वती पूज्यते। बालाः विद्यारम्भं कुर्वन्ति।',
        rituals: ['पूर्वाह्णे सरस्वतीपूजनम्', 'पीतश्वेतवस्त्रधारणम्', 'गेण्डुसर्षपपुष्पार्पणम्', 'बालानां विद्यारम्भः', 'पतङ्गोड्डयनं विद्यालयपूजाश्च'],
        deity: 'सरस्वती',
      },
      kn: {
        name: 'ಬಸಂತ ಪಂಚಮಿ',
        description: 'ವಸಂತ ಹಬ್ಬ ಮತ್ತು ಸರಸ್ವತಿ ಪೂಜೆ',
        significance: 'ವಸಂತವನ್ನು ಸ್ವಾಗತಿಸುವ ದಿನ, ಸರಸ್ವತಿಯ ಜನ್ಮದಿನವೆಂದು ಗೌರವಿಸಲಾಗುತ್ತದೆ. ಜ್ಞಾನ, ಕಲೆ ಮತ್ತು ಅಜ್ಞಾನ ನಿವಾರಣೆಗಾಗಿ ಬಿಳಿ-ಹಳದಿ ಉಡುಗೆಯಲ್ಲಿ ಸರಸ್ವತಿಯನ್ನು ಪೂಜಿಸಲಾಗುತ್ತದೆ. ಮಕ್ಕಳು ವಿದ್ಯಾರಂಭ ಮಾಡುತ್ತಾರೆ.',
        rituals: ['ಬೆಳಿಗ್ಗೆ ಸರಸ್ವತಿಯನ್ನು ಪೂಜಿಸಿ', 'ಹಳದಿ ಮತ್ತು ಬಿಳಿ ಬಟ್ಟೆ ಧರಿಸಿ', 'ಚೆಂಡು ಹೂವು ಮತ್ತು ಸಾಸಿವೆ ಹೂವು ಅರ್ಪಿಸಿ', 'ಮಕ್ಕಳ ವಿದ್ಯಾರಂಭ ಪಾಠ ಆರಂಭಿಸಿ', 'ಗಾಳಿಪಟ ಹಾರಿಸಿ ಶಾಲಾ ಪೂಜೆ ಮಾಡಿ'],
        deity: 'ಸರಸ್ವತಿ',
      },
      te: {
        name: 'వసంత పంచమి',
        description: 'వసంత పండుగ సరస్వతీ పూజ',
        significance: 'వసంత రాకకు, సరస్వతీదేవి జన్మదినంగా జరుపుకుంటారు. విద్య కళల కోసం సరస్వతిని పూజిస్తారు. పిల్లలు విద్యాభ్యాసం ప్రారంభిస్తారు.',
        rituals: ['ఉదయం సరస్వతిని పూజించండి', 'పసుపు తెలుపు బట్టలు ధరించండి', 'బంతి ఆవపూలు సమర్పించండి', 'పిల్లలతో అక్షరాభ్యాసం చేయించండి', 'గాలిపటాలు ఎగురవేసి పాఠశాల పూజలు చేయండి'],
        deity: 'సరస్వతి',
      },
      ta: {
        name: 'வசந்த பஞ்சமி',
        description: 'இளவேனில் விழா சரஸ்வதி பூஜை',
        significance: 'இளவேனிலை வரவேற்கும் நாள்; சரஸ்வதியின் பிறந்த நாளாகப் போற்றப்படுகிறது. கல்வி கலை அறியாமை நீக்கம் வேண்டி வழிபடுகின்றனர்; குழந்தைகள் கல்வியைத் தொடங்குகின்றனர்.',
        rituals: ['காலையில் சரஸ்வதியை வழிபடு', 'மஞ்சள் வெள்ளை உடை அணி', 'சாமந்தி கடுகு மலர் படை', 'குழந்தைகளுக்குக் கல்வி தொடங்கு', 'பட்டம் விட்டுக் கொண்டாடு'],
        deity: 'சரஸ்வதி',
      },
    },
    description: 'Spring Festival and Saraswati Puja',
    significance: 'Magha Shukla Panchami heralding spring and honored as Saraswati Jayanti, the goddess\'s birth anniversary. Devotees in white and yellow worship Saraswati for knowledge, arts, and the removal of ignorance; schools hold pujas, children begin Vidya Arambha, and Punjab flies kites.',
    rituals: ['Worship Saraswati in Purvahna morning', 'Dress in yellow and white', 'Offer marigold and mustard flowers', 'Begin children\'s Vidya Arambha lessons', 'Fly kites; hold school pujas'],
    deity: 'Saraswati',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'regional'
  },
  {
    id: 'guru-purnima',
    name: 'Guru Purnima',
    nameHindi: 'गुरु पूर्णिमा',
    i18n: {
      hi: {
        name: 'गुरु पूर्णिमा',
        description: 'गुरु का दिवस',
        significance: 'अज्ञान दूर करने वाले गुरुओं का सम्मान; हिंदू इसे वेदव्यास का जन्मदिन मानते हैं।',
        rituals: ['गुरु या व्यास पूजन करें', 'शिक्षकों को फूल-फल अर्पित करें', 'गुरु चरणों की पादपूजा करें', 'सत्संग और प्रवचन में जुड़ें', 'शिक्षकों और विद्वानों को दान दें'],
        deity: 'वेदव्यास',
      },
      sa: {
        name: 'गुरुपूर्णिमा',
        description: 'गुरुपूजनदिवसः',
        significance: 'आषाढपूर्णिमायां गुरवः पूज्यन्ते। व्यासपूर्णिमारूपेण वेदव्यासस्य जन्मदिवसः अयम्। बौद्धाः बुद्धस्य प्रथमोपदेशं स्मरन्ति।',
        rituals: ['गुरुव्यासपूजनम्', 'गुरुभ्यः पुष्पफलार्पणम्', 'गुरुपादपूजा', 'सत्सङ्गप्रवचनभागित्वम्', 'गुरुभ्यः विद्वद्भ्यश्च दानम्'],
        deity: 'वेदव्यासः',
      },
      kn: {
        name: 'ಗುರು ಪೂರ್ಣಿಮೆ',
        description: 'ಗುರುವಿನ ದಿನ',
        significance: 'ಗುರುಗಳಿಗೆ, ಕತ್ತಲೆಯನ್ನು ನೀಗಿ ಬೋಧಿಸುವವರಿಗೆ ಮೀಸಲಾದ ಹುಣ್ಣಿಮೆ. ವೇದವ್ಯಾಸರ ಜನ್ಮದಿನವೆಂದು ವ್ಯಾಸ ಪೂರ್ಣಿಮೆಯಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಬೌದ್ಧರು ಬುದ್ಧನ ಮೊದಲ ಉಪದೇಶವನ್ನು ಸ್ಮರಿಸುತ್ತಾರೆ.',
        rituals: ['ಗುರು ಅಥವಾ ವ್ಯಾಸ ಪೂಜೆ ಮಾಡಿ', 'ಗುರುಗಳಿಗೆ ಹೂವು, ಹಣ್ಣು ಅರ್ಪಿಸಿ', 'ಗುರುವಿನ ಪಾದ ಪೂಜೆ ಮಾಡಿ', 'ಸತ್ಸಂಗ ಮತ್ತು ಪ್ರವಚನದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ', 'ಗುರುಗಳು ಮತ್ತು ವಿದ್ವಾಂಸರಿಗೆ ದಾನ ನೀಡಿ'],
        deity: 'ವೇದವ್ಯಾಸ',
      },
      te: {
        name: 'గురు పూర్ణిమ',
        description: 'గురువుల దినం',
        significance: 'గురువులను గౌరవించే రోజు. వేదవ్యాసుని జన్మదినంగా వ్యాసపూర్ణిమ అని కూడా అంటారు. విద్యనేర్పిన గురువులకు పూజ చేస్తారు.',
        rituals: ['గురువు లేదా వ్యాస పూజ చేయండి', 'గురువులకు పూలు పళ్లు సమర్పించండి', 'గురు పాదపూజ చేయండి', 'సత్సంగం ప్రవచనాలకు వెళ్లండి', 'గురువులకు దానం చేయండి'],
        deity: 'వేదవ్యాసుడు',
      },
      ta: {
        name: 'குரு பூர்ணிமா',
        description: 'குருவுக்குரிய நாள்',
        significance: 'குருமார்களையும் ஆசிரியர்களையும் போற்றும் நாள். வேத வியாசரின் பிறந்த நாளாகவும் கொண்டாடப்படுகிறது; அறியாமை நீக்கும் போதனையைப் போற்றும் விழா.',
        rituals: ['குரு வியாச பூஜை செய்', 'ஆசிரியருக்கு மலர் கனி தந்திடு', 'குரு பாத பூஜை செய்', 'சத்சங்க சொற்பொழிவில் கலந்துகொள்', 'ஆசிரியர்களுக்கு தானம் செய்'],
        deity: 'வேத வியாசர்',
      },
    },
    description: 'Day of the Guru',
    significance: 'Ashadha Purnima reserved for honoring gurus, spiritual guides who dispel darkness through teaching. Hindus observe it as Vyasa Purnima, the birth anniversary of Veda Vyasa, compiler of the Vedas and author of the Mahabharata; Buddhists honor the Buddha\'s first sermon at Sarnath.',
    rituals: ['Perform Guru or Vyasa puja', 'Offer flowers, fruits to teachers', 'Do padapuja of guru\'s feet', 'Attend satsang and discourses', 'Donate to teachers and scholars'],
    deity: 'Ved Vyasa',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 3, // Ashadha
    type: 'regional'
  },
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    nameHindi: 'हनुमान जयंती',
    i18n: {
      hi: {
        name: 'हनुमान जयंती',
        description: 'हनुमान का जन्मोत्सव',
        significance: 'राम भक्त हनुमान का जन्मदिन; भक्त व्रत रखकर मंदिर में चालीसा और सुंदरकांड का पाठ करते हैं।',
        rituals: ['दिनभर व्रत रखकर हनुमान मंदिर जाएं', 'हनुमान चालीसा और सुंदरकांड पढ़ें', 'सिंदूर, गेंदা, लड्डू अर्पित करें'],
        deity: 'हनुमान',
      },
      sa: {
        name: 'हनुमज्जयन्ती',
        description: 'हनुमज्जन्मदिवसः',
        significance: 'रामभक्तस्य हनुमतः जन्मदिवसः अयम्। बलभक्तिसेवानां प्रतीकः सः।',
        rituals: ['दिनव्रतं हनुमन्मन्दिरदर्शनं च', 'हनुमच्चालीसासुन्दरकाण्डपठनम्', 'सिन्दूरगेण्डुलड्डुकार्पणम्'],
        deity: 'हनुमान्',
      },
      kn: {
        name: 'ಹನುಮ ಜಯಂತಿ',
        description: 'ಹನುಮಂತನ ಜನ್ಮದಿನ',
        significance: 'ರಾಮನ ಪರಮ ಭಕ್ತ ಹನುಮಂತನ ಜನ್ಮದ ಆಚರಣೆ.',
        rituals: ['ದಿನವಿಡೀ ಉಪವಾಸವಿದ್ದು ಹನುಮ ದೇವಸ್ಥಾನಕ್ಕೆ ಭೇಟಿ ನೀಡಿ', 'ಹನುಮಾನ್ ಚಾಲೀಸಾ ಮತ್ತು ಸುಂದರಕಾಂಡ ಪಠಿಸಿ', 'ಸಿಂಧೂರ, ಚೆಂಡು ಹೂವು, ಲಡ್ಡು ಅರ್ಪಿಸಿ'],
        deity: 'ಹನುಮಂತ',
      },
      te: {
        name: 'హనుమాన్ జయంతి',
        description: 'హనుమంతుని జన్మదినం',
        significance: 'రామభక్తుడైన హనుమంతుని జన్మదినం. శక్తి భక్తి సేవకు ప్రతీకగా హనుమంతుని పూజిస్తారు.',
        rituals: ['ఉపవాసం ఉండి హనుమాన్ గుడికి వెళ్లండి', 'హనుమాన్ చాలీసా సుందరకాండ పఠించండి', 'సిందూరం బంతిపూలు లడ్డూలు సమర్పించండి'],
        deity: 'హనుమంతుడు',
      },
      ta: {
        name: 'அனுமன் ஜெயந்தி',
        description: 'அனுமன் பிறந்த நாள்',
        significance: 'ராமரின் பக்தரான அனுமனின் பிறந்த நாளைக் கொண்டாடும் விழா.',
        rituals: ['விரதமிருந்து அனுமன் கோயில் செல்', 'அனுமன் சாலீசா சுந்தரகாண்டம் படித்திடு', 'செந்தூரம் சாமந்தி லட்டு படைத்திடு'],
        deity: 'அனுமன்',
      },
    },
    description: 'Birth of Lord Hanuman',
    significance: 'Celebrates the birth of Lord Hanuman, the devoted disciple of Lord Rama.',
    rituals: ['Day-long fast and Hanuman temple visit', 'Recite Hanuman Chalisa and Sundarakanda', 'Offer sindoor, marigold, laddoo'],
    deity: 'Hanuman',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'minor'
  },
  {
    id: 'mahavir-jayanti',
    name: 'Mahavir Jayanti',
    nameHindi: 'महावीर जयंती',
    i18n: {
      hi: {
        name: 'महावीर जयंती',
        description: 'महावीर का जन्मोत्सव',
        significance: 'चौबीसवें तीर्थंकर वर्धमान महावीर का जन्म कल्याणक; अहिंसा, सत्य और अपरिग्रह का स्मरण होता है।',
        rituals: ['महावीर अभिषेक और मंदिर प्रार्थना करें', 'भजनों सहित रथयात्रा निकालें', 'दान, व्रत और मुनि प्रवचन करें'],
        deity: 'महावीर (जैन तीर्थंकर)',
      },
      sa: {
        name: 'महावीरजयन्ती',
        description: 'महावीरजन्मदिवसः',
        significance: 'जैनानां चतुर्विंशतीर्थङ्करस्य वर्धमानमहावीरस्य जन्मकल्याणकम्। अहिंसासत्यास्तेयब्रह्मचर्यापरिग्रहाः अत्र दृढीक्रियन्ते।',
        rituals: ['महावीराभिषेकमन्दिरप्रार्थना', 'स्तोत्रैः सह रथयात्रा', 'दानव्रतयतिप्रवचनानि'],
        deity: 'महावीरः',
      },
      kn: {
        name: 'ಮಹಾವೀರ ಜಯಂತಿ',
        description: 'ಮಹಾವೀರರ ಜನ್ಮದಿನ',
        significance: 'ವರ್ಧಮಾನ ಮಹಾವೀರರ ಜನ್ಮ ಕಲ್ಯಾಣಕ. ಅಹಿಂಸೆ, ಸತ್ಯ, ಅಸ್ತೇಯ, ಬ್ರಹ್ಮಚರ್ಯ ಮತ್ತು ಅಪರಿಗ್ರಹಗಳನ್ನು ಮೆರವಣಿಗೆ, ಪ್ರವಚನ, ದಾನ ಮತ್ತು ವ್ರತಗಳಿಂದ ಪುನಃ ಸಾರಲಾಗುತ್ತದೆ.',
        rituals: ['ಮಹಾವೀರ ಅಭಿಷೇಕ ಮತ್ತು ದೇವಸ್ಥಾನ ಪ್ರಾರ್ಥನೆ ಮಾಡಿ', 'ಭಜನೆಯೊಂದಿಗೆ ರಥಯಾತ್ರೆ ನಡೆಸಿ', 'ದಾನ, ವ್ರತ ಮತ್ತು ಮುನಿ ಪ್ರವಚನದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ'],
        deity: 'ಮಹಾವೀರ',
      },
      te: {
        name: 'మహావీర్ జయంతి',
        description: 'మహావీరుని జన్మదినం',
        significance: 'జైన మతానికి చెందిన వర్ధమాన మహావీరుని జన్మదినం. అహింస సత్యం త్యాగం విలువలను స్మరిస్తూ ఊరేగింపులు దానాలు చేస్తారు.',
        rituals: ['మహావీరునికి అభిషేకం గుడిపూజ చేయండి', 'భజనలతో రథయాత్రలో పాల్గొనండి', 'దానాలు వ్రతాలు సాధువుల ప్రవచనాలు వినండి'],
        deity: 'మహావీరుడు',
      },
      ta: {
        name: 'மகாவீர் ஜெயந்தி',
        description: 'மகாவீரர் பிறந்த நாள்',
        significance: 'இருபத்து நான்காம் தீர்த்தங்கரரான வர்த்தமான மகாவீரரின் பிறந்த நாள். அகிம்சை உண்மை துறவு நெறிகளை நினைவூட்டுகிறது; ஊர்வலம் சொற்பொழிவு தானத்துடன் கொண்டாடப்படுகிறது.',
        rituals: ['மகாவீரர் அபிஷேக வழிபாடு செய்', 'பாட்டுடன் தேர் ஊர்வலம் செல்', 'தானம் விரத சொற்பொழிவில் கலந்துகொள்'],
        deity: 'மகாவீரர்',
      },
    },
    description: 'Birth of Lord Mahavir',
    significance: 'Jain Janma Kalyanak marking the birth of Vardhamana Mahavira, 24th Tirthankara, at Kundagrama in Bihar. It reaffirms ahimsa, satya, asteya, brahmacharya and aparigraha through processions, discourses by monks, charity and vows, observed by Digambara and Shvetambara Jains.',
    rituals: ['Mahavira abhisheka and temple prayers', 'Rath Yatra with hymns', 'Charity, vows, monk discourses'],
    deity: 'Mahavira (Jain Tirthankara)',
    tithiNumber: 13,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'minor'
  },
  {
    id: 'buddha-purnima',
    name: 'Buddha Purnima',
    nameHindi: 'बुद्ध पूर्णिमा',
    i18n: {
      hi: {
        name: 'बुद्ध पूर्णिमा',
        description: 'बुद्ध का जन्मोत्सव',
        significance: 'गौतम बुद्ध के जन्म, बोधि और परिनिर्वाण की स्मृति का पावन दिन।',
        rituals: ['विहार जाएं, स्तूप की परिक्रमा करें', 'दान, शील पालन, दीप अर्पण करें', 'जन्म, बोधि, परिनिर्वाण का ध्यान करें'],
      },
      sa: {
        name: 'बुद्धपूर्णिमा',
        description: 'बुद्धजन्मदिवसः',
        significance: 'गौतमबुद्धस्य जन्मबोधिपरिनिर्वाणानि अस्यां पूर्णिमायां स्मर्यन्ते।',
        rituals: ['विहारदर्शनं स्तूपप्रदक्षिणा च', 'दानशीलपालनं दीपार्पणं च', 'जन्मबोधिपरिनिर्वाणध्यानम्'],
      },
      kn: {
        name: 'ಬುದ್ಧ ಪೂರ್ಣಿಮೆ',
        description: 'ಬುದ್ಧನ ಜನ್ಮದಿನ',
        significance: 'ಗೌತಮ ಬುದ್ಧನ ಜನ್ಮ, ಜ್ಞಾನೋದಯ ಮತ್ತು ಪರಿನಿರ್ವಾಣದ ಆಚರಣೆ.',
        rituals: ['ವಿಹಾರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಸ್ತೂಪ ಪ್ರದಕ್ಷಿಣೆ ಮಾಡಿ', 'ದಾನ, ಶೀಲ ಪಾಲಿಸಿ ದೀಪ ಅರ್ಪಿಸಿ', 'ಜನ್ಮ, ಜ್ಞಾನೋದಯ, ಪರಿನಿರ್ವಾಣವನ್ನು ಧ್ಯಾನಿಸಿ'],
      },
      te: {
        name: 'బుద్ధ పూర్ణిమ',
        description: 'బుద్ధుని జన్మదినం',
        significance: 'గౌతమ బుద్ధుని జననం జ్ఞానోదయం మహాపరినిర్వాణానికి గుర్తుగా జరుపుకుంటారు.',
        rituals: ['విహారానికి వెళ్లి స్తూప ప్రదక్షిణ చేయండి', 'దానం శీలం దీపదానం పాటించండి', 'జననం జ్ఞానోదయం పరినిర్వాణం స్మరించి ధ్యానం చేయండి'],
      },
      ta: {
        name: 'புத்த பூர்ணிமா',
        description: 'புத்தர் பிறந்த நாள்',
        significance: 'கௌதம புத்தரின் பிறப்பு, ஞானம், பரிநிர்வாணம் ஆகியவற்றைக் கொண்டாடும் நாள்.',
        rituals: ['விகாரை சென்று ஸ்தூபியை வலம் வா', 'தான தீப வழிபாடு செய்', 'பிறப்பு ஞானம் நினைந்து தியானி'],
      },
    },
    description: 'Birth of Lord Buddha',
    significance: 'Celebrates the birth, enlightenment, and parinirvana of Gautama Buddha.',
    rituals: ['Visit vihara, stupa circumambulation', 'Dana, sila observance, lamp offering', 'Meditation on birth, enlightenment, parinirvana'],
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 2, // Vaishakha
    type: 'minor'
  },

  // Additional Important Festivals
  {
    id: 'nag-panchami',
    name: 'Nag Panchami',
    nameHindi: 'नाग पंचमी',
    i18n: {
      hi: {
        name: 'नाग पंचमी',
        description: 'सर्प देवताओं की पूजा',
        significance: 'नाग देवताओं की उपासना; सर्प भय से रक्षा और कालसर्प दोष निवारण की मान्यता है।',
        rituals: ['सर्प विग्रहों को दूध अर्पित करें', 'बारह नाग नाम मंत्र जपें', 'महिलाएं परिवार कल्याण हेतु प्रार्थना करें'],
        deity: 'नाग (अनंत, वासुकि, तक्षक)',
      },
      sa: {
        name: 'नागपञ्चमी',
        description: 'नागदेवतापूजनम्',
        significance: 'नागदेवतानां पूजादिवसः। नागपूजनं सर्पभयात् रक्षति कालसर्पदोषं च हरति।',
        rituals: ['नागप्रतिमाभ्यः दुग्धार्पणम्', 'द्वादशनागनाममन्त्रजपः', 'कुटुम्बकल्याणाय स्त्रीणां प्रार्थना'],
        deity: 'नागाः',
      },
      kn: {
        name: 'ನಾಗ ಪಂಚಮಿ',
        description: 'ಸರ್ಪ ದೇವತೆಗಳ ಆರಾಧನೆ',
        significance: 'ನಾಗ ದೇವತೆಗಳಿಗೆ ಮೀಸಲು. ಹಾವಿನ ಪೂಜೆಯು ಹಾವಿನ ಭಯದಿಂದ ರಕ್ಷಣೆ ನೀಡಿ ಕಾಲಸರ್ಪ ದೋಷ ನಿವಾರಿಸುತ್ತದೆ.',
        rituals: ['ಹಾವಿನ ಮೂರ್ತಿಗಳಿಗೆ ಹಾಲು ಅರ್ಪಿಸಿ', 'ಹನ್ನೆರಡು ನಾಗ ನಾಮ ಮಂತ್ರ ಪಠಿಸಿ', 'ಕುಟುಂಬದ ಕ್ಷೇಮಕ್ಕಾಗಿ ಮಹಿಳೆಯರು ಪ್ರಾರ್ಥಿಸಿ'],
        deity: 'ನಾಗಗಳು',
      },
      te: {
        name: 'నాగ పంచమి',
        description: 'సర్పదేవతల పూజ',
        significance: 'నాగదేవతలకు అంకితం. పాములను పూజిస్తే పాము భయం తొలగి కుటుంబానికి రక్షణ కలుగుతుందని నమ్ముతారు.',
        rituals: ['నాగ విగ్రహాలకు పాలు పోయండి', 'పన్నెండు నాగుల పేర్ల మంత్రం పఠించండి', 'కుటుంబ క్షేమం కోసం ప్రార్థించండి'],
        deity: 'నాగదేవతలు',
      },
      ta: {
        name: 'நாக பஞ்சமி',
        description: 'நாக தெய்வ வழிபாடு',
        significance: 'நாக தெய்வங்களுக்குரிய நாள். பாம்பு வழிபாடு காப்பு தரும்; குடும்ப நலனுக்காகப் பெண்கள் வழிபடுகின்றனர்.',
        rituals: ['நாக சிலைகளுக்குப் பால் படை', 'பன்னிரு நாக மந்திரம் சொல்', 'குடும்ப நலன் வேண்டி வழிபடு'],
        deity: 'நாகர்கள்',
      },
    },
    description: 'Worship of Serpent Deities',
    significance: 'Dedicated to Naga (serpent) deities. Worship of snakes brings protection from snake bites and removes Kala Sarpa Dosha.',
    rituals: ['Offer milk to snake idols', 'Recite twelve Naga names mantra', 'Women pray for family welfare'],
    deity: 'Nagas (Ananta, Vasuki, Takshaka)',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'varalakshmi-vratam',
    name: 'Varalakshmi Vratam',
    nameHindi: 'वरलक्ष्मी व्रतम्',
    i18n: {
      hi: {
        name: 'वरलक्ष्मी व्रतम्',
        description: 'लक्ष्मी की पूजा',
        significance: 'पति के कल्याण और समृद्धि हेतु विवाहित स्त्रियों का व्रत; दक्षिण में अत्यंत शुभ माना जाता है।',
        rituals: ['पूर्णिमा से पूर्व शुक्रवार को व्रत रखें', 'कलश में वरलक्ष्मी पूजन करें', 'विवाहित स्त्रियां रक्षा धागा बाँधें'],
        deity: 'लक्ष्मी',
      },
      sa: {
        name: 'वरलक्ष्मीव्रतम्',
        description: 'लक्ष्मीव्रतम्',
        significance: 'पतिव्रताः पतुः कल्याणैश्वर्ययोः कृते वरलक्ष्मीव्रतं चरन्ति। दक्षिणभारते अत्यन्तं शुभं मतम्।',
        rituals: ['पूर्णिमापूर्वशुक्रवारव्रतम्', 'कलशेन वरलक्ष्मीपूजनम्', 'पतिव्रताभिः रक्षासूत्रबन्धनम्'],
        deity: 'लक्ष्मीः',
      },
      kn: {
        name: 'ವರಲಕ್ಷ್ಮಿ ವ್ರತ',
        description: 'ಲಕ್ಷ್ಮೀ ದೇವಿಯ ಆರಾಧನೆ',
        significance: 'ಪತಿಯ ಕ್ಷೇಮ ಮತ್ತು ಸಮೃದ್ಧಿಗಾಗಿ ವಿವಾಹಿತ ಮಹಿಳೆಯರು ಆಚರಿಸುತ್ತಾರೆ. ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ಅತ್ಯಂತ ಶುಭಕರ.',
        rituals: ['ಹುಣ್ಣಿಮೆಗೆ ಮುನ್ನ ಶುಕ್ರವಾರ ಉಪವಾಸವಿರಿ', 'ಕಳಸದಲ್ಲಿ ವರಲಕ್ಷ್ಮಿಯನ್ನು ಪೂಜಿಸಿ', 'ವಿವಾಹಿತ ಮಹಿಳೆಯರು ಪವಿತ್ರ ದಾರ ಕಟ್ಟಿ'],
        deity: 'ಲಕ್ಷ್ಮಿ',
      },
      te: {
        name: 'వరలక్ష్మీ వ్రతం',
        description: 'లక్ష్మీదేవి పూజ',
        significance: 'భర్త శ్రేయస్సు కుటుంబ ఐశ్వర్యం కోసం వివాహితలు చేసే వ్రతం. దక్షిణాదిలో చాలా శుభప్రదంగా భావిస్తారు.',
        rituals: ['శుక్రవారం ఉపవాసం ఉండండి', 'కలశంలో వరలక్ష్మిని పూజించండి', 'తోరం కట్టుకోండి'],
        deity: 'లక్ష్మి',
      },
      ta: {
        name: 'வரலட்சுமி விரதம்',
        description: 'லட்சுமி அம்மன் வழிபாடு',
        significance: 'கணவரின் நலன் குடும்பச் செழிப்பு வேண்டி மணமான பெண்கள் நோற்கும் விரதம். தென்னிந்தியாவில் மிகவும் சிறப்பானது.',
        rituals: ['வெள்ளியன்று விரதம் இரு', 'கலசத்தில் வரலட்சுமி பூஜை செய்', 'புனித நூல் கட்டிக்கொள்'],
        deity: 'லட்சுமி',
      },
    },
    description: 'Worship of Goddess Lakshmi',
    significance: 'Observed by married women for the well-being and prosperity of their husbands. Highly auspicious in South India.',
    rituals: ['South India Friday fast before Purnima', 'Kalasha puja to Varalakshmi', 'Married women tie sacred thread'],
    deity: 'Lakshmi (as Varalakshmi)',
    tithiNumber: 13,
    paksha: 'Shukla',
    month: 5, // Shravana (Friday before Purnima)
    type: 'major',
    region: ['South India', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh']
  },
  {
    id: 'krishna-jayanti',
    name: 'Krishna Jayanti',
    nameHindi: 'कृष्ण जयंती',
    i18n: {
      hi: {
        name: 'कृष्ण जयंती',
        description: 'जन्माष्टमी का ही नाम',
        significance: 'कृष्ण जन्म का उत्सव; व्रत, प्रार्थना और मध्यरात्रि पूजन से मनाया जाता है।',
        rituals: ['दिनभर व्रत रखकर मध्यरात्रि तोड़ें', 'कृष्ण अभिषेक और भजन करें', 'भागवत जन्म प्रसंग का पाठ करें'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'कृष्णजयन्ती',
        description: 'कृष्णजन्मदिवसः',
        significance: 'श्रीकृष्णजन्मोत्सवः। भक्ताः उपोष्य मध्यरात्रौ जन्मोत्सवं कुर्वन्ति।',
        rituals: ['मध्यरात्रिपर्यन्तं दिनव्रतम्', 'कृष्णाभिषेकभजनानि', 'भागवतजन्माध्यायपठनम्'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಕೃಷ್ಣ ಜಯಂತಿ',
        description: 'ಜನ್ಮಾಷ್ಟಮಿಯ ಮತ್ತೊಂದು ಹೆಸರು',
        significance: 'ಕೃಷ್ಣನ ಜನ್ಮದ ಆಚರಣೆ. ಉಪವಾಸ, ಪ್ರಾರ್ಥನೆ ಮತ್ತು ಮಧ್ಯರಾತ್ರಿಯ ಸಂಭ್ರಮದಿಂದ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಹಗಲು ಉಪವಾಸವಿದ್ದು ಮಧ್ಯರಾತ್ರಿ ಮುರಿಯಿರಿ', 'ಕೃಷ್ಣ ಅಭಿಷೇಕ ಮತ್ತು ಭಜನೆ ಮಾಡಿ', 'ಭಾಗವತದ ಜನ್ಮ ಅಧ್ಯಾಯ ಪಠಿಸಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'కృష్ణ జయంతి',
        description: 'జన్మాష్టమికి మరో పేరు',
        significance: 'కృష్ణుని జన్మదిన వేడుక. ఉపవాసం ప్రార్థన అర్ధరాత్రి సంబరాలతో జరుపుకుంటారు.',
        rituals: ['అర్ధరాత్రి వరకు ఉపవాసం ఉండండి', 'కృష్ణునికి అభిషేకం భజనలు చేయండి', 'భాగవతంలో కృష్ణ జనన ఘట్టం పఠించండి'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'கிருஷ்ண ஜெயந்தி',
        description: 'ஜென்மாஷ்டமியின் மறுபெயர்',
        significance: 'கிருஷ்ணர் பிறந்த நாள். விரதம், வழிபாடு, நள்ளிரவுக் கொண்டாட்டங்களுடன் கொண்டாடப்படுகிறது.',
        rituals: ['நள்ளிரவு வரை பகல் விரதம் இரு', 'கிருஷ்ண அபிஷேக பஜனை செய்', 'பாகவதப் பிறப்புப் பகுதி படித்திடு'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Another name for Janmashtami',
    significance: 'Celebrates the birth of Lord Krishna. Observed with fasting, prayers, and midnight celebrations.',
    rituals: ['Day fast broken at midnight', 'Krishna abhisheka and bhajans', 'Recite Bhagavata birth chapter'],
    deity: 'Krishna',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'ganesh-jayanti',
    name: 'Ganesh Jayanti',
    nameHindi: 'गणेश जयंती',
    i18n: {
      hi: {
        name: 'गणेश जयंती',
        description: 'गणेश का जन्मोत्सव',
        significance: 'गणेश जन्म की वैकल्पिक तिथि; महाराष्ट्र और पश्चिम भारत में विशेष पूजन होता है।',
        rituals: ['चतुर्थी का व्रत रखें', 'मध्याह्न में गणेश अभिषेक और तिल-कुंड करें', 'गणपति अथर्वशीर्ष का पाठ करें'],
        deity: 'गणेश',
      },
      sa: {
        name: 'गणेशजयन्ती',
        description: 'गणेशजन्मदिवसः',
        significance: 'माघशुक्लचतुर्थ्यां गणेशजन्मोत्सवः। महाराष्ट्रपश्चिमभारते विशेषेण आचर्यते।',
        rituals: ['माघशुक्लचतुर्थ्यां व्रतम्', 'मध्याह्ने गणेशाभिषेकतिलकुण्डहवनम्', 'गणपत्यथर्वशीर्षपठनम्'],
        deity: 'गणेशः',
      },
      kn: {
        name: 'ಗಣೇಶ ಜಯಂತಿ',
        description: 'ಗಣೇಶನ ಜನ್ಮದಿನ',
        significance: 'ಗಣೇಶನ ಜನ್ಮವನ್ನು ಆಚರಿಸುವ ಪರ್ಯಾಯ ದಿನ. ಮಹಾರಾಷ್ಟ್ರ ಮತ್ತು ಪಶ್ಚಿಮ ಭಾರತದಲ್ಲಿ ವಿಶೇಷ ಆಚರಣೆ.',
        rituals: ['ಮಾಘ ಶುಕ್ಲ ಚತುರ್ಥಿಯಂದು ಉಪವಾಸವಿರಿ', 'ಮಧ್ಯಾಹ್ನ ಗಣೇಶ ಅಭಿಷೇಕ ಮತ್ತು ಎಳ್ಳಿನ ನೈವೇದ್ಯ ಮಾಡಿ', 'ಗಣಪತಿ ಅಥರ್ವಶೀರ್ಷ ಪಠಿಸಿ'],
        deity: 'ಗಣೇಶ',
      },
      te: {
        name: 'గణేశ్ జయంతి',
        description: 'వినాయకుని జన్మదినం',
        significance: 'వినాయకుని జన్మదినంగా మహారాష్ట్రలో జరుపుకునే మరో తిథి. ఆటంకాలు తొలగాలని వినాయకుని పూజిస్తారు.',
        rituals: ['చవితి రోజు ఉపవాసం ఉండండి', 'మధ్యాహ్నం గణపతికి అభిషేకం చేయండి', 'గణపతి అథర్వశీర్షం పఠించండి'],
        deity: 'గణేశ్',
      },
      ta: {
        name: 'விநாயகர் ஜெயந்தி',
        description: 'விநாயகர் பிறந்த நாள்',
        significance: 'விநாயகரின் பிறப்பைக் கொண்டாடும் மற்றொரு நாள். மகாராஷ்டிரம் மேற்கிந்தியாவில் சிறப்பாகக் கொண்டாடப்படுகிறது.',
        rituals: ['விரதம் இரு', 'நண்பகலில் விநாயக அபிஷேகம் செய்', 'கணபதி அதர்வசீர்ஷம் படித்திடு'],
        deity: 'விநாயகர்',
      },
    },
    description: 'Birth of Lord Ganesha (Magha Shukla 4)',
    significance: 'Alternative date for celebrating Lord Ganesha\'s birth. Particularly observed in Maharashtra and Western India.',
    rituals: ['Maharashtra Magha Shukla Chaturthi fast', 'Midday Ganesh abhisheka and til-kund', 'Recite Ganapati Atharvashirsha'],
    deity: 'Ganesha',
    tithiNumber: 4,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'minor',
    region: ['Maharashtra', 'Western India']
  },
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya',
    nameHindi: 'अक्षय तृतीया',
    i18n: {
      hi: {
        name: 'अक्षय तृतीया',
        description: 'अक्षय तृतीय दिवस',
        significance: 'अत्यंत शुभ दिन; स्वर्ण क्रय, नए कार्य और पूजन से अक्षय पुण्य की मान्यता है।',
        rituals: ['व्रत सहित लक्ष्मीनारायण पूजें', 'स्वर्ण खरीदें, नए कार्य आरंभ करें', 'दान, तर्पण, पवित्र स्नान करें'],
        deity: 'विष्णु सहित लक्ष्मी (लक्ष्मीनारायण)',
      },
      sa: {
        name: 'अक्षयतृतीया',
        description: 'अक्षयतृतीयापर्व',
        significance: 'अतिशुभदिवसः अयम्। सुवर्णक्रयणं नवकार्यारम्भः पूजनं च अक्षयपुण्यं ददति।',
        rituals: ['व्रतेन सह लक्ष्मीनारायणपूजनम्', 'सुवर्णक्रयणं कार्यारम्भश्च', 'दानतर्पणपुण्यस्नानानि'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ಅಕ್ಷಯ ತೃತೀಯ',
        description: 'ಅಕ್ಷಯವಾದ ಮೂರನೇ ದಿನ',
        significance: 'ಅತ್ಯಂತ ಶುಭ ದಿನಗಳಲ್ಲಿ ಒಂದು. ಚಿನ್ನ ಖರೀದಿ, ಹೊಸ ಕೆಲಸ ಆರಂಭ ಮತ್ತು ಪೂಜೆಗಳು ಅಕ್ಷಯ ಪುಣ್ಯ ನೀಡುತ್ತವೆ.',
        rituals: ['ಉಪವಾಸವಿದ್ದು ಲಕ್ಷ್ಮೀನಾರಾಯಣರನ್ನು ಪೂಜಿಸಿ', 'ಚಿನ್ನ ಖರೀದಿಸಿ ಹೊಸ ಕೆಲಸ ಆರಂಭಿಸಿ', 'ದಾನ, ತರ್ಪಣ ಮತ್ತು ಪವಿತ್ರ ಸ್ನಾನ ಮಾಡಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'అక్షయ తృతీయ',
        description: 'ఎప్పటికీ తరగని తదియ',
        significance: 'అత్యంత శుభదినం. బంగారం కొనడం కొత్త పనులు మొదలుపెట్టడం పూజలు చేయడం అక్షయ ఫలితం ఇస్తుందని నమ్ముతారు.',
        rituals: ['లక్ష్మీనారాయణులను పూజించి ఉపవాసం ఉండండి', 'బంగారం కొనండి కొత్త పనులు మొదలుపెట్టండి', 'దానం తర్పణం పుణ్యస్నానం చేయండి'],
        deity: 'విష్ణు మరియు లక్ష్మి',
      },
      ta: {
        name: 'அட்சய திருதியை',
        description: 'அழியாப் பலன் தரும் நாள்',
        significance: 'மிகவும் மங்கலமான நாட்களில் ஒன்று. தங்கம் வாங்குதல், புது முயற்சி தொடங்குதல், தானம் வழிபாடு முடிவற்ற பலன் தரும்.',
        rituals: ['லட்சுமி நாராயணரை வழிபட்டு விரதம் இரு', 'தங்கம் வாங்கு முயற்சி தொடங்கு', 'தான தர்ப்பண புனித நீராடல் செய்'],
        deity: 'விஷ்ணு மற்றும் லட்சுமி',
      },
    },
    description: 'Eternal Third Day',
    significance: 'One of the most auspicious days. Buying gold, starting new ventures, and performing pujas brings endless merit.',
    rituals: ['Worship Lakshminarayana with fast', 'Buy gold, start ventures', 'Charity, tarpan, holy dip'],
    deity: 'Vishnu with Lakshmi (Lakshminarayana)',
    tithiNumber: 3,
    paksha: 'Shukla',
    month: 2, // Vaishakha
    type: 'major'
  },
  {
    id: 'vat-purnima',
    name: 'Vat Purnima',
    nameHindi: 'वट पूर्णिमा',
    i18n: {
      hi: {
        name: 'वट पूर्णिमा',
        description: 'विवाहित स्त्रियों का पर्व',
        significance: 'पति की दीर्घायु हेतु विवाहित स्त्रियां वट वृक्ष का व्रत-पूजन करती हैं।',
        rituals: ['विवाहित स्त्रियां व्रत रखें', 'वट की परिक्रमा कर धागा बाँधें', 'सावित्री-सत्यवान कथा सुनें'],
        deity: 'सावित्री (वट वृक्ष)',
      },
      sa: {
        name: 'वटपूर्णिमा',
        description: 'पतिव्रतानां वटपूजनम्',
        significance: 'पतिव्रताः पतुः दीर्घायुषः कृते वटवृक्षं पूजयन्ति। सावित्रीसत्यवत्कथा श्रूयते।',
        rituals: ['पतिव्रतानां व्रतधारणम्', 'वटप्रदक्षिणा सूत्रबन्धनं च', 'सावित्रीसत्यवत्कथाश्रवणम्'],
        deity: 'सावित्री',
      },
      kn: {
        name: 'ವಟ ಪೂರ್ಣಿಮೆ',
        description: 'ವಿವಾಹಿತ ಮಹಿಳೆಯರ ಹಬ್ಬ',
        significance: 'ಪತಿಯ ದೀರ್ಘಾಯುಷ್ಯಕ್ಕಾಗಿ ವಿವಾಹಿತ ಮಹಿಳೆಯರು ಉಪವಾಸವಿದ್ದು ಆಲದ ಮರವನ್ನು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ವಿವಾಹಿತ ಮಹಿಳೆಯರು ಉಪವಾಸವಿರಿ', 'ಆಲದ ಮರಕ್ಕೆ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ ದಾರ ಕಟ್ಟಿ', 'ಸಾವಿತ್ರಿ-ಸತ್ಯವಾನ್ ಕಥೆ ಕೇಳಿ'],
        deity: 'ಸಾವಿತ್ರಿ',
      },
      te: {
        name: 'వట పూర్ణిమ',
        description: 'వివాహితల పండుగ',
        significance: 'భర్త ఆయుష్షు కోసం వివాహితలు మర్రిచెట్టును పూజించి ఉపవాసం చేస్తారు.',
        rituals: ['వివాహితలు ఉపవాసం ఉండండి', 'మర్రిచెట్టు చుట్టూ ప్రదక్షిణ చేసి దారం కట్టండి', 'సావిత్రి సత్యవంతుల కథ వినండి'],
        deity: 'సావిత్రి',
      },
      ta: {
        name: 'வட பூர்ணிமா',
        description: 'மணமான பெண்களின் விழா',
        significance: 'கணவரின் நீண்ட ஆயுள் வேண்டி மணமான பெண்கள் ஆலமரத்தை வழிபட்டு விரதம் நோற்கும் நாள்.',
        rituals: ['விரதம் இரு', 'ஆலமரத்தை வலம் வந்து நூல் கட்டு', 'சாவித்திரி கதை கேட்டிடு'],
        deity: 'சாவித்திரி',
      },
    },
    description: 'Festival of Married Women',
    significance: 'Married women observe fast and worship the banyan tree for the long life of their husbands.',
    rituals: ['Maharashtra-Gujarat married women fast', 'Circumambulate banyan, tie thread', 'Hear Savitri-Satyavan katha'],
    deity: 'Savitri (banyan/vata vriksha)',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 3, // Jyeshtha
    type: 'minor',
    region: ['Western India', 'Maharashtra', 'Gujarat']
  },
  {
    id: 'rakhi-purnima',
    name: 'Raksha Bandhan / Rakhi Purnima',
    nameHindi: 'रक्षाबंधन',
    i18n: {
      hi: {
        name: 'रक्षा बंधन / राखी पूर्णिमा',
        description: 'पवित्र धागा समारोह',
        significance: 'बहन भाई की कलाई पर राखी बाँधती है; भाई-बहन के रक्षा बंधन का उत्सव है।',
        rituals: ['बहन राखी बाँधकर तिलक लगाएं', 'भाई रक्षा वचन देकर उपहार दें', 'भद्रा टालें; अपराह्न को प्राथमिकता दें'],
      },
      sa: {
        name: 'राखीपूर्णिमा',
        description: 'रक्षासूत्रसंस्कारः',
        significance: 'भगिन्यः भ्रातृभ्यः राखीं बध्नन्ति। भ्रातृभगिन्योः रक्षाबन्धः अत्र उत्सव्यते।',
        rituals: ['भगिन्या राखीबन्धनं तिलकं च', 'भ्रातुः रक्षाप्रतिज्ञा उपहारदानं च', 'भद्रापरिहारः अपराह्णप्राधान्यं च'],
      },
      kn: {
        name: 'ರಕ್ಷಾ ಬಂಧನ / ರಾಖಿ ಪೂರ್ಣಿಮೆ',
        description: 'ಪವಿತ್ರ ದಾರದ ಆಚರಣೆ',
        significance: 'ಸಹೋದರಿಯರು ಸಹೋದರರ ಮಣಿಕಟ್ಟಿಗೆ ರಾಖಿ ಕಟ್ಟುತ್ತಾರೆ. ಒಡಹುಟ್ಟಿದವರ ರಕ್ಷಣಾ ಬಂಧವನ್ನು ಸಂಭ್ರಮಿಸುತ್ತದೆ.',
        rituals: ['ಸಹೋದರಿ ರಾಖಿ ಕಟ್ಟಿ ತಿಲಕವಿಡಿ', 'ಸಹೋದರ ರಕ್ಷಣೆಯ ಮಾತು ನೀಡಿ ಉಡುಗೊರೆ ನೀಡಿ', 'ಭದ್ರಾ ತಪ್ಪಿಸಿ ಮಧ್ಯಾಹ್ನಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ'],
      },
      te: {
        name: 'రాఖీ పూర్ణిమ',
        description: 'పవిత్ర దారాల వేడుక',
        significance: 'అన్నాచెల్లెళ్ల రక్షణ బంధానికి గుర్తు. సోదరీమణులు సోదరుని చేతికి రాఖీ కడతారు.',
        rituals: ['సోదరికి తిలకం దిద్ది రాఖీ కట్టండి', 'సోదరులు రక్షణ మాట ఇచ్చి బహుమతి ఇవ్వండి', 'భద్ర వదిలి మధ్యాహ్నం జరుపుకోండి'],
      },
      ta: {
        name: 'ரக்ஷா பந்தன் ராக்கி பூர்ணிமா',
        description: 'புனித நூல் சடங்கு',
        significance: 'சகோதரிகள் சகோதரர்களின் கைகளில் ராக்கி கட்டும் நாள். உடன்பிறப்புகளின் காக்கும் பிணைப்பைக் கொண்டாடுகிறது.',
        rituals: ['ராக்கி கட்டித் திலகமிடு', 'காக்க உறுதி தந்து பரிசளி', 'பிற்பகலில் கொண்டாடு'],
      },
    },
    description: 'Sacred Thread Ceremony',
    significance: 'Sisters tie rakhi on brothers\' wrists. Celebrates the protective bond between siblings.',
    rituals: ['Sister ties rakhi, applies tilak', 'Brother vows protection, gives gift', 'Avoid Bhadra; prefer Aparahna'],
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'sharad-purnima',
    name: 'Sharad Purnima',
    nameHindi: 'शरद पूर्णिमा',
    i18n: {
      hi: {
        name: 'शरद पूर्णिमा',
        description: 'शरद की पूर्णिमा',
        significance: 'चंद्रमा से अमृत वर्षा की मान्यता वाली रात्रि; चांदनी में रखी खीर ग्रहण की जाती है।',
        rituals: ['चंद्र और लक्ष्मी पूजन करें', 'खीर रातभर चांदनी में रखें', 'ब्रज महारास का स्मरण करें'],
        deity: 'चंद्र और लक्ष्मी',
      },
      sa: {
        name: 'शरत्पूर्णिमा',
        description: 'शरत्पूर्णिमा',
        significance: 'अस्यां रात्रौ चन्द्रः अमृतं वर्षतीति मतम्। खीरं चन्द्रिकायां स्थाप्यते।',
        rituals: ['चन्द्रलक्ष्मीपूजनम्', 'रात्रौ चन्द्रिकायां खीरस्थापनम्', 'व्रजे महारासस्मरणम्'],
        deity: 'चन्द्रः',
      },
      kn: {
        name: 'ಶರದ್ ಪೂರ್ಣಿಮೆ',
        description: 'ಶರತ್ಕಾಲದ ಹುಣ್ಣಿಮೆ',
        significance: 'ಚಂದ್ರನು ಅಮೃತ ಸುರಿಸುವ ರಾತ್ರಿಯೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ಅಮೃತ ಹೀರಲೆಂದು ಕೀರನ್ನು ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿಡಲಾಗುತ್ತದೆ.',
        rituals: ['ಚಂದ್ರ ಮತ್ತು ಲಕ್ಷ್ಮಿಯನ್ನು ಪೂಜಿಸಿ', 'ಕೀರನ್ನು ರಾತ್ರಿಯಿಡೀ ಚಂದ್ರನ ಬೆಳಕಿನಲ್ಲಿಡಿ', 'ಬ್ರಜ್ ಮಹಾ-ರಾಸವನ್ನು ಸ್ಮರಿಸಿ'],
        deity: 'ಚಂದ್ರ',
      },
      te: {
        name: 'శరద్ పూర్ణిమ',
        description: 'శరత్కాల వెన్నెల',
        significance: 'చంద్రుడు అమృతం కురిపించే రాత్రిగా భావిస్తారు. వెన్నెల్లో ఉంచిన పాయసం అమృతమవుతుందని నమ్ముతారు.',
        rituals: ['చంద్రుడు లక్ష్మిని పూజించండి', 'పాయసం వెన్నెల్లో ఉంచండి', 'బ్రజ్ మహారాసాన్ని స్మరించండి'],
        deity: 'చంద్రుడు మరియు లక్ష్మి',
      },
      ta: {
        name: 'சரத் பூர்ணிமா',
        description: 'இலையுதிர் முழுநிலவு',
        significance: 'நிலவு அமுதம் பொழியும் இரவாகக் கருதப்படுகிறது. நிலவொளியில் வைத்த பால் பாயசம் அமுதத்தை ஏற்பதாக நம்பிக்கை.',
        rituals: ['சந்திர லட்சுமி பூஜை செய்', 'பாயசத்தை நிலவொளியில் வைத்திடு', 'பிருந்தாவன ராஸத்தை நினைத்திடு'],
        deity: 'சந்திரன் மற்றும் லட்சுமி',
      },
    },
    description: 'Autumn Full Moon',
    significance: 'Considered the night when the moon showers nectar. Kheer is left under moonlight to absorb the nectar.',
    rituals: ['Moon-Chandra and Lakshmi puja', 'Keep kheer under moonlight overnight', 'Brij Maha-Raas remembrance'],
    deity: 'Chandra (Moon) and Lakshmi',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 7, // Ashwin
    type: 'major'
  },
  {
    id: 'kartik-purnima',
    name: 'Kartik Purnima',
    nameHindi: 'कार्तिक पूर्णिमा',
    i18n: {
      hi: {
        name: 'कार्तिक पूर्णिमा',
        description: 'त्रिपुरी पूर्णिमा',
        significance: 'त्रिपुरासुर पर शिव की विजय की स्मृति वाली पवित्र पूर्णिमा; पवित्र नदियों में स्नान और दीपदान होता है।',
        rituals: ['प्रातः गंगा में पवित्र स्नान करें', 'मिट्टी के दीप जलाएं', 'तुलसी-शालिग्राम विवाह संपन्न करें'],
        deity: 'शिव (त्रिपुरारी) और विष्णु',
      },
      sa: {
        name: 'कार्तिकपूर्णिमा',
        description: 'कार्तिकपूर्णिमा',
        significance: 'कार्तिकमासस्य अतिपवित्रा पूर्णिमा। शिवः त्रिपुरासुरं जघान। पुण्यनदीस्नानं क्रियते।',
        rituals: ['प्रातः गङ्गायां पुण्यस्नानम्', 'मृद्दीपप्रज्वालनम् (देवदीपावली)', 'तुलसीशालिग्रामविवाहसमापनम्'],
        deity: 'शिवः',
      },
      kn: {
        name: 'ಕಾರ್ತಿಕ ಪೂರ್ಣಿಮೆ',
        description: 'ತ್ರಿಪುರಿ ಪೂರ್ಣಿಮೆ',
        significance: 'ಕಾರ್ತಿಕದ ಅತ್ಯಂತ ಪವಿತ್ರ ಹುಣ್ಣಿಮೆ. ಭಕ್ತರು ಪವಿತ್ರ ನದಿಗಳಲ್ಲಿ ಸ್ನಾನ ಮಾಡುತ್ತಾರೆ. ತ್ರಿಪುರಾಸುರನ ಮೇಲೆ ಶಿವನ ವಿಜಯವನ್ನು ಸಂಭ್ರಮಿಸುತ್ತದೆ.',
        rituals: ['ಮುಂಜಾನೆ ಗಂಗೆಯಲ್ಲಿ ಪವಿತ್ರ ಸ್ನಾನ ಮಾಡಿ', 'ಮಣ್ಣಿನ ದೀಪ ಹಚ್ಚಿ', 'ತುಳಸಿ-ಶಾಲಿಗ್ರಾಮ ವಿವಾಹ ಮುಕ್ತಾಯಗೊಳಿಸಿ'],
        deity: 'ಶಿವ',
      },
      te: {
        name: 'కార్తీక పూర్ణిమ',
        description: 'త్రిపురి పూర్ణిమ',
        significance: 'కార్తీక మాసంలో పవిత్రమైన వెన్నెల. త్రిపురాసురునిపై శివుని విజయానికి గుర్తు. పుణ్యనదీ స్నానం దీపదానం చేస్తారు.',
        rituals: ['తెల్లవారున గంగాస్నానం చేయండి', 'మట్టి ప్రమిదలు వెలిగించండి', 'తులసి సాలగ్రామ వివాహం ముగించండి'],
        deity: 'శివ మరియు విష్ణు',
      },
      ta: {
        name: 'கார்த்திகை பூர்ணிமா',
        description: 'திரிபுரி பூர்ணிமா',
        significance: 'கார்த்திகை மாத மிகப் புனித முழுநிலவு. புனித நதி நீராடல் சிறப்பானது. திரிபுராசுரனைச் சிவன் வென்றதைக் கொண்டாடுகிறது.',
        rituals: ['அதிகாலையில் கங்கையில் நீராடு', 'மண் விளக்குகள் ஏற்று', 'துளசி சாளக்கிராம திருமணம் நிறைவு செய்'],
        deity: 'சிவன் மற்றும் விஷ்ணு',
      },
    },
    description: 'Tripuri Purnima',
    significance: 'Highly sacred full moon in Kartik month. Devotees take holy dip in sacred rivers. Celebrates victory of Lord Shiva over demon Tripurasura.',
    rituals: ['Holy dip in Ganga at dawn', 'Light earthen lamps (Dev Diwali)', 'Tulasi-Shaligram vivah conclusion'],
    deity: 'Shiva (Tripurari) and Vishnu',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major'
  },
  {
    id: 'prabodhini-ekadashi',
    name: 'Prabodhini Ekadashi',
    nameHindi: 'प्रबोधिनी एकादशी',
    i18n: {
      hi: {
        name: 'प्रबोधिनी एकादशी',
        description: 'विष्णु का जागरण',
        significance: 'चातुर्मास की समाप्ति पर विष्णु के जागरण का दिन; इसके बाद विवाह आदि मांगलिक कार्य आरंभ होते हैं।',
        rituals: ['एकादशी व्रत रखें', 'विष्णु जागरण विधि करें', 'तुलसी विवाह आरंभ करें', 'चातुर्मास बाद विवाह आरंभ करें'],
        deity: 'विष्णु',
      },
      sa: {
        name: 'प्रबोधिनीएकादशी',
        description: 'विष्णुप्रबोधनैकादशी',
        significance: 'चातुर्मास्यसमाप्तिः। विष्णुः योगनिद्रातः प्रबुध्यते। विवाहोत्सवानां शुभारम्भः अयम्।',
        rituals: ['एकादशीव्रतम्', 'विष्णुप्रबोधनविधिः', 'तुलसीविवाहारम्भः', 'चातुर्मास्यानन्तरं विवाहारम्भः'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ಪ್ರಬೋಧಿನಿ ಏಕಾದಶಿ',
        description: 'ವಿಷ್ಣುವಿನ ಜಾಗರಣೆ',
        significance: 'ಚಾತುರ್ಮಾಸದ ಅಂತ್ಯ. ವಿಷ್ಣುವು ಯೋಗ ನಿದ್ರೆಯಿಂದ ಎಚ್ಚರಗೊಳ್ಳುತ್ತಾನೆ. ವಿವಾಹ ಮತ್ತು ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶುಭಕರ.',
        rituals: ['ಏಕಾದಶಿ ಉಪವಾಸವಿರಿ', 'ವಿಷ್ಣುವಿನ ಜಾಗರಣಾ ವಿಧಿಗಳನ್ನು ಮಾಡಿ', 'ತುಳಸಿ ವಿವಾಹ ಆರಂಭಿಸಿ', 'ಚಾತುರ್ಮಾಸದ ನಂತರ ವಿವಾಹ ಆರಂಭಿಸಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'ప్రబోధినీ ఏకాదశి',
        description: 'విష్ణువు మేల్కొనే రోజు',
        significance: 'నాలుగు నెలల చాతుర్మాసం ముగింపు. విష్ణువు యోగనిద్ర నుండి మేల్కొంటాడు. పెళ్లిళ్లు శుభకార్యాలకు అనుకూలం.',
        rituals: ['ఏకాదశి ఉపవాసం ఉండండి', 'విష్ణు మేల్కొలుపు పూజ చేయండి', 'తులసి వివాహం ప్రారంభించండి', 'చాతుర్మాసం తర్వాత పెళ్లిళ్లు చేయండి'],
        deity: 'విష్ణు',
      },
      ta: {
        name: 'பிரபோதினி ஏகாதசி',
        description: 'விஷ்ணு விழித்தெழும் நாள்',
        significance: 'நான்கு மாத மழைக்கால ஓய்வின் முடிவு. விஷ்ணு யோக நித்திரையிலிருந்து விழிக்கிறார். திருமணம் கொண்டாட்டங்களுக்கு மங்கலமான தொடக்கம்.',
        rituals: ['ஏகாதசி விரதம் இரு', 'விஷ்ணு விழிப்புச் சடங்கு செய்', 'துளசி கல்யாணம் தொடங்கு', 'திருமணங்களைத் தொடங்கு'],
        deity: 'விஷ்ணு',
      },
    },
    description: 'Awakening of Lord Vishnu',
    significance: 'Marks the end of Chaturmas (4 months of monsoon). Lord Vishnu awakens from cosmic sleep. Auspicious for weddings and celebrations.',
    rituals: ['Ekadashi fast', 'Vishnu awakening rites', 'Tulasi Vivah begins', 'Start weddings after Chaturmas'],
    deity: 'Vishnu',
    tithiNumber: 11,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major'
  },
  {
    id: 'bheeshma-ekadashi',
    name: 'Bheeshma Ekadashi',
    nameHindi: 'भीष्म एकादशी',
    i18n: {
      hi: {
        name: 'भीष्म एकादशी',
        description: 'भीष्म पितामह की एकादशी',
        significance: 'शरशय्या पर भीष्म द्वारा विष्णु सहस्रनाम उपदेश की स्मृति; विष्णु व्रत और सहस्रनाम पाठ का दिन।',
        rituals: ['विष्णु हेतु एकादशी व्रत रखें', 'विष्णु सहस्रनाम का पाठ करें', 'भीष्म को सम्मान सहित तर्पण दें'],
        deity: 'विष्णु',
      },
      sa: {
        name: 'भीष्मैकादशी',
        description: 'भीष्मैकादशी',
        significance: 'माघशुक्लैकादश्यां भीष्मः शरशय्यायां विष्णुसहस्रनाम उपदिश्य उत्तरायणे देहं त्यक्तवान्।',
        rituals: ['विष्णवे एकादशीव्रतम्', 'विष्णुसहस्रनामपठनम्', 'भीष्मस्मरणेन तर्पणम्'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ಭೀಷ್ಮ ಏಕಾದಶಿ',
        description: 'ಭೀಷ್ಮ ಪಿತಾಮಹರ ಏಕಾದಶಿ',
        significance: 'ಜಯ ಏಕಾದಶಿಯೆಂದೂ ಕರೆಯಲಾಗುತ್ತದೆ. ಶರಶಯ್ಯೆಯ ಮೇಲೆ ಭೀಷ್ಮರು ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಬೋಧಿಸಿ ಉತ್ತರಾಯಣಕ್ಕಾಗಿ ಕಾದ ಕಥೆಯೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದೆ. ವೈಷ್ಣವರು ಉಪವಾಸವಿದ್ದು ವಿಷ್ಣುವನ್ನು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ವಿಷ್ಣುವಿಗಾಗಿ ಏಕಾದಶಿ ಉಪವಾಸವಿರಿ', 'ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಿಸಿ', 'ಭೀಷ್ಮರಿಗೆ ತರ್ಪಣ ಅರ್ಪಿಸಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'భీష్మ ఏకాదశి',
        description: 'భీష్ముని ఏకాదశి',
        significance: 'అంపశయ్యపై భీష్ముడు విష్ణు సహస్రనామం ఉపదేశించిన రోజు. విష్ణుభక్తులు ఉపవాసం సహస్రనామ పారాయణం చేస్తారు.',
        rituals: ['విష్ణువు కోసం ఏకాదశి ఉపవాసం ఉండండి', 'విష్ణు సహస్రనామం పఠించండి', 'భీష్మునికి తర్పణం వదలండి'],
        deity: 'విష్ణు',
      },
      ta: {
        name: 'பீஷ்ம ஏகாதசி',
        description: 'பீஷ்மரின் ஏகாதசி',
        significance: 'பீஷ்மர் அம்புப் படுக்கையில் விஷ்ணு சகஸ்ரநாமம் உபதேசித்ததுடன் தொடர்புடைய ஏகாதசி. வைணவர்கள் விரதமிருந்து விஷ்ணுவை வழிபட்டு சகஸ்ரநாமம் படிக்கின்றனர்.',
        rituals: ['விஷ்ணுவுக்காக ஏகாதசி விரதம் இரு', 'விஷ்ணு சகஸ்ரநாமம் படித்திடு', 'பீஷ்மரைப் போற்றி நீர் தர்ப்பணம் செய்'],
        deity: 'விஷ்ணு',
      },
    },
    description: 'Ekadashi of Bheeshma Pitamah',
    significance: 'Magha Shukla Ekadashi, also called Jaya Ekadashi, linked to Bhishma on his arrow-bed teaching the Vishnu Sahasranama and awaiting Uttarayana for his passing. Vaishnavas keep Ekadashi fast, worship Vishnu, recite Sahasranama and observe Bhishma Panchaka discipline.',
    rituals: ['Ekadashi fast for Vishnu', 'Recite Vishnu Sahasranama', 'Offer tarpan honouring Bhishma'],
    deity: 'Vishnu',
    tithiNumber: 11,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'minor'
  },
  {
    id: 'vasant-panchami',
    name: 'Vasant Panchami / Saraswati Puja',
    nameHindi: 'वसंत पंचमी',
    i18n: {
      hi: {
        name: 'वसंत पंचमी',
        description: 'वसंत पर्व और सरस्वती पूजा',
        significance: 'सरस्वती को समर्पित दिन; वसंत आगमन पर विद्यार्थी और कलाकार विद्या हेतु पूजन करते हैं।',
        rituals: ['पूर्वाह्न में सरस्वती पूजा करें', 'विद्यार्थी पुस्तक-कलम अर्पित करें', 'पीले वस्त्र पहनें, वसंत मनाएं'],
        deity: 'सरस्वती',
      },
      sa: {
        name: 'वसन्तपञ्चमी',
        description: 'वसन्तोत्सवः सरस्वतीपूजा च',
        significance: 'सरस्वत्यै समर्पिता तिथिः। वसन्तागमनं ज्ञानसर्जनयोः च उत्सवः। छात्राः कलाकाराश्च पूजयन्ति।',
        rituals: ['पूर्वाह्णे सरस्वतीपूजनम्', 'छात्रैः पुस्तकलेखन्यर्पणम्', 'पीतवस्त्रधारणं वसन्तपालनं च'],
        deity: 'सरस्वती',
      },
      kn: {
        name: 'ವಸಂತ ಪಂಚಮಿ / ಸರಸ್ವತಿ ಪೂಜೆ',
        description: 'ವಸಂತ ಹಬ್ಬ ಮತ್ತು ಸರಸ್ವತಿ ಆರಾಧನೆ',
        significance: 'ಸರಸ್ವತಿಗೆ ಮೀಸಲು. ವಸಂತ ಆಗಮನವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಜ್ಞಾನ ಮತ್ತು ಸೃಜನಶೀಲತೆಗಾಗಿ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಕಲಾವಿದರು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ಮುಂಜಾನೆ ಸರಸ್ವತಿ ಪೂಜೆ ಮಾಡಿ', 'ವಿದ್ಯಾರ್ಥಿಗಳು ಪುಸ್ತಕ, ಲೇಖನಿ ಅರ್ಪಿಸಿ', 'ಹಳದಿ ಧರಿಸಿ ವಸಂತ ಆಚರಿಸಿ'],
        deity: 'ಸರಸ್ವತಿ',
      },
      te: {
        name: 'వసంత పంచమి',
        description: 'వసంత పండుగ సరస్వతీ పూజ',
        significance: 'సరస్వతీదేవికి అంకితం. వసంత రాకకు గుర్తు. విద్యార్థులు కళాకారులు జ్ఞానం కోసం పూజిస్తారు.',
        rituals: ['ఉదయం సరస్వతీ పూజ చేయండి', 'పుస్తకాలు పెన్నులు సమర్పించండి', 'పసుపు బట్టలు ధరించి వసంతం జరుపుకోండి'],
        deity: 'సరస్వతి',
      },
      ta: {
        name: 'வசந்த பஞ்சமி சரஸ்வதி பூஜை',
        description: 'இளவேனில் விழா சரஸ்வதி வழிபாடு',
        significance: 'சரஸ்வதிக்குரிய நாள். இளவேனிலின் வருகையைக் குறிக்கிறது. மாணவர்கள் கலைஞர்கள் அறிவு படைப்பாற்றல் வேண்டி வழிபடுகின்றனர்.',
        rituals: ['முற்பகலில் சரஸ்வதி பூஜை செய்', 'புத்தகம் எழுதுகோல் படைத்திடு', 'மஞ்சள் அணிந்து இளவேனில் கொண்டாடு'],
        deity: 'சரஸ்வதி',
      },
    },
    description: 'Spring Festival & Goddess Saraswati Worship',
    significance: 'Dedicated to Goddess Saraswati. Marks the arrival of spring. Students and artists worship for knowledge and creativity.',
    rituals: ['Saraswati puja in forenoon', 'Students offer books, pens', 'Wear yellow, spring observance'],
    deity: 'Saraswati',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'major'
  },
  {
    id: 'chhath-puja',
    name: 'Chhath Puja',
    nameHindi: 'छठ पूजा',
    i18n: {
      hi: {
        name: 'छठ पूजा',
        description: 'सूर्य उपासना',
        significance: 'सूर्य और छठी मैया को समर्पित प्राचीन पर्व; जल में खड़े होकर कठिन व्रत और अर्घ्य होता है।',
        rituals: ['छत्तीस घंटे निर्जल व्रत रखें', 'डूबते सूर्य को अर्घ्य दें', 'उगते सूर्य को उषा अर्घ्य दें'],
        deity: 'सूर्य और छठी मैया',
      },
      sa: {
        name: 'छठपूजा',
        description: 'सूर्योपासनापर्व',
        significance: 'सूर्याय छठीमातृकायै च समर्पितं प्राचीनं पर्व। कठोरव्रतेन जले स्थित्वा प्रार्थना क्रियते।',
        rituals: ['षट्त्रिंशत्घण्टात्मकं निर्जलव्रतम्', 'अस्तंगच्छते सूर्याय अर्घ्यदानम्', 'उदयते सूर्याय उषार्घ्यम्'],
        deity: 'सूर्यः',
      },
      kn: {
        name: 'ಛಠ್ ಪೂಜೆ',
        description: 'ಸೂರ್ಯ ದೇವರ ಆರಾಧನೆ',
        significance: 'ಸೂರ್ಯ ಮತ್ತು ಛಠೀ ಮೈಯಾಗೆ ಮೀಸಲಾದ ಪ್ರಾಚೀನ ಹಬ್ಬ. ನೀರಿನಲ್ಲಿ ನಿಂತು ಕಠಿಣ ಉಪವಾಸದಿಂದ ಪ್ರಾರ್ಥಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಮೂವತ್ತಾರು ಗಂಟೆ ನಿರ್ಜಲ ಉಪವಾಸವಿರಿ', 'ಮುಳುಗುವ ಸೂರ್ಯನಿಗೆ ಅರ್ಘ್ಯ ನೀಡಿ', 'ಉದಯಿಸುವ ಸೂರ್ಯನಿಗೆ ಉಷಾ ಅರ್ಘ್ಯ ನೀಡಿ'],
        deity: 'ಸೂರ್ಯ',
      },
      te: {
        name: 'ఛట్ పూజ',
        description: 'సూర్యుని ఆరాధన',
        significance: 'సూర్యునికి ఛఠీమయ్యకు అంకితమైన పండుగ. కఠిన ఉపవాసంతో నీటిలో నిలబడి సూర్యునికి అర్ఘ్యం ఇస్తారు.',
        rituals: ['ముప్పై ఆరు గంటలు నిర్జల ఉపవాసం ఉండండి', 'అస్తమిస్తున్న సూర్యునికి అర్ఘ్యం ఇవ్వండి', 'ఉదయించే సూర్యునికి అర్ఘ్యం ఇవ్వండి'],
        deity: 'సూర్య మరియు ఛఠీమాత',
      },
      ta: {
        name: 'சட் பூஜை',
        description: 'சூரிய வழிபாடு',
        significance: 'சூரியனுக்கும் சட்தி மையாவுக்கும் உரிய பழமையான விழா. கடும் விரதத்துடன் நீரில் நின்று வழிபடப்படுகிறது.',
        rituals: ['கடும் நீரின்றி விரதம் இரு', 'மறையும் சூரியனுக்கு அர்க்கியம் தா', 'உதய சூரியனுக்கு அர்க்கியம் தா'],
        deity: 'சூரியன்',
      },
    },
    description: 'Sun God Worship',
    significance: 'Ancient festival dedicated to Surya (Sun God) and Chhathi Maiya. Observed with strict fasting and standing in water for prayers.',
    rituals: ['Bihar 36-hour nirjala fast', 'Arghya to setting sun', 'Usha Arghya to rising sun'],
    deity: 'Surya and Chhathi Maiya',
    tithiNumber: 6,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major',
    region: ['Bihar', 'Jharkhand', 'Eastern UP', 'North India']
  },
  {
    id: 'vishu',
    name: 'Vishu',
    nameHindi: 'विषु',
    i18n: {
      hi: {
        name: 'विषु',
        description: 'केरल नववर्ष',
        significance: 'मलयाली नववर्ष; विषुक्कणी प्रथम दर्शन, आतिशबाजी और festive भोजन की परंपरा है।',
        rituals: ['विषुक्कणी प्रथम दर्शन करें', 'दीप जलाएं, आतिशबाजी करें', 'festive सद्या भोजन करें'],
        deity: 'विष्णु (कृष्ण रूप)',
      },
      sa: {
        name: 'विषुः',
        description: 'केरळनववर्षम्',
        significance: 'मलयालिनां नववर्षम्। विषुक्कणिप्रथमदर्शनेन उत्सवः आरभ्यते।',
        rituals: ['विषुक्कणिप्रथमदर्शनम्', 'दीपप्रज्वालनं पटाखाविस्फोटश्च', 'सद्याभोजनोत्सवः'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ವಿಷು',
        description: 'ಕೇರಳ ಹೊಸ ವರ್ಷ',
        significance: 'ಮಲಯಾಳಿ ಹೊಸ ವರ್ಷ. ವಿಷು ಕಣಿ ಮೊದಲ ದರ್ಶನ, ಪಟಾಕಿ ಮತ್ತು ಹಬ್ಬದ ಊಟದಿಂದ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ವಿಷು ಕಣಿ ಮೊದಲ ದರ್ಶನ ಮಾಡಿ', 'ದೀಪ ಹಚ್ಚಿ ಪಟಾಕಿ ಸಿಡಿಸಿ', 'ಹಬ್ಬದ ಸದ್ಯ ಊಟ ಸವಿಯಿರಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'విషువు',
        description: 'కేరళ కొత్త సంవత్సరం',
        significance: 'మలయాళీ కొత్త సంవత్సరం. విషుకని మొదటి దర్శనం బాణాసంచా పండుగ భోజనంతో జరుపుకుంటారు.',
        rituals: ['విషుకని మొదటి దర్శనం చేయండి', 'దీపాలు వెలిగించి బాణాసంచా కాల్చండి', 'పండుగ సద్య భోజనం చేయండి'],
        deity: 'విష్ణు',
      },
      ta: {
        name: 'விஷு',
        description: 'கேரளப் புத்தாண்டு',
        significance: 'மலையாளப் புத்தாண்டு. விஷுக்கணி முதல் காட்சி, வாணவேடிக்கை, விருந்துடன் கொண்டாடப்படுகிறது.',
        rituals: ['விஷுக்கணி முதலில் கண்டிடு', 'விளக்கேற்றி வாணம் வெடித்திடு', 'விருந்து உண்டு மகிழ்ந்திடு'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Kerala New Year',
    significance: 'Malayali New Year celebrated with Vishu Kani (first sight), fireworks, and festive meals.',
    rituals: ['Kerala Vishu Kani first sight', 'Light lamps, fireworks', 'Festive sadya meal'],
    deity: 'Vishnu (as Krishna)',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 1, // Chaitra (Medam in Malayalam calendar)
    type: 'regional',
    region: ['Kerala']
  },
  {
    id: 'janmashtami-smart',
    name: 'Smarta Janmashtami',
    nameHindi: 'स्मार्त जन्माष्टमी',
    i18n: {
      hi: {
        name: 'स्मार्त जन्माष्टमी',
        description: 'जन्माष्टमी (स्मार्त परंपरा)',
        significance: 'स्मार्त परंपरा की कृष्ण जयंती; वैष्णव जन्माष्टमी से एक दिन पूर्व मनाई जाती है।',
        rituals: ['सूर्योदय अष्टमी से स्मार्त व्रत रखें', 'मध्यरात्रि कृष्ण जन्म विधि करें', 'वैष्णव अगले दिन मनाएं'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'स्मार्तजन्माष्टमी',
        description: 'स्मार्तकृष्णजयन्ती',
        significance: 'स्मार्तसम्प्रदायेन कृष्णजयन्ती आचर्यते। वैष्णवजन्माष्टम्याः पूर्वदिने भवति।',
        rituals: ['सूर्योदयाष्टमीमानन स्मार्तव्रतम्', 'मध्यरात्रौ कृष्णजन्मविधिः', 'परदिने वैष्णवानां पालनम्'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಸ್ಮಾರ್ತ ಜನ್ಮಾಷ್ಟಮಿ',
        description: 'ಜನ್ಮಾಷ್ಟಮಿ',
        significance: 'ಸ್ಮಾರ್ತ ಸಂಪ್ರದಾಯದ ಕೃಷ್ಣ ಜಯಂತಿ. ವೈಷ್ಣವ ಜನ್ಮಾಷ್ಟಮಿಗಿಂತ ಒಂದು ದಿನ ಮುನ್ನ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಸೂರ್ಯೋದಯದ ಅಷ್ಟಮಿಯಂತೆ ಸ್ಮಾರ್ತ ಉಪವಾಸವಿರಿ', 'ಮಧ್ಯರಾತ್ರಿ ಕೃಷ್ಣ ಜನ್ಮ ವಿಧಿಗಳನ್ನು ಮಾಡಿ', 'ವೈಷ್ಣವರು ಮರುದಿನ ಆಚರಿಸಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'స్మార్త జన్మాష్టమి',
        description: 'జన్మాష్టమి',
        significance: 'స్మార్త సంప్రదాయంలో కృష్ణ జయంతి. వైష్ణవ జన్మాష్టమికి ముందురోజు జరుపుకుంటారు.',
        rituals: ['సూర్యోదయ అష్టమి ప్రకారం ఉపవాసం ఉండండి', 'అర్ధరాత్రి కృష్ణ జనన పూజ చేయండి', 'మరుసటి రోజు వైష్ణవులు జరుపుకుంటారు'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'ஸ்மார்த்த ஜென்மாஷ்டமி',
        description: 'ஜென்மாஷ்டமி ஸ்மார்த்த மரபு',
        significance: 'ஸ்மார்த்த மரபில் கிருஷ்ண ஜெயந்தி கொண்டாடப்படும் நாள். வைணவ ஜென்மாஷ்டமிக்கு முந்தைய நாள் கொண்டாடப்படுகிறது.',
        rituals: ['சூரிய உதய அஷ்டமியில் விரதம் இரு', 'நள்ளிரவில் கிருஷ்ணப் பிறப்புச் சடங்கு செய்', 'மறுநாள் வைணவர் கொண்டாடுவர்'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Janmashtami (Smarta Tradition)',
    significance: 'Krishna Jayanti observed by Smarta tradition. Celebrated one day before Vaishnava Janmashtami.',
    rituals: ['Smarta fast per sunrise Ashtami', 'Midnight Krishna birth rites', 'Vaishnavas observe next day'],
    deity: 'Krishna',
    tithiNumber: 7,
    paksha: 'Krishna',
    month: 5, // Shravana
    type: 'minor'
  },
  {
    id: 'govardhan-puja',
    name: 'Govardhan Puja',
    nameHindi: 'गोवर्धन पूजा',
    i18n: {
      hi: {
        name: 'गोवर्धन पूजा',
        description: 'गोवर्धन पर्वत सम्मान का अन्नकूट',
        significance: 'इंद्र की वर्षा से वृंदावन रक्षा हेतु कृष्ण के गोवर्धन धारण की स्मृति; प्रकृति पूजा और कृतज्ञता का उत्सव।',
        rituals: ['घर में गोबर का गोवर्धन बनाएं', 'अनेक व्यंजनों का अन्नकूट अर्पित करें', 'गायों को पूजकर सजाएं', 'पर्वत मंदिर की भजन सहित परिक्रमा करें'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'गोवर्धनपूजा',
        description: 'गोवर्धनपूजनान्नकूटोत्सवः',
        significance: 'कृष्णः गोवर्धनपर्वतं धृत्वा वृन्दावनं ररक्ष। दीपावल्याः परदिने गोधनपूजा अन्नकूटभोजनं च क्रियते।',
        rituals: ['गृहे गोमयगोवर्धननिर्माणम्', 'अनेकव्यञ्जनैः अन्नकूटार्पणम्', 'गवां पूजनं शृङ्गालङ्कारश्च', 'भजनैः सह गिरिप्रदक्षिणा'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಗೋವರ್ಧನ ಪೂಜೆ',
        description: 'ಗೋವರ್ಧನ ಬೆಟ್ಟವನ್ನು ಗೌರವಿಸುವ ಅನ್ನಕೂಟ ಹಬ್ಬ',
        significance: 'ಇಂದ್ರನ ಮಳೆಯಿಂದ ವೃಂದಾವನವನ್ನು ರಕ್ಷಿಸಲು ಕೃಷ್ಣನು ಗೋವರ್ಧನ ಬೆಟ್ಟ ಎತ್ತಿದ ನೆನಪು. ದೀಪಾವಳಿಯ ಮರುದಿನ ಮನೆಗಳಲ್ಲಿ ಬೆಟ್ಟ ಮಾಡಿ ಅನ್ನಕೂಟ ನೈವೇದ್ಯ ಅರ್ಪಿಸಿ ದನಗಳನ್ನು ಗೌರವಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಮನೆಯಲ್ಲಿ ಸಗಣಿಯ ಗೋವರ್ಧನ ಬೆಟ್ಟ ಮಾಡಿ', 'ಅನೇಕ ಖಾದ್ಯಗಳ ಅನ್ನಕೂಟ ಅರ್ಪಿಸಿ', 'ದನಗಳನ್ನು ಪೂಜಿಸಿ ಕೊಂಬು ಅಲಂಕರಿಸಿ', 'ಭಜನೆ ಹಾಡುತ್ತಾ ಬೆಟ್ಟಕ್ಕೆ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'గోవర్ధన పూజ',
        description: 'గోవర్ధనగిరి అన్నకూట్ పండుగ',
        significance: 'ఇంద్రుని వాన నుండి గోకులాన్ని కాపాడేందుకు కృష్ణుడు గోవర్ధనగిరి ఎత్తిన కథకు గుర్తు. దీపావళి మరుసటి రోజు ప్రకృతిని పశువులను పూజిస్తారు.',
        rituals: ['ఇంట్లో పేడతో గోవర్ధనం చేయండి', 'అన్నకూట్ విందు సమర్పించండి', 'గోవులను పూజించి అలంకరించండి', 'భజనలతో గిరి ప్రదక్షిణ చేయండి'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'கோவர்த்தன பூஜை',
        description: 'கோவர்த்தன மலையைப் போற்றும் அன்னகூட் விழா',
        significance: 'இந்திரனின் மழையிலிருந்து கோகுலத்தைக் காக்க கிருஷ்ணர் கோவர்த்தன மலையைத் தூக்கியதை நினைவூட்டுகிறது. தீபாவளி மறுநாள் காலை கொண்டாடப்படுகிறது; இயற்கை வழிபாடு நன்றியின் விழா.',
        rituals: ['வீட்டில் கோவர்த்தன குன்று அமைத்திடு', 'பல உணவு அன்னகூட் படைத்திடு', 'பசுக்களை வழிபட்டு அலங்கரி', 'பஜனையுடன் குன்றை வலம் வா'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Annakut festival honouring Govardhan Hill',
    significance: 'Commemorates Krishna lifting Govardhan Hill to shelter Vrindavan from Indra’s deluge, affirming devotion over ritual pride. Observed the morning after Diwali, households build cow-dung hillocks, offer Annakut feasts of countless dishes, and honour cattle as Krishna’s companions. It celebrates nature worship, gratitude, and divine protection of the humble.',
    rituals: ['Build cow-dung Govardhan hillock at home', 'Offer Annakut feast of many dishes', 'Worship cows and decorate horns', 'Circumambulate hill shrine singing bhajans'],
    deity: 'Krishna',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major'
  },
  {
    id: 'narak-chaturdashi',
    name: 'Narak Chaturdashi',
    nameHindi: 'नरक चतुर्दशी',
    i18n: {
      hi: {
        name: 'नरक चतुर्दशी',
        description: 'छोटी दीपावली और तेल स्नान',
        significance: 'नरकासुर पर कृष्ण की विजय की स्मृति; प्रातः अभ्यंग स्नान और संध्या दीपों वाली छोटी दीपावली।',
        rituals: ['सूर्योदय से पहले तेल स्नान करें', 'संध्या को दीपों की पंक्तियां जलाएं', 'यम हेतु दक्षिणमुखी दीप रखें', 'द्वार रंगोली और तोरण से सजाएं'],
        deity: 'कृष्ण और यम',
      },
      sa: {
        name: 'नरकचतुर्दशी',
        description: 'छोटदीपावली तैलस्नानदिवसश्च',
        significance: 'कृष्णः नरकासुरं जघान। तमसः उपरि ज्योतिषः विजयः। प्रातः अभ्यङ्गस्नानं क्रियते गृहाणि च दीपैः अलङ्क्रियन्ते।',
        rituals: ['सूर्योदयात् पूर्वं तैलाभ्यङ्गस्नानम्', 'सायं दीपपङ्क्तिप्रज्वालनम्', 'यमाय दक्षिणाभिमुखदीपार्पणम्', 'द्वाररङ्गोलीतोरणालङ्कारः'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ನರಕ ಚತುರ್ದಶಿ',
        description: 'ಛೋಟಿ ದೀಪಾವಳಿ ಮತ್ತು ಎಣ್ಣೆ ಸ್ನಾನದ ದಿನ',
        significance: 'ನರಕಾಸುರನ ಮೇಲೆ ಕೃಷ್ಣನ ವಿಜಯ ಮತ್ತು ಸೆರೆಯಾಳುಗಳ ಬಿಡುಗಡೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಛೋಟಿ ದೀಪಾವಳಿಯಾಗಿ ಮುಂಜಾನೆ ಎಣ್ಣೆ ಸ್ನಾನದಿಂದ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಯಮನಿಗೆ ದೀಪ ಹಚ್ಚಿ ರಕ್ಷಣೆ ಕೋರಲಾಗುತ್ತದೆ.',
        rituals: ['ಸೂರ್ಯೋದಯಕ್ಕೆ ಮುನ್ನ ಎಣ್ಣೆ ಸ್ನಾನ ಮಾಡಿ', 'ಸಂಜೆ ಸಾಲು ದೀಪ ಹಚ್ಚಿ', 'ಯಮನಿಗಾಗಿ ದಕ್ಷಿಣಕ್ಕೆ ಮುಖ ಮಾಡಿ ದೀಪವಿಡಿ', 'ರಂಗೋಲಿ ಮತ್ತು ತೋರಣದಿಂದ ಬಾಗಿಲು ಅಲಂಕರಿಸಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'నరక చతుర్దశి',
        description: 'చోటీ దీపావళి తలంటు స్నానం',
        significance: 'నరకాసురునిపై కృష్ణుని విజయానికి గుర్తు. చెడుపై వెలుగు గెలుపుకు ప్రతీక. తెల్లవారున తలంటి దీపాలు వెలిగిస్తారు.',
        rituals: ['తెల్లవారున తలంటి స్నానం చేయండి', 'సాయంత్రం వరుస దీపాలు వెలిగించండి', 'యముని కోసం దక్షిణాన దీపం పెట్టండి', 'ముగ్గులు తోరణాలతో గుమ్మం అలంకరించండి'],
        deity: 'కృష్ణ మరియు యముడు',
      },
      ta: {
        name: 'நரக சதுர்த்தசி',
        description: 'சிறு தீபாவளி எண்ணெய் குளியல் நாள்',
        significance: 'நரகாசுரனைக் கிருஷ்ணர் வென்றதைக் குறிக்கிறது; இருள் நீங்கி ஒளி வெல்வதன் அடையாளம். சிறு தீபாவளியாக விடியலில் எண்ணெய் குளியலுடன் கொண்டாடப்படுகிறது.',
        rituals: ['சூரிய உதயத்திற்கு முன் எண்ணெய் குளித்திடு', 'மாலையில் வரிசையாய் விளக்கேற்று', 'யமனுக்குத் தெற்கில் விளக்கேற்று', 'கோல தோரணத்தால் வாயில் அலங்கரி'],
        deity: 'கிருஷ்ணர் மற்றும் யமன்',
      },
    },
    description: 'Choti Diwali and ritual oil bath day',
    significance: 'Marks Krishna’s victory over the demon Narakasura and the liberation of sixteen thousand captives, symbolising light dispelling entrenched darkness. Celebrated as Choti Diwali with the pre-dawn Abhyang oil bath, homes are cleaned and lit. Devotees also light a lamp for Yama, praying for protection from untimely death.',
    rituals: ['Take ritual oil bath before sunrise', 'Light rows of lamps at dusk', 'Offer a lamp facing south for Yama', 'Decorate doorway with rangoli and torans'],
    deity: 'Krishna and Yama',
    tithiNumber: 14,
    paksha: 'Krishna',
    month: 8, // Kartika (purnimanta; = amanta Ashwin Krishna Chaturdashi)
    type: 'major',
    monthBasis: 'purnimanta',
  },
  {
    id: 'govatsa-dwadashi',
    name: 'Govatsa Dwadashi',
    nameHindi: 'गोवत्स द्वादशी',
    i18n: {
      hi: {
        name: 'गोवत्स द्वादशी',
        description: 'दीपावली खोलने वाली वसुबारस गौ पूजा',
        significance: 'महाराष्ट्र-गुजरात में वसुबारस के रूप में दीपावली का आरंभ; बछड़े सहित गौ माता की पूजा होती है।',
        rituals: ['गाय-बछड़े को नहलाकर सजाएं', 'गेहूँ, चना और हरा चारा खिलाएं', 'कुमकुम लगाकर आरती करें', 'शाम की पूजा तक व्रत रखें'],
        deity: 'गौ माता',
      },
      sa: {
        name: 'गोवत्सद्वादशी',
        description: 'दीपावल्यारम्भे गोपूजनम्',
        significance: 'दीपावलीपर्वणः आरम्भदिवसः। गौः माता पोषिका च पूज्यते। स्त्रियः व्रतेन गोवत्सां पूजयन्ति।',
        rituals: ['गोवत्सयोः स्नापनालङ्कारः', 'गोधूमचणकहरिततृणार्पणम्', 'कुङ्कुमधारणम् आरार्तिकं च', 'सायं पूजापर्यन्तं व्रतम्'],
        deity: 'गोमाता',
      },
      kn: {
        name: 'ಗೋವತ್ಸ ದ್ವಾದಶಿ',
        description: 'ದೀಪಾವಳಿಯನ್ನು ತೆರೆಯುವ ವಸುಬಾರಸ್ ದನಗಳ ಪೂಜೆ',
        significance: 'ಮಹಾರಾಷ್ಟ್ರ ಮತ್ತು ಗುಜರಾತಿನಲ್ಲಿ ವಸುಬಾರಸ್ ಆಗಿ ದೀಪಾವಳಿಯನ್ನು ತೆರೆಯುತ್ತದೆ. ಕರುಳಿರುವ ಹಸುವನ್ನು ತಾಯಿಯಾಗಿ ಗೌರವಿಸಿ ಗೋಧಿ, ಕಡಲೆ ಮತ್ತು ಹುಲ್ಲು ಅರ್ಪಿಸಿ ಕುಟುಂಬದ ಕ್ಷೇಮ ಕೋರಲಾಗುತ್ತದೆ.',
        rituals: ['ಹಸು ಮತ್ತು ಕರುವನ್ನು ಸ್ನಾನ ಮಾಡಿಸಿ ಅಲಂಕರಿಸಿ', 'ಗೋಧಿ, ಕಡಲೆ ಮತ್ತು ಹಸಿರು ಮೇವು ನೀಡಿ', 'ಕುಂಕುಮವಿಟ್ಟು ಆರತಿ ಮಾಡಿ', 'ಸಂಜೆ ಪೂಜೆಯವರೆಗೆ ಉಪವಾಸವಿರಿ'],
        deity: 'ಗೋಮಾತಾ',
      },
      te: {
        name: 'గోవత్స ద్వాదశి',
        description: 'దీపావళిని ప్రారంభించే గోపూజ',
        significance: 'దీపావళి వేడుకకు ఆరంభం. తల్లిగా భావించే గోవును దూడతో కలిపి పూజిస్తారు. కృష్ణుని గోప్రేమకు గుర్తు.',
        rituals: ['గోవును దూడను కడిగి అలంకరించండి', 'గోధుమలు శెనగలు పచ్చిమేత పెట్టండి', 'కుంకుమ పెట్టి హారతి ఇవ్వండి', 'సాయంత్రం పూజ వరకు ఉపవాసం ఉండండి'],
        deity: 'గోమాత',
      },
      ta: {
        name: 'கோவத்ச துவாதசி',
        description: 'தீபாவளியைத் தொடங்கும் பசு வழிபாடு',
        significance: 'தீபாவளிக் காலத்தைத் தொடங்கும் நாள். தாயாகப் போற்றப்படும் பசுவைக் கன்றுடன் வழிபட்டு குடும்ப நலன் வேண்டுகின்றனர். கிருஷ்ணரின் பசு அன்பை நினைவூட்டுகிறது.',
        rituals: ['பசு கன்றைக் குளிப்பாட்டி அலங்கரி', 'கோதுமை தீவனம் படைத்திடு', 'குங்குமமிட்டு ஆரத்தி எடு', 'மாலை வழிபாடு வரை விரதம் இரு'],
        deity: 'கோ மாதா',
      },
    },
    description: 'Vasubaras cow worship opening Diwali',
    significance: 'Opens the Diwali season in Maharashtra and Gujarat as Vasubaras, honouring the cow as mother and sustainer of agrarian life. Women fast and worship the cow with her calf, offering wheat, gram, and greens while praying for family welfare. The rite recalls Krishna’s love for cows and Vrindavan’s pastoral heritage.',
    rituals: ['Bathe and decorate cow and calf', 'Offer wheat gram and green fodder', 'Apply kumkum and perform aarti', 'Observe fast till evening worship'],
    deity: 'Gau Mata',
    tithiNumber: 12,
    paksha: 'Krishna',
    month: 8, // Kartika (purnimanta; = amanta Ashwin Krishna Dwadashi)
    type: 'major',
    region: ['Maharashtra', 'Gujarat'],
    monthBasis: 'purnimanta',
  },
  {
    id: 'tulsi-vivah',
    name: 'Tulsi Vivah',
    nameHindi: 'तुलसी विवाह',
    i18n: {
      hi: {
        name: 'तुलसी विवाह',
        description: 'तुलसी और विष्णु का विवाह',
        significance: 'तुलसी रूप लक्ष्मी का शालिग्राम विष्णु से विवाह; चातुर्मास समाप्त कर विवाह ऋतु खोलता है।',
        rituals: ['तुलसी पौधे को दुल्हन सजाएं', 'संध्या को शालिग्राम बारात निकालें', 'विवाह मंत्र गाकर मालाएं बदलें', 'गन्ना और festive मिठाई बाँटें'],
        deity: 'विष्णु (शालिग्राम) और लक्ष्मी (तुलसी)',
      },
      sa: {
        name: 'तुलसीविवाहः',
        description: 'तुलसीविष्णुविवाहः',
        significance: 'तुलसीरूपायाः लक्ष्म्याः विष्णुना सह विवाहः। चातुर्मास्यानन्तरं विवाहर्तुः आरम्भः अयम्।',
        rituals: ['तुलसीवृक्षस्य वधूवेषधारणम्', 'सायं शालिग्रामविवाहशोभायात्रा', 'विवाहमन्त्रपठनं मालाविनिमयश्च', 'इक्षुमिष्टान्नवितरणम्'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ತುಳಸಿ ವಿವಾಹ',
        description: 'ತುಳಸಿ ಮತ್ತು ವಿಷ್ಣುವಿನ ವಿಧ್ಯುಕ್ತ ವಿವಾಹ',
        significance: 'ತುಳಸಿ ರೂಪದ ಲಕ್ಷ್ಮಿ ಮತ್ತು ಶಾಲಿಗ್ರಾಮ ರೂಪದ ವಿಷ್ಣುವಿನ ವಿವಾಹ. ಚಾತುರ್ಮಾಸ ಮುಗಿದು ವಿವಾಹ ಕಾಲ ಮತ್ತೆ ತೆರೆಯುತ್ತದೆ. ಮನೆಗಳಲ್ಲಿ ಸಂಜೆ ಪೂರ್ಣ ವಿವಾಹದಂತೆ ಮೆರವಣಿಗೆ, ಹಾಡು ಮತ್ತು ಸಂಕಲ್ಪಗಳೊಂದಿಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ತುಳಸಿ ಗಿಡವನ್ನು ಮದುಮಗಳಂತೆ ಅಲಂಕರಿಸಿ', 'ಸಂಜೆ ಶಾಲಿಗ್ರಾಮ ವಿವಾಹ ಮೆರವಣಿಗೆ ನಡೆಸಿ', 'ವಿವಾಹ ಮಂತ್ರ ಹಾಡಿ ಹಾರ ವಿನಿಮಯ ಮಾಡಿ', 'ಕಬ್ಬು ಮತ್ತು ಹಬ್ಬದ ಸಿಹಿ ಹಂಚಿ'],
        deity: 'ಲಕ್ಷ್ಮಿ',
      },
      te: {
        name: 'తులసి వివాహం',
        description: 'తులసి విష్ణువుల కల్యాణం',
        significance: 'తులసిగా లక్ష్మి, సాలగ్రామంగా విష్ణువుల కల్యాణం. చాతుర్మాసం ముగిసి పెళ్లిళ్ల కాలం మొదలవుతుంది. భక్తి దాంపత్యానికి గుర్తు.',
        rituals: ['తులసి మొక్కను పెళ్లికూతురిలా అలంకరించండి', 'సాయంత్రం సాలగ్రామ ఊరేగింపు కల్యాణం జరపండి', 'మంగళ వాయిద్యాలతో దండలు మార్చండి', 'చెరకు పండుగ స్వీట్లు పంచండి'],
        deity: 'విష్ణు మరియు లక్ష్మి',
      },
      ta: {
        name: 'துளசி கல்யாணம்',
        description: 'துளசி விஷ்ணுவின் திருக்கல்யாணம்',
        significance: 'துளசி வடிவ லட்சுமிக்கும் சாளக்கிராம விஷ்ணுவுக்கும் நடக்கும் திருமணம். மழைக்கால ஓய்வு முடிந்து திருமணக் காலம் தொடங்குகிறது; பக்தி கற்பு இல்லறப் புனிதத்தைப் போற்றும் விழா.',
        rituals: ['துளசியை மணப்பெண்ணாய் அலங்கரி', 'மாலையில் திருக்கல்யாண ஊர்வலம் நடத்து', 'மங்கலப் பாட்டுடன் மாலை மாற்று', 'கரும்பு இனிப்பு வழங்கிடு'],
        deity: 'விஷ்ணு மற்றும் லட்சுமி',
      },
    },
    description: 'Ceremonial wedding of Tulsi and Vishnu',
    significance: 'Celebrates the marriage of Goddess Lakshmi in her Tulsi form to Vishnu as Shaligram, closing the inauspicious Chaturmas period and reopening the wedding season. Households stage a full wedding with procession, songs, and vows around the Tulsi plant at dusk. It honours devotion, fidelity, and the sanctity of married life.',
    rituals: ['Dress Tulsi plant as bride', 'Stage Shaligram wedding procession at dusk', 'Chant wedding hymns and exchange garlands', 'Distribute sugarcane and festive sweets'],
    deity: 'Vishnu (Shaligram) and Lakshmi (Tulsi)',
    tithiNumber: 12,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major',
    vyapti: 'pradosh', // wedding rites are performed in the evening
  },
  {
    id: 'anant-chaturdashi',
    name: 'Anant Chaturdashi',
    nameHindi: 'अनंत चतुर्दशी',
    i18n: {
      hi: {
        name: 'अनंत चतुर्दशी',
        description: 'अनंत विष्णु का धागा व्रत',
        significance: 'अनंत रक्षक विष्णु का चौदह गांठों वाला धागा व्रत; महाराष्ट्र में इसी दिन गणेश विसर्जन होता है।',
        rituals: ['चौदह गांठों वाला अनंत धागा बाँधें', 'चौदह उपचारों से विष्णु पूजें', 'अनंत व्रत कथा सुनें', 'शोभायात्रा से गणेश विसर्जन करें'],
        deity: 'विष्णु',
      },
      sa: {
        name: 'अनन्तचतुर्दशी',
        description: 'अनन्तव्रतसूत्रधारणम्',
        significance: 'अनन्तरूपः विष्णुः पूज्यते। चतुर्दशग्रन्थियुक्तं सूत्रं बाहौ बध्यते। महाराष्ट्रे गणेशविसर्जनं अपि भवति।',
        rituals: ['बाहौ चतुर्दशग्रन्थिसूत्रबन्धनम्', 'चतुर्दशोपचारैः विष्णुपूजनम्', 'अनन्तव्रतकथाश्रवणम्', 'शोभायात्रया गणेशविसर्जनम्'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ಅನಂತ ಚತುರ್ದಶಿ',
        description: 'ಅನಂತ ವಿಷ್ಣುವಿಗೆ ಪವಿತ್ರ ದಾರದ ವ್ರತ',
        significance: 'ಅನಂತನಾದ ವಿಷ್ಣುವನ್ನು ಹದಿನಾಲ್ಕು ಗಂಟಿನ ಪವಿತ್ರ ದಾರದಿಂದ ಗೌರವಿಸಲಾಗುತ್ತದೆ. ವನವಾಸದ ನಂತರ ಪಾಂಡವರು ಸಂಪತ್ತು ಮರಳಿ ಪಡೆದ ಕಥೆ. ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ಈ ದಿನ ಗಣೇಶ ವಿಸರ್ಜನೆಯೊಂದಿಗೆ ಗಣೇಶೋತ್ಸವ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ.',
        rituals: ['ಹದಿನಾಲ್ಕು ಗಂಟಿನ ಅನಂತ ದಾರ ಕಟ್ಟಿ', 'ಹದಿನಾಲ್ಕು ಉಪಚಾರಗಳಿಂದ ವಿಷ್ಣುವನ್ನು ಪೂಜಿಸಿ', 'ಅನಂತ ವ್ರತ ಕಥೆ ಕೇಳಿ', 'ಮೆರವಣಿಗೆಯಲ್ಲಿ ಗಣೇಶ ಮೂರ್ತಿ ವಿಸರ್ಜಿಸಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'అనంత చతుర్దశి',
        description: 'అనంత విష్ణువుకు దారపు దీక్ష',
        significance: 'అనంతునిగా విష్ణువును పూజించి పద్నాలుగు ముడుల దారం కడతారు. మహారాష్ట్రలో ఈరోజు వినాయక నిమజ్జనం చేస్తారు.',
        rituals: ['పద్నాలుగు ముడుల అనంత దారం కట్టుకోండి', 'పద్నాలుగు ఉపచారాలతో విష్ణువును పూజించండి', 'అనంత వ్రత కథ వినండి', 'ఊరేగింపుతో వినాయక నిమజ్జనం చేయండి'],
        deity: 'విష్ణు',
      },
      ta: {
        name: 'அனந்த சதுர்த்தசி',
        description: 'அழியா விஷ்ணுவுக்கு நூல் விரதம்',
        significance: 'முடிவற்ற காக்கும் விஷ்ணுவைப் போற்றும் விரதம்; பதினான்கு முடிச்சு நூல் கையில் கட்டப்படுகிறது. மகாராஷ்டிரத்தில் விநாயகர் சிலை கரைப்புடன் நிறைவடைகிறது.',
        rituals: ['பதினான்கு முடிச்சு நூல் கட்டு', 'பதினான்கு படையலுடன் விஷ்ணுவை வழிபடு', 'விரதக் கதை கேட்டிடு', 'ஊர்வலத்துடன் விநாயகர் சிலை கரைத்திடு'],
        deity: 'விஷ்ணு',
      },
    },
    description: 'Sacred thread vow to eternal Vishnu',
    significance: 'Honours Vishnu as Anant, the infinite protector, through a vow sealed by a fourteen-knotted sacred thread tied on the arm. Devotees recall Draupadi and Yudhishthira regaining fortune through this vrata after exile. In Maharashtra the day also closes Ganeshotsav with the immersion of Ganesh idols amid processions.',
    rituals: ['Tie fourteen-knotted Anant thread on arm', 'Worship Vishnu with fourteen offerings', 'Hear Anant vrata katha', 'Immerse Ganesh idols in procession'],
    deity: 'Vishnu',
    tithiNumber: 14,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'major'
  },
  {
    id: 'rath-yatra',
    name: 'Rath Yatra',
    nameHindi: 'रथ यात्रा',
    i18n: {
      hi: {
        name: 'रथ यात्रा',
        description: 'जगन्नाथ की भव्य रथ यात्रा',
        significance: 'जगन्नाथ, बलभद्र, सुभद्रा की गुंडिचा यात्रा; लाखों भक्त रस्सी खींचकर कृपा पाते हैं।',
        rituals: ['भक्ति सहित रथ रस्सी खींचें', 'छप्पन भोग अर्पित करें', 'छेरा पहंरा विधि देखें', 'मार्ग में कीर्तन गाएं'],
        deity: 'जगन्नाथ',
      },
      sa: {
        name: 'रथयात्रा',
        description: 'जगन्नाथस्य रथोत्सवः',
        significance: 'जगन्नाथबलभद्रसुभद्राः बृहद्रथैः गुण्डिचामन्दिरं नीयन्ते। राजा छेरापहँरा विधौ सम्मार्जनं करोति।',
        rituals: ['भक्त्या रथरज्जुकर्षणम्', 'देवेभ्यः छप्पनभोगार्पणम्', 'छेरापहँरादर्शनम्', 'मार्गे कीर्तनगायनम्'],
        deity: 'जगन्नाथः',
      },
      kn: {
        name: 'ರಥಯಾತ್ರೆ',
        description: 'ಜಗನ್ನಾಥನ ಮಹಾ ರಥೋತ್ಸವ',
        significance: 'ಜಗನ್ನಾಥ, ಬಲಭದ್ರ ಮತ್ತು ಸುಭದ್ರರನ್ನು ಎತ್ತರದ ರಥಗಳಲ್ಲಿ ಪುರಿ ದೇವಸ್ಥಾನದಿಂದ ಗುಂಡಿಚಾಗೆ ಕೊಂಡೊಯ್ಯಲಾಗುತ್ತದೆ. ಲಕ್ಷಾಂತರ ಜನ ಹಗ್ಗ ಎಳೆಯುತ್ತಾರೆ. ದೇವರು ಎಲ್ಲರಿಗಾಗಿ ಬೀದಿಗೆ ಬರುತ್ತಾನೆಂಬುದರ ಸಂಕೇತ.',
        rituals: ['ಭಕ್ತಿಯಿಂದ ರಥದ ಹಗ್ಗ ಎಳೆಯಿರಿ', 'ದೇವರಿಗೆ ಛಪ್ಪನ್ ಭೋಗ ಅರ್ಪಿಸಿ', 'ಛೇರಾ ಪಹಾರಾ ಗುಡಿಸುವ ವಿಧಿ ವೀಕ್ಷಿಸಿ', 'ಮೆರವಣಿಗೆ ಹಾದಿಯಲ್ಲಿ ಕೀರ್ತನೆ ಹಾಡಿ'],
        deity: 'ಜಗನ್ನಾಥ',
      },
      te: {
        name: 'రథయాత్ర',
        description: 'జగన్నాథుని రథోత్సవం',
        significance: 'జగన్నాథ బలభద్ర సుభద్రలను పెద్ద రథాలపై ఊరేగించే యాత్ర. భగవంతుడు వీధుల్లోకి వచ్చి అందరినీ అనుగ్రహిస్తాడని భావన.',
        rituals: ['భక్తితో రథం తాళ్లు లాగండి', 'ఛప్పన్ భోగ్ సమర్పించండి', 'ఛేరా పహరా సేవ చూడండి', 'ఊరేగింపులో కీర్తనలు పాడండి'],
        deity: 'జగన్నాథుడు',
      },
      ta: {
        name: 'ரத யாத்திரை',
        description: 'ஜகந்நாதரின் பெரும் தேர்த் திருவிழா',
        significance: 'ஜகந்நாதர் தேரில் ஏறி குண்டிச்சா செல்லும் ஆண்டு பயணம். இறைவன் வீதிக்கு வந்து அனைவருக்கும் அருளும் நாள்; பணிவின் அடையாளமாகச் சடங்குகள் நடக்கின்றன.',
        rituals: ['பக்தியுடன் தேர் வடம் இழுத்திடு', 'ஐம்பத்தாறு போக் படைத்திடு', 'தேர் தூய்மைச் சடங்கு கண்டிடு', 'ஊர்வலத்தில் கீர்த்தனை பாடு'],
        deity: 'ஜகந்நாதர்',
      },
    },
    description: 'Grand chariot festival of Lord Jagannath',
    significance: 'Carries Jagannath, Balabhadra, and Subhadra on towering chariots from the Puri temple to Gundicha, enacting the deities’ annual journey to their birthplace. Millions pull the ropes seeking grace, while the king sweeps the chariot in the Chhera Pahanra rite of humility. It proclaims that the divine comes to the streets for all.',
    rituals: ['Pull chariot ropes with devotion', 'Offer chhappan bhog to deities', 'Witness Chhera Pahanra sweeping rite', 'Sing kirtans along procession route'],
    deity: 'Jagannath',
    tithiNumber: 2,
    paksha: 'Shukla',
    month: 4, // Ashadha
    type: 'major',
    region: ['Odisha', 'Bengal']
  },
  {
    id: 'ganga-dussehra',
    name: 'Ganga Dussehra',
    nameHindi: 'गंगा दशहरा',
    i18n: {
      hi: {
        name: 'गंगा दशहरा',
        description: 'गंगा का पृथ्वी अवतरण',
        significance: 'भगीरथ तपस्या से शिव जटा द्वारा गंगा अवतरण की स्मृति; इस दशमी स्नान से दस पाप हरण की मान्यता है।',
        rituals: ['प्रातः गंगा में स्नान करें', 'फूल, दूध और दीप अर्पित करें', 'भव्य गंगा आरती में जुड़ें', 'जल, अन्न और छाते दान करें'],
        deity: 'गंगा',
      },
      sa: {
        name: 'गङ्गादशहरा',
        description: 'गङ्गावतरणदिवसः',
        significance: 'भगीरथतपसा गङ्गा शिवजटाभ्यः भुवम् अवातरत्। अस्यां दशम्यां गङ्गास्नानं दशविधपापं हरति।',
        rituals: ['प्रातः गङ्गायां स्नानम्', 'पुष्पदुग्धदीपार्पणम्', 'महागङ्गारार्तिकदर्शनम्', 'जलान्नछत्रदानम्'],
        deity: 'गङ्गा',
      },
      kn: {
        name: 'ಗಂಗಾ ದಶಹರಾ',
        description: 'ಗಂಗೆಯ ಭೂಮಿಗೆ ಇಳಿದ ದಿನ',
        significance: 'ಭಗೀರಥನ ತಪಸ್ಸಿಗೆ ಶಿವನ ಜಡೆಯ ಮೂಲಕ ಗಂಗೆ ಭೂಮಿಗೆ ಇಳಿದ ನೆನಪು. ಈ ದಶಮಿಯಂದು ನದಿಯಲ್ಲಿ ಸ್ನಾನ ಮಾಡಿದರೆ ಹತ್ತು ಬಗೆಯ ಪಾಪಗಳು ತೊಳೆದುಹೋಗುತ್ತವೆ. ಹರಿದ್ವಾರ, ವಾರಣಾಸಿ ಮತ್ತು ಪ್ರಯಾಗ್‌ನಲ್ಲಿ ಗಂಗಾ ಆರತಿ ನಡೆಯುತ್ತದೆ.',
        rituals: ['ಮುಂಜಾನೆ ಗಂಗೆಯಲ್ಲಿ ಸ್ನಾನ ಮಾಡಿ', 'ಹೂವು, ಹಾಲು ಮತ್ತು ದೀಪ ಅರ್ಪಿಸಿ', 'ಮಹಾ ಗಂಗಾ ಆರತಿಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ', 'ನೀರು, ಆಹಾರ ಮತ್ತು ಛತ್ರಿ ದಾನ ನೀಡಿ'],
        deity: 'ಗಂಗಾ',
      },
      te: {
        name: 'గంగా దసరా',
        description: 'గంగ భూమికి దిగిన రోజు',
        significance: 'భగీరథుని తపస్సుతో గంగ శివుని జటల గుండా భూమికి దిగిన రోజు. ఈరోజు గంగాస్నానం పాపాలు పోగొడుతుందని నమ్ముతారు.',
        rituals: ['తెల్లవారున గంగాస్నానం చేయండి', 'పూలు పాలు దీపాలు సమర్పించండి', 'గంగా హారతికి వెళ్లండి', 'నీరు ఆహారం గొడుగులు దానం చేయండి'],
        deity: 'గంగాదేవి',
      },
      ta: {
        name: 'கங்கா தசரா',
        description: 'கங்கை பூமிக்கு இறங்கிய நாள்',
        significance: 'பகீரதன் தவத்தால் கங்கை சிவன் முடி வழியே பூமிக்கு இறங்கியதைக் கொண்டாடும் நாள். இன்று நதி நீராடல் பாவங்களைப் போக்கும் என்பது நம்பிக்கை.',
        rituals: ['அதிகாலையில் கங்கையில் நீராடு', 'மலர் பால் விளக்கு படைத்திடு', 'கங்கா ஆரத்தியில் கலந்துகொள்', 'நீர் உணவு குடை தானம் செய்'],
        deity: 'கங்கை',
      },
    },
    description: 'Descent of the Ganga to earth',
    significance: 'Commemorates the descent of the Ganga through Shiva’s locks to earth at King Bhagiratha’s penance, redeeming his ancestors’ ashes. Bathing in the river on this Dashami is believed to wash away ten categories of sin. Pilgrims gather at Haridwar, Varanasi, and Prayagraj for Ganga aarti and charity.',
    rituals: ['Bathe in Ganga at dawn', 'Offer flowers milk and lamps', 'Attend grand Ganga aarti', 'Donate water food and umbrellas'],
    deity: 'Ganga',
    tithiNumber: 10,
    paksha: 'Shukla',
    month: 3, // Jyeshtha
    type: 'major'
  },
  {
    id: 'hartalika-teej',
    name: 'Hartalika Teej',
    nameHindi: 'हरतालिका तीज',
    i18n: {
      hi: {
        name: 'हरतालिका तीज',
        description: 'वैवाहिक सुख हेतु पार्वती व्रत',
        significance: 'शिव को पाने हेतु पार्वती की वन तपस्या की स्मृति; स्त्रियां संध्या को बालू शिव-पार्वती पूजकर निर्जल व्रत रखती हैं।',
        rituals: ['अगली सुबह तक निर्जल व्रत रखें', 'बालू के दिव्य युगल बनाएं', 'सोलह शृंगार से पूजन करें', 'संध्या को हरतालिका कथा सुनें'],
        deity: 'पार्वती और शिव',
      },
      sa: {
        name: 'हरतालिकातृतीया',
        description: 'पार्वतीतपोव्रतम्',
        significance: 'पार्वती कठिनतपसा शिवं पतिं लेभे। स्त्रियः निर्जलव्रतेन सैकतशिवपार्वतीपूजनं कुर्वन्ति।',
        rituals: ['परप्रातःपर्यन्तं निर्जलव्रतम्', 'सैकतदेवदम्पतिनिर्माणम्', 'षोडशशृङ्गारैः पूजनम्', 'सायं हरतालिकाकथाश्रवणम्'],
        deity: 'पार्वती',
      },
      kn: {
        name: 'ಹರತಾಲಿಕಾ ತೀಜ್',
        description: 'ವೈವಾಹಿಕ ಸುಖಕ್ಕಾಗಿ ಪಾರ್ವತಿಯ ಉಪವಾಸ',
        significance: 'ಶಿವನನ್ನು ಪಡೆಯಲು ಪಾರ್ವತಿ ಕಾಡಿನಲ್ಲಿ ಕಠಿಣ ತಪಸ್ಸು ಮಾಡಿದ ನೆನಪು. ವಿವಾಹಿತ ಮತ್ತು ಅವಿವಾಹಿತ ಮಹಿಳೆಯರು ನೀರಿಲ್ಲದೆ ಉಪವಾಸವಿದ್ದು ಸಂಜೆ ಶಿವ-ಪಾರ್ವತಿಯ ಮರಳು ಮೂರ್ತಿಗಳನ್ನು ಪೂಜಿಸುತ್ತಾರೆ.',
        rituals: ['ಮರುದಿನ ಬೆಳಗಿನವರೆಗೆ ನಿರ್ಜಲ ಉಪವಾಸವಿರಿ', 'ದಿವ್ಯ ದಂಪತಿಯ ಮರಳು ಮೂರ್ತಿ ಮಾಡಿ', 'ಹದಿನಾರು ಅಲಂಕಾರಗಳಿಂದ ಮೂರ್ತಿಗಳನ್ನು ಪೂಜಿಸಿ', 'ಸಂಜೆ ಹರತಾಲಿಕಾ ವ್ರತ ಕಥೆ ಕೇಳಿ'],
        deity: 'ಪಾರ್ವತಿ',
      },
      te: {
        name: 'హర్తాళికా తీజ్',
        description: 'సౌభాగ్యం కోసం పార్వతి ఉపవాసం',
        significance: 'శివుని కోసం పార్వతి చేసిన కఠిన తపస్సుకు గుర్తు. వివాహితలు అవివాహితలు నీరు లేకుండా ఉపవాసం ఉండి శివపార్వతులను పూజిస్తారు.',
        rituals: ['మరుసటి ఉదయం వరకు నిర్జల ఉపవాసం ఉండండి', 'ఇసుకతో శివపార్వతులను చేయండి', 'పదహారు అలంకారాలతో పూజించండి', 'సాయంత్రం వ్రత కథ వినండి'],
        deity: 'పార్వతి మరియు శివ',
      },
      ta: {
        name: 'ஹர்த்தாலிகா தீஜ்',
        description: 'மண வாழ்வுக்குப் பார்வதி நோற்ற விரதம்',
        significance: 'சிவனை மணக்கப் பார்வதி காட்டில் கடும் தவம் செய்ததை நினைவூட்டுகிறது. பெண்கள் நீரின்றி விரதமிருந்து மாலையில் சிவ பார்வதி மண் சிலைகளை வழிபடுகின்றனர்.',
        rituals: ['மறுநாள் காலை வரை நீரின்றி விரதம் இரு', 'தெய்வ இணையின் மண் சிலை செய்', 'பதினாறு அலங்காரத்துடன் வழிபடு', 'மாலையில் விரதக் கதை கேட்டிடு'],
        deity: 'பார்வதி மற்றும் சிவன்',
      },
    },
    description: 'Parvati penance fast for marital bliss',
    significance: 'Recalls Parvati’s fierce forest penance winning Shiva as husband after her friends spirited her away from an unwanted match. Married and unmarried women alike keep a strict waterless fast, worshipping sand idols of Shiva and Parvati at dusk. It celebrates resolve in love, fidelity, and the power of a woman’s vow.',
    rituals: ['Keep waterless fast till next morning', 'Craft sand idols of divine couple', 'Worship idols with sixteen adornments', 'Hear Hartalika vrata katha at dusk'],
    deity: 'Parvati and Shiva',
    tithiNumber: 3,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'major',
    region: ['North India', 'Maharashtra'],
    vyapti: 'pradosh', // sand-idol worship is performed in the evening
  },
  {
    id: 'hariyali-teej',
    name: 'Hariyali Teej',
    nameHindi: 'हरियाली तीज',
    i18n: {
      hi: {
        name: 'हरियाली तीज',
        description: 'पार्वती का सावनी झूला पर्व',
        significance: 'सावनी हरियाली और शिव-पार्वती मिलन का उत्सव; स्त्रियां झूला झूलकर मेहंदी और सावन गीतों से मनाती हैं।',
        rituals: ['फूल सजे झूलों पर झूलें', 'मेहंदी लगाएं, हरा पहनें', 'मिलकर सावन लोकगीत गाएं', 'हरे उपचारों से पार्वती पूजें'],
        deity: 'पार्वती और शिव',
      },
      sa: {
        name: 'हरियालीतृतीया',
        description: 'श्रावणहरियालीतीजः',
        significance: 'वर्षर्तुहरितिमायाः स्वागतं पार्वतीशिवयोः पुनर्मिलनं च। स्त्रियः पुष्पालङ्कृतदोलासु क्रीडन्ति।',
        rituals: ['पुष्पालङ्कृतदोलाक्रीडा', 'मेहन्दीधारणं हरितवस्त्रं च', 'सामूहिकसावनगीतगायनम्', 'हरितोपचारैः पार्वतीपूजनम्'],
        deity: 'पार्वती',
      },
      kn: {
        name: 'ಹರಿಯಾಲಿ ತೀಜ್',
        description: 'ಪಾರ್ವತಿಯ ಮಳೆಗಾಲದ ಜೋಕಾಲಿ ಹಬ್ಬ',
        significance: 'ಮಳೆಗಾಲದ ಹಸಿರನ್ನು ಸ್ವಾಗತಿಸಿ ತಪಸ್ಸಿನ ನಂತರ ಪಾರ್ವತಿ ಶಿವನೊಂದಿಗೆ ಮಿಲನವಾದ್ದನ್ನು ಗೌರವಿಸುತ್ತದೆ. ಮಹಿಳೆಯರು ಹೂವಿನ ಜೋಕಾಲಿಯಲ್ಲಿ ತೂಗುತ್ತಾರೆ, ಮೆಹಂದಿ ಹಚ್ಚುತ್ತಾರೆ, ಹಸಿರು ಬಳೆ ಧರಿಸುತ್ತಾರೆ ಮತ್ತು ಸಾವನ್ ಹಾಡು ಹಾಡುತ್ತಾರೆ.',
        rituals: ['ಹೂವಿನ ಜೋಕಾಲಿಯಲ್ಲಿ ತೂಗಿ', 'ಮೆಹಂದಿ ಹಚ್ಚಿ ಹಸಿರು ಧರಿಸಿ', 'ಒಟ್ಟಿಗೆ ಸಾವನ್ ಜಾನಪದ ಹಾಡು ಹಾಡಿ', 'ಹಸಿರು ನೈವೇದ್ಯದಿಂದ ಪಾರ್ವತಿಯನ್ನು ಪೂಜಿಸಿ'],
        deity: 'ಪಾರ್ವತಿ',
      },
      te: {
        name: 'హరియాలీ తీజ్',
        description: 'పార్వతి వానకాల ఊయల పండుగ',
        significance: 'వానకాల పచ్చదనానికి, శివునితో పార్వతి కలయికకు గుర్తు. మహిళలు పూల ఊయలలూగుతూ మెహందీ గాజులతో సంబరం చేస్తారు.',
        rituals: ['పూలతో అలంకరించిన ఊయలలూగండి', 'మెహందీ పెట్టుకుని ఆకుపచ్చ దుస్తులు ధరించండి', 'వానపాటలు కలిసి పాడండి', 'పచ్చని పత్రితో పార్వతిని పూజించండి'],
        deity: 'పార్వతి మరియు శివ',
      },
      ta: {
        name: 'ஹரியாலி தீஜ்',
        description: 'பார்வதியின் மழைக்கால ஊஞ்சல் விழா',
        significance: 'மழைக்காலப் பசுமையை வரவேற்று, சிவனுடன் பார்வதி இணைந்ததைப் போற்றும் நாள். பெண்கள் மலர் ஊஞ்சல் ஆடி, மருதாணி பச்சை வளையல் அணிந்து பாடிக் கொண்டாடுகின்றனர்.',
        rituals: ['மலர் ஊஞ்சலில் ஆடு', 'மருதாணி பச்சை உடை அணி', 'சாவன் பாடல்கள் பாடு', 'பச்சைப் படையலுடன் பார்வதியை வழிபடு'],
        deity: 'பார்வதி மற்றும் சிவன்',
      },
    },
    description: 'Monsoon swing festival of Parvati',
    significance: 'Welcomes the monsoon greenery and honours Parvati’s reunion with Shiva after long austerities, observed on Shravana’s bright Tritiya. Women swing on flower-decked jhulas, adorn hands with mehndi, wear green bangles, and sing Kajri and sawan songs. Fairs across Rajasthan and the northern plains mark the season’s joy.',
    rituals: ['Swing on flower-decked jhulas', 'Apply mehndi and wear green', 'Sing sawan folk songs together', 'Worship Parvati with green offerings'],
    deity: 'Parvati and Shiva',
    tithiNumber: 3,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major',
    region: ['Rajasthan', 'Uttar Pradesh', 'Haryana']
  },
  {
    id: 'kajari-teej',
    name: 'Kajari Teej',
    nameHindi: 'कजरी तीज',
    i18n: {
      hi: {
        name: 'कजरी तीज',
        description: 'विरह के कजरी गीतों का पर्व',
        significance: 'वर्षा ऋतु में शिव की प्रतीक्षारत पार्वती का व्रत; स्त्रियां नीम और दिव्य युगल पूजकर कजरी गाती हैं।',
        rituals: ['सूर्योदय से चंद्रोदय तक व्रत रखें', 'नीम और दिव्य युगल पूजें', 'रातभर कजरी गीत गाएं', 'उगते चंद्र को अर्घ्य दें'],
        deity: 'पार्वती और शिव',
      },
      sa: {
        name: 'कजरीतृतीया',
        description: 'कजरीगीततीजः',
        significance: 'कजरीलोकगीतैः पार्वती वर्षावधूरूपेण पूज्यते। स्त्रियः व्रतेन रात्रौ गायन्ति।',
        rituals: ['सूर्योदयात् चन्द्रोदयपर्यन्तं व्रतम्', 'निम्बवृक्षदेवदम्पतिपूजनम्', 'रात्रौ कजरीगीतगायनम्', 'उदयते चन्द्राय अर्घ्यदानम्'],
        deity: 'पार्वती',
      },
      kn: {
        name: 'ಕಜರಿ ತೀಜ್',
        description: 'ವಿರಹದ ಕಜ್ರಿ ಹಾಡುಗಳ ಹಬ್ಬ',
        significance: 'ವಿರಹ ಮತ್ತು ಹಂಬಲದ ಕಜ್ರಿ ಜಾನಪದ ಹಾಡುಗಳಿಂದ ಆಚರಿಸಲಾಗುತ್ತದೆ. ಪಾರ್ವತಿಯನ್ನು ಮಳೆಗಾಲದ ಮದುಮಗಳಾಗಿ ಗೌರವಿಸಲಾಗುತ್ತದೆ. ಮಹಿಳೆಯರು ಉಪವಾಸವಿದ್ದು ಬೇವಿನ ಮರ ಮತ್ತು ದಿವ್ಯ ದಂಪತಿಯನ್ನು ಪೂಜಿಸಿ ರಾತ್ರಿಯಿಡೀ ಹಾಡುತ್ತಾರೆ.',
        rituals: ['ಸೂರ್ಯೋದಯದಿಂದ ಚಂದ್ರೋದಯದವರೆಗೆ ಉಪವಾಸವಿರಿ', 'ಬೇವಿನ ಮರ ಮತ್ತು ದಿವ್ಯ ದಂಪತಿಯನ್ನು ಪೂಜಿಸಿ', 'ರಾತ್ರಿಯಿಡೀ ಕಜ್ರಿ ಹಾಡು ಹಾಡಿ', 'ಏರುವ ಚಂದ್ರನಿಗೆ ಅರ್ಘ್ಯ ನೀಡಿ'],
        deity: 'ಪಾರ್ವತಿ',
      },
      te: {
        name: 'కజరీ తీజ్',
        description: 'కజ్రీ పాటల పండుగ',
        significance: 'శివుని కోసం ఎదురుచూసే వానకాల పెళ్లికూతురిగా పార్వతిని పూజిస్తారు. మహిళలు ఉపవాసం ఉండి రాత్రంతా కజ్రీ పాటలు పాడతారు.',
        rituals: ['సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం ఉండండి', 'వేపచెట్టును శివపార్వతులను పూజించండి', 'రాత్రంతా కజ్రీ పాటలు పాడండి', 'ఉదయించే చంద్రునికి అర్ఘ్యం ఇవ్వండి'],
        deity: 'పార్వతి మరియు శివ',
      },
      ta: {
        name: 'கஜரி தீஜ்',
        description: 'கஜரி பாடல் விழா',
        significance: 'பிரிவு ஏக்கத்தைப் பாடும் கஜரி பாடல்களால் பார்வதியை மழைக்கால மணமகளாய்ப் போற்றும் நாள். பெண்கள் விரதமிருந்து வேம்பு தெய்வ இணையை வழிபட்டுப் பாடுகின்றனர்.',
        rituals: ['சூரிய உதயம் முதல் நிலவு வரை விரதம் இரு', 'வேம்பு தெய்வ இணையை வழிபடு', 'இரவெல்லாம் கஜரி பாடல் பாடு', 'எழும் நிலவுக்கு அர்க்கியம் தா'],
        deity: 'பார்வதி மற்றும் சிவன்',
      },
    },
    description: 'Kajri song festival of longing',
    significance: 'Sung into being through Kajri folk songs of separation and longing, this Tritiya honours Parvati as the monsoon bride awaiting Shiva. Women fast, worship the neem tree and the divine couple, and gather to sing through the night. Bundi’s procession of Teej Mata draws multitudes celebrating love tested by distance.',
    rituals: ['Fast from sunrise to moonrise', 'Worship neem tree and divine couple', 'Sing Kajri songs through night', 'Offer arghya to rising moon'],
    deity: 'Parvati and Shiva',
    tithiNumber: 3,
    paksha: 'Krishna',
    month: 6, // Bhadrapada (purnimanta; = amanta Shravana Krishna Tritiya)
    type: 'minor',
    region: ['Rajasthan', 'Uttar Pradesh', 'Bihar'],
    monthBasis: 'purnimanta',
  },
  {
    id: 'rishi-panchami',
    name: 'Rishi Panchami',
    nameHindi: 'ऋषि पंचमी',
    i18n: {
      hi: {
        name: 'ऋषि पंचमी',
        description: 'सप्तर्षियों का प्रायश्चित व्रत',
        significance: 'वैदिक ज्ञान रक्षक सप्तर्षियों का सम्मान; अनजाने ritual दोष शुद्धि हेतु उपवास और तर्पण होता है।',
        rituals: ['पवित्र जड़ी-बूटियों से स्नान करें', 'सातों ऋषियों को तर्पण दें', 'बिना अन्न एक बार भोजन व्रत रखें', 'ऋषि पंचमी व्रत कथा पढ़ें'],
        deity: 'सप्तर्षि',
      },
      sa: {
        name: 'ऋषिपञ्चमी',
        description: 'सप्तर्षिपूजनव्रतम्',
        significance: 'सप्तर्षयः पूज्यन्ते। स्त्रियः शुद्ध्यर्थं पवित्रौषधीस्नानं कृत्वा व्रतं चरन्ति।',
        rituals: ['पवित्रौषधीभिः स्नानम्', 'सप्तर्षिभ्यः तर्पणम्', 'धान्यरहितैकभुक्तव्रतम्', 'ऋषिपञ्चमीकथाश्रवणम्'],
        deity: 'सप्तर्षयः',
      },
      kn: {
        name: 'ಋಷಿ ಪಂಚಮಿ',
        description: 'ಸಪ್ತರ್ಷಿಗಳನ್ನು ಗೌರವಿಸುವ ಪ್ರಾಯಶ್ಚಿತ್ತ ಉಪವಾಸ',
        significance: 'ವೇದ ಜ್ಞಾನ ಕಾಯುವ ಸಪ್ತರ್ಷಿಗಳನ್ನು ಉಪವಾಸ ಮತ್ತು ಪ್ರಾಯಶ್ಚಿತ್ತದಿಂದ ಗೌರವಿಸಲಾಗುತ್ತದೆ. ಮಹಿಳೆಯರು ಅರಿವಿಲ್ಲದೆ ಆದ ತಪ್ಪುಗಳ ಶುದ್ಧಿಗಾಗಿ ಪವಿತ್ರ ಗಿಡಮೂಲಿಕೆ ಸ್ನಾನ ಮಾಡಿ ಋಷಿಗಳಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸುತ್ತಾರೆ.',
        rituals: ['ಪವಿತ್ರ ಗಿಡಮೂಲಿಕೆಗಳಿಂದ ಸ್ನಾನ ಮಾಡಿ', 'ಸಪ್ತರ್ಷಿಗಳಿಗೆ ಅರ್ಘ್ಯ ಅರ್ಪಿಸಿ', 'ಧಾನ್ಯವಿಲ್ಲದೆ ಒಂದೇ ಊಟದ ಉಪವಾಸವಿರಿ', 'ಋಷಿ ಪಂಚಮಿ ವ್ರತ ಕಥೆ ಪಠಿಸಿ'],
        deity: 'ಸಪ್ತರ್ಷಿಗಳು',
      },
      te: {
        name: 'ఋషి పంచమి',
        description: 'సప్తర్షులకు ప్రాయశ్చిత్త ఉపవాసం',
        significance: 'వేదజ్ఞానం కాపాడే సప్తర్షులను గౌరవించే రోజు. తెలిసీ తెలియక చేసిన తప్పులకు ప్రాయశ్చిత్తంగా ఉపవాసం పవిత్ర స్నానం చేస్తారు.',
        rituals: ['పవిత్ర మూలికలతో స్నానం చేయండి', 'సప్తర్షులకు తర్పణం వదలండి', 'ధాన్యం లేకుండా ఒంటిపూట భోజనం చేయండి', 'వ్రత కథ వినండి'],
        deity: 'సప్తర్షులు',
      },
      ta: {
        name: 'ரிஷி பஞ்சமி',
        description: 'ஏழு முனிவரைப் போற்றும் விரதம்',
        significance: 'வேத ஞானம் காக்கும் சப்த ரிஷிகளைப் போற்றும் நாள். அறியாமல் நேர்ந்த குறை நீங்கப் பெண்கள் புனித மூலிகை நீராடி விரதமிருந்து முனிவர்களுக்கு அர்க்கியம் தருகின்றனர்.',
        rituals: ['புனித மூலிகையால் நீராடு', 'ஏழு முனிவருக்கு அர்க்கியம் தா', 'தானியமின்றி ஒருவேளை விரதம் இரு', 'விரதக் கதை படித்திடு'],
        deity: 'சப்த ரிஷிகள்',
      },
    },
    description: 'Atonement fast honouring seven sages',
    significance: 'Honours the Sapta Rishis, the seven seers who guard Vedic wisdom, through fasting and atonement rites. Women observe this Panchami seeking purification from inadvertent ritual faults, bathing with sacred herbs and offering oblations to the sages. It upholds reverence for teachers and the discipline of corrective penance.',
    rituals: ['Bathe using sacred cleansing herbs', 'Offer oblations to seven sages', 'Keep single grainless meal fast', 'Recite Rishi Panchami vrata katha'],
    deity: 'Sapta Rishis',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'minor'
  },
  {
    id: 'radhashtami',
    name: 'Radhashtami',
    nameHindi: 'राधाष्टमी',
    i18n: {
      hi: {
        name: 'राधाष्टमी',
        description: 'राधा का जन्मोत्सव',
        significance: 'कृष्ण की नित्य संगिनी राधा का बरसाना जन्म; मंदिरों में पंचामृत स्नान और मध्याह्न पूजन होता है।',
        rituals: ['राधा विग्रह को पंचामृत स्नान कराएं', 'विग्रह को नवजात शिशु सजाएं', 'मिठाई और सफेद फूल चढ़ाएं', 'मध्याह्न में राधा महिमा गाएं'],
        deity: 'राधा',
      },
      sa: {
        name: 'राधाष्टमी',
        description: 'राधाजन्मदिवसः',
        significance: 'कृष्णप्रेयस्याः राधायाः जन्मदिवसः। बरसानायां मध्याह्ने उत्सवः। राधाकृपया एव कृष्णः प्राप्यते।',
        rituals: ['पञ्चामृतेन राधास्नापनम्', 'नवजातवेषालङ्कारः', 'मिष्टान्नश्वेतपुष्पार्पणम्', 'मध्याह्ने राधामहिमगायनम्'],
        deity: 'राधा',
      },
      kn: {
        name: 'ರಾಧಾಷ್ಟಮಿ',
        description: 'ರಾಧಾ ದೇವಿಯ ಜನ್ಮೋತ್ಸವ',
        significance: 'ಕೃಷ್ಣನ ನಿತ್ಯ ಸಂಗಾತಿ, ನಿಸ್ವಾರ್ಥ ಭಕ್ತಿಯ ಮೂರ್ತಿ ರಾಧೆಯ ಜನ್ಮದ ಆಚರಣೆ. ದೇವಸ್ಥಾನಗಳಲ್ಲಿ ಪಂಚಾಮೃತ ಸ್ನಾನ ಮಾಡಿಸಿ ನವಜಾತ ಶಿಶುವಾಗಿ ಅಲಂಕರಿಸಿ ಮಧ್ಯಾಹ್ನ ಮಹಿಮೆ ಹಾಡಲಾಗುತ್ತದೆ.',
        rituals: ['ಪಂಚಾಮೃತದಿಂದ ರಾಧಾ ಮೂರ್ತಿಗೆ ಸ್ನಾನ ಮಾಡಿಸಿ', 'ಮೂರ್ತಿಯನ್ನು ನವಜಾತ ಮಗುವಾಗಿ ಅಲಂಕರಿಸಿ', 'ಸಿಹಿ ಮತ್ತು ಬಿಳಿ ಹೂವು ಅರ್ಪಿಸಿ', 'ಮಧ್ಯಾಹ್ನ ರಾಧಾ ಮಹಿಮೆ ಹಾಡಿ'],
        deity: 'ರಾಧಾ',
      },
      te: {
        name: 'రాధాష్టమి',
        description: 'రాధాదేవి జన్మోత్సవం',
        significance: 'కృష్ణుని నిత్య సహచరి రాధాదేవి జన్మదినం. బర్సానాలో మధ్యాహ్నం వేడుక చేస్తారు. రాధ కృపతోనే కృష్ణుడు లభిస్తాడని నమ్ముతారు.',
        rituals: ['రాధ విగ్రహానికి పంచామృత స్నానం చేయించండి', 'పసిపాపలా అలంకరించండి', 'స్వీట్లు తెల్లపూలు సమర్పించండి', 'మధ్యాహ్నం రాధా కీర్తనలు పాడండి'],
        deity: 'రాధాదేవి',
      },
      ta: {
        name: 'ராதாஷ்டமி',
        description: 'ராதை பிறந்த கொண்டாட்டம்',
        significance: 'கிருஷ்ணரின் அன்புத் துணையான ராதை நண்பகலில் பிறந்த நாள். கோயில்களில் பஞ்சாமிர்த நீராட்டி, குழந்தையாய் அலங்கரித்துப் பாடுகின்றனர். ராதை அருளாலே கிருஷ்ணரை அடையலாம்.',
        rituals: ['ராதை சிலைக்குப் பஞ்சாமிர்தம் ஆட்டு', 'குழந்தையாய் அலங்கரித்திடு', 'இனிப்பு வெள்ளை மலர் படைத்திடு', 'நண்பகலில் ராதை புகழ் பாடு'],
        deity: 'ராதை',
      },
    },
    description: 'Birth celebration of Goddess Radha',
    significance: 'Celebrates the birth of Radha, Krishna’s eternal consort and embodiment of selfless devotion, born at midday in Barsana. Temples bathe her idol in panchamrita, dress her as a newborn, and sing her glories through the day. Devotees seek her grace first, for Krishna is reached only through Radha’s compassion.',
    rituals: ['Bathe Radha idol with panchamrita', 'Dress idol as newborn child', 'Offer sweets and white flowers', 'Sing Radha glories at midday'],
    deity: 'Radha',
    tithiNumber: 8,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'major',
    region: ['Braj', 'Bengal'],
    vyapti: 'madhyahna', // Radha was born at midday
  },
  {
    id: 'narasimha-jayanti',
    name: 'Narasimha Jayanti',
    nameHindi: 'नरसिंह जयंती',
    i18n: {
      hi: {
        name: 'नरसिंह जयंती',
        description: 'नरसिंह का संध्या प्राकट्य',
        significance: 'प्रह्लाद रक्षा हेतु खंभे से नरसिंह प्राकट्य की स्मृति; गोधूलि बेला में उपवास तोड़कर पूजन होता है।',
        rituals: ['प्राकट्य बेला संध्या तक व्रत रखें', 'गुड़ का शरबत और तुलसी चढ़ाएं', 'नरसिंह कवच और स्तोत्र पढ़ें', 'गोधूलि में घी के दीप जलाएं'],
        deity: 'नरसिंह',
      },
      sa: {
        name: 'नृसिंहजयन्ती',
        description: 'नृसिंहप्राकट्यदिवसः',
        significance: 'विष्णुः स्तम्भात् नृसिंहरूपेण प्रकटः प्रह्लादं ररक्ष। सन्ध्याकाले पूजनं प्रधानम्।',
        rituals: ['सन्ध्यापर्यन्तं व्रतम्', 'गुडजलतुलस्यर्पणम्', 'नृसिंहकवचस्तोत्रपठनम्', 'सन्ध्याकाले घृतदीपप्रज्वालनम्'],
        deity: 'नृसिंहः',
      },
      kn: {
        name: 'ನರಸಿಂಹ ಜಯಂತಿ',
        description: 'ಸಂಜೆ ಕಾಣಿಸಿಕೊಂಡ ನರಸಿಂಹ',
        significance: 'ಪ್ರಹ್ಲಾದನನ್ನು ರಕ್ಷಿಸಲು ವಿಷ್ಣುವು ಕಂಬದಿಂದ ನರಸಿಂಹನಾಗಿ ಸಂಜೆ ಕಾಣಿಸಿಕೊಂಡ ನೆನಪು. ಸಂಜೆ ಉಪವಾಸ ಮುರಿದು ಪೂಜೆ ಮಾಡಲಾಗುತ್ತದೆ. ಭಕ್ತಿ ನಾಶದಂಚಿನಲ್ಲಿದ್ದಾಗ ದೈವಿಕ ರಕ್ಷಣೆ ಬರುತ್ತದೆಂಬುದರ ಸಂಕೇತ.',
        rituals: ['ಮುಸ್ಸಂಜೆಯವರೆಗೆ ಉಪವಾಸವಿರಿ', 'ಬೆಲ್ಲದ ನೀರು ಮತ್ತು ತುಳಸಿ ಅರ್ಪಿಸಿ', 'ನರಸಿಂಹ ಕವಚ ಮತ್ತು ಸ್ತೋತ್ರ ಪಠಿಸಿ', 'ಮುಸ್ಸಂಜೆಯಲ್ಲಿ ತುಪ್ಪದ ದೀಪ ಹಚ್ಚಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'నరసింహ జయంతి',
        description: 'నరసింహుని సంధ్యా అవతారం',
        significance: 'ప్రహ్లాదుని కాపాడేందుకు విష్ణువు స్తంభం నుండి నరసింహుడిగా వచ్చిన రోజు. సంధ్యవేళ పూజ విశేషం. భక్తికి రక్షణ లభిస్తుందని భావన.',
        rituals: ['సంధ్య వరకు ఉపవాసం ఉండండి', 'బెల్లం పానకం తులసి సమర్పించండి', 'నరసింహ కవచం స్తోత్రాలు పఠించండి', 'సంధ్యలో నేతి దీపాలు వెలిగించండి'],
        deity: 'నరసింహుడు',
      },
      ta: {
        name: 'நரசிம்ம ஜெயந்தி',
        description: 'அந்தியில் தோன்றிய நரசிம்மர்',
        significance: 'பிரகலாதனைக் காக்க விஷ்ணு தூணிலிருந்து நரசிம்மராய் அந்தியில் வெளிப்பட்ட நாள். மாலையில் வழிபாடு சிறக்கிறது; பக்தி ஆபத்தில் இருக்கும்போது இறை காப்பு வரும் என்பதன் அடையாளம்.',
        rituals: ['அந்தி வரை விரதம் இரு', 'வெல்ல நீர் துளசி படைத்திடு', 'நரசிம்ம கவச துதி படித்திடு', 'அந்தியில் நெய் விளக்கேற்று'],
        deity: 'நரசிம்மர்',
      },
    },
    description: 'Fiery dusk appearance of Narasimha',
    significance: 'Marks Vishnu bursting from a pillar at dusk as Narasimha, half lion and half man, to rescue Prahlada from Hiranyakashipu. Because the manifestation occurred at twilight, worship peaks in the evening with fasting broken after sunset. It affirms that divine protection arrives precisely when devotion faces annihilation.',
    rituals: ['Fast till dusk manifestation hour', 'Offer jaggery water and tulsi', 'Recite Narasimha kavacha and stotras', 'Light ghee lamps at twilight'],
    deity: 'Narasimha',
    tithiNumber: 14,
    paksha: 'Shukla',
    month: 2, // Vaishakha
    type: 'major',
    vyapti: 'pradosh', // Narasimha appeared at twilight
  },
  {
    id: 'jivitputrika',
    name: 'Jivitputrika',
    nameHindi: 'जीवित्पुत्रिका',
    i18n: {
      hi: {
        name: 'जीवित्पुत्रिका',
        description: 'संतान हेतु माताओं का निर्जल व्रत',
        significance: 'संतान की दीर्घायु हेतु माताओं का कठिन निर्जल व्रत; जीमूतवाहन के आत्मबलिदान की कथा से जुड़ा है।',
        rituals: ['व्रत से पहले ritual भोज करें', 'दिनभर कठोर निर्जल व्रत रखें', 'संध्या को जीमूतवाहन कथा सुनें', 'संतान को रक्षा धागा बाँधें'],
        deity: 'जीमूतवाहन',
      },
      sa: {
        name: 'जीवित्पुत्रिका',
        description: 'पुत्रहिताय निर्जलव्रतम्',
        significance: 'मातरः पुत्रदीर्घायुषः कृते निर्जलव्रतं चरन्ति। जीमूतवाहनस्य आत्मत्यागः अत्र स्मर्यते।',
        rituals: ['व्रतात् पूर्वं विधिपूर्वकं भोजनम्', 'दिनं निर्जलकठोरव्रतम्', 'सायं जीमूतवाहनकथाश्रवणम्', 'बालेभ्यः रक्षासूत्रबन्धनम्'],
        deity: 'जीमूतवाहनः',
      },
      kn: {
        name: 'ಜೀವಿತ್ಪುತ್ರಿಕಾ',
        description: 'ಮಕ್ಕಳಿಗಾಗಿ ತಾಯಂದಿರ ನಿರ್ಜಲ ಉಪವಾಸ',
        significance: 'ಮಕ್ಕಳ ದೀರ್ಘಾಯುಷ್ಯಕ್ಕಾಗಿ ತಾಯಂದಿರು ಕಠಿಣ ನಿರ್ಜಲ ಉಪವಾಸ ಮಾಡುತ್ತಾರೆ. ಜೀಮೂತವಾಹನನು ಹಾವಿನ ಮಗುವನ್ನು ಉಳಿಸಲು ತನ್ನನ್ನು ಅರ್ಪಿಸಿದ ಕಥೆಯ ಮೇಲೆ ನಿಂತಿದೆ. ಮಕ್ಕಳಿಗೆ ದಾರ ಕಟ್ಟಿ ಆಶೀರ್ವದಿಸಲಾಗುತ್ತದೆ.',
        rituals: ['ಉಪವಾಸದ ದಿನಕ್ಕೆ ಮುನ್ನ ವಿಧ್ಯುಕ್ತ ಭೋಜನ ಮಾಡಿ', 'ದಿನವಿಡೀ ಕಠಿಣ ನಿರ್ಜಲ ಉಪವಾಸವಿರಿ', 'ಸಂಜೆ ಜೀಮೂತವಾಹನ ಕಥೆ ಕೇಳಿ', 'ಮಕ್ಕಳಿಗೆ ಆಶೀರ್ವಾದದ ದಾರ ಕಟ್ಟಿ'],
        deity: 'ಜೀಮೂತವಾಹನ',
      },
      te: {
        name: 'జివిత్‌పుత్రిక',
        description: 'పిల్లల కోసం తల్లుల నిర్జల ఉపవాసం',
        significance: 'పిల్లల ఆయుష్షు కోసం తల్లులు నీరు కూడా తీసుకోకుండా చేసే కఠిన ఉపవాసం. జీమూతవాహనుని త్యాగకథకు గుర్తు.',
        rituals: ['ఉపవాసానికి ముందురోజు విందు చేయండి', 'రోజంతా నిర్జల ఉపవాసం ఉండండి', 'సాయంత్రం జీమూతవాహన కథ వినండి', 'పిల్లలకు రక్షణ దారం కట్టండి'],
        deity: 'జీమూతవాహనుడు',
      },
      ta: {
        name: 'ஜிவித்புத்ரிகா',
        description: 'குழந்தைகளுக்காக அன்னையர் நோற்கும் நீர் விரதம்',
        significance: 'குழந்தைகளின் நீண்ட ஆயுள் நலனுக்காக அன்னையர் நீரின்றிக் கடும் விரதம் நோற்கும் நாள். தாய்மையின் தாங்கும் சக்தியைப் போற்றுகிறது; குழந்தைகளுக்குக் காப்பு நூல் கட்டப்படுகிறது.',
        rituals: ['விரதத்திற்கு முன் முறையாய் விருந்துண்', 'நாளெல்லாம் நீரின்றி விரதம் இரு', 'மாலையில் விரதக் கதை கேட்டிடு', 'குழந்தைகளுக்குக் காப்பு நூல் கட்டு'],
        deity: 'ஜிமூதவாகனன்',
      },
    },
    description: 'Waterless mothers fast for children',
    significance: 'Mothers undertake a gruelling waterless fast for the long life and welfare of their children, rooted in Prince Jimutavahana sacrificing himself to Garuda to save a serpent child. Preceded by ritual feasting and closed by dawn feasting, the three-day observance honours maternal endurance. Its thread tied on children seals the blessing.',
    rituals: ['Feast ritually before fasting day', 'Keep strict waterless daylong fast', 'Hear Jimutavahana katha at evening', 'Tie blessed thread on children'],
    deity: 'Jimutavahana',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 7, // Ashwin (purnimanta; = amanta Bhadrapada Krishna Ashtami)
    type: 'major',
    region: ['Bihar', 'Jharkhand', 'Nepal'],
    monthBasis: 'purnimanta',
    vyapti: 'madhyahna', // all-day nirjala vrat: Ashtami must hold midday (2026: onset 08:00 Oct 3, udaya Saptami)
  },
  {
    id: 'vivah-panchami',
    name: 'Vivah Panchami',
    nameHindi: 'विवाह पंचमी',
    i18n: {
      hi: {
        name: 'विवाह पंचमी',
        description: 'राम-सीता विवाह वर्षगांठ',
        significance: 'जनकपुर में शिव धनुष टूटने पर राम-सीता विवाह की स्मृति; मंदिरों में बारात सहित दिव्य विवाह रचता है।',
        rituals: ['बारात सहित दिव्य विवाह रचाएं', 'राम-सीता विग्रह भव्य सजाएं', 'विवाह मंत्र और आशीर्वाद पढ़ें', 'festive विवाह भोज बाँटें'],
        deity: 'राम और सीता',
      },
      sa: {
        name: 'विवाहपञ्चमी',
        description: 'रामसीताविवाहदिवसः',
        significance: 'जनकपुरे रामसीतयोः विवाहः अभवत्। मन्दिरेषु पूर्णविवाहोत्सवः क्रियते।',
        rituals: ['बरातसहितदिव्यविवाहायोजनम्', 'रामसीताप्रतिमालङ्कारः', 'विवाहमन्त्राशीर्वादपठनम्', 'विवाहभोजनविनिमयः'],
        deity: 'रामः',
      },
      kn: {
        name: 'ವಿವಾಹ ಪಂಚಮಿ',
        description: 'ರಾಮ-ಸೀತೆಯ ವಿವಾಹ ವಾರ್ಷಿಕೋತ್ಸವ',
        significance: 'ಜನಕಪುರದಲ್ಲಿ ಶಿವಧನುಸ್ಸು ಮುರಿದು ರಾಮ-ಸೀತೆಯ ವಿವಾಹವಾದ ನೆನಪು. ದೇವಸ್ಥಾನಗಳಲ್ಲಿ ಬಾರಾತ್, ಸಂಕಲ್ಪ ಮತ್ತು ಭೋಜನದೊಂದಿಗೆ ಪೂರ್ಣ ವಿವಾಹ ನಡೆಸಲಾಗುತ್ತದೆ. ಆದರ್ಶ ದಾಂಪತ್ಯವನ್ನು ಸಂಭ್ರಮಿಸುತ್ತದೆ.',
        rituals: ['ಬಾರಾತ್‌ನೊಂದಿಗೆ ದಿವ್ಯ ವಿವಾಹ ನಡೆಸಿ', 'ರಾಮ-ಸೀತಾ ಮೂರ್ತಿಗಳನ್ನು ವೈಭವದಿಂದ ಅಲಂಕರಿಸಿ', 'ವಿವಾಹ ಮಂತ್ರ ಮತ್ತು ಆಶೀರ್ವಾದ ಪಠಿಸಿ', 'ಹಬ್ಬದ ವಿವಾಹ ಭೋಜನ ಹಂಚಿ'],
        deity: 'ರಾಮ',
      },
      te: {
        name: 'వివాహ పంచమి',
        description: 'రామ సీతల కల్యాణ వార్షికోత్సవం',
        significance: 'శివధనుస్సు విరిచి రాముడు సీతను వివాహమాడిన కథకు గుర్తు. జనక్‌పూర్‌లో బరాత్ పెళ్లి సంబరంగా జరుపుకుంటారు.',
        rituals: ['బరాత్‌తో దివ్య కల్యాణం జరపండి', 'రామ సీతలను ఘనంగా అలంకరించండి', 'కల్యాణ మంత్రాలు ఆశీర్వాదాలు పఠించండి', 'పెళ్లి విందు పంచుకోండి'],
        deity: 'రామ మరియు సీత',
      },
      ta: {
        name: 'விவாக பஞ்சமி',
        description: 'ராமர் சீதை திருமண நாள்',
        significance: 'ராமர் சீதை திருமணத்தை மீண்டும் நடத்தும் நாள். கோயில்களில் ஊர்வலம் உறுதிமொழி விருந்துடன் முழுத் திருமணம் நடக்கிறது; சிறந்த இணை வாழ்வைக் கொண்டாடுகிறது.',
        rituals: ['தெய்வத் திருமண ஊர்வலம் நடத்து', 'ராமர் சீதை சிலைகளை அலங்கரி', 'மணப் பாட்டு வாழ்த்துப் பாடு', 'திருமண விருந்து பகிர்ந்துண்'],
        deity: 'ராமர் மற்றும் சீதை',
      },
    },
    description: 'Wedding anniversary of Rama and Sita',
    significance: 'Re-enacts the wedding of Rama and Sita under Shiva’s broken bow in Janakpur, where King Janaka’s sacrifice culminated in divine union. Temples stage the full marriage with baraat, vows, and feasting as devotees celebrate ideal partnership. It crowns Mithila’s cultural calendar and draws pilgrims across the border.',
    rituals: ['Stage divine wedding with baraat', 'Adorn Rama Sita idols richly', 'Recite wedding hymns and blessings', 'Share festive wedding feast'],
    deity: 'Rama and Sita',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 9, // Margashirsha
    type: 'major',
    region: ['Mithila', 'Nepal']
  },
  {
    id: 'dattatreya-jayanti',
    name: 'Dattatreya Jayanti',
    nameHindi: 'दत्तात्रेय जयंती',
    i18n: {
      hi: {
        name: 'दत्तात्रेय जयंती',
        description: 'त्रिमूर्ति तपस्वी का जन्म',
        significance: 'ब्रह्मा-विष्णु-शिव स्वरूप दत्तात्रेय का जन्म; औदुंबर वृक्ष परिक्रमा और गुरु चरित्र पाठ होता है।',
        rituals: ['दत्त मंत्र और स्तोत्र जपें', 'औदुंबर वृक्ष की परिक्रमा करें', 'दान दें, तपस्वियों को खिलाएं', 'मध्याह्न में गुरु चरित्र पढ़ें'],
        deity: 'दत्तात्रेय',
      },
      sa: {
        name: 'दत्तात्रेयजयन्ती',
        description: 'दत्तात्रेयजन्मदिवसः',
        significance: 'ब्रह्मविष्णुशिवात्मकस्य दत्तात्रेयस्य जन्मदिवसः। गुरुतत्त्वं अत्र उत्सव्यते।',
        rituals: ['दत्तमन्त्रस्तोत्रजपः', 'औदुम्बरवृक्षप्रदक्षिणा', 'दानं यतिभोजनं च', 'मध्याह्ने गुरुचरित्रपठनम्'],
        deity: 'दत्तात्रेयः',
      },
      kn: {
        name: 'ದತ್ತಾತ್ರೇಯ ಜಯಂತಿ',
        description: 'ತ್ರಿಮೂರ್ತಿ ಸಂನ್ಯಾಸಿಯ ಜನ್ಮದಿನ',
        significance: 'ಬ್ರಹ್ಮ, ವಿಷ್ಣು ಮತ್ತು ಶಿವರನ್ನು ಒಳಗೊಂಡ ದತ್ತಾತ್ರೇಯರ ಜನ್ಮದ ಗೌರವ. ಅತ್ರಿ ಮತ್ತು ಅನಸೂಯರಿಗೆ ಜನಿಸಿದ ದತ್ತರ ಮಹಿಮೆ. ಗುರು ತತ್ವವು ಸಾಧಕರನ್ನು ಮುಕ್ತಿಯತ್ತ ನಡೆಸುತ್ತದೆಂಬುದರ ಆಚರಣೆ.',
        rituals: ['ದತ್ತ ಮಂತ್ರ ಮತ್ತು ಸ್ತೋತ್ರ ಪಠಿಸಿ', 'ಔದುಂಬರ ಮರಕ್ಕೆ ಪ್ರದಕ್ಷಿಣೆ ಹಾಕಿ', 'ದಾನ ನೀಡಿ ಸಂನ್ಯಾಸಿಗಳಿಗೆ ಅನ್ನ ನೀಡಿ', 'ಮಧ್ಯಾಹ್ನ ಗುರು ಚರಿತ್ರೆ ಓದಿ'],
        deity: 'ದತ್ತಾತ್ರೇಯ',
      },
      te: {
        name: 'దత్తాత్రేయ జయంతి',
        description: 'త్రిమూర్తి స్వరూపుని జన్మదినం',
        significance: 'బ్రహ్మ విష్ణు శివుల అంశతో జన్మించిన దత్తాత్రేయుని జన్మదినం. గురుతత్వానికి, సాధకులకు మార్గదర్శనానికి గుర్తు.',
        rituals: ['దత్త మంత్రం స్తోత్రాలు జపించండి', 'ఔదుంబర చెట్టుకు ప్రదక్షిణ చేయండి', 'దానం చేసి సాధువులకు అన్నం పెట్టండి', 'మధ్యాహ్నం గురుచరిత్ర పఠించండి'],
        deity: 'దత్తాత్రేయుడు',
      },
      ta: {
        name: 'தத்தாத்ரேய ஜெயந்தி',
        description: 'மும்மூர்த்தித் துறவியின் பிறப்பு',
        significance: 'மும்மூர்த்தி அம்சமான தத்தாத்ரேயர் பிறந்த நாள். பக்தர்கள் மந்திரம் சொல்லி, அத்தி மரத்தை வலம் வந்து, தானம் செய்கின்றனர். வடிவம் கடந்த விடுதலைக்கு வழிகாட்டும் குரு தத்துவத்தைப் போற்றும் நாள்.',
        rituals: ['தத்த மந்திர துதி சொல்', 'அத்தி மரத்தை வலம் வா', 'தானம் செய்து துறவிக்கு உணவளி', 'நண்பகலில் குரு சரித்திரம் படித்திடு'],
        deity: 'தத்தாத்ரேயர்',
      },
    },
    description: 'Birth of the triune ascetic',
    significance: 'Honours the birth of Dattatreya, the ascetic embodying Brahma, Vishnu, and Shiva, born to sage Atri and Anasuya. Datta shrines at Ganagapur and Audumbar resound with chanting as devotees circumambulate holy fig trees. The day celebrates the guru principle guiding seekers beyond form toward liberation.',
    rituals: ['Chant Datta mantra and stotras', 'Circumambulate Audumbar fig tree', 'Offer charity and feed ascetics', 'Read Guru Charitra at midday'],
    deity: 'Dattatreya',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 9, // Margashirsha
    type: 'major',
    region: ['Maharashtra', 'Karnataka'],
    vyapti: 'madhyahna', // Datta birth is observed at midday
  },
  {
    id: 'gita-jayanti',
    name: 'Gita Jayanti',
    nameHindi: 'गीता जयंती',
    i18n: {
      hi: {
        name: 'गीता जयंती',
        description: 'गीता उपदेश दिवस',
        significance: 'कुरुक्षेत्र में अर्जुन को कृष्ण के गीता उपदेश की स्मृति; समूहों में सातों सौ श्लोकों का पाठ होता है।',
        rituals: ['समूह में गीता श्लोक गाएं', 'टीका सहित एक अध्याय पढ़ें', 'कृष्ण ग्रंथ को फूल चढ़ाएं', 'ज्ञान ज्योति हेतु दीप जलाएं'],
        deity: 'कृष्ण',
      },
      sa: {
        name: 'गीताजयन्ती',
        description: 'गीतोपदेशदिवसः',
        significance: 'कुरुक्षेत्रे कृष्णः अर्जुनाय भगवद्गीताम् उपदिष्टवान्। निष्कामकर्मयोगः अत्र बोधितः।',
        rituals: ['सामूहिकगीतापठनम्', 'टीकया सह एकाध्यायाध्ययनम्', 'कृष्णग्रन्थाय पुष्पार्पणम्', 'ज्ञानाय दीपप्रज्वालनम्'],
        deity: 'कृष्णः',
      },
      kn: {
        name: 'ಗೀತಾ ಜಯಂತಿ',
        description: 'ಗೀತಾ ಉಪದೇಶದ ದಿನ',
        significance: 'ಕುರುಕ್ಷೇತ್ರದಲ್ಲಿ ಕೃಷ್ಣನು ಅರ್ಜುನನಿಗೆ ಭಗವದ್ಗೀತೆ ಬೋಧಿಸಿದ ನೆನಪು. ನಿರಾಸೆಯನ್ನು ಕರ್ತವ್ಯ ತತ್ವದಿಂದ ಪರಿಹರಿಸಿತು. ಸಭೆಗಳು ಎಲ್ಲ ಶ್ಲೋಕಗಳನ್ನು ಒಟ್ಟಿಗೆ ಪಠಿಸುತ್ತವೆ. ಬಿಕ್ಕಟ್ಟಿನಲ್ಲಿ ಧರ್ಮ ಕಾರ್ಯಕ್ಕೆ ಜೀವಂತ ಮಾರ್ಗದರ್ಶನ.',
        rituals: ['ಸಭೆಯಲ್ಲಿ ಗೀತಾ ಶ್ಲೋಕ ಪಠಿಸಿ', 'ವ್ಯಾಖ್ಯಾನದೊಂದಿಗೆ ಒಂದು ಅಧ್ಯಾಯ ಅಧ್ಯಯನ ಮಾಡಿ', 'ಕೃಷ್ಣ-ಗ್ರಂಥಕ್ಕೆ ಹೂವು ಅರ್ಪಿಸಿ', 'ಜ್ಞಾನದ ಬೆಳಕಿಗೆ ದೀಪ ಹಚ್ಚಿ'],
        deity: 'ಕೃಷ್ಣ',
      },
      te: {
        name: 'గీతా జయంతి',
        description: 'గీతా బోధనా దినం',
        significance: 'కురుక్షేత్రంలో అర్జునునికి కృష్ణుడు భగవద్గీత బోధించిన రోజు. కర్తవ్య బోధనకు, ధర్మబద్ధ జీవనానికి గుర్తుగా గీత పారాయణం చేస్తారు.',
        rituals: ['సామూహికంగా గీత శ్లోకాలు పఠించండి', 'ఒక అధ్యాయం వ్యాఖ్యానంతో చదవండి', 'కృష్ణునికి గీతాగ్రంథానికి పూలు సమర్పించండి', 'జ్ఞానానికి గుర్తుగా దీపాలు వెలిగించండి'],
        deity: 'కృష్ణ',
      },
      ta: {
        name: 'கீதா ஜெயந்தி',
        description: 'கீதை உரைத்த நாள்',
        significance: 'போர்க்களத்தில் அர்ச்சுனனுக்குக் கிருஷ்ணர் பகவத் கீதை உரைத்த நாள். பற்றின்றிக் கடமை செய்யும் தத்துவத்தைத் தந்தது. கூட்டமாய் கீதை பாராயணம் செய்யப்படுகிறது.',
        rituals: ['கூட்டமாய் கீதை பாராயணம் செய்', 'ஒரு அத்தியாயம் உரையுடன் படித்திடு', 'கிருஷ்ண நூலுக்கு மலர் படைத்திடு', 'ஞான ஒளிக்காய் விளக்கேற்று'],
        deity: 'கிருஷ்ணர்',
      },
    },
    description: 'Day of the Gita discourse',
    significance: 'Marks Krishna delivering the Bhagavad Gita to Arjuna on Kurukshetra’s battlefield, resolving despair with the philosophy of duty without attachment. Congregations chant all seven hundred verses in unison at Kurukshetra and beyond. It honours scripture as living counsel for righteous action amid crisis.',
    rituals: ['Chant Gita verses in congregation', 'Study one chapter with commentary', 'Offer flowers to Krishna scripture', 'Light lamps for guiding wisdom'],
    deity: 'Krishna',
    tithiNumber: 11,
    paksha: 'Shukla',
    month: 9, // Margashirsha
    type: 'major'
  },
  {
    id: 'vamana-jayanti',
    name: 'Vamana Jayanti',
    nameHindi: 'वामन जयंती',
    i18n: {
      hi: {
        name: 'वामन जयंती',
        description: 'लोक नापने वाला वामन अवतार',
        significance: 'राजा बलि से तीन पगों में तीनों लोक मांगने वाले वामन की स्मृति; मध्याह्न विष्णु पूजन और दान होता है।',
        rituals: ['परिवार सहित वामन कथा सुनें', 'मध्याह्न में विष्णु पूजें', 'अन्न और दक्षिणा उदार दें', 'द्वार पर बलि चरण बनाएं'],
        deity: 'वामन',
      },
      sa: {
        name: 'वामनजयन्ती',
        description: 'वामनावतारदिवसः',
        significance: 'विष्णुः वामनरूपेण बलेः सकाशात् त्रिलोकं त्रिभिः क्रमैः प्रत्यगृह्णात्। केरळे एषा तिथिः ओणम् अलङ्करोति।',
        rituals: ['कुटुम्बेन सह वामनकथाश्रवणम्', 'मध्याह्ने विष्णुपूजनम्', 'अन्नदक्षिणादानम्', 'द्वारे बलिपादचिह्नलेखनम्'],
        deity: 'विष्णुः',
      },
      kn: {
        name: 'ವಾಮನ ಜಯಂತಿ',
        description: 'ಜಗತ್ತನ್ನು ಅಳೆದ ಕುಬ್ಜ ಅವತಾರ',
        significance: 'ಬಲಿಯಿಂದ ಮೂರು ಲೋಕಗಳನ್ನು ಮೂರು ಹೆಜ್ಜೆಗಳಿಂದ ಮರಳಿ ಪಡೆದ ವಿಷ್ಣುವಿನ ವಾಮನ ಅವತಾರದ ಆಚರಣೆ. ಉದಾರ ಅಸುರನನ್ನು ನಾಶಮಾಡದೆ ಸಮತೋಲನ ಮರುಸ್ಥಾಪಿಸಿತು. ಮಧ್ಯಾಹ್ನ ವಿಷ್ಣು ಪೂಜೆ ಮತ್ತು ದಾನ ವಿಶೇಷ.',
        rituals: ['ಕುಟುಂಬದೊಂದಿಗೆ ವಾಮನ ಕಥೆ ಕೇಳಿ', 'ಮಧ್ಯಾಹ್ನ ವಿಷ್ಣುವನ್ನು ಪೂಜಿಸಿ', 'ಆಹಾರ ಮತ್ತು ದಕ್ಷಿಣೆ ಉದಾರವಾಗಿ ದಾನ ನೀಡಿ', 'ಬಾಗಿಲಲ್ಲಿ ಬಲಿಯ ಹೆಜ್ಜೆ ಬಿಡಿ'],
        deity: 'ವಿಷ್ಣು',
      },
      te: {
        name: 'వామన జయంతి',
        description: 'మూడు లోకాలు కొలిచిన వామనుడు',
        significance: 'బలి చక్రవర్తి నుండి మూడు లోకాలు తిరిగి తీసుకునేందుకు విష్ణువు వామనుడిగా వచ్చిన రోజు. దానం ధర్మానికి గుర్తు.',
        rituals: ['కుటుంబంతో వామన కథ వినండి', 'మధ్యాహ్నం విష్ణువును పూజించండి', 'అన్నదానం దక్షిణ ఇవ్వండి', 'గుమ్మంలో బలి పాదాలు వేయండి'],
        deity: 'వామనుడు',
      },
      ta: {
        name: 'வாமன ஜெயந்தி',
        description: 'உலகளந்த குள்ள அவதாரம்',
        significance: 'மன்னன் மகாபலியிடமிருந்து மூன்று அடியால் மூவுலகை விஷ்ணு வாமனராய் மீட்ட நாள். குடும்பத்துடன் கதை கேட்டு, நண்பகலில் விஷ்ணுவை வழிபட்டு, தானம் தரப்படுகிறது.',
        rituals: ['குடும்பத்துடன் வாமன கதை கேட்டிடு', 'நண்பகலில் விஷ்ணுவை வழிபடு', 'உணவு தட்சிணை தாராளமாய்த் தந்திடு', 'வாயிலில் மகாபலி பாதம் வரைந்திடு'],
        deity: 'வாமனர்',
      },
    },
    description: 'Dwarf avatar who measured worlds',
    significance: 'Celebrates Vishnu’s dwarf avatar Vamana reclaiming the three worlds from King Bali with three strides, restoring cosmic balance without destroying the generous asura. Devotees hear the Vamana katha, worship Vishnu at noon, and give charity to Brahmins. In Kerala the same tithi crowns Onam’s honouring of Bali.',
    rituals: ['Hear Vamana katha with family', 'Worship Vishnu at midday', 'Donate food and dakshina generously', 'Draw Bali footprints at doorway'],
    deity: 'Vamana',
    tithiNumber: 12,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'minor'
  },
  {
    id: 'ratha-saptami',
    name: 'Ratha Saptami',
    nameHindi: 'रथ सप्तमी',
    i18n: {
      hi: {
        name: 'रथ सप्तमी',
        description: 'सूर्य जन्म और रथ मोड़',
        significance: 'सूर्य के जन्म और उत्तरायण रथ मोड़ का उत्सव; सूर्योदय स्नान और आदित्य हृदय पाठ होता है।',
        rituals: ['पूर्वमुख सूर्योदय स्नान करें', 'सात अश्वों वाली रंगोली बनाएं', 'आदित्य हृदय स्तोत्र पढ़ें', 'उगते सूर्य को जल दें'],
        deity: 'सूर्य',
      },
      sa: {
        name: 'रथसप्तमी',
        description: 'सूर्यजन्मदिवसः',
        significance: 'सूर्यस्य जन्मदिवसः। तस्य रथः उत्तरायणाभिमुखं परिवर्तते। प्रातःस्नानं आदित्यहृदयपठनं च क्रियते।',
        rituals: ['प्राच्यभिमुखं प्रातःस्नानम्', 'सप्ताश्वरथरङ्गोलीलेखनम्', 'आदित्यहृदयपठनम्', 'उदयते सूर्याय जलार्पणम्'],
        deity: 'सूर्यः',
      },
      kn: {
        name: 'ರಥ ಸಪ್ತಮಿ',
        description: 'ಸೂರ್ಯನ ಜನ್ಮದಿನ ಮತ್ತು ರಥ ತಿರುವು',
        significance: 'ಸೂರ್ಯನ ಜನ್ಮದಿನ, ರಥ ಉತ್ತರದೆಡೆಗೆ ತಿರುಗುತ್ತದೆ, ದಿನಗಳು ಉದ್ದವಾಗುತ್ತವೆ. ಭಕ್ತರು ಸೂರ್ಯೋದಯದಲ್ಲಿ ಸ್ನಾನ ಮಾಡಿ ಏಳು ಕುದುರೆಗಳ ರಂಗೋಲಿ ಬಿಡಿ ಆದಿತ್ಯ ಹೃದಯ ಪಠಿಸುತ್ತಾರೆ.',
        rituals: ['ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಸೂರ್ಯೋದಯದಲ್ಲಿ ಸ್ನಾನ ಮಾಡಿ', 'ಏಳು ಕುದುರೆಗಳ ರಥ ರಂಗೋಲಿ ಬಿಡಿ', 'ಆದಿತ್ಯ ಹೃದಯ ಸ್ತೋತ್ರ ಪಠಿಸಿ', 'ಏರುವ ಸೂರ್ಯನಿಗೆ ನೀರು ಅರ್ಪಿಸಿ'],
        deity: 'ಸೂರ್ಯ',
      },
      te: {
        name: 'రథ సప్తమి',
        description: 'సూర్యుని జన్మదినం రథ మలుపు',
        significance: 'సూర్యుని జన్మదినంగా, రథం ఉత్తరానికు తిరిగే రోజుగా జరుపుకుంటారు. ఆరోగ్యం వెలుగు కోసం సూర్యునికి నీళ్లు వదిలి ఆదిత్య హృదయం పఠిస్తారు.',
        rituals: ['తెల్లవారున తూర్పుకు తిరిగి స్నానం చేయండి', 'ఏడు గుర్రాల రథ ముగ్గు వేయండి', 'ఆదిత్య హృదయం పఠించండి', 'ఉదయించే సూర్యునికి నీళ్లు వదలండి'],
        deity: 'సూర్య',
      },
      ta: {
        name: 'ரத சப்தமி',
        description: 'சூரியன் பிறந்த நாள் தேர்த் திருப்பம்',
        significance: 'சூரியனின் பிறந்த நாளாகவும், தேர் வடக்கு நோக்கித் திரும்பும் நாளாகவும் கொண்டாடப்படுகிறது. விடியலில் நீராடி, ஏழு குதிரைத் தேர்க் கோலமிட்டு, ஆதித்ய ஹிருதயம் படிக்கப்படுகிறது.',
        rituals: ['கிழக்கு நோக்கி விடியலில் நீராடு', 'ஏழு குதிரைத் தேர்க் கோலமிடு', 'ஆதித்ய ஹிருதயம் படித்திடு', 'எழும் சூரியனுக்கு நீர் தந்திடு'],
        deity: 'சூரியன்',
      },
    },
    description: 'Sun god birthday and chariot turn',
    significance: 'Hails Surya’s birthday as his chariot turns toward the northern hemisphere, promising lengthening days and returning warmth. Devotees bathe at sunrise, draw chariot rangolis with seven horses, and chant the Aditya Hridayam. Tirumala stages a one-day Brahmotsavam carrying the deity on seven vahanas.',
    rituals: ['Bathe at sunrise facing east', 'Draw seven-horse chariot rangoli', 'Chant Aditya Hridayam hymn', 'Offer water to rising sun'],
    deity: 'Surya',
    tithiNumber: 7,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'minor',
    region: ['South India', 'Maharashtra']
  },
  {
    id: 'bhishma-ashtami',
    name: 'Bhishma Ashtami',
    nameHindi: 'भीष्म अष्टमी',
    i18n: {
      hi: {
        name: 'भीष्म अष्टमी',
        description: 'भीष्म का निर्वाण दिवस',
        significance: 'उत्तरायण आरंभ पर शरशय्या से भीष्म प्रस्थान की स्मृति; तिल तर्पण और विष्णु सहस्रनाम पाठ होता है।',
        rituals: ['तिल जल से तर्पण दें', 'विष्णु सहस्रनाम पूरा पढ़ें', 'बुजुर्गों का उपहार सहित सम्मान करें', 'पितरों हेतु दीप जलाएं'],
        deity: 'भीष्म',
      },
      sa: {
        name: 'भीष्माष्टमी',
        description: 'भीष्मनिर्वाणदिवसः',
        significance: 'भीष्मः शरशय्यायाम् उत्तरायणारम्भे स्वेच्छया देहं त्यक्तवान्। तिलतर्पणं सहस्रनामपठनं च क्रियते।',
        rituals: ['तिलोदकतर्पणम्', 'विष्णुसहस्रनामपठनम्', 'ज्येष्ठानां सत्कारः दानं च', 'पितृभ्यः दीपप्रज्वालनम्'],
        deity: 'भीष्मः',
      },
      kn: {
        name: 'ಭೀಷ್ಮ ಅಷ್ಟಮಿ',
        description: 'ಭೀಷ್ಮರ ನಿರ್ಯಾಣ ದಿನ',
        significance: 'ಶರಶಯ್ಯೆಯ ಮೇಲೆ ಭೀಷ್ಮರು ದೇಹ ತ್ಯಜಿಸಿದ ನೆನಪು. ತಮ್ಮ ಸಮಯವನ್ನು ತಾವೇ ಆರಿಸಿಕೊಂಡರು. ಭಕ್ತರು ಎಳ್ಳು ನೀರು ಅರ್ಪಿಸಿ ಅವರು ಬೋಧಿಸಿದ ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪಠಿಸುತ್ತಾರೆ. ತ್ಯಾಗ ಮತ್ತು ಜ್ಞಾನದ ಗೌರವ.',
        rituals: ['ಎಳ್ಳು ಬೆರೆಸಿದ ನೀರು ಅರ್ಪಿಸಿ', 'ವಿಷ್ಣು ಸಹಸ್ರನಾಮ ಪೂರ್ಣ ಪಠಿಸಿ', 'ಹಿರಿಯರನ್ನು ಉಡುಗೊರೆಯಿಂದ ಗೌರವಿಸಿ', 'ಪಿತೃಗಳಿಗಾಗಿ ದೀಪ ಹಚ್ಚಿ'],
        deity: 'ಭೀಷ್ಮ',
      },
      te: {
        name: 'భీష్మాష్టమి',
        description: 'భీష్ముని నిర్యాణ దినం',
        significance: 'అంపశయ్యపై భీష్ముడు ఉత్తరాయణంలో తనువు చాలించిన రోజు. నువ్వులతో తర్పణం వదిలి విష్ణు సహస్రనామం పఠిస్తారు.',
        rituals: ['నువ్వులతో తర్పణం వదలండి', 'విష్ణు సహస్రనామం పూర్తిగా పఠించండి', 'పెద్దలను గౌరవించి బహుమతులు ఇవ్వండి', 'పితరులకు దీపం వెలిగించండి'],
        deity: 'భీష్ముడు',
      },
      ta: {
        name: 'பீஷ்ம அஷ்டமி',
        description: 'பீஷ்மரின் நினைவு நாள்',
        significance: 'அம்புப் படுக்கையில் பீஷ்மர் உடல் நீத்த நாள். எள் நீர் தர்ப்பணம் தந்து, அவர் உரைத்த விஷ்ணு சகஸ்ரநாமம் படிக்கப்படுகிறது. தியாகம் ஞானத்தைப் போற்றும் நாள்.',
        rituals: ['எள் நீர் தர்ப்பணம் தந்திடு', 'விஷ்ணு சகஸ்ரநாமம் முழுதும் படித்திடு', 'மூத்தோரைப் பரிசுடன் போற்று', 'முன்னோருக்கு விளக்கேற்று'],
        deity: 'பீஷ்மர்',
      },
    },
    description: 'Death anniversary of Bhishma',
    significance: 'Marks grandsire Bhishma leaving his body on the arrow bed at Uttarayana’s onset, choosing his moment after fifty-eight nights of discourse. Devotees offer sesame water in his memory and recite the Vishnu Sahasranama he revealed. The day honours sacrifice, wisdom, and the warrior’s mastery over death itself.',
    rituals: ['Offer sesame water libations', 'Recite Vishnu Sahasranama fully', 'Honour elders with gifts', 'Light lamp for departed ancestors'],
    deity: 'Bhishma',
    tithiNumber: 8,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'minor'
  },
  {
    id: 'kalabhairav-jayanti',
    name: 'Kalabhairav Jayanti',
    nameHindi: 'कालभैरव जयंती',
    i18n: {
      hi: {
        name: 'कालभैरव जयंती',
        description: 'शिव का मध्यरात्रि उग्र रूप',
        significance: 'समय रक्षक कालभैरव प्राकट्य की स्मृति; रात्रि जागरण, तेल दीप और श्वान सेवा से पूजन होता है।',
        rituals: ['रात्रि प्रहरों में भैरव पूजें', 'सरसों तेल के दीप जलाएं', 'काले श्वानों को श्रद्धा खिलाएं', 'स्तोत्रों सहित रात्रि जागरण करें'],
        deity: 'शिव (भैरव)',
      },
      sa: {
        name: 'कालभैरवजयन्ती',
        description: 'कालभैरवप्राकट्यदिवसः',
        significance: 'शिवः कालभैरवरूपेण प्रकटः। कालस्य वाराणस्याश्च रक्षकः सः। रात्रौ अष्टयामपूजा क्रियते।',
        rituals: ['रात्रियामेषु भैरवपूजनम्', 'सर्षपतैलदीपप्रज्वालनम्', 'कृष्णशुनां भोजनदानम्', 'स्तोत्रैः सह रात्रिजागरणम्'],
        deity: 'शिवः',
      },
      kn: {
        name: 'ಕಾಲಭೈರವ ಜಯಂತಿ',
        description: 'ಶಿವನ ಉಗ್ರ ಮಧ್ಯರಾತ್ರಿ ರೂಪ',
        significance: 'ಕಾಲದ ಮತ್ತು ವಾರಣಾಸಿಯ ಕಾವಲುಗಾರ ಕಾಲಭೈರವನಾಗಿ ಶಿವನು ಕಾಣಿಸಿಕೊಂಡ ಗೌರವ. ರಾತ್ರಿಯಿಡೀ ಸಾಸಿವೆ ಎಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ, ನಾಯಿಗಳಿಗೆ ಆಹಾರ ನೀಡಿ ಜಾಗರಣೆ ಮಾಡಲಾಗುತ್ತದೆ. ಭಯ ಮತ್ತು ಅಡೆತಡೆಗಳಿಂದ ರಕ್ಷಣೆ ಕೋರಲಾಗುತ್ತದೆ.',
        rituals: ['ರಾತ್ರಿ ಜಾವಗಳಲ್ಲಿ ಭೈರವನನ್ನು ಪೂಜಿಸಿ', 'ಸಾಸಿವೆ ಎಣ್ಣೆ ದೀಪ ಹಚ್ಚಿ', 'ಕಪ್ಪು ನಾಯಿಗಳಿಗೆ ಭಕ್ತಿಯಿಂದ ಆಹಾರ ನೀಡಿ', 'ಸ್ತೋತ್ರಗಳೊಂದಿಗೆ ರಾತ್ರಿ ಜಾಗರಣೆ ಮಾಡಿ'],
        deity: 'ಶಿವ',
      },
      te: {
        name: 'కాలభైరవ జయంతి',
        description: 'శివుని భయంకర అర్ధరాత్రి రూపం',
        significance: 'కాలానికి కాపలాదారుగా శివుడు కాలభైరవుడిగా వచ్చిన రోజు. భయం శత్రువులు ఆటంకాలు తొలగాలని రాత్రి పూజ జాగరణ చేస్తారు.',
        rituals: ['రాత్రి జాముల్లో భైరవుని పూజించండి', 'ఆవనూనె దీపాలు వెలిగించండి', 'నల్ల కుక్కలకు అన్నం పెట్టండి', 'రాత్రంతా స్తోత్రాలతో జాగరణ చేయండి'],
        deity: 'శివ',
      },
      ta: {
        name: 'காலபைரவ ஜெயந்தி',
        description: 'சிவனின் நள்ளிரவு உக்கிர வடிவம்',
        significance: 'காலத்தின் காவலனான காலபைரவராய்ச் சிவன் வெளிப்பட்ட நாள். இரவில் வழிபடப்படுகிறது; அச்சம் பகை இடையூறு நீங்கக் காப்பு வேண்டுகின்றனர்.',
        rituals: ['இரவுச் சாமங்களில் பைரவரை வழிபடு', 'கடுகெண்ணெய் விளக்கேற்று', 'கரு நாய்களுக்கு அன்புடன் உணவளி', 'பாட்டுடன் இரவு விழித்திரு'],
        deity: 'சிவன்',
      },
    },
    description: 'Fierce midnight form of Shiva',
    significance: 'Honours Shiva manifesting as Kalabhairav, the fierce guardian of time and Varanasi’s kotwal, worshipped through the night in eight watches. Devotees offer mustard oil lamps, feed black dogs as his vehicle, and keep vigil reciting his hymns. The rite seeks protection from fear, enemies, and untimely obstacles.',
    rituals: ['Worship Bhairava in night watches', 'Light mustard oil lamps', 'Feed black dogs reverently', 'Keep night vigil with hymns'],
    deity: 'Shiva (Bhairava)',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 9, // Margashirsha (purnimanta; = amanta Kartika Krishna Ashtami)
    type: 'minor',
    vyapti: 'nishita', // Bhairava is worshipped at midnight
    monthBasis: 'purnimanta',
  },
  {
    id: 'champa-shashthi',
    name: 'Champa Shashthi',
    nameHindi: 'चंपा षष्ठी',
    i18n: {
      hi: {
        name: 'चंपा षष्ठी',
        description: 'खंडोबा की असुर विजय',
        significance: 'मणि-मल्ल दानवों पर खंडोबा विजय की पूर्णता; हल्दी उड़ाकर मल्हार जयघोष होता है।',
        rituals: ['पूजन में हल्दी उड़ाएं', 'मल्हार जयघोष लगाएं', 'बैंगन भाजी-रोटी भोग लगाएं', 'जेजुरी मेला दर्शन करें'],
        deity: 'खंडोबा (शिव)',
      },
      sa: {
        name: 'चम्पाषष्ठी',
        description: 'खण्डोबाविजयदिवसः',
        significance: 'खण्डोबा मणिमल्लदानवौ हत्वा ऋषीन् अरक्षत्। भक्ताः हरिद्राचूर्णं विकिरन्ति।',
        rituals: ['पूजायां हरिद्राचूर्णविकिरणम्', 'मल्हारविजयघोषः', 'वाङ्गीकरीभाकरीनैवेद्यम्', 'जेजुरीयात्रामहोत्सवः'],
        deity: 'शिवः',
      },
      kn: {
        name: 'ಚಂಪಾ ಷಷ್ಠಿ',
        description: 'ರಾಕ್ಷಸರ ಮೇಲೆ ಖಂಡೋಬನ ವಿಜಯ',
        significance: 'ಮಣಿ ಮತ್ತು ಮಲ್ಲ ರಾಕ್ಷಸರ ಮೇಲೆ ಖಂಡೋಬನ ಆರು ದಿನಗಳ ವಿಜಯದ ಸಮಾರೋಪ. ಭಕ್ತರು ಅರಿಶಿನ ಪುಡಿ ಸುರಿಸುತ್ತಾರೆ, ಮಲ್ಹಾರ್ ಜಯಘೋಷ ಮಾಡುತ್ತಾರೆ. ಸಾಧುಗಳನ್ನು ರಕ್ಷಿಸುವ ಧೈರ್ಯದ ಸಂಕೇತ.',
        rituals: ['ಪೂಜೆಯಲ್ಲಿ ಅರಿಶಿನ ಪುಡಿ ಸುರಿಸಿ', 'ಮಲ್ಹಾರ್ ಜಯಘೋಷ ಮಾಡಿ', 'ಬದನೆ ಪಲ್ಯ ಮತ್ತು ರೊಟ್ಟಿ ಅರ್ಪಿಸಿ', 'ಜೇಜುರಿಗೆ ಭೇಟಿ ನೀಡಿ ಜಾತ್ರೆಯಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ'],
        deity: 'ಶಿವ',
      },
      te: {
        name: 'చంపా షష్ఠి',
        description: 'ఖండోబా రాక్షస సంహారం',
        significance: 'మణి మల్ల అనే రాక్షసులపై ఖండోబా విజయానికి గుర్తు. పసుపు చల్లుకుని జేజురీలో పెద్ద జాతర జరుపుకుంటారు.',
        rituals: ['పసుపు చల్లి పూజించండి', 'మల్హారీ జయఘోషలు చేయండి', 'వంకాయ కూర జొన్న రొట్టె సమర్పించండి', 'జేజురీ జాతరకు వెళ్లండి'],
        deity: 'శివ',
      },
      ta: {
        name: 'சம்பா சஷ்டி',
        description: 'கண்டோபா அரக்கரை வென்ற நாள்',
        significance: 'மணி மல்ல அரக்கர்களைக் கண்டோபா வென்றதன் நிறைவு நாள். மஞ்சள் தூவி, வெற்றி முழக்கமிட்டுக் கொண்டாடப்படுகிறது; எளியோரைக் காக்கும் துணிவின் அடையாளம்.',
        rituals: ['மஞ்சள் தூவி வழிபடு', 'மல்ஹார் வெற்றி முழக்கமிடு', 'கத்தரி கறி ரொட்டி படைத்திடு', 'ஜேஜூரி திருவிழா கண்டிடு'],
        deity: 'சிவன்',
      },
    },
    description: 'Khandoba victory over demons',
    significance: 'Culminates Khandoba’s six-day campaign defeating the demons Mani and Malla, restoring freedom to the sages of Jejuri. Devotees shower turmeric powder, raise the cry of victory to Malhar, and offer brinjal curry with millet bread. As Maharashtra’s beloved family deity, Khandoba embodies courage protecting the humble.',
    rituals: ['Shower turmeric powder in worship', 'Chant victory cries to Malhar', 'Offer brinjal curry and bread', 'Visit Jejuri for grand fair'],
    deity: 'Khandoba (Shiva)',
    tithiNumber: 6,
    paksha: 'Shukla',
    month: 9, // Margashirsha
    type: 'minor',
    region: ['Maharashtra', 'Karnataka']
  },
  {
    id: 'skanda-shashti',
    name: 'Skanda Shashti',
    nameHindi: 'स्कंद षष्ठी',
    i18n: {
      hi: {
        name: 'स्कंद षष्ठी',
        description: 'मुरुगन विजय का छह दिवसीय व्रत',
        significance: 'सूरपद्मन पर मुरुगन विजय की स्मृति; छह दिन व्रत, कावड़ और सूरसंहार पुनरभिनय होता है।',
        rituals: ['संध्या तक छह दिन व्रत रखें', 'मंदिर दूध कलश ले जाएं', 'कंद षष्ठी कवचम पढ़ें', 'सूरसंहार पुनरभिनय देखें'],
        deity: 'मुरुगन (कार्तिकेय)',
      },
      sa: {
        name: 'स्कन्दषष्ठी',
        description: 'मुरुगविजयषड्रात्रव्रतम्',
        significance: 'मुरुगः षड्दिनयुद्धेन सूरपद्मानं जघान। भक्ताः षड्दिनं व्रतं चरन्ति।',
        rituals: ['सायंपर्यन्तं षड्दिनव्रतम्', 'मन्दिरं प्रति दुग्धकलशवहनम्', 'कन्दषष्ठिकवचपठनम्', 'सूरसंहारदर्शनम्'],
        deity: 'कार्तिकेयः',
      },
      kn: {
        name: 'ಸ್ಕಂದ ಷಷ್ಠಿ',
        description: 'ಮುರುಗನ ವಿಜಯದ ಆರು ದಿನಗಳ ಉಪವಾಸ',
        significance: 'ಆರು ದಿನಗಳ ಯುದ್ಧದ ನಂತರ ಮುರುಗನು ಸುರಪದ್ಮನನ್ನು ಸಂಹರಿಸಿದ ನೆನಪು. ಭಕ್ತರು ಆರು ದಿನ ಉಪವಾಸವಿದ್ದು ಹಾಲಿನ ಕೊಡ ಹೊತ್ತು ಸ್ಕಂದ ಕವಚ ಪಠಿಸುತ್ತಾರೆ. ಅಹಂಕಾರದ ಮೇಲೆ ಯುವ ಧೈರ್ಯದ ವಿಜಯ.',
        rituals: ['ಸಂಜೆಯವರೆಗೆ ಆರು ದಿನ ಉಪವಾಸವಿರಿ', 'ದೇವಸ್ಥಾನಕ್ಕೆ ಹಾಲಿನ ಕೊಡ ಹೊತ್ತು ಹೋಗಿ', 'ಕಂದ ಷಷ್ಠಿ ಕವಚ ಪಠಿಸಿ', 'ಸೂರಸಂಹಾರ ನಾಟಕ ವೀಕ್ಷಿಸಿ'],
        deity: 'ಮುರುಗನ್',
      },
      te: {
        name: 'స్కంద షష్ఠి',
        description: 'మురుగన్ విజయ ఆరురోజుల ఉపవాసం',
        significance: 'సూరపద్మునిపై మురుగన్ విజయానికి గుర్తు. ఆరు రోజులు ఉపవాసం ఉండి పాలకుండలు మోస్తారు. యవ్వన ధైర్యానికి ప్రతీక.',
        rituals: ['సాయంత్రం వరకు ఆరు రోజులు ఉపవాసం ఉండండి', 'పాలకుండలు మోసి గుడికి వెళ్లండి', 'కంద షష్ఠి కవచం పఠించండి', 'సూరసంహారం చూడండి'],
        deity: 'మురుగన్',
      },
      ta: {
        name: 'கந்த சஷ்டி',
        description: 'முருகன் வெற்றியின் ஆறு நாள் விரதம்',
        significance: 'சூரபத்மனை முருகன் வென்றதைக் கொண்டாடும் நாள். பக்தர்கள் ஆறு நாள் விரதமிருந்து, பால்குடம் காவடி எடுத்து, சூரசம்ஹாரம் காண்கின்றனர். செருக்கை அழிக்கும் இளம் துணிவின் விழா.',
        rituals: ['மாலை வரை ஆறு நாள் விரதம் இரு', 'பால்குடம் எடுத்துக் கோயில் செல்', 'கந்த சஷ்டி கவசம் படித்திடு', 'சூரசம்ஹாரம் கண்டிடு'],
        deity: 'முருகன்',
      },
    },
    description: 'Six-day fast of Murugan victory',
    significance: 'Commemorates Murugan destroying the asura Surapadman after six days of battle, splitting the foe into peacock and rooster emblems. Devotees fast six days, carry milk pots and kavadis, and gather at Tiruchendur for the Soorasamharam re-enactment. It celebrates youthful courage annihilating arrogance and division.',
    rituals: ['Fast six days till dusk', 'Carry milk pots to temple', 'Chant Kanda Shashti Kavacham', 'Witness Soorasamharam re-enactment'],
    deity: 'Murugan (Kartikeya)',
    tithiNumber: 6,
    paksha: 'Shukla',
    month: 0, // every month
    type: 'minor',
    region: ['Tamil Nadu']
  },
  {
    id: 'vinayaka-chaturthi',
    name: 'Vinayaka Chaturthi',
    nameHindi: 'विनायक चतुर्थी',
    i18n: {
      hi: {
        name: 'विनायक चतुर्थी',
        description: 'गणेश का मासिक मध्याह्न पूजन',
        significance: 'प्रत्येक शुक्ल पक्ष में पार्वती नंदन गणेश का मध्याह्न पूजन; विघ्नहीन आरंभ की प्रार्थना होती है।',
        rituals: ['दूर्वा और मोदक अर्पित करें', 'गणेश अथर्वशीर्ष पढ़ें', 'मध्याह्न बेला में विग्रह पूजें', 'विघ्नहीन आरंभ की प्रार्थना करें'],
        deity: 'गणेश',
      },
      sa: {
        name: 'विनायकचतुर्थी',
        description: 'मासिकमध्याह्नगणेशपूजनम्',
        significance: 'प्रतिशुक्लपक्षं मध्याह्ने गणेशः पूज्यते। एषः तस्य सृष्टिकालः। दूर्वामोदकैः पूजनं क्रियते।',
        rituals: ['दूर्वामोदकार्पणम्', 'गणेशाथर्वशीर्षपठनम्', 'मध्याह्ने प्रतिमापूजनम्', 'विघ्नहीनारम्भप्रार्थना'],
        deity: 'गणेशः',
      },
      kn: {
        name: 'ವಿನಾಯಕ ಚತುರ್ಥಿ',
        description: 'ಗಣೇಶನ ಮಾಸಿಕ ಮಧ್ಯಾಹ್ನ ಪೂಜೆ',
        significance: 'ಪ್ರತಿ ಶುಕ್ಲ ಪಕ್ಷದಲ್ಲಿ ಮಧ್ಯಾಹ್ನ ಗಣೇಶನನ್ನು ಗೌರವಿಸಲಾಗುತ್ತದೆ. ಗರಿಕೆ ಮತ್ತು ಮೋದಕ ಅರ್ಪಿಸಿ ಅಥರ್ವಶೀರ್ಷ ಪಠಿಸಿ ವಿಘ್ನರಹಿತ ಆರಂಭ ಕೋರಲಾಗುತ್ತದೆ.',
        rituals: ['ಗರಿಕೆ ಮತ್ತು ಮೋದಕ ಅರ್ಪಿಸಿ', 'ಗಣೇಶ ಅಥರ್ವಶೀರ್ಷ ಪಠಿಸಿ', 'ಮಧ್ಯಾಹ್ನ ಮೂರ್ತಿಯನ್ನು ಪೂಜಿಸಿ', 'ವಿಘ್ನರಹಿತ ಆರಂಭಕ್ಕಾಗಿ ಪ್ರಾರ್ಥಿಸಿ'],
        deity: 'ಗಣೇಶ',
      },
      te: {
        name: 'వినాయక చవితి',
        description: 'వినాయకుని నెలవారీ మధ్యాహ్న పూజ',
        significance: 'ప్రతి నెల వెన్నెల చవితి మధ్యాహ్నం వినాయకుని పూజిస్తారు. ఆటంకాలు తొలగి కొత్త పనులు సఫలం కావాలని కోరుకుంటారు.',
        rituals: ['గరిక ఉండ్రాళ్లు సమర్పించండి', 'గణపతి అథర్వశీర్షం పఠించండి', 'మధ్యాహ్నం విగ్రహం పూజించండి', 'ఆటంకాలు తొలగాలని ప్రార్థించండి'],
        deity: 'గణేశ్',
      },
      ta: {
        name: 'விநாயக சதுர்த்தி',
        description: 'விநாயகரின் மாத நண்பகல் வழிபாடு',
        significance: 'வளர்பிறைதோறும் நண்பகலில் விநாயகரைப் போற்றும் நாள். அருகு கொழுக்கட்டை படைத்து, அதர்வசீர்ஷம் படித்து, இடையூறற்ற தொடக்கம் வேண்டுகின்றனர்.',
        rituals: ['அருகு கொழுக்கட்டை படைத்திடு', 'விநாயக அதர்வசீர்ஷம் படித்திடு', 'நண்பகலில் சிலை வழிபாடு செய்', 'இடையூறற்ற தொடக்கம் வேண்டு'],
        deity: 'விநாயகர்',
      },
    },
    description: 'Monthly midday worship of Ganesha',
    significance: 'Honours Ganesha each bright fortnight at midday, the hour of his creation by Parvati from turmeric paste. Devotees offer Durva grass and sweet modaks, recite the Atharvashirsha, and seek obstacle-free beginnings. It keeps Ganesha’s grace active through every waxing cycle.',
    rituals: ['Offer Durva grass and modaks', 'Recite Ganesha Atharvashirsha hymn', 'Worship idol at midday hour', 'Pray for obstacle-free beginnings'],
    deity: 'Ganesha',
    tithiNumber: 4,
    paksha: 'Shukla',
    month: 0, // every month
    type: 'minor',
    vyapti: 'madhyahna', // Ganesha was created at midday
  },
  {
    id: 'masik-shivratri',
    name: 'Masik Shivratri',
    nameHindi: 'मासिक शिवरात्रि',
    i18n: {
      hi: {
        name: 'मासिक शिवरात्रि',
        description: 'शिव उपासना की मासिक रात्रि',
        significance: 'प्रत्येक कृष्ण चतुर्दशी को शिव उपासना; दिन व्रत, मध्यरात्रि अभिषेक और जागरण होता है।',
        rituals: ['सूर्योदय से अगली सुबह तक व्रत रखें', 'लिंग को दूध-जल से नहलाएं', 'महामृत्युंजय मंत्र जपें', 'बेलपत्र सहित रात्रि जागरण करें'],
        deity: 'शिव',
      },
      sa: {
        name: 'मासिकशिवरात्रिः',
        description: 'मासिकशिवरात्रिः',
        significance: 'प्रतिकृष्णपक्षं चतुर्दशीरात्रिः शिवाय समर्पिता। भक्ताः उपोष्य मध्यरात्रौ लिङ्गाभिषेकं कुर्वन्ति।',
        rituals: ['सूर्योदयात् परप्रातःपर्यन्तं व्रतम्', 'दुग्धजलेन लिङ्गस्नापनम्', 'महामृत्युञ्जयजपः', 'बिल्वपत्रैः सह रात्रिजागरणम्'],
        deity: 'शिवः',
      },
      kn: {
        name: 'ಮಾಸಿಕ ಶಿವರಾತ್ರಿ',
        description: 'ಶಿವನ ಮಾಸಿಕ ರಾತ್ರಿ ಪೂಜೆ',
        significance: 'ಪ್ರತಿ ಕೃಷ್ಣ ಪಕ್ಷದ ಚತುರ್ದಶಿ ರಾತ್ರಿಯನ್ನು ಶಿವನಿಗೆ ಅರ್ಪಿಸಲಾಗುತ್ತದೆ. ಭಕ್ತರು ಹಗಲು ಉಪವಾಸವಿದ್ದು ಮಧ್ಯರಾತ್ರಿ ಹಾಲು ಮತ್ತು ನೀರಿನಿಂದ ಲಿಂಗಕ್ಕೆ ಸ್ನಾನ ಮಾಡಿಸಿ ಮಹಾ ಮೃತ್ಯುಂಜಯ ಪಠಿಸುತ್ತಾರೆ.',
        rituals: ['ಸೂರ್ಯೋದಯದಿಂದ ಮರುದಿನ ಬೆಳಗಿನವರೆಗೆ ಉಪವಾಸವಿರಿ', 'ಹಾಲು ಮತ್ತು ನೀರಿನಿಂದ ಲಿಂಗಕ್ಕೆ ಸ್ನಾನ ಮಾಡಿಸಿ', 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಪಠಿಸಿ', 'ಬಿಲ್ವಪತ್ರೆಯೊಂದಿಗೆ ರಾತ್ರಿ ಜಾಗರಣೆ ಮಾಡಿ'],
        deity: 'ಶಿವ',
      },
      te: {
        name: 'మాసిక శివరాత్రి',
        description: 'శివుని నెలవారీ రాత్రి పూజ',
        significance: 'ప్రతి నెల బహుళ చతుర్దశి రాత్రి శివునికి అంకితం. ఉపవాసం లింగాభిషేకం జాగరణ చేస్తారు. మహా శివరాత్రికి సన్నాహంగా భావిస్తారు.',
        rituals: ['తెల్లవారు నుండి మరుసటి ఉదయం వరకు ఉపవాసం ఉండండి', 'లింగానికి పాలు నీళ్లతో అభిషేకం చేయండి', 'మహా మృత్యుంజయ మంత్రం జపించండి', 'మారేడు దళాలతో రాత్రి జాగరణ చేయండి'],
        deity: 'శివ',
      },
      ta: {
        name: 'மாத சிவராத்திரி',
        description: 'சிவ வழிபாட்டின் மாத இரவு',
        significance: 'தேய்பிறைச் சதுர்த்தசிதோறும் சிவனுக்குரிய இரவு. பகலில் விரதமிருந்து நள்ளிரவில் லிங்கத்திற்குப் பால் நீர் ஆட்டி, மகா மிருத்யுஞ்சயம் சொல்கின்றனர்.',
        rituals: ['சூரிய உதயம் முதல் மறுநாள் வரை விரதம் இரு', 'லிங்கத்திற்குப் பால் நீர் ஆட்டு', 'மகா மிருத்யுஞ்சயம் சொல்', 'வில்வத்துடன் இரவு விழித்திரு'],
        deity: 'சிவன்',
      },
    },
    description: 'Monthly night of Shiva worship',
    significance: 'Dedicates each dark fortnight’s fourteenth night to Shiva, recalling the cosmic dance and the wedding of Shiva and Parvati. Devotees fast through the day, bathe the lingam with milk and water at midnight, and chant the Maha Mrityunjaya. It offers monthly renewal for penitents awaiting Maha Shivratri.',
    rituals: ['Fast sunrise to next morning', 'Bathe lingam with milk water', 'Chant Maha Mrityunjaya mantra', 'Keep night vigil with bilva'],
    deity: 'Shiva',
    tithiNumber: 14,
    paksha: 'Krishna',
    month: 0, // every month
    type: 'minor',
    vyapti: 'nishita', // Shiva is worshipped at midnight
  }
];

export type FestivalTextLang = 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta';
export type FestivalTextField = 'name' | 'description' | 'significance' | 'rituals' | 'deity';

/**
 * Why: single accessor for localised festival text. Returns
 * i18n[lang][field] when a translation exists, else the canonical
 * top-level English value. Arrays (rituals) are returned as-is —
 * callers join or list them; nothing is joined here.
 */
export function festivalText(
  fest: FestivalData,
  lang: string,
  field: FestivalTextField
): string | string[] | undefined {
  const tr = (fest.i18n as Record<string, Partial<Record<FestivalTextField, string | string[]>>> | undefined)?.[lang];
  const v = tr?.[field];
  if (v !== undefined) return v as string | string[];
  if (field === 'rituals') return fest.rituals;
  if (field === 'deity') return fest.deity;
  return fest[field];
}

/**
 * Get festivals for a specific date
 * Why: Check if a given date has any festival
 *
 * Matching is based on tithi number, paksha, AND lunar month.
 * Hindu festivals are tied to specific lunar months (e.g., Janmashtami is
 * Shravana Krishna Ashtami, not just any Krishna Ashtami). The `month` field
 * in festival data is essential for correct matching.
 *
 * Special case: Sankashti Chaturthi (month=0) is observed every month on
 * Krishna Paksha Chaturthi, so it does not filter by month.
 *
 * Purnimanta rules (monthBasis 'purnimanta': Diwali, Karva, Ahoi, Bhai Dooj)
 * additionally match the purnimanta month when it is passed in — their
 * Kartika-Krishna tithis fall in amanta Ashwin but purnimanta Kartika, which
 * the solar-sign month misses in some years (e.g. Karva Oct 10 2025 reads
 * solar month 7). Rules without the flag keep exact solar-only behaviour.
 *
 * @param lunarMonth - Current Hindu lunar month (1=Chaitra, 12=Phalguna)
 * @param purnimantaMonth - Purnimanta month (Shukla: same as amanta;
 *   Krishna: amanta + 1); only consulted for monthBasis 'purnimanta' rules
 */
export function getFestivalsForDate(
  date: Date,
  tithiNumber: number,
  paksha: 'Shukla' | 'Krishna',
  festivals: FestivalData[] = FESTIVALS,
  lunarMonth?: number,
  purnimantaMonth?: number
): Festival[] {
  const matchingFestivals = festivals.filter(festival => {
    // For Sankashti Chaturthi (observed every Krishna Paksha Chaturthi)
    if (festival.id === 'sankashti-chaturthi') {
      return tithiNumber === 4 && paksha === 'Krishna';
    }

    // Must match tithi number and paksha
    if (festival.tithiNumber !== tithiNumber || festival.paksha !== paksha) {
      return false;
    }

    // Must match lunar month (if available and festival has a specific month)
    // festival.month === 0 means "every month" (like Sankashti, handled above)
    if (lunarMonth !== undefined && festival.month > 0) {
      if (festival.month === lunarMonth) return true;
      // Purnimanta-basis rules (Kartika-Krishna set) also match the
      // purnimanta month — same tithi, North Indian reckoning.
      if (
        festival.monthBasis === 'purnimanta' &&
        purnimantaMonth !== undefined &&
        festival.month === purnimantaMonth
      ) {
        return true;
      }
      return false;
    }

    // If no lunar month is provided, fall back to tithi+paksha only
    // This is less accurate but maintains backward compatibility
    return true;
  });

  return matchingFestivals.map(festival => ({
    id: festival.id,
    name: festival.name,
    nameHindi: festival.nameHindi,
    description: festival.description,
    significance: festival.significance,
    date: date,
    tithiNumber: festival.tithiNumber,
    paksha: festival.paksha,
    month: festival.month,
    type: festival.type,
    region: festival.region,
    rituals: festival.rituals,
    deity: festival.deity,
    i18n: festival.i18n
  }));
}

/**
 * Get upcoming festivals from current date
 */
export function getUpcomingFestivals(
  currentDate: Date = new Date(),
  count: number = 5,
  festivals: FestivalData[] = FESTIVALS
): FestivalData[] {
  // Simplified - returns first 'count' festivals
  // In real implementation, would calculate actual dates based on tithis
  return festivals.slice(0, count);
}

/**
 * Get festival by ID
 */
export function getFestivalById(id: string, festivals: FestivalData[] = FESTIVALS): FestivalData | undefined {
  return festivals.find(f => f.id === id);
}

/**
 * Get festivals by type
 */
export function getFestivalsByType(
  type: 'major' | 'minor' | 'regional',
  festivals: FestivalData[] = FESTIVALS
): FestivalData[] {
  return festivals.filter(f => f.type === type);
}

/**
 * Get festivals by region
 */
export function getFestivalsByRegion(
  region: string,
  festivals: FestivalData[] = FESTIVALS
): FestivalData[] {
  return festivals.filter(f => f.region?.includes(region));
}
