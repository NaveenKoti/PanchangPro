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
    description: 'Festival of Lights',
    significance: 'Celebrates the return of Lord Rama to Ayodhya after 14 years of exile. Also associated with Goddess Lakshmi and the victory of light over darkness. Lakshmi Puja is performed in Pradosh Kaal (after sunset) while Amavasya prevails — so the eve, not the Udaya-Amavasya morning, is Diwali (2026: Nov 8 eve, Amavasya 11:27 Nov 8 → 12:31 Nov 9 per Drik; Udaya Amavasya falls Nov 9). प्रदोष काल में अमावस्या व्याप्त होने पर लक्ष्मी पूजा होती है — उदया तिथि वाला दिन नहीं।',
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
    description: 'Bonfire on the eve of Holi',
    significance: 'The ceremonial bonfire symbolising the burning of Holika and the victory of devotion (Prahlad) over evil. Performed in Pradosh Kaal while Purnima prevails, strictly after Bhadra ends — Bhadra occupies the first half of Purnima, so when it covers the pradosh the observance moves to the Udaya-Purnima evening (Drik 2026: Mar 3, muhurat 18:22–20:50; regional calendars observing the pradosh-Purnima light on Mar 2). No Bhadra/Vishti time is computed here — this rule keeps both candidate days; consult a panchang for the Bhadra window. भद्रा के बाद प्रदोष काल में होलिका दहन; भद्रा समय की गणना यहाँ नहीं की गई है।',
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
    description: 'Sisters bless brothers (Diwali close)',
    significance: 'Kartika Shukla Dwitiya — sisters apply tilak and bless their brothers in the afternoon (Aparahna), closing the five-day Diwali festival. Dwitiya must prevail at Aparahna (sunrise + 0.7 × daylength), not merely at dawn. अपराह्न काल में द्वितीया होने पर भाई दूज मनाई जाती है।',
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
    description: 'Mothers fast for children',
    significance: 'Kartika Krishna Ashtami fast kept by mothers for their children’s welfare. The fast is broken at star-sighting (tara darshan) after the evening puja — NOT at moonrise, which falls near midnight (2026: Ashtami Nov 1 14:52 → Nov 2 13:11, moonrise ~23:52 IST per Prokerala/Drik listings; observance Nov 1, when Ashtami holds the sunset). व्रत तारों के दर्शन के बाद तोड़ा जाता है, चंद्रोदय पर नहीं।',
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
    description: 'Festival of Colors',
    significance: 'Celebrates the victory of good over evil, the burning of Holika, and the divine love of Radha and Krishna.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 12, // Phalguna (month 12 = index 11 + 1)
    type: 'major'
  },
  {
    id: 'navratri',
    name: 'Navratri',
    nameHindi: 'नवरात्रि',
    description: 'Nine Nights of Goddess Durga',
    significance: 'Nine nights dedicated to Goddess Durga in her nine forms. Celebrates the victory of good over evil.',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 7, // Ashwin (month 7 = index 6 + 1)
    type: 'major'
  },
  {
    id: 'dussehra',
    name: 'Dussehra',
    nameHindi: 'दशहरा',
    description: 'Vijayadashami',
    significance: 'Marks the victory of Lord Rama over Ravana. The tenth day of Navratri.',
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
    description: 'Birth of Lord Ganesha',
    significance: 'Celebrates the birth of Lord Ganesha, the remover of obstacles.',
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
    description: 'Birth of Lord Krishna',
    significance: 'Celebrates the birth of Lord Krishna, the eighth avatar of Lord Vishnu.',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 5, // Shravana (month 5 = index 4 + 1)
    type: 'major'
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    nameHindi: 'राम नवमी',
    description: 'Birth of Lord Rama',
    significance: 'Celebrates the birth of Lord Rama, the seventh avatar of Lord Vishnu.',
    tithiNumber: 9,
    paksha: 'Shukla',
    month: 1, // Chaitra (month 1 = index 0 + 1)
    type: 'major'
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    nameHindi: 'महाशिवरात्रि',
    description: 'Great Night of Lord Shiva',
    significance: 'Dedicated to Lord Shiva. Celebrated by fasting, meditation, and staying awake all night.',
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
    description: 'Bond of Protection',
    significance: 'Sisters tie a protective thread (rakhi) on their brothers\' wrists. Celebrates the bond between siblings.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 5, // Shravana (month 5 = index 4 + 1)
    type: 'major'
  },
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    description: 'Festival for Married Women',
    significance: 'Married women fast from sunrise to moonrise for the long life and well-being of their husbands. The vrat day is the Udaya Chaturthi (2025: Oct 10, Chaturthi Oct 9 22:54 → Oct 10 19:38 per Drik); the fast is broken at the computed moonrise (Delhi 20:13 IST per Drik). सूर्योदय की चतुर्थी को व्रत, चंद्रोदय पर पारण।',
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
    description: 'Monthly Ganesha Festival',
    significance: 'Observed on 4th day of Krishna Paksha each month. Dedicated to Lord Ganesha for removing obstacles. Fast broken after moonrise.',
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
    description: 'Harvest Festival of Tamil Nadu',
    significance: 'Four-day harvest festival thanking the Sun God for agricultural abundance.',
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
    description: 'Harvest Festival of Kerala',
    significance: 'Celebrates the homecoming of King Mahabali. Famous for boat races and flower rangoli.',
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
    description: 'New Year for Karnataka, Andhra, Telangana',
    significance: 'Marks the beginning of a new year in these regions. Special dishes like Ugadi Pachadi are prepared.',
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
    description: 'Maharashtrian New Year',
    significance: 'Marks the beginning of spring and the harvest season. A gudi (flag) is erected outside homes.',
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
    description: 'Assamese New Year and Harvest Festival',
    significance: 'Three festivals celebrated in Assam marking different agricultural cycles.',
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
    description: 'Punjabi Winter Festival',
    significance: 'Celebrates the end of winter and the harvest of rabi crops. Bonfires and folk songs.',
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
    description: 'Spring Festival and Saraswati Puja',
    significance: 'Dedicated to Goddess Saraswati. Marks the arrival of spring. People wear yellow.',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'regional'
  },
  {
    id: 'guru-purnima',
    name: 'Guru Purnima',
    nameHindi: 'गुरु पूर्णिमा',
    description: 'Day of the Guru',
    significance: 'Day to honor spiritual and academic teachers. Lord Shiva became the first Guru (Adi Guru).',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 3, // Ashadha
    type: 'regional'
  },
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    nameHindi: 'हनुमान जयंती',
    description: 'Birth of Lord Hanuman',
    significance: 'Celebrates the birth of Lord Hanuman, the devoted disciple of Lord Rama.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'minor'
  },
  {
    id: 'mahavir-jayanti',
    name: 'Mahavir Jayanti',
    nameHindi: 'महावीर जयंती',
    description: 'Birth of Lord Mahavir',
    significance: 'Celebrates the birth of Lord Mahavir, the 24th Tirthankara of Jainism.',
    tithiNumber: 13,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'minor'
  },
  {
    id: 'buddha-purnima',
    name: 'Buddha Purnima',
    nameHindi: 'बुद्ध पूर्णिमा',
    description: 'Birth of Lord Buddha',
    significance: 'Celebrates the birth, enlightenment, and parinirvana of Gautama Buddha.',
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
    description: 'Worship of Serpent Deities',
    significance: 'Dedicated to Naga (serpent) deities. Worship of snakes brings protection from snake bites and removes Kala Sarpa Dosha.',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'varalakshmi-vratam',
    name: 'Varalakshmi Vratam',
    nameHindi: 'वरलक्ष्मी व्रतम्',
    description: 'Worship of Goddess Lakshmi',
    significance: 'Observed by married women for the well-being and prosperity of their husbands. Highly auspicious in South India.',
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
    description: 'Another name for Janmashtami',
    significance: 'Celebrates the birth of Lord Krishna. Observed with fasting, prayers, and midnight celebrations.',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'ganesh-jayanti',
    name: 'Ganesh Jayanti',
    nameHindi: 'गणेश जयंती',
    description: 'Birth of Lord Ganesha (Magha Shukla 4)',
    significance: 'Alternative date for celebrating Lord Ganesha\'s birth. Particularly observed in Maharashtra and Western India.',
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
    description: 'Eternal Third Day',
    significance: 'One of the most auspicious days. Buying gold, starting new ventures, and performing pujas brings endless merit.',
    tithiNumber: 3,
    paksha: 'Shukla',
    month: 2, // Vaishakha
    type: 'major'
  },
  {
    id: 'vat-purnima',
    name: 'Vat Purnima',
    nameHindi: 'वट पूर्णिमा',
    description: 'Festival of Married Women',
    significance: 'Married women observe fast and worship the banyan tree for the long life of their husbands.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 3, // Jyeshtha
    type: 'minor',
    region: ['Western India', 'Maharashtra', 'Gujarat']
  },
  {
    id: 'rakhi-purnima',
    name: 'Raksha Bandhan / Rakhi Purnima',
    nameHindi: 'रक्षा बंधन',
    description: 'Sacred Thread Ceremony',
    significance: 'Sisters tie rakhi on brothers\' wrists. Celebrates the protective bond between siblings.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major'
  },
  {
    id: 'sharad-purnima',
    name: 'Sharad Purnima',
    nameHindi: 'शरद पूर्णिमा',
    description: 'Autumn Full Moon',
    significance: 'Considered the night when the moon showers nectar. Kheer is left under moonlight to absorb the nectar.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 7, // Ashwin
    type: 'major'
  },
  {
    id: 'kartik-purnima',
    name: 'Kartik Purnima',
    nameHindi: 'कार्तिक पूर्णिमा',
    description: 'Tripuri Purnima',
    significance: 'Highly sacred full moon in Kartik month. Devotees take holy dip in sacred rivers. Celebrates victory of Lord Shiva over demon Tripurasura.',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major'
  },
  {
    id: 'prabodhini-ekadashi',
    name: 'Prabodhini Ekadashi',
    nameHindi: 'प्रबोधिनी एकादशी',
    description: 'Awakening of Lord Vishnu',
    significance: 'Marks the end of Chaturmas (4 months of monsoon). Lord Vishnu awakens from cosmic sleep. Auspicious for weddings and celebrations.',
    tithiNumber: 11,
    paksha: 'Shukla',
    month: 8, // Kartika
    type: 'major'
  },
  {
    id: 'bheeshma-ekadashi',
    name: 'Bheeshma Ekadashi',
    nameHindi: 'भीष्म एकादशी',
    description: 'Ekadashi of Bheeshma Pitamah',
    significance: 'Associated with Bheeshma Pitamah from Mahabharata. Observed during Magha month.',
    tithiNumber: 11,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'minor'
  },
  {
    id: 'vasant-panchami',
    name: 'Vasant Panchami / Saraswati Puja',
    nameHindi: 'वसंत पंचमी',
    description: 'Spring Festival & Goddess Saraswati Worship',
    significance: 'Dedicated to Goddess Saraswati. Marks the arrival of spring. Students and artists worship for knowledge and creativity.',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 11, // Magha
    type: 'major'
  },
  {
    id: 'chhath-puja',
    name: 'Chhath Puja',
    nameHindi: 'छठ पूजा',
    description: 'Sun God Worship',
    significance: 'Ancient festival dedicated to Surya (Sun God) and Chhathi Maiya. Observed with strict fasting and standing in water for prayers.',
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
    description: 'Kerala New Year',
    significance: 'Malayali New Year celebrated with Vishu Kani (first sight), fireworks, and festive meals.',
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
    description: 'Janmashtami (Smarta Tradition)',
    significance: 'Krishna Jayanti observed by Smarta tradition. Celebrated one day before Vaishnava Janmashtami.',
    tithiNumber: 7,
    paksha: 'Krishna',
    month: 5, // Shravana
    type: 'minor'
  }
];

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
    region: festival.region
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
