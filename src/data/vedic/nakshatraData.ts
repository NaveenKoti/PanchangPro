/**
 * Nakshatra Significance Database
 * 
 * Complete offline data for all 27 nakshatras with:
 * - Ruling deity
 * - Guna (Sattva/Rajas/Tamas)
 * - Nature (fixed/movable/soft/sharp/light)
 * - Significance
 * - Good activities
 * - Activities to avoid
 * 
 * Sources:
 * - Brihat Samhita (Varahamihira)
 * - Brihat Parashara Hora Shastra
 * - Muhurta Chintamani
 * - Phaladeepika
 * - Agni Purana
 */

export interface NakshatraSignificance {
  number: number;
  name: string;
  nameHindi: string;
  rulingDeity: string;
  rulingDeityHindi: string;
  rulingPlanet: string;
  pada: 1 | 2 | 3 | 4;
  guna: 'Sattva' | 'Rajas' | 'Tamas';
  nature: 'fixed' | 'movable' | 'soft' | 'sharp' | 'light' | 'dreadful';
  symbol: string;
  symbolHindi: string;
  significance: string;
  significanceHindi: string;
  goodFor: string[];
  goodForHindi: string[];
  avoidFor: string[];
  avoidForHindi: string[];
  compatibility?: string;
  specialNotes?: string;
}

