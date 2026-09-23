/**
 * Fasting Database - Complete Integration
 * 
 * Integrates complete Ekadashi data from scriptures with
 * other fasting days (Pradosh, Sankashti, Purnima, Amavasya)
 * 
 * Sources:
 * - Padma Purana - Ekadashi Mahatmya
 * - Bhavishya Purana
 * - Agni Purana
 * - Brahma Vaivarta Purana
 */

import { COMPLETE_EKADASHI_DATA, EkadashiData } from './vedic/completeEkadashiData';

export interface FastingInfo {
  id: string;
  name: string;
  nameHindi: string;
  type: 'ekadashi' | 'pradosh' | 'sankashti' | 'purnima' | 'amavasya' | 'other';
  significance: string;
  significanceHindi: string;
  benefits: string[];
  benefitsHindi: string[];
  rules: string[];
  rulesHindi: string[];
  deity: string;
  deityHindi: string;
  paranaTime?: string;
  paranaTimeHindi?: string;
  specialNotes?: string;
  specialNotesHindi?: string;
  month?: number;
  paksha?: 'Shukla' | 'Krishna';
  tithiNumber?: number;
}

// Convert Ekadashi data to FastingInfo format
const ekadashiToFastingInfo = (ekadashi: EkadashiData): FastingInfo => {
  return {
    id: ekadashi.id,
    name: ekadashi.name,
    nameHindi: ekadashi.nameHindi,
    type: 'ekadashi',
    significance: ekadashi.significance,
    significanceHindi: ekadashi.significanceHindi,
    benefits: ekadashi.benefits,
    benefitsHindi: ekadashi.benefitsHindi,
    rules: ekadashi.fastingRules,
    rulesHindi: ekadashi.fastingRulesHindi,
    deity: ekadashi.presidingDeity,
    deityHindi: ekadashi.presidingDeityHindi,
    paranaTime: ekadashi.paranaTime,
    paranaTimeHindi: ekadashi.paranaTimeHindi,
    specialNotes: ekadashi.specialObservances?.join('. '),
    specialNotesHindi: ekadashi.specialObservancesHindi?.join('. '),
    month: ekadashi.month,
    paksha: ekadashi.paksha,
    tithiNumber: ekadashi.tithiNumber,
  };
};

// ============================================================================
// ALL 24 EKADASHIS - Complete from Scriptures
// ============================================================================
export const EKADASHIS: FastingInfo[] = COMPLETE_EKADASHI_DATA.map(ekadashiToFastingInfo);

