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
    significance: 'Pradosh is the twilight period on Trayodashi (13th lunar day). Dedicated to Lord Shiva, it removes sins and brings prosperity. Observed twice a month during both Shukla and Krishna paksha.',
    significanceHindi: 'प्रदोष त्रयोदशी (13वें चंद्र दिन) की संध्या अवधि है। भगवान शिव को समर्पित, यह पापों को दूर करता है और समृद्धि लाता है। शुकल और कृष्ण दोनों पक्षों में महीने में दो बार मनाया जाता है।',
    benefits: [
      'Removes all sins',
      'Brings prosperity and wealth',
      'Fulfills legitimate desires',
      'Improves health and relationships',
      'Brings mental peace',
      'Blesses with progeny',
      'Removes obstacles in marriage'
    ],
    benefitsHindi: [
      'सभी पाप दूर करता है',
      'समृद्धि और धन लाता है',
      'वैध इच्छाएं पूरी करता है',
      'स्वास्थ्य और रिश्तों में सुधार',
      'मानसिक शांति लाता है',
      'संतान का आशीर्वाद देता है',
      'विवाह में बाधाएं दूर करता है'
    ],
    rules: [
      'Fast during the day',
      'Worship Lord Shiva during twilight (1.5 hours before sunset to 1 hour after)',
      'Visit Shiva temple if possible',
      'Offer water, milk, bel leaves, and dhatura to Shiva Linga',
      'Chant Om Namah Shivaya and Maha Mrityunjaya Mantra',
      'Read Shiva Purana or Pradosh Vrat Katha',
      'Break fast after evening puja and moonrise',
      'Maintain celibacy and speak truth'
    ],
    rulesHindi: [
      'दिन के दौरान व्रत रखें',
      'संध्या के दौरान भगवान शिव की पूजा करें (सूर्यास्त से 1.5 घंटे पहले से 1 घंटे बाद तक)',
      'संभव हो तो शिव मंदिर जाएं',
      'शिव लिंग पर जल, दूध, बेल पत्र और धतूरा अर्पित करें',
      'ॐ नमः शिवाय और महा मृत्युंजय मंत्र जाप करें',
      'शिव पुराण या प्रदोष व्रत कथा पढ़ें',
      'शाम की पूजा और चंद्रोदय के बाद व्रत तोड़ें',
      'ब्रह्मचर्य का पालन करें और सत्य बोलें'
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
    significance: 'Sankashti Chaturthi is observed on the 4th day of Krishna Paksha (waning moon). Dedicated to Lord Ganesha, it removes obstacles and brings success. The fast is broken after moonrise.',
    significanceHindi: 'संकष्टी चतुर्थी कृष्ण पक्ष (घटते चंद्रमा) के चौथे दिन मनाई जाती है। भगवान गणेश को समर्पित, यह बाधाओं को दूर करता है और सफलता लाता है। चंद्रोदय के बाद व्रत तोड़ा जाता है।',
    benefits: [
      'Removes all obstacles',
      'Brings success in endeavors',
      'Improves wisdom and intellect',
      'Brings prosperity and wealth',
      'Fulfills desires',
      'Protects from enemies and negative forces',
      'Removes Mangal Dosha and other planetary afflictions'
    ],
    benefitsHindi: [
      'सभी बाधाएं दूर करता है',
      'प्रयासों में सफलता लाता है',
      'बुद्धि और बुद्धिमत्ता में सुधार',
      'समृद्धि और धन लाता है',
      'इच्छाएं पूरी करता है',
      'शत्रुओं और नकारात्मक शक्तियों से रक्षा',
      'मंगल दोष और अन्य ग्रह दोष दूर करता है'
    ],
    rules: [
      'Complete fast or fruits/milk only',
      'Worship Lord Ganesha with red flowers',
      'Offer durva grass and modak (sweet)',
      'Light ghee lamp in evening',
      'Chant Ganesha mantras (Om Gam Ganapataye Namah)',
      'Read Ganesha Atharvashirsha',
      'Break fast after moonrise',
      'View moon through sieve, then break fast',
      'Apply tilak of kumkum on forehead'
    ],
    rulesHindi: [
      'पूर्ण व्रत या केवल फल/दूध',
      'लाल फूलों से भगवान गणेश की पूजा करें',
      'दूर्वा घास और मोदक अर्पित करें',
      'शाम को घी का दीपक जलाएं',
      'गणेश मंत्र जाप (ॐ गं गणपतये नमः)',
      'गणेश अथर्वशीर्ष पढ़ें',
      'चंद्रोदय के बाद व्रत तोड़ें',
      'छलनी से चंद्रमा देखें, फिर व्रत तोड़ें',
      'माथे पर कुमकुम का तिलक लगाएं'
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
    significance: 'Full moon day is highly auspicious for spiritual practices. Fasting on Purnima brings mental peace, spiritual growth, and fulfillment of desires. Dedicated to Lord Satyanarayan and Moon god.',
    significanceHindi: 'पूर्णिमा का दिन आध्यात्मिक अभ्यास के लिए अत्यंत शुभ है। पूर्णिमा पर व्रत रखने से मानसिक शांति, आध्यात्मिक विकास और इच्छाओं की पूर्ति होती है। भगवान सत्यनारायण और चंद्र देव को समर्पित।',
    benefits: [
      'Mental peace and emotional balance',
      'Spiritual growth and enlightenment',
      'Fulfills legitimate desires',
      'Removes sins and negative karma',
      'Improves relationships and family harmony',
      'Brings prosperity and good health',
      'Enhances meditation and spiritual practices'
    ],
    benefitsHindi: [
      'मानसिक शांति और भावनात्मक संतुलन',
      'आध्यात्मिक विकास और ज्ञान',
      'वैध इच्छाओं की पूर्ति',
      'पाप और नकारात्मक कर्म दूर',
      'रिश्तों और पारिवारिक सौहार्द में सुधार',
      'समृद्धि और अच्छा स्वास्थ्य लाता है',
      'ध्यान और आध्यात्मिक अभ्यास को बढ़ाता है'
    ],
    rules: [
      'Fast or eat only light sattvic food',
      'Worship Lord Satyanarayan',
      'Perform Satyanarayan Puja if possible',
      'Donate food, clothes, and essentials to poor',
      'Chant Vishnu mantras or Satyanarayan Katha',
      'Visit temple and offer prayers',
      'Break fast after moonrise or next morning',
      'Maintain purity of thought and action'
    ],
    rulesHindi: [
      'व्रत करें या केवल हल्का सात्विक भोजन',
      'भगवान सत्यनारायण की पूजा करें',
      'संभव हो तो सत्यनारायण पूजा करें',
      'गरीबों को भोजन, वस्त्र और आवश्यक वस्तुएं दान करें',
      'विष्णु मंत्र या सत्यनारायण कथा जाप करें',
      'मंदिर जाएं और प्रार्थना करें',
      'चंद्रोदय के बाद या अगली सुबह व्रत तोड़ें',
      'विचार और कर्म की शुद्धता बनाए रखें'
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
    significance: 'New moon day is dedicated to ancestor worship (Pitru Tarpan). Fasting on Amavasya honors ancestors, removes Pitru Dosha, and brings their blessings. Especially important for those facing Pitru Dosha in horoscope.',
    significanceHindi: 'अमावस्या का दिन पितृ पूजा (पितृ तर्पण) को समर्पित है। अमावस्या पर व्रत रखने से पूर्वजों का सम्मान होता है, पितृ दोष दूर होता है और उनका आशीर्वाद मिलता है। विशेष रूप से जिनकी कुंडली में पितृ दोष है उनके लिए महत्वपूर्ण।',
    benefits: [
      'Honors ancestors and brings their blessings',
      'Removes Pitru Dosha from horoscope',
      'Helps in getting progeny',
      'Removes obstacles from family lineage',
      'Brings peace to departed souls',
      'Improves family relationships',
      'Removes unexplained problems and suffering'
    ],
    benefitsHindi: [
      'पूर्वजों का सम्मान और उनका आशीर्वाद',
      'कुंडली से पितृ दोष दूर',
      'संतान प्राप्ति में सहायक',
      'पारिवारिक वंश से बाधाएं दूर',
      'दिवंगत आत्माओं को शांति',
      'पारिवारिक रिश्तों में सुधार',
      'अस्पष्ट समस्याओं और पीड़ा को दूर करता है'
    ],
    rules: [
      'Fast or eat light sattvic food',
      'Perform Pitru Tarpan (ancestor rituals)',
      'Offer water, sesame seeds, and rice to ancestors',
      'Feed Brahmins, poor, and cows',
      'Donate food in ancestor name',
      'Chant Pitru mantras',
      'Avoid auspicious ceremonies on this day',
      'Break fast after sunset or next morning',
      'Visit Gaya or other sacred places for Pitru rituals if possible'
    ],
    rulesHindi: [
      'व्रत करें या हल्का सात्विक भोजन',
      'पितृ तर्पण करें (पूर्वज अनुष्ठान)',
      'पूर्वजों को जल, तिल और चावल अर्पित करें',
      'ब्राह्मणों, गरीबों और गायों को भोजन खिलाएं',
      'पूर्वज के नाम पर भोजन दान करें',
      'पितृ मंत्र जाप करें',
      'इस दिन शुभ समारोह से बचें',
      'सूर्यास्त के बाद या अगली सुबह व्रत तोड़ें',
      'संभव हो तो पितृ अनुष्ठान के लिए गया या अन्य पवित्र स्थान जाएं'
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