export const NAKSHATRA_DATA: NakshatraSignificance[] = [
  {
    number: 1,
    name: 'Ashwini',
    nameHindi: 'अश्विनी',
    rulingDeity: 'Ashwini Kumaras',
    rulingDeityHindi: 'अश्विनी कुमार',
    rulingPlanet: 'Ketu',
    pada: 4,
    guna: 'Tamas',
    nature: 'light',
    symbol: "Horse's Head",
    symbolHindi: 'घोड़े का सिर',
    significance: 'First nakshatra. Represents healing, speed, and new beginnings. The divine physicians bring quick cures and swift action.',
    significanceHindi: 'पहला नक्षत्र। चिकित्सा, गति और नई शुरुआत का प्रतिनिधित्व करता है। दिव्य चिकित्सक त्वरित उपचार और त्वरित कार्रवाई लाते हैं।',
    goodFor: [
      'Medical treatments',
      'Starting new ventures',
      'Travel',
      'Sports and competitions',
      'Learning driving',
      'Buying vehicles',
      'Short journeys'
    ],
    goodForHindi: [
      'चिकित्सा उपचार',
      'नए उद्यम शुरू करना',
      'यात्रा',
      'खेल और प्रतियोगिताएं',
      'ड्राइविंग सीखना',
      'वाहन खरीदना',
      'छोटी यात्राएं'
    ],
    avoidFor: [
      'Marriage ceremonies',
      'Long-term investments',
      'Planting trees',
      'Land purchase'
    ],
    avoidForHindi: [
      'विवाह समारोह',
      'दीर्घकालिक निवेश',
      'पेड़ लगाना',
      'जमीन खरीदना'
    ],
    specialNotes: 'Excellent for emergency medical treatments. Not ideal for marriage.',
  },
  {
    number: 2,
    name: 'Bharani',
    nameHindi: 'भरणी',
    rulingDeity: 'Yama',
    rulingDeityHindi: 'यम',
    rulingPlanet: 'Venus',
    pada: 4,
    guna: 'Rajas',
    nature: 'movable',
    symbol: 'Yoni (Female Organ)',
    symbolHindi: 'योनि',
    significance: 'Represents transformation, restraint, and the cycle of life and death. Ruled by Yama, god of dharma and justice.',
    significanceHindi: 'परिवर्तन, संयम और जीवन और मृत्यु के चक्र का प्रतिनिधित्व करता है। धर्म और न्याय के देवता यम द्वारा शासित।',
    goodFor: [
      'Spiritual practices',
      'Research work',
      'Investigation',
      'Removing obstacles',
      'Discipline-building',
      'Yama worship'
    ],
    goodForHindi: [
      'आध्यात्मिक अभ्यास',
      'अनुसंधान कार्य',
      'जांच',
      'बाधाएं दूर करना',
      'अनुशासन निर्माण',
      'यम पूजा'
    ],
    avoidFor: [
      'Marriage',
      'Starting education',
      'Auspicious ceremonies',
      'Travel',
      'New business'
    ],
    avoidForHindi: [
      'विवाह',
      'शिक्षा शुरू करना',
      'शुभ समारोह',
      'यात्रा',
      'नया व्यवसाय'
    ],
    specialNotes: 'Considered inauspicious for most worldly activities. Good for spiritual practices only.',
  },
  {
    number: 3,
    name: 'Krittika',
    nameHindi: 'कृत्तिका',
    rulingDeity: 'Agni',
    rulingDeityHindi: 'अग्नि',
    rulingPlanet: 'Sun',
    pada: 4,
    guna: 'Rajas',
    nature: 'fixed',
    symbol: 'Knife/Razor',
    symbolHindi: 'चाकू/उस्तरा',
    significance: 'Represents purification, cutting away negativity, and spiritual transformation. Fire god Agni brings purification and power.',
    significanceHindi: 'शुद्धिकरण, नकारात्मकता को काटने और आध्यात्मिक परिवर्तन का प्रतिनिधित्व करता है। अग्नि देव शुद्धिकरण और शक्ति लाते हैं।',
    goodFor: [
      'Spiritual practices',
      'Purification rituals',
      'Cooking-related work',
      'Metal work',
      'Jewelry making',
      'Fire-related activities',
      'Yajna/Havan'
    ],
    goodForHindi: [
      'आध्यात्मिक अभ्यास',
      'शुद्धिकरण अनुष्ठान',
      'खाना पकाने से जुड़ा काम',
      'धातु कार्य',
      'आभूषण निर्माण',
      'अग्नि संबंधी गतिविधियां',
      'यज्ञ/हवन'
    ],
    avoidFor: [
      'Marriage',
      'Starting education',
      'Planting',
      'Peaceful negotiations'
    ],
    avoidForHindi: [
      'विवाह',
      'शिक्षा शुरू करना',
      'लगाना',
      'शांतिपूर्ण वार्ता'
    ],
    specialNotes: 'Powerful for spiritual purification. Sharp energy - use carefully.',
  },
  {
    number: 4,
    name: 'Rohini',
    nameHindi: 'रोहिणी',
    rulingDeity: 'Brahma',
    rulingDeityHindi: 'ब्रह्मा',
    rulingPlanet: 'Moon',
    pada: 4,
    guna: 'Sattva',
    nature: 'fixed',
    symbol: 'Chariot/Temple',
    symbolHindi: 'रथ/मंदिर',
    significance: 'Most auspicious nakshatra. Represents growth, fertility, creativity, and material abundance. Beloved of the Moon god.',
    significanceHindi: 'सबसे शुभ नक्षत्र। विकास, उर्वरता, रचनात्मकता और भौतिक प्रचुरता का प्रतिनिधित्व करता है। चंद्र देव का प्रिय।',
    goodFor: [
      'Marriage',
      'All auspicious works',
      'Agriculture',
      'Business',
      'Arts and creativity',
      'Property purchase',
      'Conception',
      'Education'
    ],
    goodForHindi: [
      'विवाह',
      'सभी शुभ कार्य',
      'कृषि',
      'व्यापार',
      'कला और रचनात्मकता',
      'संपत्ति खरीद',
      'गर्भधारण',
      'शिक्षा'
    ],
    avoidFor: [
      'Destructive activities',
      'Negative works'
    ],
    avoidForHindi: [
      'विनाशकारी गतिविधियां',
      'नकारात्मक कार्य'
    ],
    specialNotes: 'Considered the best nakshatra for most auspicious activities. Highly fertile and creative.',
  },
  {
    number: 5,
    name: 'Mrigashira',
    nameHindi: 'मृगशिरा',
    rulingDeity: 'Soma',
    rulingDeityHindi: 'सोम',
    rulingPlanet: 'Mars',
    pada: 4,
    guna: 'Tamas',
    nature: 'movable',
    symbol: "Deer's Head",
    symbolHindi: 'हिरण का सिर',
    significance: 'Represents searching, curiosity, and beauty. The seeking energy leads to knowledge and sensual experiences.',
    significanceHindi: 'खोज, जिज्ञासा और सुंदरता का प्रतिनिधित्व करता है। खोजने वाली ऊर्जा ज्ञान और इंद्रिय अनुभवों की ओर ले जाती है।',
    goodFor: [
      'Learning arts',
      'Music and dance',
      'Jewelry wearing',
      'Romantic activities',
      'Travel',
      'Shopping',
      'Beauty treatments'
    ],
    goodForHindi: [
      'कला सीखना',
      'संगीत और नृत्य',
      'आभूषण पहनना',
      'रोमांटिक गतिविधियां',
      'यात्रा',
      'खरीदारी',
      'सौंदर्य उपचार'
    ],
    avoidFor: [
      'Aggressive activities',
      'Confrontations',
      'Heavy investments'
    ],
    avoidForHindi: [
      'आक्रामक गतिविधियां',
      'टकराव',
      'भारी निवेश'
    ],
    specialNotes: 'Good for arts and romance. Mind tends to wander - focus needed.',
  },
  {
    number: 6,
    name: 'Ardra',
    nameHindi: 'आर्द्रा',
    rulingDeity: 'Rudra',
    rulingDeityHindi: 'रुद्र',
    rulingPlanet: 'Rahu',
    pada: 4,
    guna: 'Tamas',
    nature: 'movable',
    symbol: 'Teardrop',
    symbolHindi: 'आंसू',
    significance: 'Represents transformation through destruction. Rudra brings storms that clear the way for renewal. Intense energy.',
    significanceHindi: 'विनाश के माध्यम से परिवर्तन का प्रतिनिधित्व करता है। रुद्र तूफान लाते हैं जो नवीनीकरण के लिए रास्ता साफ करते हैं। तीव्र ऊर्जा।',
    goodFor: [
      'Spiritual transformation',
      'Removing enemies',
      'Destruction of negativity',
      'Tantric practices',
      'Research',
      'Investigation'
    ],
    goodForHindi: [
      'आध्यात्मिक परिवर्तन',
      'दुश्मनों को दूर करना',
      'नकारात्मकता का विनाश',
      'तांत्रिक अभ्यास',
      'अनुसंधान',
      'जांच'
    ],
    avoidFor: [
      'Marriage',
      'Auspicious ceremonies',
      'New ventures',
      'Travel',
      'Education'
    ],
    avoidForHindi: [
      'विवाह',
      'शुभ समारोह',
      'नए उद्यम',
      'यात्रा',
      'शिक्षा'
    ],
    specialNotes: 'Generally inauspicious. Only for specific spiritual/destructive purposes.',
  },
  {
    number: 7,
    name: 'Punarvasu',
    nameHindi: 'पुनर्वसु',
    rulingDeity: 'Aditi',
    rulingDeityHindi: 'अदिति',
    rulingPlanet: 'Jupiter',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Quiver of Arrows',
    symbolHindi: 'तीरों का तूणीर',
    significance: 'Represents renewal, restoration, and return. Mother Aditi brings abundance and second chances.',
    significanceHindi: 'नवीनीकरण, बहाली और वापसी का प्रतिनिधित्व करता है। माता अदिति प्रचुरता और दूसरे अवसर लाती हैं।',
    goodFor: [
      'New beginnings',
      'Education',
      'Travel',
      'Recovery from illness',
      'Reconciliation',
      'Starting business',
      'Learning'
    ],
    goodForHindi: [
      'नई शुरुआत',
      'शिक्षा',
      'यात्रा',
      'बीमारी से ठीक होना',
      'सुलह',
      'व्यापार शुरू करना',
      'सीखना'
    ],
    avoidFor: [
      'Destructive activities',
      'Confrontations'
    ],
    avoidForHindi: [
      'विनाशकारी गतिविधियां',
      'टकराव'
    ],
    specialNotes: 'Excellent for new beginnings and recovery. Very auspicious.',
  },
  {
    number: 8,
    name: 'Pushya',
    nameHindi: 'पुष्य',
    rulingDeity: 'Brihaspati',
    rulingDeityHindi: 'बृहस्पति',
    rulingPlanet: 'Saturn',
    pada: 4,
    guna: 'Sattva',
    nature: 'fixed',
    symbol: "Cow's Udder/Arrow",
    symbolHindi: 'गाय का थन/तीर',
    significance: 'Most auspicious nakshatra after Rohini. Represents nourishment, growth, and spiritual development. The nourisher.',
    significanceHindi: 'रोहिणी के बाद सबसे शुभ नक्षत्र। पोषण, विकास और आध्यात्मिक विकास का प्रतिनिधित्व करता है। पोषक।',
    goodFor: [
      'All auspicious works',
      'Marriage',
      'Education',
      'Business',
      'Property purchase',
      'Spiritual practices',
      'Medical treatments',
      'Starting education'
    ],
    goodForHindi: [
      'सभी शुभ कार्य',
      'विवाह',
      'शिक्षा',
      'व्यापार',
      'संपत्ति खरीद',
      'आध्यात्मिक अभ्यास',
      'चिकित्सा उपचार',
      'शिक्षा शुरू करना'
    ],
    avoidFor: [
      'Negative activities'
    ],
    avoidForHindi: [
      'नकारात्मक गतिविधियां'
    ],
    specialNotes: 'Exceptionally auspicious. Pushya Nakshatra is considered highly favorable for all good works.',
  },
  {
    number: 9,
    name: 'Ashlesha',
    nameHindi: 'आश्लेषा',
    rulingDeity: 'Nagas',
    rulingDeityHindi: 'नाग',
    rulingPlanet: 'Mercury',
    pada: 4,
    guna: 'Rajas',
    nature: 'movable',
    symbol: 'Serpent',
    symbolHindi: 'सर्प',
    significance: 'Represents clinging, entanglement, and hidden knowledge. Serpent energy brings wisdom but also deception.',
    significanceHindi: 'चिपकने, उलझने और छिपे ज्ञान का प्रतिनिधित्व करता है। सर्प ऊर्जा बुद्धि लाती है लेकिन धोखा भी।',
    goodFor: [
      'Tantric practices',
      'Research',
      'Occult sciences',
      'Medicine',
      'Poison-related work',
      'Destroying enemies',
      'Hypnosis'
    ],
    goodForHindi: [
      'तांत्रिक अभ्यास',
      'अनुसंधान',
      'गुप्त विज्ञान',
      'चिकित्सा',
      'विष संबंधी कार्य',
      'दुश्मनों को नष्ट करना',
      'सम्मोहन'
    ],
    avoidFor: [
      'Marriage',
      'Auspicious ceremonies',
      'New ventures',
      'Travel',
      'Education',
      'Partnerships'
    ],
    avoidForHindi: [
      'विवाह',
      'शुभ समारोह',
      'नए उद्यम',
      'यात्रा',
      'शिक्षा',
      'साझेदारी'
    ],
    specialNotes: 'Generally inauspicious for worldly activities. Powerful for specific spiritual/tantric work.',
  },
  {
    number: 10,
    name: 'Magha',
    nameHindi: 'मघा',
    rulingDeity: 'Pitris (Ancestors)',
    rulingDeityHindi: 'पितृ',
    rulingPlanet: 'Ketu',
    pada: 4,
    guna: 'Tamas',
    nature: 'fixed',
    symbol: 'Royal Throne',
    symbolHindi: 'शाही सिंहासन',
    significance: 'Represents royalty, power, and ancestral blessings. Connected to Pitris (ancestors) who bestow authority.',
    significanceHindi: 'राजशाही, शक्ति और पितृ आशीर्वाद का प्रतिनिधित्व करता है। पितृओं (पूर्वजों) से जुड़ा जो अधिकार प्रदान करते हैं।',
    goodFor: [
      'Meeting authorities',
      'Political activities',
      'Ancestor worship',
      'Property matters',
      'Leadership roles',
      'Starting dynasty-related work'
    ],
    goodForHindi: [
      'अधिकारियों से मिलना',
      'राजनीतिक गतिविधियां',
      'पितृ पूजा',
      'संपत्ति मामले',
      'नेतृत्व भूमिकाएं',
      'वंश संबंधी कार्य शुरू करना'
    ],
    avoidFor: [
      'Marriage',
      'Travel',
      'Education'
    ],
    avoidForHindi: [
      'विवाह',
      'यात्रा',
      'शिक्षा'
    ],
    specialNotes: 'Powerful for authority and ancestral connections. Not ideal for marriage.',
  },
  {
    number: 11,
    name: 'Purva Phalguni',
    nameHindi: 'पूर्व फाल्गुनी',
    rulingDeity: 'Bhaga',
    rulingDeityHindi: 'भग',
    rulingPlanet: 'Venus',
    pada: 4,
    guna: 'Rajas',
    nature: 'fixed',
    symbol: 'Front Legs of Bed',
    symbolHindi: 'बिस्तर के अगले पैर',
    significance: 'Represents pleasure, creativity, romance, and progeny. Bhaga brings enjoyment and marital bliss.',
    significanceHindi: 'खुशी, रचनात्मकता, रोमांस और संतान का प्रतिनिधित्व करता है। भग आनंद और वैवाहिक सुख लाते हैं।',
    goodFor: [
      'Marriage',
      'Romantic activities',
      'Arts and entertainment',
      'Conception',
      'Beauty treatments',
      'Celebrations',
      'Friendships'
    ],
    goodForHindi: [
      'विवाह',
      'रोमांटिक गतिविधियां',
      'कला और मनोरंजन',
      'गर्भधारण',
      'सौंदर्य उपचार',
      'उत्सव',
      'मित्रता'
    ],
    avoidFor: [
      'Spiritual practices',
      'Fasting',
      'Austere activities'
    ],
    avoidForHindi: [
      'आध्यात्मिक अभ्यास',
      'व्रत',
      'कठोर गतिविधियां'
    ],
    specialNotes: 'Excellent for marriage and romance. Not suitable for spiritual austerities.',
  },
  {
    number: 12,
    name: 'Uttara Phalguni',
    nameHindi: 'उत्तर फाल्गुनी',
    rulingDeity: 'Aryaman',
    rulingDeityHindi: 'आर्यमन',
    rulingPlanet: 'Sun',
    pada: 4,
    guna: 'Sattva',
    nature: 'fixed',
    symbol: 'Back Legs of Bed',
    symbolHindi: 'बिस्तर के पिछले पैर',
    significance: 'Represents patronage, support, and lasting relationships. Aryaman brings contracts and alliances.',
    significanceHindi: 'संरक्षण, समर्थन और स्थायी संबंधों का प्रतिनिधित्व करता है। आर्यमन अनुबंध और गठबंधन लाते हैं।',
    goodFor: [
      'Marriage',
      'Partnerships',
      'Business agreements',
      'Friendships',
      'Charity',
      'Social work',
      'Leadership'
    ],
    goodForHindi: [
      'विवाह',
      'साझेदारी',
      'व्यापार समझौते',
      'मित्रता',
      'दान',
      'सामाजिक कार्य',
      'नेतृत्व'
    ],
    avoidFor: [
      'Secret activities',
      'Deception'
    ],
    avoidForHindi: [
      'गुप्त गतिविधियां',
      'धोखा'
    ],
    specialNotes: 'Very auspicious for marriage and partnerships. Brings stability.',
  },
  {
    number: 13,
    name: 'Hasta',
    nameHindi: 'हस्त',
    rulingDeity: 'Savitar',
    rulingDeityHindi: 'सविता',
    rulingPlanet: 'Moon',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Hand',
    symbolHindi: 'हाथ',
    significance: 'Represents skill, craftsmanship, and healing hands. Savitar brings dexterity and artistic ability.',
    significanceHindi: 'कौशल, शिल्प और चिकित्सा हाथों का प्रतिनिधित्व करता है। सविता चपलता और कलात्मक क्षमता लाते हैं।',
    goodFor: [
      'Learning crafts',
      'Medical practice',
      'Business',
      'Trade',
      'Writing',
      'Accounting',
      'Jewelry work',
      'Healing'
    ],
    goodForHindi: [
      'शिल्प सीखना',
      'चिकित्सा अभ्यास',
      'व्यापार',
      'व्यापार',
      'लेखन',
      'लेखांकन',
      'आभूषण कार्य',
      'चिकित्सा'
    ],
    avoidFor: [
      'Destructive activities',
      'Violence'
    ],
    avoidForHindi: [
      'विनाशकारी गतिविधियां',
      'हिंसा'
    ],
    specialNotes: 'Excellent for skill-based work and healing professions.',
  },
  {
    number: 14,
    name: 'Chitra',
    nameHindi: 'चित्रा',
    rulingDeity: 'Vishwakarma',
    rulingDeityHindi: 'विश्वकर्मा',
    rulingPlanet: 'Mars',
    pada: 4,
    guna: 'Rajas',
    nature: 'movable',
    symbol: 'Bright Jewel',
    symbolHindi: 'चमकीला रत्न',
    significance: 'Represents creativity, illusion, and artistic brilliance. Vishwakarma brings architectural and artistic genius.',
    significanceHindi: 'रचनात्मकता, भ्रम और कलात्मक चमक का प्रतिनिधित्व करता है। विश्वकर्मा वास्तुकला और कलात्मक प्रतिभा लाते हैं।',
    goodFor: [
      'Arts and crafts',
      'Architecture',
      'Design work',
      'Jewelry making',
      'Painting',
      'Sculpture',
      'Creative projects'
    ],
    goodForHindi: [
      'कला और शिल्प',
      'वास्तुकला',
      'डिजाइन कार्य',
      'आभूषण निर्माण',
      'चित्रकला',
      'मूर्तिकला',
      'रचनात्मक परियोजनाएं'
    ],
    avoidFor: [
      'Spiritual practices',
      'Simple living'
    ],
    avoidForHindi: [
      'आध्यात्मिक अभ्यास',
      'सादा जीवन'
    ],
    specialNotes: 'Brilliant for creative and artistic work. May create illusion - seek truth.',
  },
  {
    number: 15,
    name: 'Swati',
    nameHindi: 'स्वाति',
    rulingDeity: 'Vayu',
    rulingDeityHindi: 'वायु',
    rulingPlanet: 'Rahu',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Coral/Sword',
    symbolHindi: 'मूंगा/तलवार',
    significance: 'Represents independence, flexibility, and trade. Vayu brings movement and business acumen.',
    significanceHindi: 'स्वतंत्रता, लचीलापन और व्यापार का प्रतिनिधित्व करता है। वायु गति और व्यापारिक समझ लाते हैं।',
    goodFor: [
      'Business',
      'Trade',
      'Travel',
      'Learning music',
      'Independence-related work',
      'Negotiations'
    ],
    goodForHindi: [
      'व्यापार',
      'व्यापार',
      'यात्रा',
      'संगीत सीखना',
      'स्वतंत्रता संबंधी कार्य',
      'वार्ता'
    ],
    avoidFor: [
      'Fixed activities',
      'Marriage (can create instability)'
    ],
    avoidForHindi: [
      'स्थिर गतिविधियां',
      'विवाह (अस्थिरता पैदा कर सकता है)'
    ],
    specialNotes: 'Good for business and trade. Too much independence can be challenging.',
  },
  {
    number: 16,
    name: 'Vishakha',
    nameHindi: 'विशाखा',
    rulingDeity: 'Indra-Agni',
    rulingDeityHindi: 'इंद्र-अग्नि',
    rulingPlanet: 'Jupiter',
    pada: 4,
    guna: 'Rajas',
    nature: 'movable',
    symbol: 'Triumphal Gateway',
    symbolHindi: 'विजय द्वार',
    significance: 'Represents determination, achievement, and focused goals. Indra-Agni brings power to accomplish.',
    significanceHindi: 'दृढ़ संकल्प, उपलब्धि और केंद्रित लक्ष्यों का प्रतिनिधित्व करता है। इंद्र-अग्नि प्राप्त करने की शक्ति लाते हैं।',
    goodFor: [
      'Competitions',
      'Achievement-oriented work',
      'Business',
      'Marriage',
      'Travel',
      'Goal-setting'
    ],
    goodForHindi: [
      'प्रतियोगिताएं',
      'उपलब्धि उन्मुख कार्य',
      'व्यापार',
      'विवाह',
      'यात्रा',
      'लक्ष्य निर्धारण'
    ],
    avoidFor: [
      'Giving up',
      'Scattered efforts'
    ],
    avoidForHindi: [
      'हार मानना',
      'बिखरे हुए प्रयास'
    ],
    specialNotes: 'Excellent for achieving goals through determination. Can be overly focused.',
  },
  {
    number: 17,
    name: 'Anuradha',
    nameHindi: 'अनुराधा',
    rulingDeity: 'Mitra',
    rulingDeityHindi: 'मित्र',
    rulingPlanet: 'Saturn',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Triumphal Arch',
    symbolHindi: 'विजय मेहराब',
    significance: 'Represents devotion, friendship, and success through cooperation. Mitra brings harmonious relationships.',
    significanceHindi: 'भक्ति, मित्रता और सहयोग के माध्यम से सफलता का प्रतिनिधित्व करता है। मित्र सामंजस्यपूर्ण संबंध लाते हैं।',
    goodFor: [
      'Friendships',
      'Partnerships',
      'Group activities',
      'Travel',
      'Business',
      'Spiritual devotion',
      'Social work'
    ],
    goodForHindi: [
      'मित्रता',
      'साझेदारी',
      'समूह गतिविधियां',
      'यात्रा',
      'व्यापार',
      'आध्यात्मिक भक्ति',
      'सामाजिक कार्य'
    ],
    avoidFor: [
      'Isolation',
      'Antagonism'
    ],
    avoidForHindi: [
      'एकांत',
      'विरोध'
    ],
    specialNotes: 'Excellent for cooperation and friendships. Success through others.',
  },
  {
    number: 18,
    name: 'Jyeshtha',
    nameHindi: 'ज्येष्ठा',
    rulingDeity: 'Indra',
    rulingDeityHindi: 'इंद्र',
    rulingPlanet: 'Mercury',
    pada: 4,
    guna: 'Rajas',
    nature: 'fixed',
    symbol: 'Circular Amulet',
    symbolHindi: 'गोलाकार तावीज',
    significance: 'Represents seniority, protection, and hidden powers. Indra brings authority but also secrecy.',
    significanceHindi: 'वरिष्ठता, सुरक्षा और छिपी शक्तियों का प्रतिनिधित्व करता है। इंद्र अधिकार लाते हैं लेकिन गुप्तता भी।',
    goodFor: [
      'Leadership roles',
      'Protection work',
      'Occult sciences',
      'Research',
      'Meeting authorities',
      'Tantric practices'
    ],
    goodForHindi: [
      'नेतृत्व भूमिकाएं',
      'सुरक्षा कार्य',
      'गुप्त विज्ञान',
      'अनुसंधान',
      'अधिकारियों से मिलना',
      'तांत्रिक अभ्यास'
    ],
    avoidFor: [
      'Marriage',
      'Simple activities',
      'Openness'
    ],
    avoidForHindi: [
      'विवाह',
      'साधारण गतिविधियां',
      'खुलापन'
    ],
    specialNotes: 'Powerful but secretive. Good for leadership and occult. Not ideal for marriage.',
  },
  {
    number: 19,
    name: 'Mula',
    nameHindi: 'मूल',
    rulingDeity: 'Nirriti',
    rulingDeityHindi: 'निऋति',
    rulingPlanet: 'Ketu',
    pada: 4,
    guna: 'Tamas',
    nature: 'movable',
    symbol: 'Bunch of Roots',
    symbolHindi: 'जड़ों का गुच्छा',
    significance: 'Represents destruction of evil, root-cause analysis, and transformation. Nirriti brings dissolution for renewal.',
    significanceHindi: 'बुराई का विनाश, मूल कारण विश्लेषण और परिवर्तन का प्रतिनिधित्व करता है। निऋति नवीनीकरण के लिए विघटन लाते हैं।',
    goodFor: [
      'Research',
      'Investigation',
      'Destroying enemies',
      'Tantric practices',
      'Root-cause healing',
      'Spiritual transformation'
    ],
    goodForHindi: [
      'अनुसंधान',
      'जांच',
      'दुश्मनों को नष्ट करना',
      'तांत्रिक अभ्यास',
      'मूल कारण चिकित्सा',
      'आध्यात्मिक परिवर्तन'
    ],
    avoidFor: [
      'Marriage',
      'Auspicious ceremonies',
      'New ventures',
      'Education'
    ],
    avoidForHindi: [
      'विवाह',
      'शुभ समारोह',
      'नए उद्यम',
      'शिक्षा'
    ],
    specialNotes: 'Powerful for destruction of negativity. Generally inauspicious for worldly works.',
  },
  {
    number: 20,
    name: 'Purva Ashadha',
    nameHindi: 'पूर्वाषाढ़ा',
    rulingDeity: 'Apas (Water)',
    rulingDeityHindi: 'अप्स (जल)',
    rulingPlanet: 'Venus',
    pada: 4,
    guna: 'Rajas',
    nature: 'movable',
    symbol: 'Hand Fan',
    symbolHindi: 'हाथ का पंखा',
    significance: 'Represents invincibility, purification, and popularity. Water brings cleansing and widespread appeal.',
    significanceHindi: 'अजेयता, शुद्धिकरण और लोकप्रियता का प्रतिनिधित्व करता है। जल सफाई और व्यापक अपील लाता है।',
    goodFor: [
      'Competitions',
      'Public speaking',
      'Politics',
      'Arts',
      'Travel by water',
      'Healing'
    ],
    goodForHindi: [
      'प्रतियोगिताएं',
      'सार्वजनिक बोलना',
      'राजनीति',
      'कला',
      'जल यात्रा',
      'चिकित्सा'
    ],
    avoidFor: [
      'Fixed activities',
      'Secret work'
    ],
    avoidForHindi: [
      'स्थिर गतिविधियां',
      'गुप्त कार्य'
    ],
    specialNotes: 'Good for public activities and gaining popularity.',
  },
  {
    number: 21,
    name: 'Uttara Ashadha',
    nameHindi: 'उत्तराषाढ़ा',
    rulingDeity: 'Vishwadevas',
    rulingDeityHindi: 'विश्वदेव',
    rulingPlanet: 'Sun',
    pada: 4,
    guna: 'Sattva',
    nature: 'fixed',
    symbol: 'Elephant Tusk',
    symbolHindi: 'हाथी का दांत',
    significance: 'Represents universal victory, leadership, and righteousness. Vishwadevas bring cosmic support.',
    significanceHindi: 'सार्वभौमिक विजय, नेतृत्व और धर्म का प्रतिनिधित्व करता है। विश्वदेव ब्रह्मांडीय समर्थन लाते हैं।',
    goodFor: [
      'Leadership',
      'Government work',
      'Competitions',
      'Achievement',
      'Spiritual practices',
      'Marriage',
      'Business'
    ],
    goodForHindi: [
      'नेतृत्व',
      'सरकारी कार्य',
      'प्रतियोगिताएं',
      'उपलब्धि',
      'आध्यात्मिक अभ्यास',
      'विवाह',
      'व्यापार'
    ],
    avoidFor: [
      'Defeatist attitude',
      'Unrighteous acts'
    ],
    avoidForHindi: [
      'हार की मानसिकता',
      'अधार्मिक कार्य'
    ],
    specialNotes: 'Highly auspicious. Brings victory and success through dharma.',
  },
  {
    number: 22,
    name: 'Shravana',
    nameHindi: 'श्रवण',
    rulingDeity: 'Vishnu',
    rulingDeityHindi: 'विष्णु',
    rulingPlanet: 'Moon',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Ear',
    symbolHindi: 'कान',
    significance: 'Represents listening, learning, and sacred knowledge. Vishnu brings wisdom through hearing.',
    significanceHindi: 'सुनने, सीखने और पवित्र ज्ञान का प्रतिनिधित्व करता है। विष्णु सुनने के माध्यम से बुद्धि लाते हैं।',
    goodFor: [
      'Education',
      'Learning',
      'Spiritual study',
      'Music',
      'Teaching',
      'Pilgrimage',
      'Meeting teachers'
    ],
    goodForHindi: [
      'शिक्षा',
      'सीखना',
      'आध्यात्मिक अध्ययन',
      'संगीत',
      'सिखाना',
      'तीर्थ यात्रा',
      'गुरुओं से मिलना'
    ],
    avoidFor: [
      'Ignoring advice',
      'Disrespect to elders'
    ],
    avoidForHindi: [
      'सलाह को नजरअंदाज करना',
      'बुजुर्गों का अनादर'
    ],
    specialNotes: 'Excellent for education and spiritual learning. Listen more, speak less.',
  },
  {
    number: 23,
    name: 'Dhanishta',
    nameHindi: 'धनिष्ठा',
    rulingDeity: 'Eight Vasus',
    rulingDeityHindi: 'आठ वसु',
    rulingPlanet: 'Mars',
    pada: 4,
    guna: 'Rajas',
    nature: 'fixed',
    symbol: 'Drum',
    symbolHindi: 'ढोल',
    significance: 'Represents wealth, rhythm, and fame. The Eight Vasus bring material abundance and musical talent.',
    significanceHindi: 'धन, लय और प्रसिद्धि का प्रतिनिधित्व करता है। आठ वसु भौतिक प्रचुरता और संगीत प्रतिभा लाते हैं।',
    goodFor: [
      'Music and dance',
      'Business',
      'Wealth creation',
      'Marriage',
      'Entertainment',
      'Investments'
    ],
    goodForHindi: [
      'संगीत और नृत्य',
      'व्यापार',
      'धन सृजन',
      'विवाह',
      'मनोरंजन',
      'निवेश'
    ],
    avoidFor: [
      'Poverty-minded activities',
      'Isolation'
    ],
    avoidForHindi: [
      'गरीबी मानसिकता गतिविधियां',
      'एकांत'
    ],
    specialNotes: 'Excellent for wealth and fame. Good for marriage and business.',
  },
  {
    number: 24,
    name: 'Shatabhisha',
    nameHindi: 'शतभिषा',
    rulingDeity: 'Varuna',
    rulingDeityHindi: 'वरुण',
    rulingPlanet: 'Rahu',
    pada: 4,
    guna: 'Tamas',
    nature: 'fixed',
    symbol: 'Thousand Physicians',
    symbolHindi: 'हजार चिकित्सक',
    significance: 'Represents healing, occult, and isolation. Varuna brings mystical knowledge and healing powers.',
    significanceHindi: 'चिकित्सा, गुप्त और एकांत का प्रतिनिधित्व करता है। वरुण रहस्यमय ज्ञान और चिकित्सा शक्तियां लाते हैं।',
    goodFor: [
      'Medical practice',
      'Research',
      'Occult sciences',
      'Astronomy',
      'Healing',
      'Spiritual isolation'
    ],
    goodForHindi: [
      'चिकित्सा अभ्यास',
      'अनुसंधान',
      'गुप्त विज्ञान',
      'खगोल विज्ञान',
      'चिकित्सा',
      'आध्यात्मिक एकांत'
    ],
    avoidFor: [
      'Marriage',
      'Social activities',
      'Superficial work'
    ],
    avoidForHindi: [
      'विवाह',
      'सामाजिक गतिविधियां',
      'सतही कार्य'
    ],
    specialNotes: 'Powerful for healing and occult. Not ideal for marriage or social work.',
  },
  {
    number: 25,
    name: 'Purva Bhadrapada',
    nameHindi: 'पूर्व भाद्रपद',
    rulingDeity: 'Aja Ekapada',
    rulingDeityHindi: 'अज एकापाद',
    rulingPlanet: 'Jupiter',
    pada: 4,
    guna: 'Rajas',
    nature: 'fixed',
    symbol: 'Front of Funeral Cot',
    symbolHindi: 'अंतिम संस्कार खाट का अगला हिस्सा',
    significance: 'Represents transformation, fire, and deep change. Aja Ekapada brings intense spiritual transformation.',
    significanceHindi: 'परिवर्तन, अग्नि और गहरा परिवर्तन का प्रतिनिधित्व करता है। अज एकापाद तीव्र आध्यात्मिक परिवर्तन लाते हैं।',
    goodFor: [
      'Spiritual transformation',
      'Tantric practices',
      'Destroying enemies',
      'Occult sciences',
      'Deep meditation'
    ],
    goodForHindi: [
      'आध्यात्मिक परिवर्तन',
      'तांत्रिक अभ्यास',
      'दुश्मनों को नष्ट करना',
      'गुप्त विज्ञान',
      'गहरा ध्यान'
    ],
    avoidFor: [
      'Marriage',
      'Auspicious ceremonies',
      'New ventures',
      'Education'
    ],
    avoidForHindi: [
      'विवाह',
      'शुभ समारोह',
      'नए उद्यम',
      'शिक्षा'
    ],
    specialNotes: 'Generally inauspicious. Only for specific spiritual/tantric purposes.',
  },
  {
    number: 26,
    name: 'Uttara Bhadrapada',
    nameHindi: 'उत्तर भाद्रपद',
    rulingDeity: 'Ahir Budhnya',
    rulingDeityHindi: 'अहिर्बुध्न्य',
    rulingPlanet: 'Saturn',
    pada: 4,
    guna: 'Sattva',
    nature: 'fixed',
    symbol: 'Back of Funeral Cot',
    symbolHindi: 'अंतिम संस्कार खाट का पिछला हिस्सा',
    significance: 'Represents depth, stability, and spiritual wisdom. Ahir Budhnya brings hidden treasures of knowledge.',
    significanceHindi: 'गहराई, स्थिरता और आध्यात्मिक बुद्धि का प्रतिनिधित्व करता है। अहिर्बुध्न्य ज्ञान के छिपे खजाने लाते हैं।',
    goodFor: [
      'Spiritual practices',
      'Meditation',
      'Research',
      'Occult sciences',
      'Marriage',
      'Long-term investments'
    ],
    goodForHindi: [
      'आध्यात्मिक अभ्यास',
      'ध्यान',
      'अनुसंधान',
      'गुप्त विज्ञान',
      'विवाह',
      'दीर्घकालिक निवेश'
    ],
    avoidFor: [
      'Superficial activities',
      'Hasty decisions'
    ],
    avoidForHindi: [
      'सतही गतिविधियां',
      'जल्दबाजी में निर्णय'
    ],
    specialNotes: 'Good for spiritual depth and marriage. Brings wisdom through patience.',
  },
  {
    number: 27,
    name: 'Revati',
    nameHindi: 'रेवती',
    rulingDeity: 'Pushan',
    rulingDeityHindi: 'पूषन',
    rulingPlanet: 'Mercury',
    pada: 4,
    guna: 'Sattva',
    nature: 'movable',
    symbol: 'Fish',
    symbolHindi: 'मछली',
    significance: 'Last nakshatra. Represents completion, nourishment, and liberation. Pushan brings safe journeys and abundance.',
    significanceHindi: 'अंतिम नक्षत्र। पूर्णता, पोषण और मुक्ति का प्रतिनिधित्व करता है। पूषन सुरक्षित यात्रा और प्रचुरता लाते हैं।',
    goodFor: [
      'All auspicious works',
      'Marriage',
      'Education',
      'Travel',
      'Business',
      'Conception',
      'Spiritual liberation'
    ],
    goodForHindi: [
      'सभी शुभ कार्य',
      'विवाह',
      'शिक्षा',
      'यात्रा',
      'व्यापार',
      'गर्भधारण',
      'आध्यात्मिक मुक्ति'
    ],
    avoidFor: [
      'Destructive activities'
    ],
    avoidForHindi: [
      'विनाशकारी गतिविधियां'
    ],
    specialNotes: 'Highly auspicious. Excellent for completion and new beginnings. Very nourishing.',
  },
];