// ============================================================================
// PRADOSH VRAT (Twice a month - Trayodashi)
// ============================================================================
export const OTHER_FASTS: { [key: string]: FastingInfo } = {
  'pradosh-vrat': {
    id: 'pradosh-vrat',
    name: 'Pradosh Vrat',
    nameHindi: 'प्रदोष व्रत',
    type: 'pradosh',
    significance: 'Pradosh Vrat is observed on both Trayodashi tithis to honour Lord Shiva during Pradosh Kaal after sunset. Drik Panchang fixes the day when Trayodashi prevails after sunset, so dates vary by city. Soma, Bhauma and Shani Pradosh carry special names.',
    significanceHindi: 'प्रदोष व्रत दोनों त्रयोदशी तिथियों पर सूर्यास्त के बाद प्रदोष काल में भगवान शिव की उपासना के लिए मनाया जाता है। त्रयोदशी सूर्यास्त के बाद व्याप्त होने वाले दिन को ही व्रत का दिन माना जाता है, इसलिए नगर के अनुसार तिथि बदल सकती है। सोम, भौम और शनि प्रदोष के विशेष नाम हैं।',
    benefits: [
      'Removes sins and obstacles',
      'Health, prosperity, family harmony'
    ],
    benefitsHindi: [
      'पाप और बाधाएं दूर करता है',
      'स्वास्थ्य, समृद्धि, पारिवारिक सौहार्द'
    ],
    rules: [
      'Fast during day; take fruit or nirjala per capacity',
      'Worship Shiva-Parvati in Pradosh Kaal after sunset',
      'Offer bilva leaves, milk, water, ghee lamp',
      'Hear Pradosh Katha; break fast after evening puja'
    ],
    rulesHindi: [
      'दिन में व्रत रखें; क्षमता अनुसार फल या निर्जला',
      'सूर्यास्त के बाद प्रदोष काल में शिव-पार्वती की पूजा करें',
      'बेलपत्र, दूध, जल और घी का दीपक अर्पित करें',
      'प्रदोष कथा सुनें; शाम की पूजा के बाद व्रत तोड़ें'
    ],
    deity: 'Lord Shiva',
    deityHindi: 'भगवान शिव',
    paranaTime: 'After evening Shiva puja and moonrise',
    paranaTimeHindi: 'शाम की शिव पूजा और चंद्रोदय के बाद',
    specialNotes: 'Observed on both Shukla and Krishna Paksha Trayodashi (13th day). Som Pradosh (Monday) is especially auspicious.',
    specialNotesHindi: 'शुक्ल और कृष्ण पक्ष त्रयोदशी (13वें दिन) दोनों पर मनाया जाता है। सोम प्रदोष (सोमवार) विशेष रूप से शुभ है।'
  },

  'sankashti-chaturthi': {
    id: 'sankashti-chaturthi',
    name: 'Sankashti Chaturthi',
    nameHindi: 'संकष्टी चतुर्थी',
    type: 'sankashti',
    significance: 'Sankashti Chaturthi is the Krishna Paksha Chaturthi after full moon, dedicated to Lord Ganesha as remover of obstacles. Sankashti means deliverance during troubled times. Strongest in Maharashtra and Tamil Nadu; Tuesday observance is called Angarki and deemed highly auspicious.',
    significanceHindi: 'संकष्टी चतुर्थी पूर्णिमा के बाद कृष्ण पक्ष की चतुर्थी है, जो विघ्नहर्ता भगवान गणेश को समर्पित है। संकष्टी का अर्थ है कष्ट के समय से छुटकारा। महाराष्ट्र और तमिलनाडु में इसका विशेष प्रचलन है; मंगलवार का व्रत अंगारकी कहलाता है और अत्यंत शुभ माना जाता है।',
    benefits: [
      'Removes obstacles',
      'Wisdom and success'
    ],
    benefitsHindi: [
      'बाधाएं दूर करता है',
      'बुद्धि और सफलता'
    ],
    rules: [
      'Fast from sunrise until moonrise sighting',
      'Eat only fruit, roots, sabudana, peanuts if needed',
      'Worship Ganesha with durva, modak, red flowers',
      'Break fast after moon sighting; day varies by city'
    ],
    rulesHindi: [
      'सूर्योदय से चंद्रोदय दर्शन तक व्रत रखें',
      'आवश्यकता हो तो केवल फल, कंदमूल, साबूदाना, मूंगफली खाएं',
      'दूर्वा, मोदक, लाल फूलों से गणेश की पूजा करें',
      'चंद्र दर्शन के बाद व्रत तोड़ें; नगर अनुसार दिन बदलता है'
    ],
    deity: 'Lord Ganesha',
    deityHindi: 'भगवान गणेश',
    paranaTime: 'After moonrise, view moon first then break fast',
    paranaTimeHindi: 'चंद्रोदय के बाद, पहले चंद्रमा देखें फिर व्रत तोड़ें',
    specialNotes: 'Observed on Krishna Paksha Chaturthi (4th day after Purnima). Angarki Chaturthi (Tuesday Sankashti) is especially powerful.',
    specialNotesHindi: 'कृष्ण पक्ष चतुर्थी (पूर्णिमा के बाद चौथा दिन) पर मनाया जाता है। अंगारकी चतुर्थी (मंगलवार संकष्टी) विशेष रूप से शक्तिशाली है।'
  },

  'purnima-vrat': {
    id: 'purnima-vrat',
    name: 'Purnima Vrat',
    nameHindi: 'पूर्णिमा व्रत',
    type: 'purnima',
    significance: 'Purnima is the full moon day observed as Satyanarayan Vrat in North India and Pournami Vratam in the South. Drik Panchang applies the Madhyahna rule, rejecting Chaturdashi-polluted days. Fast runs sunrise to moon sighting; evening Satyanarayan Katha permits breaking fast with prasad.',
    significanceHindi: 'पूर्णिमा पूर्ण चंद्र का दिन है, जो उत्तर भारत में सत्यनारायण व्रत और दक्षिण में पौरनमी व्रतम के रूप में मनाया जाता है। मध्याह्न नियम लागू होता है — चतुर्दशी-विद्ध दिन अमान्य है। व्रत सूर्योदय से चंद्र दर्शन तक रहता है; शाम की सत्यनारायण कथा के बाद प्रसाद से व्रत तोड़ा जा सकता है।',
    benefits: [
      'Mental peace and clarity',
      'Spiritual growth',
      'Family harmony'
    ],
    benefitsHindi: [
      'मानसिक शांति और स्पष्टता',
      'आध्यात्मिक विकास',
      'पारिवारिक सौहार्द'
    ],
    rules: [
      'Keep fast; eat only light sattvic food',
      'Perform Satyanarayan Puja and hear Katha evening',
      'Offer prasad, donate food and essentials',
      'Break fast after moon sighting with prasad'
    ],
    rulesHindi: [
      'व्रत रखें; केवल हल्का सात्विक भोजन करें',
      'शाम को सत्यनारायण पूजा करें और कथा सुनें',
      'प्रसाद अर्पित करें, अन्न और आवश्यक वस्तुएं दान करें',
      'चंद्र दर्शन के बाद प्रसाद से व्रत तोड़ें'
    ],
    deity: 'Lord Satyanarayan / Moon God',
    deityHindi: 'भगवान सत्यनारायण / चंद्र देव',
    paranaTime: 'After moonrise or next morning after sunrise',
    paranaTimeHindi: 'चंद्रोदय के बाद या सूर्योदय के बाद अगली सुबह',
    specialNotes: 'Some Purnimas have special significance: Chaitra (Hanuman Jayanti), Vaishakha (Buddha Purnima), Shravana (Raksha Bandhan), Ashwin (Sharad Purnima), Kartik (Kartik Purnima), Magha (Saraswati Puja), Phalguna (Holi).',
    specialNotesHindi: 'कुछ पूर्णिमाओं का विशेष महत्व है: चैत्र (हनुमान जयंती), वैशाख (बुद्ध पूर्णिमा), श्रावण (रक्षा बंधन), आश्विन (शरद पूर्णिमा), कार्तिक (कार्तिक पूर्णिमा), माघ (सरस्वती पूजा), फाल्गुन (होली)।'
  },

  'amavasya-vrat': {
    id: 'amavasya-vrat',
    name: 'Amavasya Vrat',
    nameHindi: 'अमावस्या व्रत',
    type: 'amavasya',
    significance: 'Amavasya is the new moon day classed as Pitra Tithi for Shraddha, tarpan and charity to ancestors. Drik Panchang deems it unsuitable for auspicious beginnings but apt for Kalasarpa Dosha puja. Monday Somvati and Saturday Shani Amavasya are especially significant.',
    significanceHindi: 'अमावस्या नव चंद्र का दिन है, जो श्राद्ध, तर्पण और पूर्वजों के लिए दान हेतु पितृ तिथि मानी जाती है। शुभ आरंभ के लिए इसे अनुपयुक्त, परंतु कालसर्प दोष पूजा के लिए योग्य माना जाता है। सोमवती और शनि अमावस्या का विशेष महत्व है।',
    benefits: [
      'Honours ancestors, eases Pitru Dosha',
      'Peace for departed, family welfare'
    ],
    benefitsHindi: [
      'पूर्वजों का सम्मान, पितृ दोष शांत',
      'दिवंगतों को शांति, पारिवारिक कल्याण'
    ],
    rules: [
      'Fast or take single sattvic meal after rites',
      'Perform Pitru tarpan with sesame, water in afternoon',
      'Donate food, feed crows, cows, Brahmins',
      'Avoid weddings, new ventures; resume next day'
    ],
    rulesHindi: [
      'अनुष्ठानों के बाद व्रत या एक बार सात्विक भोजन करें',
      'दोपहर में तिल, जल से पितृ तर्पण करें',
      'अन्न दान करें, कौओं, गायों, ब्राह्मणों को खिलाएं',
      'विवाह, नए कार्य न करें; अगले दिन पुनः आरंभ करें'
    ],
    deity: 'Ancestors (Pitrus)',
    deityHindi: 'पितृ (पूर्वज)',
    paranaTime: 'After sunset or next morning after sunrise',
    paranaTimeHindi: 'सूर्यास्त के बाद या सूर्योदय के बाद अगली सुबह',
    specialNotes: 'Mahalaya Amavasya (Pitru Paksha) is most important for ancestor rituals. Also significant: Solar Eclipse Amavasya, Saturn Amavasya (Shani Amavasya).',
    specialNotesHindi: 'महालय अमावस्या (पितृ पक्ष) पूर्वज अनुष्ठानों के लिए सबसे महत्वपूर्ण है। इसके अलावा महत्वपूर्ण: सूर्य ग्रहण अमावस्या, शनि अमावस्या।'
  }
};

