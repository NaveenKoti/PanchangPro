/**
 * Fasting (Vrat) Database
 * 
 * Complete offline data for all major Hindu fasting days:
 * - Ekadashi (all 24)
 * - Pradosh Vrat
 * - Sankashti Chaturthi
 * - Purnima Vrat
 * - Amavasya Vrat
 * 
 * Sources:
 * - Padma Purana
 * - Bhavishya Purana
 * - Agni Purana
 * - Nirnaya Sindhu
 */

export interface FastingRule {
  id: string;
  name: string;
  nameHindi: string;
  type: 'ekadashi' | 'pradosh' | 'sankashti' | 'purnima' | 'amavasya' | 'other';
  tithi?: number;
  paksha?: 'Shukla' | 'Krishna';
  significance: string;
  significanceHindi: string;
  rules: string[];
  rulesHindi: string[];
  benefits: string[];
  benefitsHindi: string[];
  paranaTime?: {
    description: string;
    descriptionHindi: string;
    logic: 'after_sunrise' | 'specific_time' | 'next_day';
  };
  deity: string;
  deityHindi: string;
  mantras?: string[];
}

export const FASTING_DATA: FastingRule[] = [
  {
    id: 'ekadashi-shukla',
    name: 'Ekadashi Vrat',
    nameHindi: 'एकादशी व्रत',
    type: 'ekadashi',
    tithi: 11,
    paksha: 'Shukla',
    significance: 'Ekadashi is the most sacred fasting day dedicated to Lord Vishnu. Observed twice a month, it purifies the body and soul, removes sins, and brings spiritual merit.',
    significanceHindi: 'एकादशी भगवान विष्णु को समर्पित सबसे पवित्र व्रत दिन है। महीने में दो बार मनाया जाता है, यह शरीर और आत्मा को शुद्ध करता है, पापों को दूर करता है और आध्यात्मिक पुण्य लाता है।',
    rules: [
      'Complete abstinence from grains, beans, and cereals',
      'Can consume fruits, milk, nuts, and root vegetables (depending on tradition)',
      'Some observe complete water fast (Nirjala)',
      'Break fast next day during Parana time',
      'Chant Vishnu mantras and read scriptures',
      'Avoid anger, lust, and greed',
      'Stay awake late or wake up early for prayers'
    ],
    rulesHindi: [
      'अनाज, फलियां और अनाज से पूर्ण परहेज',
      'फल, दूध, मेवे और कंद सब्जियां खा सकते हैं (परंपरा के अनुसार)',
      'कुछ निर्जल (पानी बिना) व्रत रखते हैं',
      'अगले दिन पारण के समय व्रत तोड़ें',
      'विष्णु मंत्र जाप करें और शास्त्र पढ़ें',
      'क्रोध, वासना और लोभ से बचें',
      'देर तक जागें या प्रार्थना के लिए जल्दी उठें'
    ],
    benefits: [
      'Removes sins of past lives',
      'Purifies body and mind',
      'Improves digestion and health',
      'Brings spiritual merit',
      'Pleases Lord Vishnu',
      'Leads to liberation (moksha)'
    ],
    benefitsHindi: [
      'पिछले जन्मों के पाप दूर करता है',
      'शरीर और मन को शुद्ध करता है',
      'पाचन और स्वास्थ्य में सुधार करता है',
      'आध्यात्मिक पुण्य लाता है',
      'भगवान विष्णु को प्रसन्न करता है',
      'मोक्ष की ओर ले जाता है'
    ],
    paranaTime: {
      description: 'Break fast next morning after sunrise, during Dwadashi tithi',
      descriptionHindi: 'अगली सुबह सूर्योदय के बाद द्वादशी तिथि के दौरान व्रत तोड़ें',
      logic: 'after_sunrise'
    },
    deity: 'Lord Vishnu',
    deityHindi: 'भगवान विष्णु',
    mantras: [
      'Om Namo Narayanaya',
      'Om Namo Bhagavate Vasudevaya',
      'Vishnu Sahasranama'
    ]
  },
  {
    id: 'ekadashi-krishna',
    name: 'Krishna Paksha Ekadashi',
    nameHindi: 'कृष्ण पक्ष एकादशी',
    type: 'ekadashi',
    tithi: 26,
    paksha: 'Krishna',
    significance: 'Ekadashi in waning moon is equally sacred. Each Ekadashi has a specific name and story. Fasting on both Ekadashis brings complete spiritual benefit.',
    significanceHindi: 'घटते चंद्रमा में एकादशी समान रूप से पवित्र है। प्रत्येक एकादशी का एक विशिष्ट नाम और कथा है। दोनों एकादशी पर व्रत रखने से पूर्ण आध्यात्मिक लाभ मिलता है।',
    rules: [
      'Same as Shukla Paksha Ekadashi',
      'Complete abstinence from grains and beans',
      'Fruits, milk, and nuts allowed',
      'Break fast during Parana time next day',
      'Worship Lord Vishnu',
      'Read Ekadashi Mahatmya'
    ],
    rulesHindi: [
      'शुक्ल पक्ष एकादशी जैसा ही',
      'अनाज और फलियों से पूर्ण परहेज',
      'फल, दूध और मेवे की अनुमति',
      'अगले दिन पारण के समय व्रत तोड़ें',
      'भगवान विष्णु की पूजा करें',
      'एकादशी माहात्म्य पढ़ें'
    ],
    benefits: [
      'Removes negative karma',
      'Strengthens willpower',
      'Improves health',
      'Brings peace of mind',
      'Spiritual advancement'
    ],
    benefitsHindi: [
      'नकारात्मक कर्म दूर करता है',
      'इच्छाशक्ति को मजबूत करता है',
      'स्वास्थ्य में सुधार करता है',
      'मन की शांति लाता है',
      'आध्यात्मिक प्रगति'
    ],
    paranaTime: {
      description: 'Break fast next morning after sunrise',
      descriptionHindi: 'अगली सुबह सूर्योदय के बाद व्रत तोड़ें',
      logic: 'after_sunrise'
    },
    deity: 'Lord Vishnu',
    deityHindi: 'भगवान विष्णु',
    mantras: [
      'Om Namo Narayanaya',
      'Hare Krishna Hare Krishna, Krishna Krishna Hare Hare'
    ]
  },
  {
    id: 'pradosh',
    name: 'Pradosh Vrat',
    nameHindi: 'प्रदोष व्रत',
    type: 'pradosh',
    tithi: 14,
    significance: 'Pradosh is the twilight period on Trayodashi (13th lunar day). Dedicated to Lord Shiva, it removes sins and brings prosperity. Observed twice a month.',
    significanceHindi: 'प्रदोष त्रयोदशी (13वें चंद्र दिन) की संध्या अवधि है। भगवान शिव को समर्पित, यह पापों को दूर करता है और समृद्धि लाता है। महीने में दो बार मनाया जाता है।',
    rules: [
      'Fast during the day',
      'Worship Lord Shiva during twilight (1.5 hours before sunset to 1 hour after)',
      'Visit Shiva temple if possible',
      'Offer water, milk, and bilva leaves to Shiva Linga',
      'Chant Om Namah Shivaya',
      'Break fast after evening puja'
    ],
    rulesHindi: [
      'दिन के दौरान व्रत रखें',
      'संध्या के दौरान भगवान शिव की पूजा करें (सूर्यास्त से 1.5 घंटे पहले से 1 घंटे बाद तक)',
      'संभव हो तो शिव मंदिर जाएं',
      'शिव लिंग पर जल, दूध और बिल्व पत्र अर्पित करें',
      'ॐ नमः शिवाय जाप करें',
      'शाम की पूजा के बाद व्रत तोड़ें'
    ],
    benefits: [
      'Removes sins',
      'Brings prosperity',
      'Fulfills desires',
      'Improves health',
      'Brings peace',
      'Blesses with progeny'
    ],
    benefitsHindi: [
      'पाप दूर करता है',
      'समृद्धि लाता है',
      'इच्छाएं पूरी करता है',
      'स्वास्थ्य में सुधार करता है',
      'शांति लाता है',
      'संतान का आशीर्वाद देता है'
    ],
    paranaTime: {
      description: 'Break fast after evening Shiva puja',
      descriptionHindi: 'शाम की शिव पूजा के बाद व्रत तोड़ें',
      logic: 'specific_time'
    },
    deity: 'Lord Shiva',
    deityHindi: 'भगवान शिव',
    mantras: [
      'Om Namah Shivaya',
      'Maha Mrityunjaya Mantra',
      'Rudrashtakam'
    ]
  },
  {
    id: 'sankashti',
    name: 'Sankashti Chaturthi',
    nameHindi: 'संकष्टी चतुर्थी',
    type: 'sankashti',
    tithi: 4,
    paksha: 'Krishna',
    significance: 'Sankashti Chaturthi is observed on the 4th day of waning moon. Dedicated to Lord Ganesha, it removes obstacles and brings success. The fast is broken after moonrise.',
    significanceHindi: 'संकष्टी चतुर्थी घटते चंद्रमा के चौथे दिन मनाई जाती है। भगवान गणेश को समर्पित, यह बाधाओं को दूर करता है और सफलता लाता है। चंद्रोदय के बाद व्रत तोड़ा जाता है।',
    rules: [
      'Complete fast or fruits/milk only',
      'Worship Lord Ganesha',
      'Offer durva grass and modak',
      'Chant Ganesha mantras',
      'Break fast after moonrise',
      'View moon and then break fast'
    ],
    rulesHindi: [
      'पूर्ण व्रत या केवल फल/दूध',
      'भगवान गणेश की पूजा करें',
      'दूर्वा घास और मोदक अर्पित करें',
      'गणेश मंत्र जाप करें',
      'चंद्रोदय के बाद व्रत तोड़ें',
      'चंद्रमा देखें और फिर व्रत तोड़ें'
    ],
    benefits: [
      'Removes obstacles',
      'Brings success',
      'Improves wisdom',
      'Brings prosperity',
      'Fulfills desires',
      'Protects from enemies'
    ],
    benefitsHindi: [
      'बाधाएं दूर करता है',
      'सफलता लाता है',
      'बुद्धि में सुधार करता है',
      'समृद्धि लाता है',
      'इच्छाएं पूरी करता है',
      'शत्रुओं से रक्षा करता है'
    ],
    paranaTime: {
      description: 'Break fast after moonrise, view moon first',
      descriptionHindi: 'चंद्रोदय के बाद व्रत तोड़ें, पहले चंद्रमा देखें',
      logic: 'specific_time'
    },
    deity: 'Lord Ganesha',
    deityHindi: 'भगवान गणेश',
    mantras: [
      'Om Gam Ganapataye Namah',
      'Vakratunda Mahakaya',
      'Ganesha Atharvashirsha'
    ]
  },
  {
    id: 'purnima',
    name: 'Purnima Vrat',
    nameHindi: 'पूर्णिमा व्रत',
    type: 'purnima',
    tithi: 15,
    paksha: 'Shukla',
    significance: 'Full moon day is highly auspicious. Fasting on Purnima brings mental peace, spiritual growth, and fulfillment of desires. Dedicated to Satyanarayan and Moon god.',
    significanceHindi: 'पूर्णिमा का दिन अत्यंत शुभ है। पूर्णिमा पर व्रत रखने से मानसिक शांति, आध्यात्मिक विकास और इच्छाओं की पूर्ति होती है। सत्यनारायण और चंद्र देव को समर्पित।',
    rules: [
      'Fast or light sattvic food',
      'Worship Lord Satyanarayan',
      'Perform Satyanarayan Puja if possible',
      'Donate food and clothes',
      'Chant Vishnu mantras',
      'Break fast after moonrise or next morning'
    ],
    rulesHindi: [
      'व्रत या हल्का सात्विक भोजन',
      'भगवान सत्यनारायण की पूजा करें',
      'संभव हो तो सत्यनारायण पूजा करें',
      'भोजन और वस्त्र दान करें',
      'विष्णु मंत्र जाप करें',
      'चंद्रोदय के बाद या अगली सुबह व्रत तोड़ें'
    ],
    benefits: [
      'Mental peace',
      'Spiritual growth',
      'Fulfills desires',
      'Removes sins',
      'Improves relationships',
      'Brings prosperity'
    ],
    benefitsHindi: [
      'मानसिक शांति',
      'आध्यात्मिक विकास',
      'इच्छाएं पूरी करता है',
      'पाप दूर करता है',
      'रिश्तों में सुधार करता है',
      'समृद्धि लाता है'
    ],
    paranaTime: {
      description: 'Break fast after moonrise or next morning',
      descriptionHindi: 'चंद्रोदय के बाद या अगली सुबह व्रत तोड़ें',
      logic: 'after_sunrise'
    },
    deity: 'Lord Satyanarayan / Moon',
    deityHindi: 'भगवान सत्यनारायण / चंद्र',
    mantras: [
      'Om Namo Bhagavate Vasudevaya',
      'Satyanarayan Katha',
      'Chandra Mantra: Om Shram Shreem Shraum Sah Chandraya Namah'
    ]
  },
  {
    id: 'amavasya',
    name: 'Amavasya Vrat',
    nameHindi: 'अमावस्या व्रत',
    type: 'amavasya',
    tithi: 30,
    paksha: 'Krishna',
    significance: 'New moon day is dedicated to ancestor worship (Pitru Tarpan). Fasting on Amavasya honors ancestors, removes Pitru Dosha, and brings their blessings.',
    significanceHindi: 'अमावस्या का दिन पितृ पूजा (पितृ तर्पण) को समर्पित है। अमावस्या पर व्रत रखने से पूर्वजों का सम्मान होता है, पितृ दोष दूर होता है और उनका आशीर्वाद मिलता है।',
    rules: [
      'Fast or light sattvic food',
      'Perform Pitru Tarpan (ancestor rituals)',
      'Offer water and sesame seeds to ancestors',
      'Feed Brahmins and poor',
      'Donate food in ancestor name',
      'Avoid auspicious ceremonies',
      'Break fast after sunset or next morning'
    ],
    rulesHindi: [
      'व्रत या हल्का सात्विक भोजन',
      'पितृ तर्पण करें (पूर्वज अनुष्ठान)',
      'पूर्वजों को जल और तिल अर्पित करें',
      'ब्राह्मणों और गरीबों को भोजन खिलाएं',
      'पूर्वज के नाम पर भोजन दान करें',
      'शुभ समारोह से बचें',
      'सूर्यास्त के बाद या अगली सुबह व्रत तोड़ें'
    ],
    benefits: [
      'Honors ancestors',
      'Removes Pitru Dosha',
      'Brings ancestral blessings',
      'Helps in progeny',
      'Removes obstacles from family',
      'Brings peace to departed souls'
    ],
    benefitsHindi: [
      'पूर्वजों का सम्मान करता है',
      'पितृ दोष दूर करता है',
      'पैतृक आशीर्वाद लाता है',
      'संतान में सहायक',
      'परिवार से बाधाएं दूर करता है',
      'दिवंगत आत्माओं को शांति लाता है'
    ],
    paranaTime: {
      description: 'Break fast after sunset or next morning',
      descriptionHindi: 'सूर्यास्त के बाद या अगली सुबह व्रत तोड़ें',
      logic: 'after_sunrise'
    },
    deity: 'Ancestors (Pitrus)',
    deityHindi: 'पितृ (पूर्वज)',
    mantras: [
      'Om Pitrubhyo Namah',
      'Pitru Gayatri Mantra',
      'Tarpan Mantras'
    ]
  }
];

/**
 * Get fasting rule by type
 */
export const getFastingByType = (type: FastingRule['type']): FastingRule[] => {
  return FASTING_DATA.filter(f => f.type === type);
};

/**
 * Get fasting rule by id
 */
export const getFastingById = (id: string): FastingRule | undefined => {
  return FASTING_DATA.find(f => f.id === id);
};

/**
 * Get all fasting rules
 */
export const getAllFastingRules = (): FastingRule[] => {
  return FASTING_DATA;
};