/**
 * Get nakshatra by number (1-27)
 */
export const getNakshatraByNumber = (number: number): NakshatraSignificance | undefined => {
  if (number < 1 || number > 27) return undefined;
  return NAKSHATRA_DATA[number - 1];
};

/**
 * Get nakshatra by name
 */
export const getNakshatraByName = (name: string): NakshatraSignificance | undefined => {
  return NAKSHATRA_DATA.find(n => n.name.toLowerCase() === name.toLowerCase());
};

/**
 * Get nakshatras by guna
 */
export const getNakshatrasByGuna = (guna: 'Sattva' | 'Rajas' | 'Tamas'): NakshatraSignificance[] => {
  return NAKSHATRA_DATA.filter(n => n.guna === guna);
};

/**
 * Get nakshatras by nature
 */
export const getNakshatrasByNature = (nature: NakshatraSignificance['nature']): NakshatraSignificance[] => {
  return NAKSHATRA_DATA.filter(n => n.nature === nature);
};

/**
 * Check if nakshatra is auspicious for marriage
 */
export const isNakshatraGoodForMarriage = (nakshatraNumber: number): boolean => {
  const auspiciousForMarriage = [4, 8, 11, 12, 16, 17, 21, 23, 26, 27]; // Rohini, Pushya, etc.
  return auspiciousForMarriage.includes(nakshatraNumber);
};

/**
 * Get compatibility between two nakshatras (simplified)
 */
export const getNakshatraCompatibility = (
  nak1: number,
  nak2: number
): 'excellent' | 'good' | 'average' | 'poor' => {
  const sameGuna = NAKSHATRA_DATA[nak1 - 1].guna === NAKSHATRA_DATA[nak2 - 1].guna;
  if (sameGuna) return 'good';
  
  const diff = Math.abs(nak1 - nak2);
  if (diff === 7 || diff === 14) return 'excellent'; // 7th and 14th are favorable
  if (diff <= 3) return 'average';
  return 'poor';
};