/**
 * Get all fasting information including all 24 Ekadashis
 */
export const getAllFastingInfo = (): FastingInfo[] => {
  return [...EKADASHIS, ...Object.values(OTHER_FASTS)];
};

/**
 * Get fasting by ID
 */
export const getFastingById = (id: string): FastingInfo | undefined => {
  // Check Ekadashis first
  const ekadashi = EKADASHIS.find(e => e.id === id);
  if (ekadashi) return ekadashi;
  
  // Check other fasts
  return OTHER_FASTS[id];
};

/**
 * Get fasting by type
 */
export const getFastingByType = (type: FastingInfo['type']): FastingInfo[] => {
  if (type === 'ekadashi') {
    return EKADASHIS;
  }
  
  return Object.values(OTHER_FASTS).filter(f => f.type === type);
};

/**
 * Get Ekadashi for specific month and paksha
 */
export const getEkadashiForMonth = (
  month: number,
  paksha: 'Shukla' | 'Krishna'
): FastingInfo | undefined => {
  return EKADASHIS.find(e => e.month === month && e.paksha === paksha);
};

/**
 * Get major Ekadashis (most important ones)
 */
export const getMajorEkadashis = (): FastingInfo[] => {
  const majorIds = [
    'nirjala',
    'sayana-shayani',
    'devutthana-prabodhini',
    'mokshada-geeta-jayanti',
    'utpanna',
    'bhishma-jaya',
    'kamada',
    'putrada'
  ];
  
  return EKADASHIS.filter(e => majorIds.includes(e.id));
};
