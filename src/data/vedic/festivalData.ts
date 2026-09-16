/**
 * Festival Database
 * 
 * Complete offline data for major Hindu festivals with:
 * - Tithi reference (tithi + paksha + maas)
 * - Significance
 * - Rituals
 * - Importance level
 * 
 * Sources:
 * - Agni Purana
 * - Bhavishya Purana
 * - regional traditions
 */

export interface FestivalData {
  id: string;
  name: string;
  nameHindi: string;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  month: number; // 1-12 (Chaitra=1, Vaishakha=2, etc.)
  type: 'major' | 'minor' | 'regional';
  region?: string[];
  significance: string;
  significanceHindi: string;
  rituals: string[];
  ritualsHindi: string[];
  deity: string;
  deityHindi: string;
  importance: 'high' | 'medium' | 'low';
  fasting?: boolean;
  specialNotes?: string;
}

export const FESTIVAL_DATA: FestivalData[] = [
  // MAJOR FESTIVALS
  {
    id: 'diwali',
    name: 'Diwali (Deepavali)',
    nameHindi: 'दिवाली (दीपावली)',
    tithiNumber: 30,
    paksha: 'Krishna',
    month: 7, // Ashwin
    type: 'major',
    significance: 'Festival of lights. Celebrates Lord Ramas return to Ayodhya after 14 years of exile. Victory of light over darkness, good over evil.',
    significanceHindi: 'रोशनी का त्योहार। 14 वर्ष के वनवास के बाद भगवान राम के अयोध्या लौटने का जश्न। अंधेरे पर प्रकाश की, बुराई पर अच्छाई की जीत।',
    rituals: [
      'Clean and decorate homes',
      'Light diyas and lamps',
      'Lakshmi Puja in evening',
      'Burst crackers (traditionally)',
      'Exchange sweets and gifts',
      'Wear new clothes',
      'Family gatherings'
    ],
    ritualsHindi: [
      'घर साफ करें और सजाएं',
      'दिये और लैंप जलाएं',
      'शाम को लक्ष्मी पूजा',
      'पटाखे फोड़ें (परंपरागत रूप से)',
      'मिठाई और उपहार exchanged करें',
      'नए कपड़े पहनें',
      'परिवार समारोह'
    ],
    deity: 'Goddess Lakshmi & Lord Ganesha',
    deityHindi: 'देवी लक्ष्मी और भगवान गणेश',
    importance: 'high',
    fasting: false,
    specialNotes: 'Main Diwali is on Amavasya. Celebrations span 5 days.'
  },
  {
    id: 'holi',
    name: 'Holi',
    nameHindi: 'होली',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 12, // Phalguna
    type: 'major',
    significance: 'Festival of colors. Celebrates divine love of Radha-Krishna. Victory of Prahlada over Holika. Arrival of spring.',
    significanceHindi: 'रंगों का त्योहार। राधा-कृष्ण के दिव्य प्रेम का जश्न। होलिका पर प्रहलाद की जीत। वसंत का आगमन।',
    rituals: [
      'Holika Dahan night before',
      'Play with colors',
      'Apply gulal and abir',
      'Sing Holi songs',
      'Prepare gujiya and thandai',
      'Visit friends and family',
      'Forgive and forget'
    ],
    ritualsHindi: [
      'पिछली रात होलिका दहन',
      'रंगों से खेलें',
      'गुलाल और अबीर लगाएं',
      'होली गीत गाएं',
      'गुझिया और ठंडाई तैयार करें',
      'दोस्तों और परिवार से मिलें',
      'माफ करें और भूल जाएं'
    ],
    deity: 'Lord Krishna & Radha',
    deityHindi: 'भगवान कृष्ण और राधा',
    importance: 'high',
    fasting: false,
    specialNotes: 'Holika Dahan on Purnima night, Holi next day'
  },
  {
    id: 'dussehra',
    name: 'Dussehra (Vijayadashami)',
    nameHindi: 'दशहरा (विजयदशमी)',
    tithiNumber: 10,
    paksha: 'Shukla',
    month: 7, // Ashwin
    type: 'major',
    significance: 'Celebrates Lord Ramas victory over Ravana. Also marks Goddess Durgas victory over Mahishasura. Victory of good over evil.',
    significanceHindi: 'भगवान राम की रावण पर विजय का जश्न। देवी दुर्गा की महिषासुर पर जीत भी। बुराई पर अच्छाई की जीत।',
    rituals: [
      'Ramlila performances',
      'Burn Ravana effigies',
      'Durga Puja immersions',
      'Worship weapons/tools',
      'Exchange leaves (Apta)',
      'Start new ventures',
      'Family celebrations'
    ],
    ritualsHindi: [
      'रामलीला प्रदर्शन',
      'रावण की पुतले जलाएं',
      'दुर्गा पूजा विसर्जन',
      'हथियार/उपकरण पूजा',
      'अपते पत्ते exchanged करें',
      'नए उद्यम शुरू करें',
      'परिवार समारोह'
    ],
    deity: 'Lord Rama & Goddess Durga',
    deityHindi: 'भगवान राम और देवी दुर्गा',
    importance: 'high',
    fasting: false
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    tithiNumber: 4,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'major',
    significance: 'Birth anniversary of Lord Ganesha. Celebrated with great devotion, especially in Maharashtra. Brings wisdom and removes obstacles.',
    significanceHindi: 'भगवान गणेश की जयंती। बड़ी भक्ति से मनाया जाता है, विशेषकर महाराष्ट्र में। बुद्धि लाता है और बाधाएं दूर करता है।',
    rituals: [
      'Install Ganesha idol at home',
      'Daily puja for 10 days',
      'Offer modak (favorite sweet)',
      'Chant Ganesha mantras',
      'Cultural programs',
      'Visarjan on 10th day',
      'Distribute prasad'
    ],
    ritualsHindi: [
      'घर पर गणेश मूर्ति स्थापित करें',
      '10 दिनों तक दैनिक पूजा',
      'मोदक अर्पित करें (प्रिय मिठाई)',
      'गणेश मंत्र जाप करें',
      'सांस्कृतिक कार्यक्रम',
      '10वें दिन विसर्जन',
      'प्रसाद वितरित करें'
    ],
    deity: 'Lord Ganesha',
    deityHindi: 'भगवान गणेश',
    importance: 'high',
    fasting: true,
    specialNotes: 'Sankashti Chaturthi - fast observed'
  },
  {
    id: 'navratri',
    name: 'Navratri',
    nameHindi: 'नवरात्रि',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 7, // Ashwin
    type: 'major',
    significance: 'Nine nights dedicated to Goddess Durga. Celebrates divine feminine energy. Different forms of Durga worshipped each day.',
    significanceHindi: 'देवी दुर्गा को समर्पित नौ रातें। दिव्य स्त्री शक्ति का जश्न। प्रत्येक दिन दुर्गा के अलग रूप की पूजा।',
    rituals: [
      'Nine days of fasting/worship',
      'Garba/Dandiya dances',
      'Kanya Puja on 9th day',
      'Install Ghat/Kalash',
      'Daily Devi puja',
      'Read Durga Saptashati',
      'Vijayadashami on 10th day'
    ],
    ritualsHindi: [
      'नौ दिन व्रत/पूजा',
      'गरबा/डांडिया नृत्य',
      '9वें दिन कन्या पूजा',
      'घट/कलश स्थापित करें',
      'दैनिक देवी पूजा',
      'दुर्गा सप्तशती पढ़ें',
      '10वें दिन विजयदशमी'
    ],
    deity: 'Goddess Durga (9 forms)',
    deityHindi: 'देवी दुर्गा (9 रूप)',
    importance: 'high',
    fasting: true,
    specialNotes: 'Fasting common for all 9 days or first/last days only'
  },
  {
    id: 'janmashtami',
    name: 'Krishna Janmashtami',
    nameHindi: 'कृष्ण जन्माष्टमी',
    tithiNumber: 8,
    paksha: 'Krishna',
    month: 6, // Bhadrapada
    type: 'major',
    significance: 'Birth anniversary of Lord Krishna. Eighth avatar of Vishnu. Celebrated with fasting, prayers, and midnight celebration.',
    significanceHindi: 'भगवान कृष्ण की जयंती। विष्णु का आठवां अवतार। व्रत, प्रार्थना और मध्यरात्रि उत्सव के साथ मनाया जाता है।',
    rituals: [
      'Fast until midnight',
      'Midnight birth celebration',
      'Krishna bhajans',
      'Read Bhagavata Purana',
      'Dahi Handi next day',
      'Decorate Krishna idols',
      'Offer butter and makhan'
    ],
    ritualsHindi: [
      'मध्यरात्रि तक व्रत',
      'मध्यरात्रि जन्म उत्सव',
      'कृष्ण भजन',
      'भागवत पुराण पढ़ें',
      'अगले दिन दही हैंडी',
      'कृष्ण मूर्तियां सजाएं',
      'मक्खन और माखन अर्पित करें'
    ],
    deity: 'Lord Krishna',
    deityHindi: 'भगवान कृष्ण',
    importance: 'high',
    fasting: true,
    specialNotes: 'Fast broken after midnight when Krishna was born'
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    nameHindi: 'राम नवमी',
    tithiNumber: 9,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'major',
    significance: 'Birth anniversary of Lord Rama. Seventh avatar of Vishnu. Celebrates righteousness, duty, and ideal kingship.',
    significanceHindi: 'भगवान राम की जयंती। विष्णु का सातवां अवतार। धर्म, कर्तव्य और आदर्श राजत्व का जश्न।',
    rituals: [
      'Fast or light food',
      'Read Ramayana',
      'Ram bhajans',
      'Temple visits',
      'Sita-Ram wedding reenactment',
      'Charity',
      'Family prayers'
    ],
    ritualsHindi: [
      'व्रत या हल्का भोजन',
      'रामायण पढ़ें',
      'राम भजन',
      'मंदिर यात्रा',
      'सीता-राम विवाह पुनः प्रस्तुत',
      'दान',
      'परिवार प्रार्थना'
    ],
    deity: 'Lord Rama',
    deityHindi: 'भगवान राम',
    importance: 'high',
    fasting: true
  },
  {
    id: 'shivratri',
    name: 'Maha Shivaratri',
    nameHindi: 'महा शिवरात्रि',
    tithiNumber: 29,
    paksha: 'Krishna',
    month: 12, // Phalguna
    type: 'major',
    significance: 'Great night of Shiva. Most auspicious night for Shiva worship. Celebrates Shivas cosmic dance and marriage to Parvati.',
    significanceHindi: 'शिव की महान रात। शिव पूजा के लिए सबसे शुभ रात। शिव के तांडव नृत्य और पार्वती से विवाह का जश्न।',
    rituals: [
      'Complete fasting',
      'Night-long vigil (jagran)',
      'Shiva Linga abhishek',
      'Offer bilva leaves',
      'Chant Om Namah Shivaya',
      'Meditation',
      'Temple visits'
    ],
    ritualsHindi: [
      'पूर्ण व्रत',
      'रात भर जागरण',
      'शिव लिंग अभिषेक',
      'बिल्व पत्र अर्पित करें',
      'ॐ नमः शिवाय जाप',
      'ध्यान',
      'मंदिर यात्रा'
    ],
    deity: 'Lord Shiva',
    deityHindi: 'भगवान शिव',
    importance: 'high',
    fasting: true,
    specialNotes: 'One of the most important fasting days'
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षा बंधन',
    tithiNumber: 15,
    paksha: 'Shukla',
    month: 5, // Shravana
    type: 'major',
    significance: 'Festival celebrating brother-sister bond. Sister ties rakhi, brother gives gifts and promises protection.',
    significanceHindi: 'भाई-बहन के बंधन का त्योहार। बहन राखी बांधती है, भाई उपहार देता है और सुरक्षा का वादा करता है।',
    rituals: [
      'Sister ties rakhi on brothers wrist',
      'Brother gives gifts',
      'Apply tilak',
      'Feed sweets',
      'Family gathering',
      'Prayers for well-being',
      'Renewal of bond'
    ],
    ritualsHindi: [
      'बहन भाई की कलाई पर राखी बांधती है',
      'भाई उपहार देता है',
      'तिलक लगाएं',
      'मिठाई खिलाएं',
      'परिवार समारोह',
      'कल्याण के लिए प्रार्थना',
      'बंधन का नवीनीकरण'
    ],
    deity: 'Divine bond',
    deityHindi: 'दिव्य बंधन',
    importance: 'high',
    fasting: false
  },
  {
    id: 'ugadi',
    name: 'Ugadi / Gudi Padwa',
    nameHindi: 'उगादी / गुड़ी पड़वा',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 1, // Chaitra
    type: 'major',
    region: ['South India', 'Maharashtra'],
    significance: 'Hindu New Year (lunar calendar). Beginning of spring. New beginnings, fresh start, and harvest celebration.',
    significanceHindi: 'हिंदू नव वर्ष (चंद्र कैलेंडर)। वसंत की शुरुआत। नई शुरुआत, ताजा शुरुआत, और फसल उत्सव।',
    rituals: [
      'Oil bath before sunrise',
      'Wear new clothes',
      'Prepare Ugadi Pachadi',
      'Panchanga Sravanam',
      'Home decoration',
      'Family puja',
      'Feast'
    ],
    ritualsHindi: [
      'सूर्योदय से पहले तेल स्नान',
      'नए कपड़े पहनें',
      'उगादी पचड़ी तैयार करें',
      'पंचांग श्रवण',
      'घर सजावट',
      'परिवार पूजा',
      'दावत'
    ],
    deity: 'Lord Brahma',
    deityHindi: 'भगवान ब्रह्मा',
    importance: 'high',
    fasting: false,
    specialNotes: 'New Year day - highly auspicious for new ventures'
  },

  // MINOR FESTIVALS
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya',
    nameHindi: 'अक्षय तृतीया',
    tithiNumber: 3,
    paksha: 'Shukla',
    month: 2, // Vaishakha
    type: 'minor',
    significance: 'Most auspicious day for new beginnings. "Akshaya" means never diminishing. Good for investments, purchases, and starting ventures.',
    significanceHindi: 'नई शुरुआत के लिए सबसे शुभ दिन। "अक्षय" का अर्थ है कभी न घटने वाला। निवेश, खरीदारी और उद्यम शुरू करने के लिए अच्छा।',
    rituals: [
      'Buy gold/jewelry',
      'Start new business',
      'Property purchase',
      'Charity',
      'Puja for prosperity',
      'Investment',
      'New ventures'
    ],
    ritualsHindi: [
      'सोना/आभूषण खरीदें',
      'नया व्यवसाय शुरू करें',
      'संपत्ति खरीद',
      'दान',
      'समृद्धि के लिए पूजा',
      'निवेश',
      'नए उद्यम'
    ],
    deity: 'Lord Kubera',
    deityHindi: 'भगवान कुबेर',
    importance: 'medium',
    fasting: false,
    specialNotes: 'One of the most auspicious days for material pursuits'
  },
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    tithiNumber: 4,
    paksha: 'Krishna',
    month: 7, // Ashwin
    type: 'minor',
    region: ['North India'],
    significance: 'Married women fast for husbands longevity and well-being. Moonrise breaking of fast. Celebrates marital bond.',
    significanceHindi: 'विवाहित महिलाएं पति की लंबी उम्र और कल्याण के लिए व्रत रखती हैं। चंद्रोदय पर व्रत तोड़ना। वैवाहिक बंधन का जश्न।',
    rituals: [
      'Complete fast (nirjala)',
      'Apply mehndi',
      'Wear red/special clothes',
      'Karwa puja in evening',
      'View moon through sieve',
      'Husband feeds water/sweet',
      'Family gathering'
    ],
    ritualsHindi: [
      'पूर्ण व्रत (निर्जल)',
      'मेंहदी लगाएं',
      'लाल/विशेष कपड़े पहनें',
      'शाम को करवा पूजा',
      'छलनी से चंद्रमा देखें',
      'पति पानी/मिठाई खिलाता है',
      'परिवार समारोह'
    ],
    deity: 'Moon God',
    deityHindi: 'चंद्र देव',
    importance: 'medium',
    fasting: true,
    specialNotes: 'Fasting by married women only'
  },
  {
    id: 'vasant-panchami',
    name: 'Vasant Panchami',
    nameHindi: 'वसंत पंचमी',
    tithiNumber: 5,
    paksha: 'Shukla',
    month: 11, // Pausha/Magha
    type: 'minor',
    significance: 'Welcome spring festival. Dedicated to Goddess Saraswati. Students worship books and instruments. Yellow color theme.',
    significanceHindi: 'वसंत स्वागत त्योहार। देवी सरस्वती को समर्पित। छात्र किताबों और वाद्ययंत्रों की पूजा करते हैं। पीला रंग थीम।',
    rituals: [
      'Saraswati Puja',
      'Worship books/instruments',
      'Wear yellow clothes',
      'Fly kites',
      'Prepare yellow sweets',
      'Cultural programs',
      'Start education on this day'
    ],
    ritualsHindi: [
      'सरस्वती पूजा',
      'किताबें/वाद्ययंत्र पूजा',
      'पीले कपड़े पहनें',
      'पतंग उड़ाएं',
      'पीली मिठाई तैयार करें',
      'सांस्कृतिक कार्यक्रम',
      'इस दिन शिक्षा शुरू करें'
    ],
    deity: 'Goddess Saraswati',
    deityHindi: 'देवी सरस्वती',
    importance: 'medium',
    fasting: false
  },
  {
    id: 'onam',
    name: 'Onam',
    nameHindi: 'ओणम',
    tithiNumber: 27,
    paksha: 'Shukla',
    month: 6, // Bhadrapada
    type: 'regional',
    region: ['Kerala'],
    significance: 'Harvest festival of Kerala. Celebrates King Mahabalis homecoming. Ten days of festivities, boat races, and feasts.',
    significanceHindi: 'केरल का फसल त्योहार। राजा महाबलि के घर लौटने का जश्न। दस दिनों का उत्सव, नौका दौड़, और दावत।',
    rituals: [
      'Pookalam (flower rangoli)',
      'Onam Sadya (grand feast)',
      'Vallam Kali (boat race)',
      'Pulikali (tiger dance)',
      'Traditional games',
      'New clothes',
      'Family gatherings'
    ],
    ritualsHindi: [
      'पूकलम (फूल रंगोली)',
      'ओणम सद्या (भारी दावत)',
      'वल्लम कली (नौका दौड़)',
      'पुलिकली (बाघ नृत्य)',
      'पारंपरिक खेल',
      'नए कपड़े',
      'परिवार समारोह'
    ],
    deity: 'King Mahabali',
    deityHindi: 'राजा महाबलि',
    importance: 'medium',
    fasting: false,
    specialNotes: 'Keralas biggest festival'
  },
  {
    id: 'pongal',
    name: 'Pongal',
    nameHindi: 'पोंगल',
    tithiNumber: 1,
    paksha: 'Shukla',
    month: 10, // Pausha
    type: 'regional',
    region: ['Tamil Nadu'],
    significance: 'Harvest festival of Tamil Nadu. Four-day celebration thanking Sun God, nature, and cattle. Boiling of milk rice.',
    significanceHindi: 'तमिलनाडु का फसल त्योहार। चार दिनों का उत्सव सूर्य देव, प्रकृति और पशुओं को धन्यवाद। दूध चावल उबालना।',
    rituals: [
      'Bhogi Pongal (day 1)',
      'Surya Pongal (day 2)',
      'Mattu Pongal (day 3)',
      'Kaanum Pongal (day 4)',
      'Cook Pongal dish',
      'Decorate cattle',
      'Kolam rangoli'
    ],
    ritualsHindi: [
      'भोगी पोंगल (दिन 1)',
      'सूर्य पोंगल (दिन 2)',
      'मट्टू पोंगल (दिन 3)',
      'कानूम पोंगल (दिन 4)',
      'पोंगल डिश पकाएं',
      'पशुओं को सजाएं',
      'कोलम रंगोली'
    ],
    deity: 'Sun God',
    deityHindi: 'सूर्य देव',
    importance: 'medium',
    fasting: false,
    specialNotes: 'Tamil harvest festival'
  }
];

/**
 * Get festival by id
 */
export const getFestivalById = (id: string): FestivalData | undefined => {
  return FESTIVAL_DATA.find(f => f.id === id);
};

/**
 * Get festivals by type
 */
export const getFestivalsByType = (type: 'major' | 'minor' | 'regional'): FestivalData[] => {
  return FESTIVAL_DATA.filter(f => f.type === type);
};

/**
 * Get festivals by month
 */
export const getFestivalsByMonth = (month: number): FestivalData[] => {
  return FESTIVAL_DATA.filter(f => f.month === month);
};

/**
 * Get all major festivals
 */
export const getMajorFestivals = (): FestivalData[] => {
  return FESTIVAL_DATA.filter(f => f.importance === 'high');
};

/**
 * Get festivals with fasting
 */
export const getFastingFestivals = (): FestivalData[] => {
  return FESTIVAL_DATA.filter(f => f.fasting === true);
};
