/**
 * Tithi Significance Database
 * 
 * Complete offline data for all 30 tithis with:
 * - Category (Nanda, Bhadra, Jaya, Rikta, Poorna)
 * - Nature (good/neutral/avoid)
 * - Significance
 * - Recommended activities
 * - Activities to avoid
 * 
 * Source: Traditional Vedic Panchang wisdom
 */

export interface TithiSignificance {
  number: number;
  name: string;
  nameHindi: string;
  paksha: 'Shukla' | 'Krishna';
  category: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna';
  nature: 'good' | 'neutral' | 'avoid';
  significance: string;
  significanceHindi: string;
  recommendedActivities: string[];
  recommendedActivitiesHindi: string[];
  avoidActivities: string[];
  avoidActivitiesHindi: string[];
  deity?: string;
  specialNotes?: string;
}

export const TITHI_DATA: TithiSignificance[] = [
  // SHUKLA PAKSHA (Waxing Moon) - Tithis 1-15
  {
    number: 1,
    name: 'Pratipada',
    nameHindi: 'प्रतिपदा',
    paksha: 'Shukla',
    category: 'Nanda',
    nature: 'good',
    significance: 'First lunar day. Good for new beginnings, starting ventures, and laying foundations.',
    significanceHindi: 'पहला चंद्र दिवस। नई शुरुआत, उद्यम शुरू करने और नींव रखने के लिए अच्छा।',
    recommendedActivities: [
      'Starting new projects',
      'Planting seeds',
      'Beginning education',
      'Buying property',
      'Marriage ceremonies'
    ],
    recommendedActivitiesHindi: [
      'नई परियोजनाएं शुरू करना',
      'बीज बोना',
      'शिक्षा शुरू करना',
      'जमीन खरीदना',
      'विवाह समारोह'
    ],
    avoidActivities: ['Funeral ceremonies', 'Negative activities'],
    avoidActivitiesHindi: ['अंतिम संस्कार', 'नकारात्मक गतिविधियां'],
    deity: 'Agni',
  },
  {
    number: 2,
    name: 'Dwitiya',
    nameHindi: 'द्वितीया',
    paksha: 'Shukla',
    category: 'Bhadra',
    nature: 'good',
    significance: 'Second lunar day. Favorable for construction, partnerships, and material gains.',
    significanceHindi: 'दूसरा चंद्र दिवस। निर्माण, साझेदारी और भौतिक लाभ के लिए अनुकूल।',
    recommendedActivities: [
      'Building construction',
      'Business partnerships',
      'Financial investments',
      'Buying vehicles',
      'Sibling-related ceremonies'
    ],
    recommendedActivitiesHindi: [
      'भवन निर्माण',
      'व्यापार साझेदारी',
      'वित्तीय निवेश',
      'वाहन खरीदना',
      'बहन-भाई से जुड़े समारोह'
    ],
    avoidActivities: ['Travel south', 'Lending money'],
    avoidActivitiesHindi: ['दक्षिण यात्रा', 'पैसे उधार देना'],
    deity: 'Brahma',
  },
  {
    number: 3,
    name: 'Tritiya',
    nameHindi: 'तृतीया',
    paksha: 'Shukla',
    category: 'Jaya',
    nature: 'good',
    significance: 'Third lunar day. Victory-oriented. Good for competitions, sports, and overcoming obstacles.',
    significanceHindi: 'तीसरा चंद्र दिवस। विजय उन्मुख। प्रतियोगिताओं, खेलों और बाधाओं को दूर करने के लिए अच्छा।',
    recommendedActivities: [
      'Competitions',
      'Sports activities',
      'Legal matters',
      'Courage-building activities',
      'Meeting friends'
    ],
    recommendedActivitiesHindi: [
      'प्रतियोगिताएं',
      'खेल गतिविधियां',
      'कानूनी मामले',
      'साहस बढ़ाने वाली गतिविधियां',
      'दोस्तों से मिलना'
    ],
    avoidActivities: ['Marriage', 'Peaceful negotiations'],
    avoidActivitiesHindi: ['विवाह', 'शांतिपूर्ण वार्ता'],
    deity: 'Gauri',
  },
  {
    number: 4,
    name: 'Chaturthi',
    nameHindi: 'चतुर्थी',
    paksha: 'Shukla',
    category: 'Rikta',
    nature: 'neutral',
    significance: 'Fourth lunar day. Mixed results. Good for removing obstacles but avoid major decisions.',
    significanceHindi: 'चौथा चंद्र दिवस। मिश्रित परिणाम। बाधाओं को दूर करने के लिए अच्छा लेकिन प्रमुख निर्णयों से बचें।',
    recommendedActivities: [
      'Removing obstacles',
      'Cleaning and purification',
      'Worship of Ganesha',
      'Minor repairs',
      'Spiritual practices'
    ],
    recommendedActivitiesHindi: [
      'बाधाएं दूर करना',
      'सफाई और शुद्धिकरण',
      'गणेश पूजा',
      'छोटी मरम्मत',
      'आध्यात्मिक अभ्यास'
    ],
    avoidActivities: [
      'Marriage',
      'New ventures',
      'Important decisions',
      'Travel'
    ],
    avoidActivitiesHindi: [
      'विवाह',
      'नए उद्यम',
      'महत्वपूर्ण निर्णय',
      'यात्रा'
    ],
    deity: 'Ganesha',
    specialNotes: 'Sankashti Chaturthi is especially auspicious for Ganesha worship',
  },
  {
    number: 5,
    name: 'Panchami',
    nameHindi: 'पंचमी',
    paksha: 'Shukla',
    category: 'Nanda',
    nature: 'good',
    significance: 'Fifth lunar day. Excellent for education, learning, and spiritual practices.',
    significanceHindi: 'पांचवां चंद्र दिवस। शिक्षा, सीखने और आध्यात्मिक अभ्यास के लिए उत्कृष्ट।',
    recommendedActivities: [
      'Starting education',
      'Learning new skills',
      'Spiritual initiation',
      'Worship of Saraswati',
      'Teaching activities'
    ],
    recommendedActivitiesHindi: [
      'शिक्षा शुरू करना',
      'नए कौशल सीखना',
      'आध्यात्मिक दीक्षा',
      'सरस्वती पूजा',
      'शिक्षण गतिविधियां'
    ],
    avoidActivities: ['Harsh speech', 'Arguments'],
    avoidActivitiesHindi: ['कठोर भाषण', 'बहस'],
    deity: 'Saraswati',
  },
  {
    number: 6,
    name: 'Shashthi',
    nameHindi: 'षष्ठी',
    paksha: 'Shukla',
    category: 'Bhadra',
    nature: 'good',
    significance: 'Sixth lunar day. Good for health-related activities, children, and protection.',
    significanceHindi: 'छठा चंद्र दिवस। स्वास्थ्य संबंधी गतिविधियों, बच्चों और सुरक्षा के लिए अच्छा।',
    recommendedActivities: [
      'Health treatments',
      'Child-related ceremonies',
      'Protection rituals',
      'Exercise routines',
      'Worship of Kartikeya'
    ],
    recommendedActivitiesHindi: [
      'स्वास्थ्य उपचार',
      'बच्चों से जुड़े समारोह',
      'सुरक्षा अनुष्ठान',
      'व्यायाम दिनचर्या',
      'कार्तिकेय पूजा'
    ],
    avoidActivities: ['Planting trees', 'Digging earth'],
    avoidActivitiesHindi: ['पेड़ लगाना', 'पृथ्वी खोदना'],
    deity: 'Kartikeya',
  },
  {
    number: 7,
    name: 'Saptami',
    nameHindi: 'सप्तमी',
    paksha: 'Shukla',
    category: 'Jaya',
    nature: 'good',
    significance: 'Seventh lunar day. Victory and success oriented. Good for travel and vehicle purchases.',
    significanceHindi: 'सातवां चंद्र दिवस। विजय और सफलता उन्मुख। यात्रा और वाहन खरीदने के लिए अच्छा।',
    recommendedActivities: [
      'Long travel',
      'Buying vehicles',
      'Competitions',
      'Achievement ceremonies',
      'Sun worship'
    ],
    recommendedActivitiesHindi: [
      'लंबी यात्रा',
      'वाहन खरीदना',
      'प्रतियोगिताएं',
      'उपलब्धि समारोह',
      'सूर्य पूजा'
    ],
    avoidActivities: ['Marriage', 'Lending money'],
    avoidActivitiesHindi: ['विवाह', 'पैसे उधार देना'],
    deity: 'Surya',
  },
  {
    number: 8,
    name: 'Ashtami',
    nameHindi: 'अष्टमी',
    paksha: 'Shukla',
    category: 'Rikta',
    nature: 'neutral',
    significance: 'Eighth lunar day. Powerful but mixed. Good for spiritual practices, avoid material ventures.',
    significanceHindi: 'आठवां चंद्र दिवस। शक्तिशाली लेकिन मिश्रित। आध्यात्मिक अभ्यास के लिए अच्छा, भौतिक उद्यमों से बचें।',
    recommendedActivities: [
      'Spiritual practices',
      'Fasting',
      'Durga worship',
      'Meditation',
      'Charity'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'व्रत',
      'दुर्गा पूजा',
      'ध्यान',
      'दान'
    ],
    avoidActivities: [
      'Marriage',
      'New business',
      'Travel',
      'Important decisions'
    ],
    avoidActivitiesHindi: [
      'विवाह',
      'नया व्यवसाय',
      'यात्रा',
      'महत्वपूर्ण निर्णय'
    ],
    deity: 'Durga',
    specialNotes: 'Durga Ashtami is highly auspicious for Devi worship',
  },
  {
    number: 9,
    name: 'Navami',
    nameHindi: 'नवमी',
    paksha: 'Shukla',
    category: 'Nanda',
    nature: 'good',
    significance: 'Ninth lunar day. Good for courageous activities, property matters, and spiritual growth.',
    significanceHindi: 'नौवां चंद्र दिवस। साहसिक गतिविधियों, संपत्ति मामलों और आध्यात्मिक विकास के लिए अच्छा।',
    recommendedActivities: [
      'Property transactions',
      'Courageous acts',
      'Spiritual practices',
      'Meeting elders',
      'Religious ceremonies'
    ],
    recommendedActivitiesHindi: [
      'संपत्ति लेनदेन',
      'साहसिक कार्य',
      'आध्यात्मिक अभ्यास',
      'बुजुर्गों से मिलना',
      'धार्मिक समारोह'
    ],
    avoidActivities: ['Hair cutting', 'Negative activities'],
    avoidActivitiesHindi: ['बाल कटवाना', 'नकारात्मक गतिविधियां'],
    deity: 'Durga',
  },
  {
    number: 10,
    name: 'Dashami',
    nameHindi: 'दशमी',
    paksha: 'Shukla',
    category: 'Bhadra',
    nature: 'good',
    significance: 'Tenth lunar day. Victory day. Excellent for competitions, achievements, and celebrations.',
    significanceHindi: 'दसवां चंद्र दिवस। विजय दिवस। प्रतियोगिताओं, उपलब्धियों और उत्सव के लिए उत्कृष्ट।',
    recommendedActivities: [
      'Competitions',
      'Award ceremonies',
      'Celebrations',
      'Victory rituals',
      'Meeting authorities'
    ],
    recommendedActivitiesHindi: [
      'प्रतियोगिताएं',
      'पुरस्कार समारोह',
      'उत्सव',
      'विजय अनुष्ठान',
      'अधिकारियों से मिलना'
    ],
    avoidActivities: ['Funeral ceremonies', 'Negative talks'],
    avoidActivitiesHindi: ['अंतिम संस्कार', 'नकारात्मक बातें'],
    deity: 'Dharma',
  },
  {
    number: 11,
    name: 'Ekadashi',
    nameHindi: 'एकादशी',
    paksha: 'Shukla',
    category: 'Jaya',
    nature: 'good',
    significance: 'Eleventh lunar day. Most auspicious for fasting and spiritual practices. Dedicated to Lord Vishnu.',
    significanceHindi: 'ग्यारहवां चंद्र दिवस। व्रत और आध्यात्मिक अभ्यास के लिए सबसे शुभ। भगवान विष्णु को समर्पित।',
    recommendedActivities: [
      'Fasting',
      'Vishnu worship',
      'Meditation',
      'Reading scriptures',
      'Charity',
      'Temple visits'
    ],
    recommendedActivitiesHindi: [
      'व्रत',
      'विष्णु पूजा',
      'ध्यान',
      'शास्त्र पढ़ना',
      'दान',
      'मंदिर यात्रा'
    ],
    avoidActivities: [
      'Grains consumption',
      'Non-vegetarian food',
      'Negative activities',
      'Anger',
      'Worldly pleasures'
    ],
    avoidActivitiesHindi: [
      'अनाज सेवन',
      'मांसाहारी भोजन',
      'नकारात्मक गतिविधियां',
      'क्रोध',
      'सांसारिक सुख'
    ],
    deity: 'Vishnu',
    specialNotes: 'One of the most sacred fasting days. Complete abstinence from grains recommended.',
  },
  {
    number: 12,
    name: 'Dwadashi',
    nameHindi: 'द्वादशी',
    paksha: 'Shukla',
    category: 'Rikta',
    nature: 'neutral',
    significance: 'Twelfth lunar day. Good for spiritual activities and completing pending tasks.',
    significanceHindi: 'बारहवां चंद्र दिवस। आध्यात्मिक गतिविधियों और लंबित कार्यों को पूरा करने के लिए अच्छा।',
    recommendedActivities: [
      'Spiritual practices',
      'Completing tasks',
      'Charity',
      'Vishnu worship',
      'Cleaning'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'कार्य पूरा करना',
      'दान',
      'विष्णु पूजा',
      'सफाई'
    ],
    avoidActivities: ['Marriage', 'New ventures', 'Travel'],
    avoidActivitiesHindi: ['विवाह', 'नए उद्यम', 'यात्रा'],
    deity: 'Vishnu',
  },
  {
    number: 13,
    name: 'Trayodashi',
    nameHindi: 'त्रयोदशी',
    paksha: 'Shukla',
    category: 'Nanda',
    nature: 'good',
    significance: 'Thirteenth lunar day. Good for friendships, social activities, and joyful occasions.',
    significanceHindi: 'तेरहवां चंद्र दिवस। मित्रता, सामाजिक गतिविधियों और खुशी के अवसरों के लिए अच्छा।',
    recommendedActivities: [
      'Social gatherings',
      'Meeting friends',
      'Celebrations',
      'Entertainment',
      'Shopping'
    ],
    recommendedActivitiesHindi: [
      'सामाजिक समारोह',
      'दोस्तों से मिलना',
      'उत्सव',
      'मनोरंजन',
      'खरीदारी'
    ],
    avoidActivities: ['Serious decisions', 'Confrontations'],
    avoidActivitiesHindi: ['गंभीर निर्णय', 'टकराव'],
    deity: 'Kamadeva',
  },
  {
    number: 14,
    name: 'Chaturdashi',
    nameHindi: 'चतुर्दशी',
    paksha: 'Shukla',
    category: 'Bhadra',
    nature: 'good',
    significance: 'Fourteenth lunar day. Powerful for spiritual practices and removing negativity.',
    significanceHindi: 'चौदहवां चंद्र दिवस। आध्यात्मिक अभ्यास और नकारात्मकता को दूर करने के लिए शक्तिशाली।',
    recommendedActivities: [
      'Spiritual practices',
      'Shiva worship',
      'Meditation',
      'Removing obstacles',
      'Fasting (Pradosh)'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'शिव पूजा',
      'ध्यान',
      'बाधाएं दूर करना',
      'व्रत (प्रदोष)'
    ],
    avoidActivities: ['Marriage', 'Worldly pleasures'],
    avoidActivitiesHindi: ['विवाह', 'सांसारिक सुख'],
    deity: 'Shiva',
    specialNotes: 'Pradosh Vrat is observed on this day',
  },
  {
    number: 15,
    name: 'Purnima',
    nameHindi: 'पूर्णिमा',
    paksha: 'Shukla',
    category: 'Poorna',
    nature: 'good',
    significance: 'Full moon day. Most auspicious. Peak energy day. Excellent for all spiritual and material activities.',
    significanceHindi: 'पूर्णिमा का दिन। सबसे शुभ। चरम ऊर्जा दिवस। सभी आध्यात्मिक और भौतिक गतिविधियों के लिए उत्कृष्ट।',
    recommendedActivities: [
      'All auspicious works',
      'Spiritual practices',
      'Fasting',
      'Charity',
      'Marriage',
      'New ventures',
      'Temple visits'
    ],
    recommendedActivitiesHindi: [
      'सभी शुभ कार्य',
      'आध्यात्मिक अभ्यास',
      'व्रत',
      'दान',
      'विवाह',
      'नए उद्यम',
      'मंदिर यात्रा'
    ],
    avoidActivities: ['Negative thoughts', 'Harming others'],
    avoidActivitiesHindi: ['नकारात्मक विचार', 'दूसरों को नुकसान'],
    deity: 'Moon',
    specialNotes: 'Full moon amplifies all energies. Highly auspicious for spiritual practices.',
  },

  // KRISHNA PAKSHA (Waning Moon) - Tithis 16-30
  {
    number: 16,
    name: 'Pratipada',
    nameHindi: 'प्रतिपदा',
    paksha: 'Krishna',
    category: 'Nanda',
    nature: 'neutral',
    significance: 'First lunar day of waning moon. Good for introspection and removing bad habits.',
    significanceHindi: 'घटते चंद्रमा का पहला चंद्र दिवस। आत्मचिंतन और बुरी आदतों को दूर करने के लिए अच्छा।',
    recommendedActivities: [
      'Self-reflection',
      'Removing bad habits',
      'Cleaning',
      'Spiritual practices',
      'Planning'
    ],
    recommendedActivitiesHindi: [
      'आत्मचिंतन',
      'बुरी आदतें दूर करना',
      'सफाई',
      'आध्यात्मिक अभ्यास',
      'योजना'
    ],
    avoidActivities: ['New beginnings', 'Marriage'],
    avoidActivitiesHindi: ['नई शुरुआत', 'विवाह'],
    deity: 'Agni',
  },
  {
    number: 17,
    name: 'Dwitiya',
    nameHindi: 'द्वितीया',
    paksha: 'Krishna',
    category: 'Bhadra',
    nature: 'neutral',
    significance: 'Second lunar day of waning moon. Focus on completion rather than new starts.',
    significanceHindi: 'घटते चंद्रमा का दूसरा चंद्र दिवस। नई शुरुआत के बजाय पूर्णता पर ध्यान दें।',
    recommendedActivities: [
      'Completing tasks',
      'Repairs',
      'Settling debts',
      'Organizing',
      'Study'
    ],
    recommendedActivitiesHindi: [
      'कार्य पूरा करना',
      'मरम्मत',
      'कर्ज चुकाना',
      'व्यवस्थित करना',
      'अध्ययन'
    ],
    avoidActivities: ['New partnerships', 'Major investments'],
    avoidActivitiesHindi: ['नई साझेदारी', 'प्रमुख निवेश'],
    deity: 'Brahma',
  },
  {
    number: 18,
    name: 'Tritiya',
    nameHindi: 'तृतीया',
    paksha: 'Krishna',
    category: 'Jaya',
    nature: 'neutral',
    significance: 'Third lunar day of waning moon. Good for overcoming enemies and obstacles.',
    significanceHindi: 'घटते चंद्रमा का तीसरा चंद्र दिवस। दुश्मनों और बाधाओं को दूर करने के लिए अच्छा।',
    recommendedActivities: [
      'Overcoming obstacles',
      'Legal matters',
      'Competitions',
      'Problem solving',
      'Exercise'
    ],
    recommendedActivitiesHindi: [
      'बाधाएं दूर करना',
      'कानूनी मामले',
      'प्रतियोगिताएं',
      'समस्या समाधान',
      'व्यायाम'
    ],
    avoidActivities: ['Marriage', 'Friendships'],
    avoidActivitiesHindi: ['विवाह', 'मित्रता'],
    deity: 'Gauri',
  },
  {
    number: 19,
    name: 'Chaturthi',
    nameHindi: 'चतुर्थी',
    paksha: 'Krishna',
    category: 'Rikta',
    nature: 'avoid',
    significance: 'Fourth lunar day of waning moon. Avoid important activities. Good for Ganesha worship.',
    significanceHindi: 'घटते चंद्रमा का चौथा चंद्र दिवस। महत्वपूर्ण गतिविधियों से बचें। गणेश पूजा के लिए अच्छा।',
    recommendedActivities: [
      'Ganesha worship',
      'Spiritual practices',
      'Cleaning',
      'Removing obstacles',
      'Meditation'
    ],
    recommendedActivitiesHindi: [
      'गणेश पूजा',
      'आध्यात्मिक अभ्यास',
      'सफाई',
      'बाधाएं दूर करना',
      'ध्यान'
    ],
    avoidActivities: [
      'All auspicious works',
      'Marriage',
      'Travel',
      'New ventures',
      'Important decisions'
    ],
    avoidActivitiesHindi: [
      'सभी शुभ कार्य',
      'विवाह',
      'यात्रा',
      'नए उद्यम',
      'महत्वपूर्ण निर्णय'
    ],
    deity: 'Ganesha',
    specialNotes: 'Sankashti Chaturthi - observe fasting for Ganesha',
  },
  {
    number: 20,
    name: 'Panchami',
    nameHindi: 'पंचमी',
    paksha: 'Krishna',
    category: 'Nanda',
    nature: 'neutral',
    significance: 'Fifth lunar day of waning moon. Moderate day. Good for learning and teaching.',
    significanceHindi: 'घटते चंद्रमा का पांचवां चंद्र दिवस। मध्यम दिन। सीखने और सिखाने के लिए अच्छा।',
    recommendedActivities: [
      'Learning',
      'Teaching',
      'Spiritual study',
      'Music practice',
      'Writing'
    ],
    recommendedActivitiesHindi: [
      'सीखना',
      'सिखाना',
      'आध्यात्मिक अध्ययन',
      'संगीत अभ्यास',
      'लेखन'
    ],
    avoidActivities: ['Marriage', 'Major decisions'],
    avoidActivitiesHindi: ['विवाह', 'प्रमुख निर्णय'],
    deity: 'Saraswati',
  },
  {
    number: 21,
    name: 'Shashthi',
    nameHindi: 'षष्ठी',
    paksha: 'Krishna',
    category: 'Bhadra',
    nature: 'neutral',
    significance: 'Sixth lunar day of waning moon. Good for health matters and children.',
    significanceHindi: 'घटते चंद्रमा का छठा चंद्र दिवस। स्वास्थ्य मामलों और बच्चों के लिए अच्छा।',
    recommendedActivities: [
      'Health checkups',
      'Child care',
      'Exercise',
      'Protection rituals',
      'Family time'
    ],
    recommendedActivitiesHindi: [
      'स्वास्थ्य जांच',
      'बाल देखभाल',
      'व्यायाम',
      'सुरक्षा अनुष्ठान',
      'परिवार के साथ समय'
    ],
    avoidActivities: ['Planting', 'Digging'],
    avoidActivitiesHindi: ['लगाना', 'खोदना'],
    deity: 'Kartikeya',
  },
  {
    number: 22,
    name: 'Saptami',
    nameHindi: 'सप्तमी',
    paksha: 'Krishna',
    category: 'Jaya',
    nature: 'neutral',
    significance: 'Seventh lunar day of waning moon. Moderate for travel and vehicle matters.',
    significanceHindi: 'घटते चंद्रमा का सातवां चंद्र दिवस। यात्रा और वाहन मामलों के लिए मध्यम।',
    recommendedActivities: [
      'Short travel',
      'Vehicle maintenance',
      'Exercise',
      'Sun worship',
      'Competitions'
    ],
    recommendedActivitiesHindi: [
      'छोटी यात्रा',
      'वाहन रखरखाव',
      'व्यायाम',
      'सूर्य पूजा',
      'प्रतियोगिताएं'
    ],
    avoidActivities: ['Long travel', 'Marriage'],
    avoidActivitiesHindi: ['लंबी यात्रा', 'विवाह'],
    deity: 'Surya',
  },
  {
    number: 23,
    name: 'Ashtami',
    nameHindi: 'अष्टमी',
    paksha: 'Krishna',
    category: 'Rikta',
    nature: 'avoid',
    significance: 'Eighth lunar day of waning moon. Avoid important works. Good for spiritual practices.',
    significanceHindi: 'घटते चंद्रमा का आठवां चंद्र दिवस। महत्वपूर्ण कार्यों से बचें। आध्यात्मिक अभ्यास के लिए अच्छा।',
    recommendedActivities: [
      'Spiritual practices',
      'Durga worship',
      'Fasting',
      'Meditation',
      'Charity'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'दुर्गा पूजा',
      'व्रत',
      'ध्यान',
      'दान'
    ],
    avoidActivities: [
      'All auspicious works',
      'Marriage',
      'Business',
      'Travel',
      'Important decisions'
    ],
    avoidActivitiesHindi: [
      'सभी शुभ कार्य',
      'विवाह',
      'व्यापार',
      'यात्रा',
      'महत्वपूर्ण निर्णय'
    ],
    deity: 'Durga',
  },
  {
    number: 24,
    name: 'Navami',
    nameHindi: 'नवमी',
    paksha: 'Krishna',
    category: 'Nanda',
    nature: 'avoid',
    significance: 'Ninth lunar day of waning moon. Generally inauspicious. Focus on spiritual activities.',
    significanceHindi: 'घटते चंद्रमा का नौवां चंद्र दिवस। आमतौर पर अशुभ। आध्यात्मिक गतिविधियों पर ध्यान दें।',
    recommendedActivities: [
      'Spiritual practices',
      'Temple visits',
      'Charity',
      'Reading scriptures',
      'Meditation'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'मंदिर यात्रा',
      'दान',
      'शास्त्र पढ़ना',
      'ध्यान'
    ],
    avoidActivities: [
      'Marriage',
      'New ventures',
      'Property deals',
      'Travel'
    ],
    avoidActivitiesHindi: [
      'विवाह',
      'नए उद्यम',
      'संपत्ति सौदे',
      'यात्रा'
    ],
    deity: 'Durga',
  },
  {
    number: 25,
    name: 'Dashami',
    nameHindi: 'दशमी',
    paksha: 'Krishna',
    category: 'Bhadra',
    nature: 'neutral',
    significance: 'Tenth lunar day of waning moon. Moderate day. Complete pending tasks.',
    significanceHindi: 'घटते चंद्रमा का दसवां चंद्र दिवस। मध्यम दिन। लंबित कार्यों को पूरा करें।',
    recommendedActivities: [
      'Completing tasks',
      'Settling matters',
      'Cleaning',
      'Organization',
      'Study'
    ],
    recommendedActivitiesHindi: [
      'कार्य पूरा करना',
      'मामले निपटाना',
      'सफाई',
      'संगठन',
      'अध्ययन'
    ],
    avoidActivities: ['New starts', 'Marriage'],
    avoidActivitiesHindi: ['नई शुरुआत', 'विवाह'],
    deity: 'Dharma',
  },
  {
    number: 26,
    name: 'Ekadashi',
    nameHindi: 'एकादशी',
    paksha: 'Krishna',
    category: 'Jaya',
    nature: 'good',
    significance: 'Eleventh lunar day of waning moon. Auspicious for fasting and Vishnu worship.',
    significanceHindi: 'घटते चंद्रमा का ग्यारहवां चंद्र दिवस। व्रत और विष्णु पूजा के लिए शुभ।',
    recommendedActivities: [
      'Fasting',
      'Vishnu worship',
      'Meditation',
      'Reading scriptures',
      'Charity',
      'Temple visits'
    ],
    recommendedActivitiesHindi: [
      'व्रत',
      'विष्णु पूजा',
      'ध्यान',
      'शास्त्र पढ़ना',
      'दान',
      'मंदिर यात्रा'
    ],
    avoidActivities: [
      'Grains consumption',
      'Non-vegetarian food',
      'Negative activities',
      'Worldly pleasures'
    ],
    avoidActivitiesHindi: [
      'अनाज सेवन',
      'मांसाहारी भोजन',
      'नकारात्मक गतिविधियां',
      'सांसारिक सुख'
    ],
    deity: 'Vishnu',
    specialNotes: 'Krishna Paksha Ekadashi - equally auspicious for fasting',
  },
  {
    number: 27,
    name: 'Dwadashi',
    nameHindi: 'द्वादशी',
    paksha: 'Krishna',
    category: 'Rikta',
    nature: 'neutral',
    significance: 'Twelfth lunar day of waning moon. Good for spiritual completion activities.',
    significanceHindi: 'घटते चंद्रमा का बारहवां चंद्र दिवस। आध्यात्मिक पूर्णता गतिविधियों के लिए अच्छा।',
    recommendedActivities: [
      'Spiritual practices',
      'Completing tasks',
      'Charity',
      'Vishnu worship',
      'Cleaning'
    ],
    recommendedActivitiesHindi: [
      'आध्यात्मिक अभ्यास',
      'कार्य पूरा करना',
      'दान',
      'विष्णु पूजा',
      'सफाई'
    ],
    avoidActivities: ['Marriage', 'New ventures'],
    avoidActivitiesHindi: ['विवाह', 'नए उद्यम'],
    deity: 'Vishnu',
  },
  {
    number: 28,
    name: 'Trayodashi',
    nameHindi: 'त्रयोदशी',
    paksha: 'Krishna',
    category: 'Nanda',
    nature: 'neutral',
    significance: 'Thirteenth lunar day of waning moon. Moderate for social activities.',
    significanceHindi: 'घटते चंद्रमा का तेरहवां चंद्र दिवस। सामाजिक गतिविधियों के लिए मध्यम।',
    recommendedActivities: [
      'Family gatherings',
      'Meeting friends',
      'Light celebrations',
      'Shopping',
      'Entertainment'
    ],
    recommendedActivitiesHindi: [
      'परिवार समारोह',
      'दोस्तों से मिलना',
      'हल्के उत्सव',
      'खरीदारी',
      'मनोरंजन'
    ],
    avoidActivities: ['Important decisions', 'Confrontations'],
    avoidActivitiesHindi: ['महत्वपूर्ण निर्णय', 'टकराव'],
    deity: 'Kamadeva',
  },
  {
    number: 29,
    name: 'Chaturdashi',
    nameHindi: 'चतुर्दशी',
    paksha: 'Krishna',
    category: 'Bhadra',
    nature: 'neutral',
    significance: 'Fourteenth lunar day of waning moon. Good for spiritual practices and Shiva worship.',
    significanceHindi: 'घटते चंद्रमा का चौदहवां चंद्र दिवस। आध्यात्मिक अभ्यास और शिव पूजा के लिए अच्छा।',
    recommendedActivities: [
      'Shiva worship',
      'Spiritual practices',
      'Meditation',
      'Fasting (Pradosh)',
      'Removing negativity'
    ],
    recommendedActivitiesHindi: [
      'शिव पूजा',
      'आध्यात्मिक अभ्यास',
      'ध्यान',
      'व्रत (प्रदोष)',
      'नकारात्मकता दूर करना'
    ],
    avoidActivities: ['Marriage', 'Worldly pleasures'],
    avoidActivitiesHindi: ['विवाह', 'सांसारिक सुख'],
    deity: 'Shiva',
    specialNotes: 'Pradosh Vrat is observed on this day',
  },
  {
    number: 30,
    name: 'Amavasya',
    nameHindi: 'अमावस्या',
    paksha: 'Krishna',
    category: 'Poorna',
    nature: 'neutral',
    significance: 'New moon day. Good for ancestor worship and spiritual practices. Avoid auspicious works.',
    significanceHindi: 'अमावस्या का दिन। पितृ पूजा और आध्यात्मिक अभ्यास के लिए अच्छा। शुभ कार्यों से बचें।',
    recommendedActivities: [
      'Ancestor worship',
      'Tarpan/Shraddh',
      'Spiritual practices',
      'Meditation',
      'Charity',
      'Feeding poor'
    ],
    recommendedActivitiesHindi: [
      'पितृ पूजा',
      'तर्पण/श्राद्ध',
      'आध्यात्मिक अभ्यास',
      'ध्यान',
      'दान',
      'गरीबों को भोजन'
    ],
    avoidActivities: [
      'Marriage',
      'New ventures',
      'Travel',
      'Auspicious ceremonies',
      'Griha Pravesh'
    ],
    avoidActivitiesHindi: [
      'विवाह',
      'नए उद्यम',
      'यात्रा',
      'शुभ समारोह',
      'गृह प्रवेश'
    ],
    deity: 'Ancestors',
    specialNotes: 'New moon - ideal for ancestor rituals. Not suitable for celebrations.',
  },
];

/**
 * Get tithi significance by number and paksha
 */
export const getTithiSignificance = (
  tithiNumber: number,
  paksha: 'Shukla' | 'Krishna'
): TithiSignificance | undefined => {
  const actualNumber = paksha === 'Shukla' ? tithiNumber : tithiNumber + 15;
  return TITHI_DATA.find(
    (t) => t.number === actualNumber && t.paksha === paksha
  );
};

/**
 * Get tithi significance by actual index (1-30)
 */
export const getTithiByIndex = (index: number): TithiSignificance | undefined => {
  if (index < 1 || index > 30) return undefined;
  return TITHI_DATA[index - 1];
};

/**
 * Get all tithis of a specific paksha
 */
export const getTithisByPaksha = (
  paksha: 'Shukla' | 'Krishna'
): TithiSignificance[] => {
  return TITHI_DATA.filter((t) => t.paksha === paksha);
};

/**
 * Get tithis by category
 */
export const getTithisByCategory = (
  category: 'Nanda' | 'Bhadra' | 'Jaya' | 'Rikta' | 'Poorna'
): TithiSignificance[] => {
  return TITHI_DATA.filter((t) => t.category === category);
};
