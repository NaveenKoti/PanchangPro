/**
 * Festival Stories Database
 * Rich content for major Hindu festivals including stories, rituals, regional variations
 */

export interface RegionalVariation {
  region: string;
  regionHindi: string;
  variation: string;
  variationHindi: string;
}

export interface FestivalStory {
  id: string;
  name: string;
  nameHindi: string;
  emoji: string;
  story: string;
  storyHindi: string;
  rituals: string[];
  ritualsHindi: string[];
  regionalVariations: RegionalVariation[];
  fastingRules?: string[];
  fastingRulesHindi?: string[];
  significance: string;
  significanceHindi: string;
  duration?: string;
  durationHindi?: string;
  bestTimeToCelebrate?: string;
  colors?: string[];
}

export const FESTIVAL_STORIES: FestivalStory[] = [
  // ============================================================================
  // DIWALI
  // ============================================================================
  {
    id: 'diwali',
    name: 'Diwali',
    nameHindi: 'दीपावली',
    emoji: '🪔',
    story: `Diwali, the Festival of Lights, commemorates the return of Lord Rama to Ayodhya after 14 years of exile and his victory over the demon king Ravana. The citizens of Ayodhya lit rows of oil lamps (diyas) to illuminate the path for their beloved king, creating a spectacular display of light that has been celebrated ever since.

In South India, Diwali marks Lord Krishna's victory over the demon Narakasura, freeing the world from fear. In Bengal, it is associated with Goddess Kali's victory over the demon Raktabija.

The festival also celebrates the eternal devotion of Prahlada and the appearance of Goddess Lakshmi from the ocean of milk during the churning of the cosmic ocean (Samudra Manthan).`,
    storyHindi: `दीपावली, प्रकाश का पर्व, भगवान राम के 14 वर्षों के वनवास और रावण पर विजय के बाद अयोध्या वापस लौटने की याद दिलाता है। अयोध्या के निवासियों ने अपने प्रिय राजा के लिए रास्ता रोशन करने के लिए दीपकों की पंक्तियाँ जलाईं, जिसका उत्सव तब से मनाया जाता है।

दक्षिण भारत में, दीपावली भगवान कृष्ण की नरकासुर पर विजय को चिह्नित करती है। बंगाल में, यह देवी काली की राक्तबीज पर विजय से जुड़ी है।

यह पर्व प्रह्लाद की शाश्वत भक्ति और समुद्र मंथन के दौरान माँ लक्ष्मी के प्रकट होने का भी उत्सव है।`,
    rituals: [
      'Clean and decorate homes with diyas, rangoli, and lights',
      'Perform Lakshmi Puja in the evening for wealth and prosperity',
      'Exchange gifts and sweets with family and friends',
      'Light fireworks (traditionally to celebrate victory over darkness)',
      'Open account books and worship Goddess Lakshmi (Chopda Pujan)',
      'Visit temples and offer prayers to deities',
      'Prepare and share traditional sweets like ladoo, barfi, and jalebi'
    ],
    ritualsHindi: [
      'घरों को दीयों, रंगोली और रोशनी से सजाएं',
      'सांयकाल लक्ष्मी पूजन करें - धन और समृद्धि के लिए',
      'परिवार और मित्रों के साथ उपहार और मिठाई का आदान-प्रदान करें',
      'पटाखे जलाएं (अंधकार पर विजय का उत्सव)',
      'बही-खाता पूजन करें - नए व्यापार वर्ष की शुरुआत',
      'मंदिर जाएं और देवताओं की पूजा करें',
      'लड्डू, बर्फी, जलेबी जैसी पारंपरिक मिठाइयाँ बनाएं और बांटें'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Celebrates Rama\'s return to Ayodhya. Major emphasis on Lakshmi-Ganesha puja.',
        variationHindi: 'राम की अयोध्या वापसी का उत्सव। लक्ष्मी-गणेश पूजा पर मुख्य जोर।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Celebrates Krishna defeating Narakasura. Oil bath before dawn is traditional.',
        variationHindi: 'कृष्ण की नरकासुर पर विजय। भोर से पहले तैल स्नान परंपरा है।'
      },
      {
        region: 'West Bengal',
        regionHindi: 'पश्चिम बंगाल',
        variation: 'Kali Puja is performed instead of Lakshmi Puja. Massive pandals and fireworks.',
        variationHindi: 'लक्ष्मी पूजा के स्थान पर काली पूजा होती है। विशाल पंडाल और पटाखे।'
      },
      {
        region: 'Gujarat',
        regionHindi: 'गुजरात',
        variation: 'Marks the beginning of the new financial year. Chopda Pujan (account book worship).',
        variationHindi: 'नए वित्तीय वर्ष की शुरुआत। बही-खाता पूजन।'
      },
      {
        region: 'Nepal',
        regionHindi: 'नेपाल',
        variation: 'Celebrated as Tihar - worship of crows, dogs, cows, and brothers over five days.',
        variationHindi: 'तिहार के रूप में मनाया जाता है - पाँच दिनों में कौआ, कुत्ता, गाय और भाई की पूजा।'
      }
    ],
    fastingRules: [
      'Some observe a partial fast until Lakshmi Puja in the evening',
      'Consume only fruits and milk during the day if fasting',
      'Break fast after evening puja with prasad',
      'Avoid tamasic foods (onion, garlic, non-vegetarian food)'
    ],
    fastingRulesHindi: [
      'कुछ लोग सांयकाल लक्ष्मी पूजन तक आंशिक उपवास रखते हैं',
      'यदि उपवास करें तो दिन में केवल फल और दूध लें',
      'सांयकाल पूजा के बाद प्रसाद से उपवास तोड़ें',
      'तामसिक भोजन (प्याज़, लहसुन, मांसाहार) से बचें'
    ],
    significance: 'Diwali symbolizes the victory of light over darkness, knowledge over ignorance, good over evil, and hope over despair. It is one of the most widely celebrated festivals across India and the Hindu diaspora worldwide. The five days of Diwali represent Dhanteras, Naraka Chaturdashi, the main Diwali night, Govardhan Puja, and Bhai Dooj.',
    significanceHindi: 'दीपावली अंधकार पर प्रकाश, अज्ञान पर ज्ञान, बुराई पर अच्छाई, और निराशा पर आशा की विजय का प्रतीक है। यह भारत और विश्व भर में सबसे व्यापक रूप से मनाए जाने वाले पर्वों में से एक है। पाँच दिनों में धनतेरस, नरक चतुर्दशी, मुख्य दीपावली रात, गोवर्धन पूजा और भाई दूज शामिल हैं।',
    duration: '5 days',
    durationHindi: '५ दिन',
    colors: ['Gold', 'Yellow', 'Orange', 'Red'],
  },

  // ============================================================================
  // HOLI
  // ============================================================================
  {
    id: 'holi',
    name: 'Holi',
    nameHindi: 'होली',
    emoji: '🎨',
    story: `Holi celebrates the divine love of Radha and Krishna and the triumph of devotion over evil. The festival is rooted in the legend of Prahlada, a young devotee of Lord Vishnu whose father, the demon king Hiranyakashipu, demanded everyone worship him instead.

When Hiranyakashipu ordered his sister Holika (who had a boon making her immune to fire) to sit in a blazing fire with Prahlada, Holika was consumed by flames while Prahlada emerged unharmed, protected by his unwavering devotion to Vishnu. The night before Holi, bonfires are lit to commemorate this event (Holika Dahan).

The playful throwing of colored powder and water originates from Krishna's youthful pastimes in Vrindavan, where he playfully colored Radha and the gopis.`,
    storyHindi: `होली राधा और कृष्ण के दिव्य प्रेम और बुराई पर भक्ति की विजय का उत्सव है। यह पर्व प्रह्लाद की कथा पर आधारित है, जो भगवान विष्णु के एक बाल भक्त थे जिनके पिता, असुर राज हिरण्यकश्यप, ने सबको अपनी पूजा करने की मांग की थी।

जब हिरण्यकश्यप ने अपनी बहन होलिका (जिसे अग्नि से सुरक्षा का वरदान मिला था) को प्रह्लाद के साथ जलती आग में बैठने का आदेश दिया, तो होलिका जल गई जबकि प्रह्लाद विष्णु की भक्ति से सुरक्षित रहे। होली से पहले की रात, होलिका दहन होता है।

रंगों की होली कृष्ण की वृंदावन की लीलाओं से आती है, जहाँ उन्होंने राधा और गोपियों के साथ रंगों की मस्ती की।`,
    rituals: [
      'Holika Dahan - light bonfire the night before (burning of Holika)',
      'Play with colored powder (gulal) and colored water',
      'Visit friends and family to exchange greetings and sweets',
      'Prepare traditional foods like gujiya, mathri, and thandai',
      'Sing and dance to festive Holi music',
      'Sprinkle colored water using pichkaris (water guns)',
      'Forgive old grievances and renew relationships'
    ],
    ritualsHindi: [
      'होलिका दहन - होली से पहले की रात अग्नि जलाएं',
      'गुलाल और रंगीन पानी से होली खेलें',
      'मित्रों और परिवार से मिलें और मिठाई बांटें',
      'गुझिया, मठरी, ठंडाई जैसी पारंपरिक चीज़ें बनाएं',
      'होली संगीत पर गाएं और नृत्य करें',
      'पिचकारी से रंगीन पानी छिड़कें',
      'पुरानी शिकायतें भूलें और संबंध नए सिरे से शुरू करें'
    ],
    regionalVariations: [
      {
        region: 'Mathura & Vrindavan',
        regionHindi: 'मथुरा और वृंदावन',
        variation: 'Most elaborate celebrations lasting over a week. Lathmar Holi where women playfully hit men with sticks.',
        variationHindi: 'सबसे भव्य उत्सव जो एक सप्ताह से अधिक चलता है। लाठमार होली जहाँ महिलाएं पुरुषों को लाठी से मारती हैं।'
      },
      {
        region: 'Punjab',
        regionHindi: 'पंजाब',
        variation: 'Celebrated with great energy as part of the harvest festival. Bhangra dancing and community feasts.',
        variationHindi: 'फसल उत्सव के हिस्से के रूप में जोश से मनाया जाता है। भांगड़ा नृत्य और सामुदायिक भोज।'
      },
      {
        region: 'West Bengal',
        regionHindi: 'पश्चिम बंगाल',
        variation: 'Known as Dol Jatra or Basanta Utsav. Cultural programs with songs and dances.',
        variationHindi: 'डोल यात्रा या बसंत उत्सव के नाम से जाना जाता है। गीत और नृत्य के साथ सांस्कृतिक कार्यक्रम।'
      },
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Puran poli is the special dish. Communities build large pyres for Holika Dahan.',
        variationHindi: 'पुरण पोली विशेष भोजन है। समुदाय होलिका दहन के लिए बड़ी चिताएं बनाते हैं।'
      }
    ],
    fastingRules: [
      'Some observe a fast on the morning of Holika Dahan',
      'Traditional thandai (sometimes with bhang) is consumed during celebrations',
      'No specific fasting rules - it is primarily a festival of joy and celebration'
    ],
    fastingRulesHindi: [
      'कुछ लोग होलिका दहन की सुबह उपवास रखते हैं',
      'उत्सव के दौरान पारंपरिक ठंडाई (कभी-कभी भांग के साथ) पी जाती है',
      'कोई विशेष उपवास नियम नहीं - यह मुख्य रूप से खुशी और उत्सव का पर्व है'
    ],
    significance: 'Holi marks the arrival of spring and the triumph of good over evil. It is a day when social barriers are broken, people of all ages and backgrounds come together, and old enmities are forgiven. The festival also celebrates the eternal love of Radha and Krishna.',
    significanceHindi: 'होली वसंत ऋतु के आगमन और बुराई पर अच्छाई की विजय का प्रतीक है। यह एक ऐसा दिन है जब सामाजिक बाधाएं टूटती हैं, सभी उम्र और पृष्ठभूमि के लोग एक साथ आते हैं, और पुरानी दुश्मनी माफ कर दी जाती है। यह पर्व राधा और कृष्ण के शाश्वत प्रेम का भी उत्सव है।',
    duration: '2 days (Holika Dahan + Dhulandi)',
    durationHindi: '२ दिन (होलिका दहन + धूलंडी)',
    colors: ['Pink', 'Green', 'Yellow', 'Red', 'Blue', 'Purple'],
  },

  // ============================================================================
  // NAVRATRI
  // ============================================================================
  {
    id: 'navratri',
    name: 'Navratri',
    nameHindi: 'नवरात्रि',
    emoji: '🕉️',
    story: `Navratri, meaning "Nine Nights," celebrates the divine feminine energy (Shakti) in the form of Goddess Durga. According to legend, the demon Mahishasura received a boon that made him invincible against all male warriors. Intoxicated by power, he began terrorizing the gods.

The divine trinity - Brahma, Vishnu, and Shiva - combined their energies to create the supreme goddess Durga. Armed with weapons from all the gods, she waged a fierce battle against Mahishasura for nine nights and ultimately defeated him on the tenth day (Dussehra).

Each of the nine nights is dedicated to one of the nine forms (Navadurga) of the Goddess: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri.`,
    storyHindi: `नवरात्रि, जिसका अर्थ है "नौ रात्रियाँ", देवी दुर्गा के रूप में दिव्य स्त्री शक्ति (शक्ति) का उत्सव है। पौराणिक कथाओं के अनुसार, असुर महिषासुर ने एक ऐसा वरदान प्राप्त किया जिससे वह सभी पुरुष योद्धाओं के против अजेय हो गया।

दिव्य त्रिमूर्ति - ब्रह्मा, विष्णु और शिव - ने अपनी शक्तियों को मिलाकर परम देवी दुर्गा की रचना की। सभी देवताओं के अस्त्रों से सुसज्जित, उन्होंने नौ रातों तक महिषासुर से भीषण युद्ध किया और दसवें दिन (दशहरा) उसे पराजित किया।

प्रत्येक नौ रातें देवी के नौ रूपों (नवदुर्गा) को समर्पित हैं: शैलपुत्री, ब्रह्मचारिणी, चंद्रघंटा, कूष्मांडा, स्कंदमाता, कात्यायनी, कालरात्रि, महागौरी और सिद्धिदात्री।`,
    rituals: [
      'Install a clay idol or image of Goddess Durga',
      'Perform daily puja and aarti of the specific Durga form for that day',
      'Observe fasting for all nine days (or at least first and last days)',
      'Recite Durga Saptashati or Devi Mahatmyam daily',
      'Perform Garba and Dandiya Raas dances (especially in Gujarat)',
      'Kanya Pujan on the eighth or ninth day - worship nine young girls representing the nine forms',
      'Visit Durga pandals and participate in community celebrations'
    ],
    ritualsHindi: [
      'देवी दुर्गा की मिट्टी की मूर्ति या चित्र स्थापित करें',
      'प्रतिदिन उस दिन के विशिष्ट दुर्गा रूप की पूजा और आरती करें',
      'नौ दिनों तक उपवास करें (या कम से कम पहले और आखिरी दिन)',
      'प्रतिदिन दुर्गा सप्तशती या देवी माहात्म्य का पाठ करें',
      'गरबा और डांडिया रास नृत्य करें (विशेषकर गुजरात में)',
      'कन्या पूजन - आठवें या नौवें दिन नौ बालिकाओं की पूजा',
      'दुर्गा पंडाल जाएं और सामुदायिक उत्सव में भाग लें'
    ],
    regionalVariations: [
      {
        region: 'Gujarat',
        regionHindi: 'गुजरात',
        variation: 'Famous for Garba and Dandiya Raas dances. Elaborate community celebrations with decorated venues.',
        variationHindi: 'गरबा और डांडिया रास नृत्य के लिए प्रसिद्ध। सजे हुए स्थानों के साथ विस्तृत सामुदायिक उत्सव।'
      },
      {
        region: 'West Bengal',
        regionHindi: 'पश्चिम बंगाल',
        variation: 'Durga Puja with magnificent clay idols (pandals). Cultural performances, food festivals, and idol immersion on Vijaya Dashami.',
        variationHindi: 'भव्य मिट्टी की मूर्तियों (पंडालों) के साथ दुर्गा पूजा। सांस्कृतिक कार्यक्रम, खाद्य उत्सव, और विजया दशमी पर मूर्ति विसर्जन।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Golu festival - display of dolls and figurines on steps. Saraswati Puja for knowledge and Ayudha Puja for tools/instruments.',
        variationHindi: 'गोलु उत्सव - सीढ़ियों पर गुड़ियों और मूर्तियों का प्रदर्शन। ज्ञान के लिए सरस्वती पूजा और उपकरणों की आयुध पूजा।'
      },
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Ram Lila performances depicting Rama\'s story. Culminates in Ravana Dahan (burning of Ravana effigies) on Dussehra.',
        variationHindi: 'राम की कथा दिखाने वाले रामलीला कार्यक्रम। दशहरा पर रावण दहन (रावण की पुतला जलाना) पर समापन।'
      }
    ],
    fastingRules: [
      'Observe a strict vegetarian/sattvic diet during all nine days',
      'Avoid onion, garlic, regular salt, and grains',
      'Consume fruits, milk, nuts, and vrat-friendly foods (singhare ka atta, kuttu ka atta)',
      'Some observe a water-only fast (nirjala) on specific days',
      'Eat one meal a day after evening puja',
      'Avoid alcohol, smoking, and tamasic activities'
    ],
    fastingRulesHindi: [
      'नौ दिनों तक कड़ा शाकाहारी/सात्विक आहार लें',
      'प्याज़, लहसुन, सामान्य नमक, और अनाज से बचें',
      'फल, दूध, मेवे और व्रत के भोजन (सिंघाड़े का आटा, कुट्टू का आटा) लें',
      'कुछ लोग विशिष्ट दिनों में निर्जल उपवास रखते हैं',
      'सांयकाल पूजा के बाद एक बार भोजन करें',
      'शराब, धूम्रपान और तामसिक गतिविधियों से बचें'
    ],
    significance: 'Navratri celebrates the victory of Goddess Durga over the buffalo demon Mahishasura, symbolizing the triumph of divine feminine energy over ego and evil. Each night honors a different aspect of the Goddess, from gentle nurturer to fierce destroyer of negativity.',
    significanceHindi: 'नवरात्रि देवी दुर्गा की महिषासुर पर विजय का उत्सव है, जो अहंकार और बुराई पर दिव्य स्त्री शक्ति की विजय का प्रतीक है। प्रत्येक रात देवी के एक अलग पहलू का सम्मान करती है - कोमल पालनहार से लेकर नकारात्मकता की भीषण विनाशक तक।',
    duration: '9 nights + 10th day (Dussehra)',
    durationHindi: '९ रातें + १०वाँ दिन (दशहरा)',
    colors: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'White', 'Pink', 'Sky Blue'],
  },

  // ============================================================================
  // DUSSEHRA (VIJAYADASHAMI)
  // ============================================================================
  {
    id: 'dussehra',
    name: 'Dussehra',
    nameHindi: 'दशहरा',
    emoji: '⚔️',
    story: `Dussehra (Vijayadashami) marks Lord Rama's victory over the demon king Ravana, as described in the epic Ramayana. After Ravana abducted Rama's wife Sita and took her to Lanka, Rama waged a great war to rescue her. The battle lasted many days, culminating in Rama slaying Ravana on the tenth day (Dashami) of the Ashwin month.

Another legend celebrates Goddess Durga's victory over Mahishasura after the nine nights of Navratri. The tenth day represents the ultimate triumph of good over evil.

In the Mahabharata, the Pandavas retrieved their hidden weapons from a Shami tree on this day before going into exile, and they worshipped their weapons before the great Kurukshetra war.`,
    storyHindi: `दशहरा (विजयादशमी) भगवान राम की रावण पर विजय को चिह्नित करता है, जैसा कि रामायण में वर्णित है। जब रावण ने राम की पत्नी सीता का अपहरण करके लंका ले गया, तो राम ने उसे बचाने के लिए महायुद्ध किया। यह युद्ध कई दिनों तक चला और आश्विन मास के दसवें दिन राम ने रावण का वध किया।

एक अन्य कथा नवरात्रि की नौ रातों के बाद देवी दुर्गा की महिषासुर पर विजय का उत्सव मनाती है। दसवाँ दिन अच्छाई की बुराई पर अंतिम विजय का प्रतीक है।

महाभारत में, पांडवों ने वनवास से पहले शमी वृक्ष में छिपे अपने अस्त्र इस दिन निकाले और कुरुक्षेत्र युद्ध से पहले अपने अस्त्रों की पूजा की।`,
    rituals: [
      'Watch or participate in Ramlila performances (dramatic retelling of Ramayana)',
      'Burn effigies of Ravana, Kumbhakarna, and Meghnath',
      'Worship weapons, tools, and vehicles (Ayudha Puja)',
      'Perform Shami Puja and exchange Shami leaves as symbols of gold',
      'Visit temples and offer special prayers',
      'Participate in processions and community celebrations',
      'Start new ventures - considered an auspicious day for beginnings'
    ],
    ritualsHindi: [
      'रामलीला कार्यक्रम देखें या भाग लें (रामायण की नाट्य कथा)',
      'रावण, कुंभकर्ण और मेघनाथ की पुतला जलाएं',
      'अस्त्रों, उपकरणों और वाहनों की पूजा करें (आयुध पूजा)',
      'शमी पूजा करें और सोने के प्रतीक के रूप में शमी पत्र का आदान-प्रदान करें',
      'मंदिर जाएं और विशेष प्रार्थना करें',
      'शोभायात्रा और सामुदायिक उत्सव में भाग लें',
      'नए उद्यम शुरू करें - शुभ कार्यों के लिए उत्तम दिन'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Grand Ramlila performances and burning of giant Ravana effigies filled with fireworks.',
        variationHindi: 'भव्य रामलीला कार्यक्रम और पटाखों से भरे विशाल रावण पुतले जलाना।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Ayudha Puja - worship of tools, instruments, and vehicles. Saraswati Puja for students.',
        variationHindi: 'आयुध पूजा - उपकरणों, वाद्यों और वाहनों की पूजा। छात्रों के लिए सरस्वती पूजा।'
      },
      {
        region: 'East India',
        regionHindi: 'पूर्वी भारत',
        variation: 'Immersion of Durga idols in rivers (Visarjan). Cultural programs and feasts.',
        variationHindi: 'दुर्गा मूर्तियों का नदियों में विसर्जन। सांस्कृतिक कार्यक्रम और भोज।'
      },
      {
        region: 'Mysore',
        regionHindi: 'मैसूर',
        variation: 'Famous Mysore Dasara - grand procession with caparisoned elephants and cultural performances.',
        variationHindi: 'प्रसिद्ध मैसूर दशहरा - सजे हुए हाथियों और सांस्कृतिक कार्यक्रमों के साथ भव्य शोभायात्रा।'
      }
    ],
    significance: 'Dussehra celebrates the ultimate victory of righteousness over evil. It marks the end of Navratri and is considered one of the most auspicious days to begin new endeavors, make important purchases, or start education.',
    significanceHindi: 'दशहरा बुराई पर धर्म की अंतिम विजय का उत्सव है। यह नवरात्रि का समापन करता है और नए कार्यों, महत्वपूर्ण खरीद, या शिक्षा शुरू करने के लिए सबसे शुभ दिनों में से एक माना जाता है।',
    duration: '1 day (10th day after Navratri)',
    durationHindi: '१ दिन (नवरात्रि के बाद १०वाँ दिन)',
    colors: ['Gold', 'Red', 'Orange'],
  },

  // ============================================================================
  // GANESH CHATURTHI
  // ============================================================================
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    emoji: '🐘',
    story: `Ganesh Chaturthi celebrates the birth of Lord Ganesha, the elephant-headed god of wisdom, prosperity, and remover of obstacles. According to the most popular legend, Goddess Parvati created a boy from turmeric paste to guard her door while she bathed. When Lord Shiva returned and was stopped by the boy, he severed the boy's head in anger.

Upon learning the boy was Parvati's creation, Shiva promised to restore him. He sent his ganas to bring the head of the first living creature they found facing north. They returned with an elephant's head, which Shiva placed on the boy's body, bringing him back to life and naming him Ganesha (Lord of the Ganas).

Ganesha is worshipped first before any auspicious occasion, ceremony, or new beginning.`,
    storyHindi: `गणेश चतुर्थी भगवान गणेश के जन्म का उत्सव है, जो बुद्धि, समृद्धि के देवता और विघ्नहर्ता हैं। सबसे लोकप्रिय कथा के अनुसार, देवी पार्वती ने हल्दी के पेस्ट से एक बालक बनाया जो स्नान करते समय द्वार की रक्षा करे। जब भगवान शिव लौटे और बालक ने उन्हें रोका, तो उन्होंने क्रोध में बालक का सिर काट दिया।

जब शिव को पता चला कि बालक पार्वती की रचना है, तो उन्होंने उसे पुनर्जीवित करने का वचन दिया। उन्होंने अपने गणों को उत्तर की ओर मुख किए पहले जीवित प्राणी का सिर लाने भेजा। वे हाथी के सिर के साथ लौटे, जिसे शिव ने बालक के शरीर पर रखा और उसे गणेश (गणों के स्वामी) नाम दिया।

गणेश की पूजा किसी भी शुभ अवसर, समारोह या नई शुरुआत से पहले सबसे पहले की जाती है।`,
    rituals: [
      'Install clay Ganesha idol at home or community pandal',
      'Perform Pran Pratishtha (invoking life into the idol) ceremony',
      'Offer modak (sweet dumplings) - Ganesha\'s favorite food',
      'Recite Ganesha Sahasranama and Ganapati Atharvashirsha',
      'Perform daily puja and aarti for the duration of the festival',
      'Observe fasting on the first day',
      'Visarjan (immersion) of idol in water body on the final day with chanting "Ganpati Bappa Morya"'
    ],
    ritualsHindi: [
      'घर या सामुदायिक पंडाल में मिट्टी का गणेश प्रतिमा स्थापित करें',
      'प्राण प्रतिष्ठा समारोह करें',
      'मोदक (मीठे डंपलिंग) अर्पित करें - गणेश का प्रिय भोजन',
      'गणेश सहस्रनाम और गणपति अथर्वशीर्ष का पाठ करें',
      'उत्सव की अवधि तक प्रतिदिन पूजा और आरती करें',
      'पहले दिन उपवास रखें',
      'अंतिम दिन "गणपति बप्पा मोरया" के जप के साथ प्रतिमा विसर्जित करें'
    ],
    regionalVariations: [
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Most elaborate celebrations. Tilak family started public celebrations in 1893. Massive pandals with artistic idols.',
        variationHindi: 'सबसे भव्य उत्सव। तिलक परिवार ने 1893 में सार्वजनिक उत्सव शुरू किया। कलात्मक मूर्तियों के विशाल पंडाल।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Celebrated with traditional puja at home. Ganesha is worshipped with special offerings.',
        variationHindi: 'घर पर पारंपरिक पूजा के साथ मनाया जाता है। गणेश की विशेष उपहारों के साथ पूजा की जाती है।'
      },
      {
        region: 'Goa',
        regionHindi: 'गोवा',
        variation: 'Unique tradition where Ganesha is worshipped in each household with elaborate decorations and community feasts.',
        variationHindi: 'अद्वितीय परंपरा जहाँ गणेश की प्रत्येक घर में सजावट और सामुदायिक भोज के साथ पूजा की जाती है।'
      }
    ],
    fastingRules: [
      'Observe a fast on the first day (Chaturthi)',
      'Avoid moon sighting on the day of Ganesh Chaturthi (mythological curse)',
      'Consume only fruits, milk, and vrat-friendly food',
      'Offer modak and break fast with prasad',
      'Avoid onion, garlic, and non-vegetarian food'
    ],
    fastingRulesHindi: [
      'पहले दिन (चतुर्थी) उपवास रखें',
      'गणेश चतुर्थी के दिन चंद्रमा को न देखें (पौराणिक शाप)',
      'केवल फल, दूध और व्रत का भोजन लें',
      'मोदक अर्पित करें और प्रसाद से उपवास तोड़ें',
      'प्याज़, लहसुन और मांसाहार से बचें'
    ],
    significance: 'Ganesh Chaturthi celebrates the birth of Lord Ganesha, the remover of obstacles and god of wisdom. The festival is also associated with environmental awareness as eco-friendly clay idols replace Plaster of Paris ones. The immersion symbolizes Ganesha\'s return to Mount Kailash to his parents Shiva and Parvati.',
    significanceHindi: 'गणेश चतुर्थी भगवान गणेश, विघ्नहर्ता और बुद्धि के देवता के जन्म का उत्सव है। यह पर्व पर्यावरण जागरूकता से भी जुड़ा है क्योंकि पर्यावरण-अनुकूल मिट्टी की मूर्तियाँ प्लास्टर ऑफ पेरिस की जगह ले रही हैं। विसर्जन गणेश के अपने माता-पिता शिव और पार्वती के पास कैलाश पर्वत पर लौटने का प्रतीक है।',
    duration: '10 days',
    durationHindi: '१० दिन',
    colors: ['Red', 'Yellow', 'Orange'],
  },

  // ============================================================================
  // JANMASHTAMI
  // ============================================================================
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    nameHindi: 'जन्माष्टमी',
    emoji: '🦚',
    story: `Janmashtami celebrates the divine birth of Lord Krishna, the eighth avatar of Lord Vishnu. Krishna was born in a prison cell in Mathura to Devaki and Vasudeva, during the dark night of the eighth day (Ashtami) of Krishna Paksha in the month of Shravana.

The tyrant king Kamsa, Devaki's brother, had imprisoned the couple after a prophecy foretold that Devaki's eighth child would cause his death. One by one, Kamsa killed each of their newborn children. But when Krishna was born, divine intervention occurred - the prison doors opened miraculously, and Vasudeva carried baby Krishna across the raging Yamuna river to Gokul, where he was raised by Yashoda and Nanda.

The celebration culminates at midnight, the believed time of Krishna's birth, with prayers, bhajans, and the ceremonial bathing and dressing of Krishna idols.`,
    storyHindi: `जन्माष्टमी भगवान कृष्ण, भगवान विष्णु के आठवें अवतार के जन्म का उत्सव है। कृष्ण का जन्म मथुरा की जेल में देवकी और वासुदेव के यहाँ श्रावण मास के कृष्ण पक्ष की आठवीं रात को हुआ था।

अत्याचारी राजा कंस, देवकी का भाई, ने दंपति को कारागार में बंद कर दिया था क्योंकि एक भविष्यवाणी ने बताया था कि देवकी का आठवाँ बच्चा उसकी मृत्यु का कारण बनेगा। कंस ने एक-एक करके सभी नवजात शिशुओं को मार डाला। लेकिन जब कृष्ण का जन्म हुआ, तो दिव्य हस्तक्षेप हुआ - जेल के दरवाज़े चमत्कारिक रूप से खुल गए, और वासुदेव बालक कृष्ण को उग्र यमुना नदी के पार गोकुल ले गए, जहाँ उन्हें यशोदा और नंद ने पाला।

रात के मध्यरात्रि में उत्सव चरम पर पहुँचता है, कृष्ण के जन्म के माने गए समय पर, प्रार्थना, भजन और कृष्ण मूर्तियों का शास्त्रोक्त स्नान और श्रृंगार होता है।`,
    rituals: [
      'Observe a strict fast until midnight',
      'Sing bhajans and read stories from Bhagavata Purana',
      'Decorate homes and temples with lights and flowers',
      'Create scenes from Krishna\'s childhood (Jhanki displays)',
      'Perform midnight puja at the exact time of Krishna\'s birth',
      'Dahi Handi celebrations - human pyramid to break the earthen pot',
      'Bathe and dress Krishna idols in new clothes and ornaments',
      'Prepare 56 types of food (Chhappan Bhog) as offering'
    ],
    ritualsHindi: [
      'मध्यरात्रि तक सख्त उपवास रखें',
      'भजन गाएं और भागवत पुराण से कथाएं पढ़ें',
      'घरों और मंदिरों को रोशनी और फूलों से सजाएं',
      'कृष्ण की बाल्यकाल की दृश्य बनाएं (झांकी प्रदर्शन)',
      'कृष्ण जन्म के सटीक समय पर मध्यरात्रि पूजा करें',
      'दही हांडी उत्सव - मिट्टी के घड़े को तोड़ने के लिए मानव पिरामिड',
      'कृष्ण मूर्तियों को नए वस्त्र और आभूषणों से सजाएं',
      '56 प्रकार के भोग (छप्पन भोग) तैयार करें'
    ],
    regionalVariations: [
      {
        region: 'Mathura & Vrindavan',
        regionHindi: 'मथुरा और वृंदावन',
        variation: 'Most elaborate celebrations. Temples are beautifully decorated. Ras Lila performances depicting Krishna\'s childhood.',
        variationHindi: 'सबसे भव्य उत्सव। मंदिर खूबसूरती से सजाए जाते हैं। कृष्ण की बाल्यकाल की रास लीला।'
      },
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Dahi Handi - teams form human pyramids to break hanging pots of curd, recreating Krishna\'s butter-stealing antics.',
        variationHindi: 'दही हांडी - टीमें लटके दही के घड़े तोड़ने के लिए मानव पिरामिड बनाती हैं, कृष्ण की माखन चोरी की लीला को दोहराते हुए।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Traditional fasting and puja. Footprints of baby Krishna are drawn with rice flour leading into homes.',
        variationHindi: 'पारंपरिक उपवास और पूजा। बालक कृष्ण के चरण चावल के आटे से घर के अंदर बनाए जाते हैं।'
      }
    ],
    fastingRules: [
      'Observe a complete or partial fast until midnight',
      'Consume only fruits and milk during the fast',
      'Break the fast at midnight after Krishna\'s birth celebration with prasad',
      'Some observe nirjala (waterless) fast for the entire day',
      'Avoid grains until after midnight puja'
    ],
    fastingRulesHindi: [
      'मध्यरात्रि तक पूर्ण या आंशिक उपवास रखें',
      'उपवास के दौरान केवल फल और दूध लें',
      'मध्यरात्रि में कृष्ण जन्म उत्सव के बाद प्रसाद से उपवास तोड़ें',
      'कुछ लोग पूरे दिन निर्जल उपवास रखते हैं',
      'मध्यरात्रि पूजा तक अनाज से बचें'
    ],
    significance: 'Janmashtami celebrates the birth of Lord Krishna, the divine teacher, protector, and the one who delivered the Bhagavad Gita. Krishna\'s life teaches the importance of duty, devotion, and the triumph of righteousness. The festival is a celebration of divine love and joy.',
    significanceHindi: 'जन्माष्टमी भगवान कृष्ण, दिव्य गुरु, रक्षक और भगवद गीता के उपदेशक के जन्म का उत्सव है। कृष्ण का जीवन कर्तव्य, भक्ति और धर्म की विजय का महत्व सिखाता है। यह पर्व दिव्य प्रेम और आनंद का उत्सव है।',
    duration: '2 days (Smarta & Vaishnava)',
    durationHindi: '२ दिन (स्मार्त और वैष्णव)',
    colors: ['Yellow', 'Peacock Blue', 'Green'],
  },

  // ============================================================================
  // RAM NAVAMI
  // ============================================================================
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    nameHindi: 'राम नवमी',
    emoji: '🏹',
    story: `Ram Navami celebrates the birth of Lord Rama, the seventh avatar of Lord Vishnu, born to King Dasharatha and Queen Kausalya in the ancient city of Ayodhya. Rama was born on the ninth day (Navami) of the bright fortnight (Shukla Paksha) in the month of Chaitra.

King Dasharatha performed the Putrakameshti Yagna (sacrifice for offspring), and from the sacred fire emerged a divine being who offered payasam (sweet rice pudding) to his queens. From this divine offering, four sons were born: Rama, Lakshmana, Bharata, and Shatrughna.

Rama is the embodiment of dharma (righteousness), the ideal son, the ideal husband, the ideal brother, and the ideal king (Maryada Purushottam). His life story, told in the epic Ramayana by sage Valmiki, teaches the highest standards of moral conduct.`,
    storyHindi: `राम नवमी भगवान राम, भगवान विष्णु के सातवें अवतार के जन्म का उत्सव है, जो प्राचीन अयोध्या में राजा दशरथ और रानी कौशल्या के यहाँ जन्मे थे। राम का जन्म चैत्र मास के शुक्ल पक्ष की नवमी को हुआ था।

राजा दशरथ ने पुत्रकामेष्टि यज्ञ किया, और पवित्र अग्नि से एक दिव्य प्राकट्य हुआ जिसने रानियों को पायसम (मीठा खीर) प्रदान किया। इस दिव्य प्रसाद से चार पुत्रों का जन्म हुआ: राम, लक्ष्मण, भरत और शत्रुघ्न।

राम धर्म (नीति) के अवतार हैं - आदर्श पुत्र, आदर्श पति, आदर्श भाई और आदर्श राजा (मर्यादा पुरुषोत्तम)। महर्षि वाल्मीकि द्वारा रामायण में बताई गई उनकी जीवन कथा नैतिक आचरण के सर्वोच्च मानकों को सिखाती है।`,
    rituals: [
      'Perform special puja and havan (fire ceremony) at home or temple',
      'Read or listen to the Ramayana or Sundara Kanda',
      'Decorate and place baby Rama idols in cradles (Jhanki)',
      'Organize or attend Ramayana discourse (Katha)',
      'Participate in Ram Navami processions',
      'Prepare and distribute panakam (jaggery drink) and neivedyam',
      'Observe a fast throughout the day',
      'Visit Rama temples and participate in community celebrations'
    ],
    ritualsHindi: [
      'घर या मंदिर में विशेष पूजा और हवन करें',
      'रामायण या सुंदरकांड पढ़ें या सुनें',
      'बाल राम की मूर्तियों को पालने में सजाएं (झांकी)',
      'रामायण कथा का आयोजन या श्रवण करें',
      'राम नवमी शोभायात्रा में भाग लें',
      'पानक (गुड़ का पेय) और नेवेद्य तैयार कर बांटें',
      'पूरे दिन उपवास रखें',
      'राम मंदिर जाएं और सामुदायिक उत्सव में भाग लें'
    ],
    regionalVariations: [
      {
        region: 'Ayodhya',
        regionHindi: 'अयोध्या',
        variation: 'Grand celebrations at Ram Janmabhoomi temple. Massive processions and religious discourses.',
        variationHindi: 'राम जन्मभूमि मंदिर में भव्य उत्सव। विशाल शोभायात्रा और धार्मिक प्रवचन।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Celebrated along with the wedding anniversary of Rama and Sita (Kalyanotsavam). Temples perform ceremonial wedding.',
        variationHindi: 'राम और सीता के विवाह की वर्षगांठ (कल्याणोत्सवम) के साथ मनाया जाता है। मंदिरों में शास्त्रोक्त विवाह होता है।'
      },
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Ramayana recitations and Ramlila performances. Fasting and community feasts.',
        variationHindi: 'रामायण पाठ और रामलीला कार्यक्रम। उपवास और सामुदायिक भोज।'
      }
    ],
    fastingRules: [
      'Observe a full-day fast from sunrise to sunset',
      'Some observe nirjala (waterless) fast',
      'Break fast after evening puja with fruits and milk',
      'Avoid onion, garlic, and grains if observing strict fast',
      'Consume only fruits, milk, and sattvic foods'
    ],
    fastingRulesHindi: [
      'सूर्योदय से सूर्यास्त तक पूर्ण उपवास रखें',
      'कुछ लोग निर्जल उपवास रखते हैं',
      'सांयकाल पूजा के बाद फल और दूध से उपवास तोड़ें',
      'यदि सख्त उपवास हो तो प्याज़, लहसुन और अनाज से बचें',
      'केवल फल, दूध और सात्विक भोजन लें'
    ],
    significance: 'Ram Navami celebrates the birth of Lord Rama, the embodiment of dharma and the ideal human being. The festival inspires devotees to follow the path of righteousness, duty, and moral excellence as exemplified by Rama\'s life.',
    significanceHindi: 'राम नवमी भगवान राम, धर्म के अवतार और आदर्श मानव के जन्म का उत्सव है। यह पर्व भक्तों को राम के जीवन द्वारा प्रदर्शित नीति, कर्तव्य और नैतिक उत्कृष्टता के मार्ग पर चलने के लिए प्रेरित करता है।',
    duration: '1 day (part of Chaitra Navratri)',
    durationHindi: '१ दिन (चैत्र नवरात्रि का हिस्सा)',
    colors: ['Orange', 'Gold', 'Red'],
  },

  // ============================================================================
  // MAHA SHIVRATRI
  // ============================================================================
  {
    id: 'maha-shivratri',
    name: 'Maha Shivaratri',
    nameHindi: 'महाशिवरात्रि',
    emoji: '🔱',
    story: `Maha Shivaratri, the "Great Night of Shiva," is one of the most sacred festivals dedicated to Lord Shiva. Several legends are associated with this auspicious night.

The most popular legend says that on this night, Shiva performed the cosmic dance of creation, preservation, and destruction (Tandava). It is also believed to be the night when Shiva and Parvati were united in divine matrimony.

Another legend tells of a hunter who, while hiding in a Bilva tree on this night, accidentally dropped Bilva leaves onto a Shiva Linga below. Unknowingly performing this sacred act, he received Shiva\'s grace and was liberated from the cycle of birth and death.

It is also believed that on this night, the northern hemisphere of the earth is positioned such that there is a natural upsurge of energy, making it spiritually beneficial to stay awake and meditate.`,
    storyHindi: `महाशिवरात्रि, "शिव की महान रात्रि", भगवान शिव को समर्पित सबसे पवित्र पर्वों में से एक है। इस शुभ रात्रि से कई पौराणिक कथाएं जुड़ी हैं।

सबसे लोकप्रिय कथा कहती है कि इस रात्रि शिव ने सृष्टि, पालन और विनाश का तांडव नृत्य किया था। यह भी माना जाता है कि इसी रात शिव और पार्वती का दिव्य विवाह हुआ था।

एक अन्य कथा एक बहेलिए की है जो इस रात बिल्व वृक्ष पर छिपे हुए था और अनजाने में बिल्व पत्र नीचे शिवलिंग पर गिर गए। अनजाने में इस पवित्र कार्य को करने पर उसे शिव की कृपा प्राप्त हुई और वह जन्म-मृत्यु के चक्र से मुक्त हो गया।

यह भी माना जाता है कि इस रात्रि पृथ्वी का उत्तरी गोलार्द्ध इस प्रकार स्थित होता है कि ऊर्जा की प्राकृतिक वृद्धि होती है, इसलिए जागृत रहना और ध्यान करना आध्यात्मिक रूप से लाभदायक है।`,
    rituals: [
      'Observe a strict fast throughout the day and night',
      'Stay awake all night (jagaran) in meditation and prayer',
      'Pour milk, water, honey, and ghee on Shiva Linga (Abhishekam)',
      'Offer Bilva (Bel) leaves to Shiva - extremely sacred to Lord Shiva',
      'Chant "Om Namah Shivaya" mantra continuously',
      'Read or listen to Shiva Purana and Linga Purana',
      'Visit Shiva temples and participate in night-long vigils',
      'Perform Rudrabhishekam - sacred bathing of Shiva Linga with 108 items'
    ],
    ritualsHindi: [
      'पूरे दिन और रात सख्त उपवास रखें',
      'ध्यान और प्रार्थना में पूरी रात जागृत रहें (जागरण)',
      'शिवलिंग पर दूध, जल, शहद और घी अर्पित करें (अभिषेकम)',
      'शिव को बिल्व (बेल) पत्र अर्पित करें - शिव को अत्यंत पवित्र',
      '"ॐ नमः शिवाय" मंत्र का निरंतर जाप करें',
      'शिव पुराण और लिंग पुराण पढ़ें या सुनें',
      'शिव मंदिर जाएं और रात भर जागरण में भाग लें',
      'रुद्राभिषेक करें - 108 वस्तुओं से शिवलिंग का शास्त्रोक्त स्नान'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Massive gatherings at temples. Mandi in Himachal Pradesh hosts an international Shivaratri fair.',
        variationHindi: 'मंदिरों में विशाल भीड़। हिमाचल प्रदेश के मंडी में अंतर्राष्ट्रीय शिवरात्रि मेला लगता है।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Elaborate Abhishekam at ancient Shiva temples. Special cultural programs and classical music concerts.',
        variationHindi: 'प्राचीन शिव मंदिरों में विस्तृत अभिषेकम। विशेष सांस्कृतिक कार्यक्रम और शास्त्रीय संगीत कार्यक्रम।'
      },
      {
        region: 'Nepal',
        regionHindi: 'नेपाल',
        variation: 'Pashupatinath Temple in Kathmandu sees hundreds of thousands of devotees. Sadhus gather from across the region.',
        variationHindi: 'काठमांडू का पशुपतिनाथ मंदिर में लाखों भक्त आते हैं। साधु पूरे क्षेत्र से एकत्रित होते हैं।'
      }
    ],
    fastingRules: [
      'Observe a strict nirjala (waterless) fast or consume only fruits and milk',
      'Eat only one meal after sunset if not doing nirjala',
      'Avoid all grains, onion, garlic, and non-vegetarian food',
      'Break fast the next morning after morning puja',
      'Some consume only water throughout the fast'
    ],
    fastingRulesHindi: [
      'कड़ा निर्जल उपवास रखें या केवल फल और दूध लें',
      'यदि निर्जल नहीं तो सूर्यास्त के बाद केवल एक बार भोजन करें',
      'सभी अनाज, प्याज़, लहसुन और मांसाहार से बचें',
      'अगली सुबह प्रातः पूजा के बाद उपवास तोड़ें',
      'कुछ लोग पूरे उपवास में केवल जल लेते हैं'
    ],
    significance: 'Maha Shivaratri is considered the most powerful night for spiritual practice. It is believed that sincere worship and staying awake through the night on Shivaratri absolves one of all sins and brings liberation (moksha). The night represents overcoming darkness and ignorance through the grace of Lord Shiva.',
    significanceHindi: 'महाशिवरात्रि आध्यात्मिक साधना के लिए सबसे शक्तिशाली रात्रि मानी जाती है। माना जाता है कि शिवरात्रि पर सच्ची भक्ति और रात भर जागरण सभी पापों को मिटा देता है और मोक्ष प्रदान करता है। यह रात्रि भगवान शिव की कृपा से अंधकार और अज्ञान पर विजय का प्रतीक है।',
    duration: '1 night',
    durationHindi: '१ रात्रि',
    colors: ['White', 'Blue', 'Silver'],
  },

  // ============================================================================
  // RAKSHA BANDHAN
  // ============================================================================
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षाबंधन',
    emoji: '🧵',
    story: `Raksha Bandhan celebrates the sacred bond between brothers and sisters. The term "Raksha Bandhan" means "the bond of protection." Several historical and mythological stories are associated with this festival.

The most popular legend tells of Draupadi and Lord Krishna. When Krishna cut his finger while wielding the Sudarshana Chakra, Draupadi immediately tore a piece of her sari and tied it around his wound. Touched by her love, Krishna promised to protect her forever - a promise he fulfilled during the disrobing incident in the Mahabharata.

Another famous story is that of King Bali and Goddess Lakshmi. When Lakshmi tied a rakhi to Bali, he granted her a wish. She asked for Lord Vishnu (who was residing with Bali) to return to Vaikuntha. Bali selflessly agreed.

Historically, queens have sent rakhis to neighboring rulers as a symbol of peace and protection. Rani Karnavati of Chittor sent a rakhi to Mughal Emperor Humayun when threatened by Bahadur Shah of Gujarat.`,
    storyHindi: `रक्षाबंधन भाई-बहन के पवित्र बंधन का उत्सव है। "रक्षाबंधन" शब्द का अर्थ है "रक्षा का बंधन"। इस पर्व से कई ऐतिहासिक और पौराणिक कथाएं जुड़ी हैं।

सबसे लोकप्रिय कथा द्रौपदी और भगवान कृष्ण की है। जब कृष्ण ने सुदर्शन चक्र चलाते समय अपनी उंगली काट ली, तो द्रौपदी ने तुरंत अपनी साड़ी का टुकड़ा फाड़कर उनके घाव पर बांध दिया। उनके प्रेम से प्रभावित होकर कृष्ण ने उनकी रक्षा का वचन दिया - जिसे उन्होंने महाभारत में चीरहरण के दौरान निभाया।

एक अन्य प्रसिद्ध कथा राजा बलि और देवी लक्ष्मी की है। जब लक्ष्मी ने बलि को राखी बांधी, तो उन्होंने एक इच्छा मांगी। लक्ष्मी ने भगवान विष्णु (जो बलि के पास थे) को वैकुंठ लौटने को कहा। बलि ने निस्वार्थ भाव से स्वीकार किया।

ऐतिहासिक रूप से, रानियों ने शांति और रक्षा के प्रतीक के रूप में पड़ोसी शासकों को राखी भेजी है। चित्तौड़ की रानी कर्णावती ने गुजरात के बहादुर शाह से खतरे पर मुगल सम्राट हुमायूं को राखी भेजी थी।`,
    rituals: [
      'Sisters tie a sacred thread (rakhi) on brothers\' wrists',
      'Brothers give gifts and promise of protection to sisters',
      'Perform aarti and apply tilak on brother\'s forehead',
      'Feed brother sweets with own hands',
      'Family gathering with festive meals',
      'Sisters pray for brothers\' well-being and longevity',
      'Exchange of gifts between families'
    ],
    ritualsHindi: [
      'बहनें भाइयों की कलाई पर पवित्र धागा (राखी) बांधती हैं',
      'भाई बहनों को उपहार और रक्षा का वचन देते हैं',
      'आरती करें और भाई के माथे पर तिलक लगाएं',
      'भाई को हाथों से मिठाई खिलाएं',
      'परिवार का मिलन और उत्सव भोज',
      'बहनें भाइयों की भलाई और दीर्घायु के लिए प्रार्थना करें',
      'परिवारों के बीच उपहारों का आदान-प्रदान'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Most widely celebrated. Elaborate rakhi ceremonies with family gatherings. Extensive gifting.',
        variationHindi: 'सबसे व्यापक रूप से मनाया जाता है। परिवार मिलन के साथ विस्तृत राखी समारोह। व्यापक उपहार।'
      },
      {
        region: 'West India',
        regionHindi: 'पश्चिम भारत',
        variation: 'Celebrated alongside Nariyal Purnima (coconut offering to the sea) by fishing communities.',
        variationHindi: 'मछुआरे समुदायों द्वारा नारियल पूर्णिमा (समुद्र को नारियल अर्पण) के साथ मनाया जाता है।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Observed as Avani Avittam - sacred thread ceremony for Brahmins. Change of sacred thread (janeyu).',
        variationHindi: 'अवनि अविट्टम के रूप में मनाया जाता है - ब्राह्मणों के लिए पवित्र धारण समारोह।'
      }
    ],
    significance: 'Raksha Bandhan celebrates the eternal bond of love and protection between siblings. It transcends blood relationships - rakhis have been tied between non-relatives as symbols of peace and mutual respect. The festival reinforces the values of family bonds, duty, and protection.',
    significanceHindi: 'रक्षाबंधन भाई-बहन के बीच प्रेम और रक्षा के शाश्वत बंधन का उत्सव है। यह रक्त संबंधों से परे है - राखी शांति और परस्पर सम्मान के प्रतीक के रूप में अजनबियों के बीच भी बांधी गई है। यह पर्व परिवार के बंधन, कर्तव्य और रक्षा के मूल्यों को मजबूत करता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Red', 'Gold', 'Yellow'],
  },

  // ============================================================================
  // KARWA CHAUTH
  // ============================================================================
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    emoji: '🌙',
    story: `Karwa Chauth is a sacred festival observed by married women who fast from sunrise to moonrise for the longevity, health, and prosperity of their husbands. It falls on the fourth day (Chaturthi) of Krishna Paksha in the month of Kartika.

The most popular legend tells of Queen Karwa, who was deeply devoted to her husband. When a crocodile attacked him in a river, Karwa tied the crocodile with cotton thread and threatened to curse Yama (the god of death). When Yama refused to help, she threatened to create her own hell. Impressed by her devotion and determination, Yama revived her husband, and both were blessed with long life.

Another legend involves Draupadi, who observed this fast on the advice of Lord Krishna when the Pandavas were facing difficulties in the forest.

The festival also coincides with the beginning of the wheat-sowing season, when women would pray for a good harvest.`,
    storyHindi: `करवा चौथ एक पवित्र पर्व है जो विवाहित महिलाओं द्वारा अपने पति की दीर्घायु, स्वास्थ्य और समृद्धि के लिए सूर्योदय से चंद्रोदय तक उपवास करने का उत्सव है। यह कार्तिक मास के कृष्ण पक्ष की चौथ को आता है।

सबसे लोकप्रिय कथा रानी करवा की है, जो अपने पति के प्रति गहरा समर्पित थीं। जब एक मगरमच्छ ने नदी में उनके पति पर हमला किया, तो करवा ने कपास के धागे से मगरमच्छ को बांधा और यम (मृत्यु के देवता) को शाप देने की धमकी दी। जब यम ने मदद करने से मना किया, तो उन्होंने अपना नरक बनाने की धमकी दी। उनकी भक्ति और दृढ़ता से प्रभावित होकर यम ने उनके पति को पुनर्जीवित किया और दोनों को दीर्घायु का आशीर्वाद मिला।

एक अन्य कथा द्रौपदी से जुड़ी है, जिन्होंने भगवान कृष्ण की सलाह पर यह व्रत रखा जब पांडव वन में कठिनाइयों का सामना कर रहे थे।

यह पर्व गेहूं बोने के मौसम की शुरुआत के साथ भी आता है, जब महिलाएं अच्छी फसल के लिए प्रार्थना करती थीं।`,
    rituals: [
      'Women observe a strict nirjala (waterless) fast from sunrise to moonrise',
      'Wake up before dawn and eat sargi (pre-dawn meal given by mother-in-law)',
      'Apply henna (mehndi) and dress in traditional attire (red/sindoor)',
      'Karwa Chauth puja in the afternoon with other married women',
      'Listen to Karwa Chauth Katha (story of the festival)',
      'Evening gathering - women pass the karwa (pot) seven times while singing',
      'Break fast only after sighting the moon and performing moon puja',
      'Husband offers water to wife to break the fast'
    ],
    ritualsHindi: [
      'महिलाएं सूर्योदय से चंद्रोदय तक सख्त निर्जल उपवास रखती हैं',
      'भोर से पहले उठें और सर्गी खाएं (सास द्वारा दिया गया प्री-डॉन भोजन)',
      'मेंहदी लगाएं और पारंपरिक वस्त्र (लाल/सिंदूर) धारण करें',
      'दोपहर में अन्य विवाहित महिलाओं के साथ करवा चौथ पूजा',
      'करवा चौथ कथा (पर्व की कथा) सुनें',
      'सांयकाल एकत्रित हों - महिलाएं गाते हुए करवा (घड़ा) सात बार घुमाएं',
      'चंद्रमा देखने और चंद्रमा पूजा के बाद ही उपवास तोड़ें',
      'पति पत्नी को जल अर्पित करके उपवास तुड़वाता है'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Most elaborate celebrations. Community gatherings, dressing up, and elaborate ceremonies.',
        variationHindi: 'सबसे भव्य उत्सव। सामुदायिक मिलन, सजना-धजना, और विस्तृत समारोह।'
      },
      {
        region: 'Punjab',
        regionHindi: 'पंजाब',
        variation: 'Celebrated with great enthusiasm. Baisakhi fairs and community prayers.',
        variationHindi: 'जोश से मनाया जाता है। बैसाखी मेले और सामुदायिक प्रार्थना।'
      },
      {
        region: 'Modern/Urban',
        regionHindi: 'आधुनिक/शहरी',
        variation: 'Increasingly, husbands also fast for their wives. Celebrated as a mutual celebration of love.',
        variationHindi: 'बढ़ते हुए, पति भी पत्नियों के लिए उपवास रखते हैं। प्रेम के पारस्परिक उत्सव के रूप में मनाया जाता है।'
      }
    ],
    fastingRules: [
      'Strict nirjala (waterless) fast from sunrise to moonrise',
      'Pre-dawn meal (sargi) is consumed before the fast begins',
      'No food or water throughout the day',
      'Fast broken only after moon sighting and husband offering water',
      'If sky is cloudy, break fast based on panchang moonrise time',
      'Unmarried women may also observe this fast for a good husband'
    ],
    fastingRulesHindi: [
      'सूर्योदय से चंद्रोदय तक कड़ा निर्जल उपवास',
      'उपवास शुरू होने से पहले प्रातः सर्गी खाएं',
      'पूरे दिन कोई भोजन या जल नहीं',
      'चंद्रमा दर्शन और पति द्वारा जल अर्पण के बाद ही उपवास तोड़ें',
      'यदि आकाश बादल से ढका हो तो पंचांग के चंद्रोदय समय के अनुसार उपवास तोड़ें',
      'अविवाहित महिलाएं भी अच्छे पति के लिए यह व्रत रख सकती हैं'
    ],
    significance: 'Karwa Chauth celebrates the sacred bond of marriage and a wife\'s devotion to her husband\'s well-being. While traditionally observed by married women, it increasingly symbolizes mutual love and commitment between spouses. The festival also marks the agricultural cycle and prays for prosperity.',
    significanceHindi: 'करवा चौथ विवाह के पवित्र बंधन और पति की भलाई के प्रति पत्नी के समर्पण का उत्सव है। परंपरागत रूप से विवाहित महिलाओं द्वारा मनाया जाता है, यह बढ़ते हुए जीवनसाथियों के बीच पारस्परिक प्रेम और प्रतिबद्धता का प्रतीक है। यह पर्व कृषि चक्र को भी चिह्नित करता है और समृद्धि के लिए प्रार्थना करता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Red', 'Maroon', 'Gold', 'Green'],
  },

  // ============================================================================
  // MAKAR SANKRANTI
  // ============================================================================
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    nameHindi: 'मकर संक्रांति',
    emoji: '🌞',
    story: `Makar Sankranti is one of the few Hindu festivals based on the solar calendar rather than the lunar calendar. It marks the transition of the Sun into the zodiac sign of Capricorn (Makar), signaling the end of the winter solstice and the beginning of longer days. This astronomical event usually falls on January 14th or 15th each year.

According to Hindu mythology, this is the day when Lord Surya's son Shani (Saturn) visits his father's house. The sun god welcomes his son with great fanfare, symbolizing the healing of their complicated relationship.

Another legend associates this day with Bhishma Pitamaha of the Mahabharata, who chose to leave his mortal body on this auspicious day of Uttarayana (the sun's northward journey), as he had the boon of choosing the time of his death (ichha mrityu).`,
    storyHindi: `मकर संक्रांति हिंदू पंचांग के सौर कैलेंडर पर आधारित कुछ पर्वों में से एक है। यह सूर्य के मकर राशि में प्रवेश, शीत अयनांत के अंत और लंबे दिनों की शुरुआत को चिह्नित करता है। यह खगोलीय घटना आमतौर पर हर साल 14 या 15 जनवरी को आती है।

हिंदू पौराणिक कथाओं के अनुसार, इस दिन भगवान सूर्य के पुत्र शनि अपने पिता के घर आते हैं। सूर्य देव अपने पुत्र का भव्य स्वागत करते हैं, जो उनके जटिल संबंधों के उपचार का प्रतीक है।

एक अन्य कथा महाभारत के भीष्म पितामह से जुड़ी है, जिन्होंने उत्तरायण (सूर्य की उत्तर दिशा की यात्रा) के इस शुभ दिन पर अपना शरीर त्यागना चुना, क्योंकि उन्हें इच्छा मृत्यु का वरदान प्राप्त था।`,
    rituals: [
      'Take holy dip in sacred rivers (Ganga, Yamuna, Godavari) at sunrise',
      'Fly kites (especially famous in Gujarat and Rajasthan)',
      'Prepare and share sweets made of til (sesame) and jaggery',
      'Perform puja to Surya Devta (Sun God)',
      'Donate khichdi, sesame, jaggery, and warm clothes to the needy',
      'Community fairs and cultural celebrations',
      'Light bonfires in some regions (Lohri celebrated the night before)'
    ],
    ritualsHindi: [
      'सूर्योदय पर पवित्र नदियों (गंगा, यमुना, गोदावरी) में स्नान करें',
      'पतंगबाज़ी करें (विशेषकर गुजरात और राजस्थान में प्रसिद्ध)',
      'तिल और गुड़ की मिठाइयाँ बनाएं और बांटें',
      'सूर्य देवता की पूजा करें',
      'खिचड़ी, तिल, गुड़ और गर्म कपड़े जरूरतमंदों को दान करें',
      'सामुदायिक मेले और सांस्कृतिक उत्सव',
      'कुछ क्षेत्रों में अग्नि जलाएं (लोहरी एक रात पहले मनाई जाती है)'
    ],
    regionalVariations: [
      {
        region: 'Gujarat & Rajasthan',
        regionHindi: 'गुजरात और राजस्थान',
        variation: 'Famous for kite flying (Uttarayan). Massive kite festivals with international participation.',
        variationHindi: 'पतंगबाज़ी (उत्तरायण) के लिए प्रसिद्ध। अंतर्राष्ट्रीय भागीदारी के साथ विशाल पतंग उत्सव।'
      },
      {
        region: 'Tamil Nadu',
        regionHindi: 'तमिल नाडु',
        variation: 'Celebrated as Pongal - a four-day harvest festival. Boiling of milk and rice as offering to Surya.',
        variationHindi: 'पोंगल के रूप में मनाया जाता है - चार दिनों का फसल उत्सव। सूर्य को दूध और चावल अर्पण।'
      },
      {
        region: 'Punjab',
        regionHindi: 'पंजाब',
        variation: 'Celebrated as Lohri the night before with bonfire, bhangra, and community feasts.',
        variationHindi: 'लोहरी के रूप में अगल की रात अग्नि, भांगड़ा और सामुदायिक भोज के साथ मनाया जाता है।'
      },
      {
        region: 'Assam',
        regionHindi: 'असम',
        variation: 'Celebrated as Magh Bihu (Bhogali Bihu) - harvest festival with feasting and traditional games.',
        variationHindi: 'माघ बिहू (भोगाली बिहू) के रूप में मनाया जाता है - भोज और पारंपरिक खेलों के साथ फसल उत्सव।'
      },
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Exchange of til-gul (sesame-jaggery sweets) with the phrase "Til gul ghya, god god bola".',
        variationHindi: '"तिल गुळ घ्या, गोड गोड बोला" के साथ तिल-गुड़ की मिठाइयाँ बांटना।'
      }
    ],
    fastingRules: [
      'Some observe a partial fast until evening',
      'Consume til-based foods (sesame is considered auspicious)',
      'No strict fasting rules - it is primarily a celebration of the sun and harvest'
    ],
    fastingRulesHindi: [
      'कुछ लोग सांयकाल तक आंशिक उपवास रखते हैं',
      'तिल-आधारित भोजन लें (तिल को शुभ माना जाता है)',
      'कोई सख्त उपवास नियम नहीं - यह मुख्य रूप से सूर्य और फसल का उत्सव है'
    ],
    significance: 'Makar Sankranti marks the beginning of Uttarayana - the six-month auspicious period when the sun travels northward. It is considered highly auspicious for spiritual practices, charity, and new beginnings. The festival also celebrates the harvest season and gratitude toward nature.',
    significanceHindi: 'मकर संक्रांति उत्तरायण की शुरुआत को चिह्नित करती है - छह महीने का शुभ काल जब सूर्य उत्तर दिशा की यात्रा करता है। इसे आध्यात्मिक साधना, दान और नई शुरुआत के लिए अत्यंत शुभ माना जाता है। यह पर्व फसल मौसम और प्रकृति के प्रति कृतज्ञता का भी उत्सव है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Yellow', 'Orange', 'Red'],
  },

  // ============================================================================
  // AKSHAYA TRITIYA
  // ============================================================================
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya',
    nameHindi: 'अक्षय तृतीया',
    emoji: '💎',
    story: `Akshaya Tritiya is one of the most auspicious days in the Hindu calendar, falling on the third day (Tritiya) of the bright fortnight (Shukla Paksha) in the month of Vaishakha. The word "Akshaya" means "never diminishing" - anything begun on this day is believed to grow endlessly.

Several significant events are associated with this day. It is believed that Lord Vishnu's fourth avatar, Vamana, was born on Akshaya Tritiya. It is also the day when the Ganga river descended to earth from heaven.

The Mahabharata is associated with this day in multiple ways. It is believed that the epic composition by Ved Vyasa began on this day, with Lord Ganesha as the scribe. During the Pandavas' exile, Lord Krishna presented the Akshaya Patra (inexhaustible vessel) to Draupadi on this day, ensuring the Pandavas would never go hungry.

It is also believed that the divine treasures of Kubera (the god of wealth) were blessed on this day.`,
    storyHindi: `अक्षय तृतीया हिंदू पंचांग के सबसे शुभ दिनों में से एक है, जो वैशाख मास के शुक्ल पक्ष की तृतीया को आता है। "अक्षय" शब्द का अर्थ है "कभी न क्षय होने वाला" - इस दिन शुरू किया गया कुछ भी अनंत रूप से बढ़ता है, ऐसा माना जाता है।

इस दिन से कई महत्वपूर्ण घटनाएं जुड़ी हैं। माना जाता है कि भगवान विष्णु के चौथे अवतार वामन का जन्म अक्षय तृतीया को हुआ था। यह वह दिन भी है जब गंगा नदी स्वर्ग से पृथ्वी पर उतरीं।

महाभारत का इस दिन से कई तरह से संबंध है। माना जाता है कि वेद व्यास द्वारा महाकाव्य की रचना इसी दिन शुरू हुई थी, भगवान गणेश लेखक थे। पांडवों के वनवास के दौरान, भगवान कृष्ण ने द्रौपदी को अक्षय पात्र (अक्षय बर्तन) प्रदान किया, जिससे पांडव कभी भूखे नहीं रहे।

यह भी माना जाता है कि इस दिन कुबेर (धन के देवता) के दिव्य खज़ाने को आशीर्वाद मिला था।`,
    rituals: [
      'Perform Lakshmi and Kubera puja for wealth and prosperity',
      'Buy gold, silver, or precious items (considered extremely auspicious)',
      'Start new ventures, investments, or property purchases',
      'Donate food, clothes, and money to Brahmins and the needy',
      'Perform Ganga puja and take holy dip in sacred rivers',
      'Recite Vishnu Sahasranama and Lakshmi mantras',
      'Begin new education or spiritual practices on this day'
    ],
    ritualsHindi: [
      'धन और समृद्धि के लिए लक्ष्मी और कुबेर की पूजा करें',
      'सोना, चांदी या कीमती वस्तुएं खरीदें (अत्यंत शुभ माना जाता है)',
      'नए उद्यम, निवेश या संपत्ति खरीद शुरू करें',
      'ब्राह्मणों और जरूरतमंदों को भोजन, वस्त्र और धन दान करें',
      'गंगा पूजा करें और पवित्र नदियों में स्नान करें',
      'विष्णु सहस्रनाम और लक्ष्मी मंत्रों का पाठ करें',
      'इस दिन नई शिक्षा या आध्यात्मिक साधना शुरू करें'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Major day for buying gold and jewelry. Jewelers offer special discounts and promotions.',
        variationHindi: 'सोना और गहने खरीदने का प्रमुख दिन। ज्वेलर्स विशेष छूट और प्रमोशन देते हैं।'
      },
      {
        region: 'West Bengal & Odisha',
        regionHindi: 'पश्चिम बंगाल और ओडिशा',
        variation: 'Celebrated as the beginning of the writing season. Children begin learning alphabets on this day.',
        variationHindi: 'लेखन मौसम की शुरुआत के रूप में मनाया जाता है। बच्चे इस दिन वर्णमाला सीखना शुरू करते हैं।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Associated with the birth of Parashurama. Special pujas and homas performed in temples.',
        variationHindi: 'परशुराम के जन्म से जुड़ा। मंदिरों में विशेष पूजा और होम किए जाते हैं।'
      }
    ],
    fastingRules: [
      'Some observe a fast dedicated to Lord Vishnu',
      'Consume sattvic foods if not fasting',
      'Break fast with traditional prasad after Vishnu puja',
      'Avoid tamasic foods (onion, garlic, non-vegetarian)'
    ],
    fastingRulesHindi: [
      'कुछ लोग भगवान विष्णु को समर्पित उपवास रखते हैं',
      'यदि उपवास न करें तो सात्विक भोजन लें',
      'विष्णु पूजा के बाद पारंपरिक प्रसाद से उपवास तोड़ें',
      'तामसिक भोजन (प्याज़, लहसुन, मांसाहार) से बचें'
    ],
    significance: 'Akshaya Tritiya is considered one of the four most auspicious days (along with Yugadi, Vijaya Dashami, and Bali Pratipada) that do not require a specific muhurat. It symbolizes infinite growth, prosperity, and the belief that righteous beginnings lead to lasting results. The day is especially favored for investments, new ventures, and spiritual commitments.',
    significanceHindi: 'अक्षय तृतीया को चार सबसे शुभ दिनों में से एक माना जाता है (युगादि, विजया दशमी और बलि प्रतिपदा के साथ) जिन्हें विशिष्ट मुहूर्त की आवश्यकता नहीं होती। यह अनंत वृद्धि, समृद्धि और इस विश्वास का प्रतीक है कि धार्मिक शुरुआत स्थायी परिणाम लाती है। यह दिन निवेश, नए उद्यम और आध्यात्मिक संकल्पों के लिए विशेष रूप से अनुकूल है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Gold', 'Yellow', 'White'],
  },

  // ============================================================================
  // VAT PURNIMA
  // ============================================================================
  {
    id: 'vat-purnima',
    name: 'Vat Purnima',
    nameHindi: 'वट पूर्णिमा',
    emoji: '🌳',
    story: `Vat Purnima is a significant festival observed by married women who pray for the longevity, health, and prosperity of their husbands. It is celebrated on the full moon day (Purnima) of the month of Jyeshtha, typically falling in May or June.

The festival is rooted in the legend of Savitri and Satyavan. Savitri was a princess who chose Satyavan, a prince living in exile, as her husband despite knowing from the sage Narada that Satyavan was destined to die within one year.

When the time came, Yama (the god of death) arrived to take Satyavan's soul. Savitri followed Yama, engaging him in wise conversation. Impressed by her wisdom, devotion, and unwavering resolve, Yama granted her several boons. Through her cleverness, she eventually secured boons that required Satyavan to be alive, forcing Yama to restore her husband's life.

The banyan tree (Vat Vriksha) holds special significance because, according to the story, Savitri tied a sacred thread around the banyan tree under which Satyavan's body lay, and it was here that she confronted Yama.`,
    storyHindi: `वट पूर्णिमा एक महत्वपूर्ण पर्व है जो विवाहित महिलाएं अपने पति की दीर्घायु, स्वास्थ्य और समृद्धि के लिए प्रार्थना करती हैं। यह ज्येष्ठ मास की पूर्णिमा को मनाया जाता है, जो आमतौर पर मई या जून में आता है।

यह पर्व सावित्री और सत्यवान की कथा पर आधारित है। सावित्री एक राजकुमारी थीं जिन्होंने सत्यवान, एक वनवासी राजकुमार, को अपना पति चुना, भले ही उन्हें ऋषि नारद से पता था कि सत्यवान का एक वर्ष के भीतर निधन हो जाएगा।

जब समय आया, तो यम (मृत्यु के देवता) सत्यवान की आत्मा लेने आए। सावित्री यम के पीछे गईं और उन्हें बुद्धिमान बातचीत में उलझाए रखा। उनकी बुद्धिमत्ता, भक्ति और अटल संकल्प से प्रभावित होकर यम ने उन्हें कई वरदान दिए। अपनी चतुराई से, उन्होंने अंततः ऐसे वरदान प्राप्त किए जिनके लिए सत्यवान का जीवित होना आवश्यक था, जिससे यम को उनके पति का जीवन लौटाना पड़ा।

वट वृक्ष का विशेष महत्व है क्योंकि कथा के अनुसार, सावित्री ने उस वट वृक्ष के चारों ओर पवित्र धागा बांधा था जिसके नीचे सत्यवान का शरीर था, और यहीं पर उन्होंने यम का सामना किया था।`,
    rituals: [
      'Worship the banyan tree (Vat Vriksha) with sacred thread',
      'Tie a cotton thread around the banyan tree seven times while praying',
      'Observe a three-day fast (or partial fast) for husband\'s longevity',
      'Listen to or recite the Savitri-Satyavan Katha',
      'Prepare special puja items: flowers, fruits, sindoor, and bangles',
      'Create a mandala or rangoli under the banyan tree',
      'Women dress in traditional attire and apply sindoor'
    ],
    ritualsHindi: [
      'वट वृक्ष की पवित्र धागे के साथ पूजा करें',
      'प्रार्थना करते हुए वट वृक्ष के चारों ओर सात बार सूती धागा बांधें',
      'पति की दीर्घायु के लिए तीन दिन का उपवास (या आंशिक उपवास) रखें',
      'सावित्री-सत्यवान कथा सुनें या पढ़ें',
      'विशेष पूजा सामग्री तैयार करें: फूल, फल, सिंदूर और चूड़ियाँ',
      'वट वृक्ष के नीचे मंडला या रंगोली बनाएं',
      'महिलाएं पारंपरिक वस्त्र धारण करें और सिंदूर लगाएं'
    ],
    regionalVariations: [
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Most widely celebrated. Women gather at banyan trees in communities. Elaborate three-day observance.',
        variationHindi: 'सबसे व्यापक रूप से मनाया जाता है। महिलाएं सामुदायिक रूप से वट वृक्षों पर एकत्रित होती हैं। विस्तृत तीन दिन का अनुष्ठान।'
      },
      {
        region: 'Gujarat',
        regionHindi: 'गुजरात',
        variation: 'Similar observance with regional variations in rituals and prayers.',
        variationHindi: 'अनुष्ठानों और प्रार्थनाओं में क्षेत्रीय भिन्नताओं के साथ समान अनुष्ठान।'
      },
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Less widely observed compared to Karwa Chauth, but still practiced in traditional families.',
        variationHindi: 'करवा चौथ की तुलना में कम व्यापक, लेकिन पारंपरिक परिवारों में अभी भी प्रचलित।'
      }
    ],
    fastingRules: [
      'Observe a three-day partial fast',
      'Some observe nirjala (waterless) fast on the main day',
      'Consume fruits, milk, and sattvic foods',
      'Break fast after completing the banyan tree puja',
      'Avoid onion, garlic, and non-vegetarian food during the observance'
    ],
    fastingRulesHindi: [
      'तीन दिन का आंशिक उपवास रखें',
      'कुछ लोग मुख्य दिन पर निर्जल उपवास रखते हैं',
      'फल, दूध और सात्विक भोजन लें',
      'वट वृक्ष की पूजा पूरी करने के बाद उपवास तोड़ें',
      'अनुष्ठान के दौरान प्याज़, लहसुन और मांसाहार से बचें'
    ],
    significance: 'Vat Purnima celebrates the ideal of wifely devotion and love, as exemplified by Savitri\'s triumph over death itself through her determination and wisdom. The banyan tree symbolizes longevity, shelter, and eternal life - qualities that devotees pray for in their family life.',
    significanceHindi: 'वट पूर्णिमा पत्नी के समर्पण और प्रेम का उत्सव है, जैसा कि सावित्री की दृढ़ता और बुद्धिमत्ता से मृत्यु पर विजय द्वारा प्रदर्शित है। वट वृक्ष दीर्घायु, आश्रय और शाश्वत जीवन का प्रतीक है - गुण जिनके लिए भक्त अपने पारिवारिक जीवन में प्रार्थना करते हैं।',
    duration: '3 days',
    durationHindi: '३ दिन',
    colors: ['Green', 'Red', 'Yellow'],
  },

  // ============================================================================
  // GURU PURNIMA
  // ============================================================================
  {
    id: 'guru-purnima',
    name: 'Guru Purnima',
    nameHindi: 'गुरु पूर्णिमा',
    emoji: '📿',
    story: `Guru Purnima is dedicated to expressing gratitude and reverence toward spiritual and academic teachers (gurus). It falls on the full moon day (Purnima) in the month of Ashadha (June-July).

The festival has deep significance in multiple Indian traditions. For Hindus, it commemorates the day when Lord Shiva became the first guru (Adi Guru), transmitting the science of Yoga to the Saptarishis (seven great sages) from the banks of Lake Kantisarovar in the Himalayas.

In the Buddhist tradition, Guru Purnima marks the day when the Buddha delivered his first sermon at Sarnath after attaining enlightenment, setting the wheel of Dharma in motion.

For the Jain tradition, it marks the day when Lord Mahavira made Indrabhuti Gautama (Gautam Swami) his first disciple, thereby becoming a Guru himself.

The word "Guru" is traditionally interpreted as "Gu" (darkness) and "Ru" (light) - one who dispels darkness and brings light through knowledge and wisdom.`,
    storyHindi: `गुरु पूर्णिमा आध्यात्मिक और शैक्षणिक गुरुओं के प्रति कृतज्ञता और आदर व्यक्त करने के लिए समर्पित है। यह आषाढ़ मास (जून-जुलाई) की पूर्णिमा को आता है।

इस पर्व का कई भारतीय परंपराओं में गहरा महत्व है। हिंदुओं के लिए, यह उस दिन को चिह्नित करता है जब भगवान शिव पहले गुरु (आदि गुरु) बने, जब उन्होंने हिमालय के कांति सरोवर झील के तट से सप्तऋषियों को योग विज्ञान का ज्ञान दिया था।

बौद्ध परंपरा में, गुरु पूर्णिमा उस दिन को चिह्नित करती है जब बुद्ध ने ज्ञान प्राप्ति के बाद सारनाथ में अपना पहला उपदेश दिया था।

जैन परंपरा के लिए, यह उस दिन को चिह्नित करता है जब भगवान महावीर ने इंद्रभूति गौतम को अपना पहला शिष्य बनाया।

"गुरु" शब्द को पारंपरिक रूप से "गु" (अंधकार) और "रु" (प्रकाश) के रूप में समझा जाता है - जो ज्ञान और बुद्धिमत्ता से अंधकार को दूर करता है और प्रकाश लाता है।`,
    rituals: [
      'Perform Guru Puja and express gratitude to teachers',
      'Visit spiritual gurus or academic mentors and offer prasad',
      'Recite Guru Stotram and other devotional hymns',
      'Organize satsangs, discourses, and spiritual gatherings',
      'Begin new studies or spiritual practices under a guru\'s guidance',
      'Donate to educational institutions and gurukuls',
      'Meditate and reflect on the teachings received from gurus'
    ],
    ritualsHindi: [
      'गुरु पूजा करें और गुरुओं के प्रति कृतज्ञता व्यक्त करें',
      'आध्यात्मिक गुरुओं या शैक्षणिक मार्गदर्शकों से मिलें और प्रसाद अर्पित करें',
      'गुरु स्तोत्र और अन्य भक्ति स्तोत्रों का पाठ करें',
      'सत्संग, प्रवचन और आध्यात्मिक सभाओं का आयोजन करें',
      'गुरु के मार्गदर्शन में नई शिक्षा या आध्यात्मिक साधना शुरू करें',
      'शैक्षणिक संस्थानों और गुरुकुलों को दान करें',
      'ध्यान करें और गुरुओं से प्राप्त शिक्षाओं पर चिंतन करें'
    ],
    regionalVariations: [
      {
        region: 'Uttarakhand',
        regionHindi: 'उत्तराखंड',
        variation: 'Major celebrations in Rishikesh and Haridwar with large spiritual gatherings and yoga events.',
        variationHindi: 'ऋषिकेश और हरिद्वार में बड़े आध्यात्मिक आयोजन और योग कार्यक्रम।'
      },
      {
        region: 'Buddhist Communities',
        regionHindi: 'बौद्ध समुदाय',
        variation: 'Celebrated as Dhamma Chakra Pravartan Din - the day Buddha first taught the Dhamma.',
        variationHindi: 'धम्म चक्र प्रवर्तन दिन के रूप में मनाया जाता है - जिस दिन बुद्ध ने पहली बार धम्म सिखाया।'
      },
      {
        region: 'Academic Institutions',
        regionHindi: 'शैक्षणिक संस्थान',
        variation: 'Universities and schools honor teachers. Students organize cultural programs to thank educators.',
        variationHindi: 'विश्वविद्यालय और विद्यालय शिक्षकों का सम्मान करते हैं। छात्र शिक्षकों को धन्यवाद देने के लिए सांस्कृतिक कार्यक्रम आयोजित करते हैं।'
      }
    ],
    fastingRules: [
      'Some observe a partial fast dedicated to the guru',
      'Consume sattvic foods throughout the day',
      'No strict fasting requirements - emphasis is on devotion and gratitude rather than austerity',
      'Break fast after Guru Puja with prasad'
    ],
    fastingRulesHindi: [
      'कुछ लोग गुरु को समर्पित आंशिक उपवास रखते हैं',
      'पूरे दिन सात्विक भोजन लें',
      'कोई सख्त उपवास आवश्यकता नहीं - तपस्या के बजाय भक्ति और कृतज्ञता पर जोर',
      'गुरु पूजा के बाद प्रसाद से उपवास तोड़ें'
    ],
    significance: 'Guru Purnima celebrates the sacred teacher-student relationship that is central to Indian knowledge traditions. It acknowledges that all progress in life - material, intellectual, or spiritual - is possible only through the guidance of a teacher. The day reminds us to honor those who have illuminated our path with knowledge.',
    significanceHindi: 'गुरु पूर्णिमा गुरु-शिष्य के पवित्र संबंध का उत्सव है जो भारतीय ज्ञान परंपराओं का केंद्र है। यह स्वीकार करता है कि जीवन में सभी प्रगति - भौतिक, बौद्धिक या आध्यात्मिक - केवल गुरु के मार्गदर्शन से संभव है। यह दिन हमें उन्हें सम्मान देने की याद दिलाता है जिन्होंने हमारे मार्ग को ज्ञान से रोशन किया है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['White', 'Saffron', 'Yellow'],
  },

  // ============================================================================
  // SHARAD PURNIMA
  // ============================================================================
  {
    id: 'sharad-purnima',
    name: 'Sharad Purnima',
    nameHindi: 'शरद पूर्णिमा',
    emoji: '🌕',
    story: `Sharad Purnima, also known as Kojagari Purnima or Kaumudi Purnima, is celebrated on the full moon night of the month of Ashwin (September-October). It marks the end of the monsoon season and the beginning of autumn.

This night is believed to be the closest the moon comes to Earth in its orbit, making its rays particularly beneficial. According to Hindu belief, on this night, the moon showers nectar (amrit) from its rays, and anything kept in moonlight absorbs these healing properties.

The most beloved legend associated with Sharad Purnima is Krishna's Raas Leela with the gopis of Vrindavan. Enchanted by Krishna's flute on this autumn full moon night, the gopis left their homes and danced with him in the moonlit groves of Vrindavan, creating the divine dance of love (Raas).

In the Jain tradition, this is the day when Lord Mahavira attained enlightenment (Kevala Jnana). For Sikhs, it marks the day when the Guru Granth Sahib was first installed at the Golden Temple in Amritsar.`,
    storyHindi: `शरद पूर्णिमा, जिसे कोजागिरी पूर्णिमा या कौमुदी पूर्णिमा के नाम से भी जाना जाता है, आश्विन मास (सितंबर-अक्टूबर) की पूर्णिमा को मनाई जाती है। यह मानसून मौसम के अंत और शरद ऋतु की शुरुआत को चिह्नित करती है।

माना जाता है कि इस रात चंद्रमा अपनी कक्षा में पृथ्वी के सबसे करीब आता है, जिससे उसकी किरणें विशेष रूप से लाभदायक होती हैं। हिंदू मान्यता के अनुसार, इस रात चंद्रमा अपनी किरणों से अमृत वर्षा करता है, और चांदनी में रखी किसी भी चीज में ये चिकित्सीय गुण समा जाते हैं।

शरद पूर्णिमा से जुड़ी सबसे प्रिय कथा कृष्ण की वृंदावन की गोपियों के साथ रास लीला है। इस शरद पूर्णिमा की रात कृष्ण की बांसुरी से मंत्रमुग्ध होकर गोपियाँ अपने घरों से निकलीं और चांदनी वृंदावन की कुंजों में उनके साथ नृत्य किया, प्रेम का दिव्य नृत्य (रास) रचा।

जैन परंपरा में, यह वह दिन है जब भगवान महावीर ने केवल ज्ञान (सर्वोच्च ज्ञान) प्राप्त किया। सिखों के लिए, यह वह दिन है जब गुरु ग्रंथ साहिब को पहली बार अमृतसर के स्वर्ण मंदिर में स्थापित किया गया था।`,
    rituals: [
      'Prepare kheer (rice pudding) and keep it in moonlight overnight',
      'Consume the moonlit kheer the next morning as prasad with healing properties',
      'Perform Lakshmi Puja - it is believed Lakshmi roams the earth on this night',
      'Stay awake at night (jagaran) singing devotional songs',
      'Bathe in sacred rivers or take ritual baths',
      'Decorate homes with flowers and lights for the moonlit night',
      'Celebrate Krishna\'s Raas Leela with devotional music and dance'
    ],
    ritualsHindi: [
      'खीर (चावल की खीर) बनाएं और रात भर चांदनी में रखें',
      'अगली सुबह चिकित्सीय गुणों वाले प्रसाद के रूप में चांदनी खीर सेवन करें',
      'लक्ष्मी पूजा करें - माना जाता है कि इस रात लक्ष्मी धरती पर घूमती हैं',
      'रात भर जागृत रहें और भक्ति गीत गाएं',
      'पवित्र नदियों में स्नान करें या शास्त्रोक्त स्नान करें',
      'चांदनी रात के लिए घरों को फूलों और रोशनी से सजाएं',
      'कृष्ण की रास लीला को भक्ति संगीत और नृत्य के साथ मनाएं'
    ],
    regionalVariations: [
      {
        region: 'Bengal & Odisha',
        regionHindi: 'बंगाल और ओडिशा',
        variation: 'Celebrated as Kojagari Purnima. Elaborate Lakshmi Puja with night-long vigils.',
        variationHindi: 'कोजागिरी पूर्णिमा के रूप में मनाया जाता है। रात भर जागरण के साथ विस्तृत लक्ष्मी पूजा।'
      },
      {
        region: 'Vrindavan & Mathura',
        regionHindi: 'वृंदावन और मथुरा',
        variation: 'Raas Leela celebrations with dramatic performances of Krishna and the gopis\' divine dance.',
        variationHindi: 'कृष्ण और गोपियों के दिव्य नृत्य के नाट्य प्रदर्शनों के साथ रास लीला उत्सव।'
      },
      {
        region: 'Gujarat',
        regionHindi: 'गुजरात',
        variation: 'Celebrated with Garba dancing under the moonlight. Community gatherings and festive foods.',
        variationHindi: 'चांदनी में गरबा नृत्य के साथ मनाया जाता है। सामुदायिक मिलन और उत्सव भोज।'
      }
    ],
    fastingRules: [
      'Some observe a fast during the day until moonrise',
      'Prepare kheer as the primary prasad food',
      'Consume light, sattvic foods during the day',
      'Break fast after moonrise and moon puja',
      'The moonlit kheer is consumed the next morning as medicinal prasad'
    ],
    fastingRulesHindi: [
      'कुछ लोग दिन में चंद्रोदय तक उपवास रखते हैं',
      'खीर को मुख्य प्रसाद के रूप में तैयार करें',
      'दिन में हल्का सात्विक भोजन लें',
      'चंद्रोदय और चंद्रमा पूजा के बाद उपवास तोड़ें',
      'चांदनी खीर अगली सुबह औषधीय प्रसाद के रूप से सेवन की जाती है'
    ],
    significance: 'Sharad Purnima celebrates the beauty of the autumn full moon and its healing properties. The moonlight on this night is considered a source of nectar that nourishes body, mind, and soul. It is a night of spiritual awakening, gratitude, and divine love.',
    significanceHindi: 'शरद पूर्णिमा शरद ऋतु की पूर्णिमा की सुंदरता और उसके चिकित्सीय गुणों का उत्सव है। इस रात की चांदनी को अमृत का स्रोत माना जाता है जो शरीर, मन और आत्मा का पोषण करती है। यह आध्यात्मिक जागृति, कृतज्ञता और दिव्य प्रेम की रात है।',
    duration: '1 night',
    durationHindi: '१ रात्रि',
    colors: ['Silver', 'White', 'Light Blue'],
  },

  // ============================================================================
  // DHANTERAS
  // ============================================================================
  {
    id: 'dhanteras',
    name: 'Dhanteras',
    nameHindi: 'धनतेरस',
    emoji: '🪙',
    story: `Dhanteras (also called Dhanatrayodashi) marks the first day of the five-day Diwali festival, falling on the thirteenth day (Trayodashi) of Krishna Paksha in the month of Kartika. The word "Dhan" means wealth and "Teras" refers to the thirteenth day.

The most popular legend tells of King Hima, whose son was predicted to die from a snake bite on the fourth day of his marriage. His clever wife arranged a pile of gold coins, silver ornaments, and lit lamps at the entrance of their chamber. She sang songs and told stories to keep her husband awake.

When Yama (the god of death) arrived in the form of a snake, the blinded by the brilliant light of the lamps and the sparkle of the gold, he could not enter. Instead, he sat outside listening to her melodious songs and stories. Eventually, he departed without taking the prince's life. Thus, Dhanteras became associated with lamps, wealth, and protection from untimely death.

Another tradition associates this day with the emergence of Lord Dhanvantari - the father of Ayurveda - who arose from the cosmic ocean during the Samudra Manthan (churning of the ocean) carrying a pot of the nectar of immortality (amrita).`,
    storyHindi: `धनतेरस (जिसे धनत्रयोदशी भी कहा जाता है) पाँच दिवसीय दीपावलि उत्सव के पहले दिन को चिह्नित करता है, जो कार्तिक मास के कृष्ण पक्ष की तेरहवीं (त्रयोदशी) को आता है। "धन" का अर्थ है धन-संपत्ति और "तेरस" तेरहवें दिन को संदर्भित करता है।

सबसे लोकप्रिय कथा राजा हिम की है, जिनके पुत्र की विवाह के चौथे दिन सर्प दंश से मृत्यु की भविष्यवाणी की गई थी। उनकी चतुर पत्नी ने अपने कक्ष के प्रवेश द्वार पर सोने के सिक्कों, चांदी के गहनों के ढेर और दीपक जलाए। उन्होंने अपने पति को जागृत रखने के लिए गीत गाए और कहानियाँ सुनाईं।

जब यम (मृत्यु के देवता) सर्प के रूप में आए, तो दीपकों की चमकदार रोशनी और सोने की चमक से अंधे होकर वे प्रवेश नहीं कर सके। इसके बजाय, वे बाहर बैठकर उनकी मधुर कथाएं और कहानियाँ सुनते रहे। अंततः, वे राजकुमार का जीवन लिए बिना चले गए। इस प्रकार, धनतेरस दीपकों, धन और अकाल मृत्यु से सुरक्षा से जुड़ा हो गया।

एक अन्य परंपरा इस दिन को भगवान धन्वंतरि के उद्भव से जोड़ती है - आयुर्वेद के पिता - जो समुद्र मंथन के दौरान अमृत कलश के साथ ब्रह्मांडीय महासागर से प्रकट हुए।`,
    rituals: [
      'Perform Lakshmi and Dhanvantari Puja in the evening',
      'Buy gold, silver, or utensils (considered highly auspicious)',
      'Clean and decorate homes for the upcoming Diwali',
      'Light oil lamps (diyas) at the entrance facing south',
      'Prepare rangoli with footprints of Lakshmi',
      'Worship cow and calf (Gau Mata puja)',
      'Keep lamps lit throughout the night (Akhand Deep)'
    ],
    ritualsHindi: [
      'सांयकाल लक्ष्मी और धन्वंतरि पूजा करें',
      'सोना, चांदी या बर्तन खरीदें (अत्यंत शुभ माना जाता है)',
      'आगामी दीपावली के लिए घरों को साफ और सजाएं',
      'दक्षिण दिशा की ओर मुख करके प्रवेश द्वार पर तेल के दीपक जलाएं',
      'लक्ष्मी के चरण चिह्नों के साथ रंगोली बनाएं',
      'गाय और बछड़े की पूजा करें (गौ माता पूजा)',
      'पूरी रात दीपक जलाए रखें (अखंड दीप)'
    ],
    regionalVariations: [
      {
        region: 'West India',
        regionHindi: 'पश्चिम भारत',
        variation: 'Major shopping and gold-buying day. Jewelers and merchants offer special promotions.',
        variationHindi: 'प्रमुख खरीदारी और सोना खरीदने का दिन। ज्वेलर्स और व्यापारी विशेष प्रमोशन देते हैं।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Celebrated as Dhanvantari Jayanti - the birthday of the god of Ayurveda. Ayurvedic practitioners perform special pujas.',
        variationHindi: 'धन्वंतरि जयंती - आयुर्वेद के देवता का जन्मदिन। आयुर्वेदिक चिकित्सक विशेष पूजा करते हैं।'
      },
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Elaborate Lakshmi Puja. Shopping for Diwali begins with purchasing gold and silver on this day.',
        variationHindi: 'विस्तृत लक्ष्मी पूजा। इस दिन सोना और चांदी खरीदकर दीपावली की खरीदारी शुरू होती है।'
      }
    ],
    fastingRules: [
      'Some observe a partial fast until evening puja',
      'Consume light meals during the day',
      'Avoid tamasic foods (onion, garlic, non-vegetarian)',
      'Break fast after Lakshmi Puja with prasad'
    ],
    fastingRulesHindi: [
      'कुछ लोग सांयकाल पूजा तक आंशिक उपवास रखते हैं',
      'दिन में हल्का भोजन लें',
      'तामसिक भोजन (प्याज़, लहसुन, मांसाहार) से बचें',
      'लक्ष्मी पूजा के बाद प्रसाद से उपवास तोड़ें'
    ],
    significance: 'Dhanteras inaugurates the five-day Diwali celebration with prayers for wealth, health, and prosperity. It honors both material abundance (through Lakshmi) and health (through Dhanvantari), recognizing that true wealth encompasses both physical well-being and material comfort.',
    significanceHindi: 'धनतेरस पाँच दिवसीय दीपावली उत्सव की शुरुआत धन, स्वास्थ्य और समृद्धि की प्रार्थना के साथ करता है। यह भौतिक समृद्धि (लक्ष्मी के माध्यम से) और स्वास्थ्य (धन्वंतरि के माध्यम से) दोनों का सम्मान करता है, यह मानते हुए कि सच्चा धन शारीरिक कल्याण और भौतिक सुख दोनों को समाहित करता है।',
    duration: '1 day (first day of 5-day Diwali)',
    durationHindi: '१ दिन (५ दिवसीय दीपावली का पहला दिन)',
    colors: ['Gold', 'Yellow', 'Red'],
  },

  // ============================================================================
  // BHAI DOOJ
  // ============================================================================
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    nameHindi: 'भाई दूज',
    emoji: '🤝',
    story: `Bhai Dooj (also known as Bhau Beej, Bhai Phota, or Bhai Tika) is celebrated on the second day (Dwitiya) of the bright fortnight (Shukla Paksha) in the month of Kartika, two days after Diwali. It honors the sacred bond between brothers and sisters.

The most popular legend relates to Lord Krishna and his sister Subhadra. After Krishna killed the demon Narakasura, he visited his sister Subhadra who welcomed him with a tilak on his forehead and performed an aarti. This tradition continues as the core ritual of Bhai Dooj.

Another legend tells of Yama, the god of death, visiting his sister Yamuna on this day. Yamuna welcomed her brother with a tilak, sweets, and a garland of flowers. Pleased by her hospitality, Yama declared that any brother who receives a tilak from his sister on this day will never face an untimely death.

Unlike Raksha Bandhan which falls in the month of Shravana (August), Bhai Dooj falls right after Diwali, making it the second celebration of sibling love in the Hindu calendar.`,
    storyHindi: `भाई दूज (जिसे भाऊ बीज, भाई फोटा या भाई टीका भी कहा जाता है) कार्तिक मास के शुक्ल पक्ष की दूसरी (द्वितीया) को दीपावली के दो दिन बाद मनाया जाता है। यह भाई-बहन के पवित्र बंधन का सम्मान करता है।

सबसे लोकप्रिय कथा भगवान कृष्ण और उनकी बहन सुभद्रा से जुड़ी है। कृष्ण द्वारा असुर नरकासुर का वध करने के बाद, वे अपनी बहन सुभद्रा से मिलने गए जिन्होंने उनके माथे पर तिलक लगाकर स्वागत किया और आरती की। यह परंपरा भाई दूज के मुख्य अनुष्ठान के रूप में जारी है।

एक अन्य कथा यम, मृत्यु के देवता, की अपनी बहन यमुना से मिलने से जुड़ी है। यमुना ने अपने भाई का तिलक, मिठाई और फूलों की माला के साथ स्वागत किया। उनके आतिथ्य से प्रसन्न होकर यम ने घोषणा की कि जो भाई इस दिन अपनी बहन से तिलक प्राप्त करता है उसे कभी अकाल मृत्यु का सामना नहीं करना पड़ेगा।

रक्षाबंधन के विपरीत जो श्रावण मास (अगस्त) में आता है, भाई दूज दीपावली के ठीक बाद आता है, जिससे यह हिंदू पंचांग में भाई-बहन प्रेम का दूसरा उत्सव है।`,
    rituals: [
      'Sisters apply tilak on brothers\' foreheads',
      'Perform aarti for brothers\' protection and well-being',
      'Brothers visit their sisters\' homes and bring gifts',
      'Sisters prepare special meals and favorite dishes for brothers',
      'Exchange of gifts and blessings between siblings',
      'Feed brother with own hands (traditional sweets)',
      'Brothers pledge to protect and support their sisters'
    ],
    ritualsHindi: [
      'बहनें भाइयों के माथे पर तिलक लगाती हैं',
      'भाइयों की रक्षा और भलाई के लिए आरती करें',
      'भाई बहनों के घर जाएं और उपहार लाएं',
      'बहनें भाइयों के लिए विशेष भोजन और पसंदीदा व्यंजन तैयार करें',
      'भाई-बहन के बीच उपहार और आशीर्वाद का आदान-प्रदान',
      'भाई को हाथों से मिठाई खिलाएं',
      'भाई बहनों की रक्षा और सहयोग का वचन देते हैं'
    ],
    regionalVariations: [
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Known as Bhau Beej. Sisters apply a tilak made of coconut ash and vermilion on brother\'s forehead.',
        variationHindi: 'भाऊ बीज के नाम से जाना जाता है। बहनें भाई के माथे पर नारियल की राख और सिंदूर का तिलक लगाती हैं।'
      },
      {
        region: 'West Bengal',
        regionHindi: 'पश्चिम बंगाल',
        variation: 'Known as Bhai Phota. Elaborate ceremony with multiple items for tilak, aarti, and traditional sweets.',
        variationHindi: 'भाई फोटा के नाम से जाना जाता है। तिलक, आरती और पारंपरिक मिठाइयों के साथ विस्तृत समारोह।'
      },
      {
        region: 'Nepal',
        regionHindi: 'नेपाल',
        variation: 'Known as Bhai Tika - the most elaborate form with seven-color tika and garlands of makhamali flowers.',
        variationHindi: 'भाई टीका - सात रंग की टीका और मखमली फूलों की मालाओं के साथ सबसे विस्तृत रूप।'
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Celebrated as Yama Dwitiya. Sisters invite brothers to their homes and prepare elaborate meals.',
        variationHindi: 'यम द्वितीया के रूप में मनाया जाता है। बहनें भाइयों को अपने घर आमंत्रित करती हैं और विस्तृत भोज तैयार करती हैं।'
      }
    ],
    fastingRules: [
      'Sisters may observe a partial fast until the tilak ceremony is complete',
      'No strict fasting requirements',
      'Consume light, sattvic foods during the day',
      'Break fast after performing the tilak and aarti for brother',
      'Traditional sweets like puran poli and modak are prepared'
    ],
    fastingRulesHindi: [
      'बहनें तिलक समारोह पूरा होने तक आंशिक उपवास रख सकती हैं',
      'कोई सख्त उपवास आवश्यकता नहीं',
      'दिन में हल्का सात्विक भोजन लें',
      'भाई के लिए तिलक और आरती करने के बाद उपवास तोड़ें',
      'पुरण पोली और मोदक जैसी पारंपरिक मिठाइयाँ बनाई जाती हैं'
    ],
    significance: 'Bhai Dooj celebrates the unique bond between brothers and sisters, complementing Raksha Bandhan as the second sibling celebration in the Hindu calendar. It reinforces family bonds and the mutual responsibility and love that siblings share throughout their lives.',
    significanceHindi: 'भाई दूज भाई-बहन के बीच अनूठे बंधन का उत्सव है, जो हिंदू पंचांग में दूसरे भाई-बहन उत्सव के रूप में रक्षाबंधन का पूरक है। यह पारिवारिक बंधनों और भाई-बहन के बीच आपसी जिम्मेदारी और प्रेम को मजबूत करता है जो वे अपने पूरे जीवन में साझा करते हैं।',
    duration: '1 day (last day of 5-day Diwali)',
    durationHindi: '१ दिन (५ दिवसीय दीपावली का आखिरी दिन)',
    colors: ['Gold', 'Yellow', 'Red', 'Green'],
  },

  // ============================================================================
  // GUDI PADWA
  // ============================================================================
  {
    id: 'gudi-padwa',
    name: 'Gudi Padwa',
    nameHindi: 'गुड़ी पाडवा',
    emoji: '🚩',
    story: `Gudi Padwa marks the beginning of the new year according to the Hindu lunisolar calendar and is the first day of the month of Chaitra (March-April). It is celebrated primarily in Maharashtra and Goa as the Marathi New Year.

The festival has both astronomical and mythological significance. It is believed to be the day when Lord Brahma created the universe and established the concepts of time, days, weeks, months, and years. It marks the arrival of spring and the rabi harvest.

Historically, Gudi Padwa is associated with the victories of the great Maratha warrior king Chhatrapati Shivaji Maharaj. The Maratha army would return victorious around this time, and the Gudi (flag) would be raised in celebration.

Another legend says that this is the day when Rama returned to Ayodhya after 14 years of exile and his victory over Ravana, and was crowned as king.`,
    storyHindi: `गुड़ी पाडवा हिंदू चंद्र-सौर कैलेंडर के अनुसार नए वर्ष की शुरुआत को चिह्नित करता है और चैत्र मास (मार्च-अप्रैल) का पहला दिन है। यह मुख्य रूप से महाराष्ट्र और गोवा में मराठी नव वर्ष के रूप में मनाया जाता है।

इस पर्व का खगोलीय और पौराणिक दोनों महत्व है। माना जाता है कि इसी दिन भगवान ब्रह्मा ने ब्रह्मांड की रचना की और समय, दिन, सप्ताह, महीने और वर्ष की अवधारणाएं स्थापित कीं। यह वसंत ऋतु और रबी फसल के आगमन को चिह्नित करता है।

ऐतिहासिक रूप से, गुड़ी पाडवा महान मराठा योद्धा राजा छत्रपति शिवाजी महाराज की विजयों से जुड़ा है। मराठा सेना इस समय के आसपास विजयी होकर लौटती थी और गुड़ी (ध्वज) उत्सव के रूप में फहराया जाता था।

एक अन्य कथा कहती है कि यह वह दिन है जब राम 14 वर्षों के वनवास और रावण पर विजय के बाद अयोध्या लौटे थे और उन्हें राजा के रूप में राज्याभिषेक किया गया था।`,
    rituals: [
      'Raise the Gudi - a bright cloth tied to a bamboo pole with neem leaves, sugar crystals, and a kalash',
      'Perform puja to the Gudi at the entrance of homes',
      'Clean and decorate homes for the new year',
      'Prepare special festive foods: shrikhand, puran poli, and chana',
      'Wear new clothes and visit family and friends',
      'Make New Year resolutions and set intentions',
      'Buy gold, silver, or new items (considered auspicious for the new year)'
    ],
    ritualsHindi: [
      'गुड़ी फहराएं - नीम की पत्तियों, चीनी के क्रिस्टल और कलश के साथ बांस की डंडी पर चमकीला कपड़ा',
      'घर के प्रवेश द्वार पर गुड़ी की पूजा करें',
      'नए वर्ष के लिए घरों को साफ और सजाएं',
      'विशेष उत्सव भोजन तैयार करें: श्रीखंड, पुरण पोली और चना',
      'नए वस्त्र धारण करें और परिवार व मित्रों से मिलें',
      'नए वर्ष के संकल्प लें और इरादे तय करें',
      'सोना, चांदी या नई वस्तुएं खरीदें (नए वर्ष के लिए शुभ माना जाता है)'
    ],
    regionalVariations: [
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Most elaborate celebrations. Gudi raising at home entrances, community celebrations, and traditional foods.',
        variationHindi: 'सबसे भव्य उत्सव। घर के प्रवेश द्वार पर गुड़ी फहराना, सामुदायिक उत्सव और पारंपरिक भोजन।'
      },
      {
        region: 'Andhra Pradesh & Telangana',
        regionHindi: 'आंध्र प्रदेश और तेलंगाना',
        variation: 'Celebrated as Ugadi with pachadi (a mixture of six tastes representing life\'s experiences).',
        variationHindi: 'उगादी के रूप में मनाया जाता है - पचड़ी (जीवन के अनुभवों का प्रतिनिधित्व करने वाले छह स्वादों का मिश्रण) के साथ।'
      },
      {
        region: 'Karnataka',
        regionHindi: 'कर्नाटक',
        variation: 'Celebrated as Ugadi with similar traditions. Reading of the Panchangam (almanac) for the year ahead.',
        variationHindi: 'उगादी के रूप में समान परंपराओं के साथ मनाया जाता है। आगामी वर्ष के लिए पंचांगम (पंचांग) का पाठ।'
      },
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Celebrated as Chaitra Navratri begins. Marking of the beginning of the new year in many regions.',
        variationHindi: 'चैत्र नवरात्रि शुरू होने के रूप में मनाया जाता है। कई क्षेत्रों में नए वर्ष की शुरुआत को चिह्नित करता है।'
      }
    ],
    fastingRules: [
      'No specific fasting requirements - it is primarily a celebration',
      'Consume festive and celebratory foods',
      'Some families eat a mixture of neem leaves and jaggery symbolizing acceptance of both bitter and sweet experiences',
      'Traditional prasad includes shrikhand, puran poli, and fruits'
    ],
    fastingRulesHindi: [
      'कोई विशेष उपवास आवश्यकता नहीं - यह मुख्य रूप से उत्सव है',
      'उत्सव भोजन लें',
      'कुछ परिवार नीम की पत्तियों और गुड़ का मिश्रण खाते हैं जो कड़वे और मीठे अनुभवों दोनों की स्वीकृति का प्रतीक है',
      'पारंपरिक प्रसाद में श्रीखंड, पुरण पोली और फल शामिल हैं'
    ],
    significance: 'Gudi Padwa celebrates new beginnings, renewal, and the cyclical nature of time. It is a day of hope, fresh starts, and setting positive intentions for the year ahead. The Gudi symbolizes victory, prosperity, and the invitation to good fortune.',
    significanceHindi: 'गुड़ी पाडवा नई शुरुआत, नवीनीकरण और समय की चक्रीय प्रकृति का उत्सव है। यह आशा, ताज़ा शुरुआत और आगामी वर्ष के लिए सकारात्मक इरादे तय करने का दिन है। गुड़ी विजय, समृद्धि और अच्छे भाग्य का निमंत्रण का प्रतीक है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Green', 'Yellow', 'Red', 'Gold'],
  },

  // ============================================================================
  // ONAM
  // ============================================================================
  {
    id: 'onam',
    name: 'Onam',
    nameHindi: 'ओणम',
    emoji: '🌺',
    story: `Onam is the grand harvest festival of Kerala, celebrated over ten days in the month of Chingam (August-September). It is one of the most important festivals in Kerala and is celebrated by people of all religions and communities.

The festival celebrates the homecoming of the legendary King Mahabali, a beloved and righteous ruler. According to legend, Mahabali was an Asura king whose reign was marked by unprecedented prosperity, equality, and happiness. His kingdom had no crime, poverty, or discrimination - everyone was treated equally.

The gods, feeling threatened by his growing power and popularity, approached Lord Vishnu. Vishnu took the form of Vamana, a dwarf Brahmin boy, and approached Mahabali during a sacrifice. When asked for a boon, Vamana requested three paces of land. Mahabali agreed, and Vamana grew to cosmic size, covering the earth and heavens in two steps. For the third step, Mahabali offered his own head.

Impressed by Mahabali\'s devotion and righteousness, Vishnu granted him the boon of visiting his beloved subjects once a year. Onam celebrates this annual homecoming of the beloved king.`,
    storyHindi: `ओणम केरल का भव्य फसल उत्सव है, जो चिंगम मास (अगस्त-सितंबर) में दस दिनों तक मनाया जाता है। यह केरल के सबसे महत्वपूर्ण पर्वों में से एक है और सभी धर्मों और समुदायों के लोग इसे मनाते हैं।

यह पर्व महान राजा महाबलि के गृह आगमन का उत्सव है, एक प्रिय और धर्मी शासक। कथाओं के अनुसार, महाबलि एक असुर राजा थे जिनका शासन अभूतपूर्व समृद्धि, समानता और खुशी से चिह्नित था। उनके राज्य में कोई अपराध, गरीबी या भेदभाव नहीं था - सभी के साथ समान व्यवहार किया जाता था।

देवता, उनकी बढ़ती शक्ति और लोकप्रियता से खतरे में महसूस करते हुए, भगवान विष्णु के पास गए। विष्णु ने वामन, एक बालक ब्राह्मण का रूप लिया, और यज्ञ के दौरान महाबलि के पास गए। जब एक वरदान मांगा गया, तो वामन ने तीन कदम जमीन मांगी। महाबलि सहमत हुए, और वामन विशालकाय हो गए, दो कदमों में पृथ्वी और स्वर्ग को कवर कर लिया। तीसरे कदम के लिए, महाबलि ने अपना सिर अर्पित किया।

महाबलि की भक्ति और धार्मिकता से प्रभावित होकर, विष्णु ने उन्हें एक बार साल में अपने प्रिय विषयों से मिलने का वरदान दिया। ओणम प्रिय राजा की इस वार्षिक गृह वापसी का उत्सव है।`,
    rituals: [
      'Create elaborate flower carpets (Pookalam) at home entrances',
      'Prepare the grand Onam feast (Onasadya) served on banana leaves',
      'Participate in or watch Vallam Kali (snake boat races)',
      'Perform Pulikali (tiger dance) and other folk arts',
      'Play traditional games like tug-of-war, ball games, and archery',
      'Visit temples and participate in cultural programs',
      'Wear traditional Kerala attire (Kasavu sarees and mundus)'
    ],
    ritualsHindi: [
      'घर के प्रवेश द्वार पर विस्तृत फूल कालीन (पूक्कलम) बनाएं',
      'केले के पत्तों पर परोसी जाने वाली भव्य ओणम दावत (ओणसद्य) तैयार करें',
      'वल्लम कली (सांप नाव दौड़) में भाग लें या देखें',
      'पुलिकली (बाघ नृत्य) और अन्य लोक कलाओं का प्रदर्शन करें',
      'रस्साकशी, गेंद खेल और तीरंदाजी जैसे पारंपरिक खेल खेलें',
      'मंदिर जाएं और सांस्कृतिक कार्यक्रमों में भाग लें',
      'केरल की पारंपरिक पोशाक (कसव साड़ियां और मुंडू) पहनें'
    ],
    regionalVariations: [
      {
        region: 'Kerala',
        regionHindi: 'केरल',
        variation: 'Most elaborate celebrations statewide. Aranmula boat race, Pulikali in Thrissur, and massive Onasadya feasts.',
        variationHindi: 'पूरे राज्य में सबसे भव्य उत्सव। अरणमुला नाव दौड़, त्रिश्शूर में पुलिकली, और विशाल ओणसद्य दावत।'
      },
      {
        region: 'Tamil Nadu (Kanyakumari)',
        regionHindi: 'तमिल नाडु (कन्याकुमारी)',
        variation: 'Significant celebrations in the border district of Kanyakumari with Kerala-style festivities.',
        variationHindi: 'कन्याकुमारी के सीमांत जिले में केरल शैली के उत्सव के साथ महत्वपूर्ण उत्सव।'
      },
      {
        region: 'Kerala Diaspora',
        regionHindi: 'केरल प्रवासी',
        variation: 'Celebrated worldwide by Malayali communities. Cultural events and community Onasadya feasts.',
        variationHindi: 'मलयाली समुदायों द्वारा दुनिया भर में मनाया जाता है। सांस्कृतिक कार्यक्रम और सामुदायिक ओणसद्य दावत।'
      }
    ],
    fastingRules: [
      'No fasting - Onam is a celebration of abundance and feasting',
      'The Onasadya feast traditionally includes 13-15 different dishes',
      'Vegetarian feast served on banana leaves with multiple curries, avial, sambar, rasam, payasam',
      'No restrictions on food - the emphasis is on sharing and celebrating abundance'
    ],
    fastingRulesHindi: [
      'कोई उपवास नहीं - ओणम प्रचुरता और दावत का उत्सव है',
      'ओणसद्य दावत में परंपरागत रूप से 13-15 अलग-अलग व्यंजन शामिल होते हैं',
      'केले के पत्तों पर परोसा जाने वाला शाकाहारी भोज जिसमें कई करी, अवियल, सांबर, रसम, पयसम शामिल हैं',
      'भोजन पर कोई प्रतिबंध नहीं - जोर साझा करने और प्रचुरता का उत्सव मनाने पर है'
    ],
    significance: 'Onam celebrates the egalitarian ideals of King Mahabali\'s reign - a golden age of equality, prosperity, and justice. It is a secular festival that transcends religious boundaries, celebrating the cultural heritage of Kerala. The festival also marks the harvest season and expresses gratitude for nature\'s bounty.',
    significanceHindi: 'ओणम राजा महाबलि के शासन के समानता आदर्शों का उत्सव है - समानता, समृद्धि और न्याय का स्वर्ण युग। यह एक धर्मनिरपेक्ष पर्व है जो धार्मिक सीमाओं से परे है, केरल की सांस्कृतिक विरासत का उत्सव है। यह पर्व फसल मौसम को भी चिह्नित करता है और प्रकृति की समृद्धि के लिए कृतज्ञता व्यक्त करता है।',
    duration: '10 days',
    durationHindi: '१० दिन',
    colors: ['White', 'Gold', 'Green', 'Orange'],
  },

  // ============================================================================
  // VISHU
  // ============================================================================
  {
    id: 'vishu',
    name: 'Vishu',
    nameHindi: 'विषु',
    emoji: '🌼',
    story: `Vishu is the astronomical new year celebrated in Kerala, falling in the month of Medam (April). It marks the sun\'s entry into the zodiac sign of Mesha (Aries), making it one of the few Hindu festivals tied to a precise astronomical event.

The festival is associated with Lord Krishna. According to legend, after the demon Narakasura was defeated, the people of Dwarka were left with depleted resources. Krishna\'s wife Satyabhama found the Syamantaka gem and restored prosperity. Vishu celebrates the restoration of prosperity and the beginning of a new cycle.

The most significant ritual of Vishu is the Vishu Kani - the "first sight" on the morning of the new year. A special arrangement is prepared the night before, consisting of rice, golden cucumber, coconut, banana, jackfruit, a mirror (vallkannadi), holy texts, and the Konna tree flowers (golden-yellow Cassia fistula). Family members are blindfolded and led to this arrangement, and the first thing they see on Vishu morning is this auspicious display.`,
    storyHindi: `विषु केरल में मनाया जाने वाला खगोलीय नव वर्ष है, जो मेडम मास (अप्रैल) में आता है। यह सूर्य के मेष राशि में प्रवेश को चिह्नित करता है, जिससे यह कुछ हिंदू पर्वों में से एक है जो एक सटीक खगोलीय घटना से जुड़ा है।

यह पर्व भगवान कृष्ण से जुड़ा है। कथाओं के अनुसार, असुर नरकासुर की हार के बाद, द्वारका के लोग संसाधनों की कमी से जूझ रहे थे। कृष्ण की पत्नी सत्यभामा को स्यमंतक मणि मिला और उन्होंने समृद्धि बहाल की। विषु समृद्धि की बहाली और एक नए चक्र की शुरुआत का उत्सव है।

विषु का सबसे महत्वपूर्ण अनुष्ठान विषु कनी है - नए वर्ष की सुबह की "पहली दृष्टि"। रात भर पहले एक विशेष व्यवस्था तैयार की जाती है, जिसमें चावल, सोने का ककड़ी, नारियल, केला, कटहल, दर्पण (वल्लकन्नाडी), पवित्र ग्रंथ और कन्ना के फूल (सुनहरे-पीले कैसिया फिस्टुला) शामिल हैं। परिवार के सदस्यों की आंखें बांधकर इस व्यवस्था के पास लाया जाता है, और विषु की सुबह जो पहली चीज वे देखते हैं वह यह शुभ प्रदर्शन है।`,
    rituals: [
      'Prepare Vishu Kani the night before - auspicious display for first sight',
      'View Vishu Kani first thing on Vishu morning (eyes closed, led to the arrangement)',
      'Give Vishukkaineetam (money/gifts given by elders to younger family members)',
      'Wear new clothes (Kasavu attire) and visit temples',
      'Prepare Vishu Sadya (grand feast) with traditional Kerala dishes',
      'Light fireworks and firecrackers (traditional celebration)',
      'Perform Vishu Phala (reading the year\'s predictions from the Panchangam)'
    ],
    ritualsHindi: [
      'रात भर पहले विषु कनी तैयार करें - पहली दृष्टि के लिए शुभ प्रदर्शन',
      'विषु सुबह सबसे पहले विषु कनी देखें (आंखें बंद करके, व्यवस्था के पास ले जाएं)',
      'विशुक्कैनेतम दें (बड़े परिवार के सदस्यों द्वारा छोटे सदस्यों को धन/उपहार)',
      'नए वस्त्र धारण करें (कसव परिधान) और मंदिर जाएं',
      'विषु सद्य (भव्य भोज) पारंपरिक केरल व्यंजनों के साथ तैयार करें',
      'पटाखे जलाएं (पारंपरिक उत्सव)',
      'विषु फल (पंचांगम से वर्ष की भविष्यवाणियां पढ़ना) करें'
    ],
    regionalVariations: [
      {
        region: 'Kerala',
        regionHindi: 'केरल',
        variation: 'Most elaborate celebrations across the state. Temple festivities, community Vishu Kani displays, and grand feasts.',
        variationHindi: 'पूरे राज्य में सबसे भव्य उत्सव। मंदिर उत्सव, सामुदायिक विषु कनी प्रदर्शन, और भव्य दावत।'
      },
      {
        region: 'Tulu Nadu (Karnataka)',
        regionHindi: 'तुलु नाडु (कर्नाटक)',
        variation: 'Celebrated by Tuluva communities with similar customs and Vishu Kani arrangements.',
        variationHindi: 'समान रीति-रिवाजों और विषु कनी व्यवस्थाओं के साथ तुलवा समुदायों द्वारा मनाया जाता है।'
      },
      {
        region: 'Kerala Diaspora',
        regionHindi: 'केरल प्रवासी',
        variation: 'Celebrated by Malayali communities worldwide with cultural events and community gatherings.',
        variationHindi: 'मलयाली समुदायों द्वारा दुनिया भर में सांस्कृतिक कार्यक्रमों और सामुदायिक मिलन के साथ मनाया जाता है।'
      }
    ],
    fastingRules: [
      'No fasting - Vishu is a celebration of abundance',
      'Consume traditional Kerala feast (Vishu Sadya) with multiple dishes',
      'The feast typically includes avial, sambar, rasam, olan, and payasam',
      'No restrictions on food - emphasis is on celebrating the new year with joy and plenty'
    ],
    fastingRulesHindi: [
      'कोई उपवास नहीं - विषु प्रचुरता का उत्सव है',
      'कई व्यंजनों के साथ पारंपरिक केरल दावत (विषु सद्य) लें',
      'दावत में आमतौर पर अवियल, सांबर, रसम, ओलान और पयसम शामिल हैं',
      'भोजन पर कोई प्रतिबंध नहीं - जोर खुशी और प्रचुरता के साथ नए वर्ष का उत्सव मनाने पर है'
    ],
    significance: 'Vishu celebrates the astronomical new year and the promise of prosperity. The Vishu Kani ritual ensures that the first sight of the year is auspicious, filled with symbols of abundance, knowledge, and divine blessings. It is a day of hope, new beginnings, and gratitude.',
    significanceHindi: 'विषु खगोलीय नव वर्ष और समृद्धि के वादे का उत्सव है। विषु कनी अनुष्ठान सुनिश्चित करता है कि वर्ष की पहली दृष्टि शुभ हो, प्रचुरता, ज्ञान और दिव्य आशीर्वाद के प्रतीकों से भरी हो। यह आशा, नई शुरुआत और कृतज्ञता का दिन है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Gold', 'Yellow', 'White', 'Green'],
  },

  // ============================================================================
  // CHHATH PUJA
  // ============================================================================
  {
    id: 'chhath-puja',
    name: 'Chhath Puja',
    nameHindi: 'छठ पूजा',
    emoji: '🌅',
    story: `Chhath Puja is an ancient festival dedicated to Surya, the Sun God, and Chhathi Maiya, the goddess of the festival. It is one of the oldest living traditions of sun worship, observed with remarkable discipline and devotion.

According to legend, Draupadi and the Pandavas observed this fast to regain their lost kingdom, and Karna — himself born of Surya — is said to have stood in river waters offering prayers to the rising sun. Devotees offer arghya (water offerings) to the setting sun and then to the rising sun, honouring the life-giving energy that sustains all creation.`,
    storyHindi: `छठ पूजा सूर्य देव और छठी मैया को समर्पित एक प्राचीन पर्व है। यह सूर्य उपासना की सबसे पुरानी जीवित परंपराओं में से एक है, जिसे अत्यंत अनुशासन और भक्ति के साथ मनाया जाता है।

कथाओं के अनुसार, द्रौपदी और पांडवों ने अपना खोया राज्य वापस पाने के लिए यह व्रत रखा था, और सूर्य के पुत्र कर्ण नदी के जल में खड़े होकर उगते सूर्य को अर्घ्य देते थे। भक्त डूबते सूर्य और फिर उगते सूर्य को अर्घ्य देते हैं, उस जीवनदायी ऊर्जा का सम्मान करते हुए जो समस्त सृष्टि का पालन करती है।`,
    rituals: [
      'Observe a strict fast, including abstaining from water during the main day',
      'Offer arghya (water and milk) to the setting sun at a riverbank or pond',
      'Offer arghya to the rising sun the following morning',
      'Prepare thekuas and other offerings as prasad without tasting them',
      'Stand in knee-deep water while offering prayers to Surya',
      'Sing traditional Chhath folk songs through the night of vigil'
    ],
    ritualsHindi: [
      'कठोर व्रत रखें, मुख्य दिन जल भी ग्रहण न करें',
      'नदी या तालाब के किनारे डूबते सूर्य को अर्घ्य (जल और दूध) दें',
      'अगली सुबह उगते सूर्य को अर्घ्य दें',
      'ठेकुआ और अन्य प्रसाद बिना चखे तैयार करें',
      'सूर्य को प्रार्थना देते समय घुटनों तक जल में खड़े रहें',
      'रात्रि जागरण में पारंपरिक छठ लोकगीत गाएं'
    ],
    regionalVariations: [
      {
        region: 'Bihar and Jharkhand',
        regionHindi: 'बिहार और झारखंड',
        variation: 'The heartland of Chhath. Rivers and ponds are lined with devotees; entire villages gather at the ghats.',
        variationHindi: 'छठ की मुख्य भूमि। नदियाँ और तालाब भक्तों से भरे रहते हैं; पूरे गाँव घाटों पर एकत्र होते हैं।'
      },
      {
        region: 'Eastern Uttar Pradesh and Nepal Terai',
        regionHindi: 'पूर्वी उत्तर प्रदेश और नेपाल तराई',
        variation: 'Celebrated with equal fervour along the Ganges and in the Madhesh region of Nepal.',
        variationHindi: 'गंगा के किनारे और नेपाल के मधेश क्षेत्र में समान श्रद्धा के साथ मनाया जाता है।'
      }
    ],
    significance: 'Chhath Puja honours Surya, the visible source of life, and Chhathi Maiya, who blesses devotees with health and prosperity. The dual offering to the setting and rising sun teaches that endings and beginnings are both sacred, and the rigorous fast expresses gratitude for nature itself.',
    significanceHindi: 'छठ पूजा जीवन के प्रत्यक्ष स्रोत सूर्य और स्वास्थ्य-समृद्धि देने वाली छठी मैया का सम्मान है। डूबते और उगते सूर्य को अर्घ्य यह सिखाता है कि अंत और आरंभ दोनों पवित्र हैं, और कठोर व्रत प्रकृति के प्रति कृतज्ञता व्यक्त करता है।',
    duration: '4 days',
    durationHindi: '४ दिन',
    colors: ['Orange', 'Gold', 'Red', 'Yellow'],
  },

  // ============================================================================
  // PITRU PAKSHA
  // ============================================================================
  {
    id: 'pitru-paksha',
    name: 'Pitru Paksha',
    nameHindi: 'पितृ पक्ष',
    emoji: '🙏',
    story: `Pitru Paksha is the fortnight dedicated to honouring departed ancestors. Each day of this period is associated with offerings to forefathers, expressing the Hindu belief that the living owe a debt of gratitude to those who came before them.

The tradition recalls Karna, who after his passing offered gold in the heavens but had never offered food to his ancestors on earth — so he was permitted to return and perform shraddha rites. Families offer tarpan (water offerings), pinda daan (rice-ball offerings), and meals to priests and the needy in the name of their ancestors.`,
    storyHindi: `पितृ पक्ष दिवंगत पूर्वजों के सम्मान को समर्पित पखवाड़ा है। इस अवधि का प्रत्येक दिन पितरों को अर्पण से जुड़ा है, जो इस हिंदू विश्वास को व्यक्त करता है कि जीवित लोगों पर अपने पूर्वजों का ऋण होता है।

यह परंपरा कर्ण की कथा से जुड़ी है, जिन्होंने स्वर्ग में स्वर्ण दान किया था पर पृथ्वी पर पितरों को अन्न नहीं दिया था — इसलिए उन्हें लौटकर श्राद्ध करने की अनुमति मिली। परिवार पितरों के नाम पर तर्पण (जल अर्पण), पिंड दान (चावल के गोले) और ब्राह्मणों व ज़रूरतमंदों को भोजन कराते हैं।`,
    rituals: [
      'Perform shraddha rites on the tithi associated with the departed ancestor',
      'Offer tarpan — water mixed with sesame seeds and barley — facing south',
      'Prepare pinda daan (cooked rice balls) as offerings to the ancestors',
      'Feed priests, crows, cows, and the needy in the ancestor’s name',
      'Avoid new beginnings, celebrations, and non-vegetarian food during the fortnight',
      'Recite ancestral prayers and remember family lineage with reverence'
    ],
    ritualsHindi: [
      'दिवंगत पूर्वज की तिथि पर श्राद्ध करें',
      'दक्षिण की ओर मुख करके तिल और जौ मिले जल से तर्पण दें',
      'पितरों को पिंड दान (पके चावल के गोले) अर्पित करें',
      'पूर्वज के नाम पर ब्राह्मणों, कौओं, गायों और ज़रूरतमंदों को भोजन कराएं',
      'पखवाड़े में नई शुरुआत, उत्सव और मांसाहार से बचें',
      'पितृ प्रार्थनाएं करें और श्रद्धा से वंश का स्मरण करें'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Shraddha meals are served to priests at home; the final day (Sarva Pitru Amavasya) covers all ancestors.',
        variationHindi: 'घर पर ब्राह्मणों को श्राद्ध भोजन कराया जाता है; अंतिम दिन (सर्व पितृ अमावस्या) सभी पितरों के लिए होता है।'
      },
      {
        region: 'Gaya (Bihar)',
        regionHindi: 'गया (बिहार)',
        variation: 'Pinda daan at the Vishnupad temple in Gaya is considered especially liberating for ancestors.',
        variationHindi: 'गया के विष्णुपाद मंदिर में पिंड दान पितरों के लिए विशेष रूप से मुक्तिदायक माना जाता है।'
      }
    ],
    significance: 'Pitru Paksha expresses shraddha — faith and remembrance — toward one’s lineage. By feeding others in the ancestors’ names, families acknowledge that present life rests on past generations, and seek blessings of peace and continuity for the household.',
    significanceHindi: 'पितृ पक्ष अपने वंश के प्रति श्रद्धा और स्मरण व्यक्त करता है। पितरों के नाम पर दूसरों को भोजन कराकर परिवार स्वीकार करते हैं कि वर्तमान जीवन पिछली पीढ़ियों पर टिका है, और घर की शांति व निरंतरता का आशीर्वाद मांगते हैं।',
    duration: '15 days',
    durationHindi: '१५ दिन',
    colors: ['White', 'Saffron', 'Beige'],
  },

  // ============================================================================
  // SAWAN SOMVAR
  // ============================================================================
  {
    id: 'sawan-somvar',
    name: 'Sawan Somvar',
    nameHindi: 'सावन सोमवार',
    emoji: '🔱',
    story: `Sawan Somvar refers to the Mondays of the sacred rainy-season month, each dedicated to Lord Shiva. Monday is Shiva’s own day, and when it falls in this holy season its merit is said to multiply.

The observance recalls Goddess Parvati, who performed severe austerities on Mondays to win Shiva as her husband. Unmarried devotees fast seeking a worthy spouse like Shiva, while married devotees pray for the health and longevity of their families. Temples resound with the chant of Om Namah Shivaya and the pouring of water and milk over the Shivling.`,
    storyHindi: `सावन सोमवार पवित्र वर्षा ऋतु के मास के सोमवारों को कहते हैं, जिनमें प्रत्येक भगवान शिव को समर्पित है। सोमवार शिव का अपना दिन है, और इस पवित्र मास में इसका पुण्य कई गुना कहा जाता है।

यह व्रत देवी पार्वती की याद दिलाता है, जिन्होंने शिव को पति रूप में पाने के लिए सोमवारों को कठोर तप किया था। अविवाहित भक्त शिव जैसे योग्य जीवनसाथी के लिए व्रत रखते हैं, जबकि विवाहित भक्त परिवार के स्वास्थ्य और दीर्घायु की प्रार्थना करते हैं। मंदिरों में ॐ नमः शिवाय का जाप और शिवलिंग पर जल-दूध का अभिषेक गूंजता है।`,
    rituals: [
      'Fast on each Monday — full day or with a single sattvik meal after sunset',
      'Offer water, milk, bel leaves, and white flowers to the Shivling',
      'Chant Om Namah Shivaya and recite the Shiva Chalisa',
      'Visit a Shiva temple, especially ancient Jyotirlinga shrines',
      'Wear simple clothes and maintain calm, truthful conduct through the day',
      'Break the fast in the evening with fruits, milk, and sattvik food'
    ],
    ritualsHindi: [
      'प्रत्येक सोमवार व्रत रखें — पूरे दिन या सूर्यास्त के बाद एक बार सात्विक भोजन',
      'शिवलिंग पर जल, दूध, बेलपत्र और श्वेत पुष्प अर्पित करें',
      'ॐ नमः शिवाय का जाप और शिव चालीसा का पाठ करें',
      'शिव मंदिर जाएं, विशेषकर प्राचीन ज्योतिर्लिंग धाम',
      'सादे वस्त्र पहनें और दिन भर शांत, सत्यपूर्ण आचरण रखें',
      'सांयकाल फल, दूध और सात्विक भोजन से व्रत खोलें'
    ],
    regionalVariations: [
      {
        region: 'North India',
        regionHindi: 'उत्तर भारत',
        variation: 'Kanwariyas carry holy river water on foot to offer at Shiva temples; Varanasi and Haridwar see vast crowds.',
        variationHindi: 'कांवड़िए पैदल पवित्र नदी का जल लाकर शिव मंदिरों में चढ़ाते हैं; वाराणसी और हरिद्वार में भारी भीड़ होती है।'
      },
      {
        region: 'Maharashtra and Central India',
        regionHindi: 'महाराष्ट्र और मध्य भारत',
        variation: 'Devotees throng Trimbakeshwar, Grishneshwar, and Mahakaleshwar; Monday abhishekams draw long queues.',
        variationHindi: 'भक्त त्र्यंबकेश्वर, घृष्णेश्वर और महाकालेश्वर में उमड़ते हैं; सोमवार के अभिषेक में लंबी कतारें लगती हैं।'
      }
    ],
    significance: 'Sawan Somvar deepens devotion to Lord Shiva, the ascetic and compassionate destroyer of ignorance. The Monday fasts teach patience and self-restraint, and Parvati’s example reminds devotees that sincere resolve eventually bears divine fruit.',
    significanceHindi: 'सावन सोमवार तपस्वी और करुणामय अज्ञान-विनाशक भगवान शिव के प्रति भक्ति गहरी करता है। सोमवार के व्रत धैर्य और संयम सिखाते हैं, और पार्वती का उदाहरण याद दिलाता है कि सच्चा संकल्प अंततः दिव्य फल देता है।',
    colors: ['White', 'Blue', 'Saffron'],
  },

  // ============================================================================
  // PONGAL
  // ============================================================================
  {
    id: 'pongal',
    name: 'Pongal',
    nameHindi: 'पोंगल',
    emoji: '🍚',
    story: `Pongal is the Tamil harvest festival, a joyful thanksgiving to Surya, the Sun God, and to the cattle and rains that make the harvest possible. Its name comes from the dish of newly harvested rice boiled with milk and jaggery until it overflows the pot — the overflow itself is the blessing.

As the sweet pongal boils over, families shout "Pongalo Pongal!" — may there be abundance. The festival honours the sun’s journey, the farmer’s labour, and the animals who share the work of the fields.`,
    storyHindi: `पोंगल तमिल फसल उत्सव है, सूर्य देव तथा फसल संभव बनाने वाले पशुओं और वर्षा के प्रति आनंदमय कृतज्ञता। इसका नाम नए चावल को दूध और गुड़ के साथ उबालने वाले व्यंजन से आया है, जो बर्तन से उफनता है — यही उफान आशीर्वाद है।

जब मीठा पोंगल उफनता है, तो परिवार "पोंगलो पोंगल!" चिल्लाते हैं — समृद्धि हो। यह पर्व सूर्य की यात्रा, किसान के श्रम और खेतों का काम बांटने वाले पशुओं का सम्मान करता है।`,
    rituals: [
      'Cook sweet pongal in a new clay pot and let it boil over auspiciously',
      'Offer the first serving to Surya, the Sun God, outdoors facing the sun',
      'Decorate homes and cattle with kolam patterns, mango leaves, and turmeric',
      'Honour cattle on Mattu Pongal with garlands, bells, and special feed',
      'Share pongal, sugarcane, and sweets with neighbours and relatives',
      'Thank farm workers and exchange gifts at the end of the harvest season'
    ],
    ritualsHindi: [
      'नई मिट्टी की हांडी में मीठा पोंगल पकाएं और शुभ रूप से उफनने दें',
      'पहला भोग घर के बाहर सूर्य की ओर मुख करके सूर्य देव को अर्पित करें',
      'घरों और पशुओं को कोलम, आम के पत्तों और हल्दी से सजाएं',
      'मट्टू पोंगल पर पशुओं को मालाओं, घंटियों और विशेष चारे से सम्मानित करें',
      'पड़ोसियों और रिश्तेदारों के साथ पोंगल, गन्ना और मिठाई बांटें',
      'फसल ऋतु के अंत में खेत मज़दूरों का आभार करें और उपहार दें'
    ],
    regionalVariations: [
      {
        region: 'Tamil Nadu',
        regionHindi: 'तमिलनाडु',
        variation: 'Four days — Bhogi, Surya Pongal, Mattu Pongal, and Kaanum Pongal — each with distinct rites and family reunions.',
        variationHindi: 'चार दिन — भोगी, सूर्य पोंगल, मट्टू पोंगल और काणुम पोंगल — प्रत्येक के अलग अनुष्ठान और पारिवारिक मिलन।'
      },
      {
        region: 'Tamil Diaspora',
        regionHindi: 'तमिल प्रवासी',
        variation: 'Celebrated in Sri Lanka, Singapore, and Malaysia with community pongal cooking and cultural programmes.',
        variationHindi: 'श्रीलंका, सिंगापुर और मलेशिया में सामुदायिक पोंगल पाक और सांस्कृतिक कार्यक्रमों के साथ मनाया जाता है।'
      }
    ],
    significance: 'Pongal celebrates gratitude — to the sun, the rain, the soil, and the animals. The overflowing pot is a prayer that prosperity should spill over to all, and the festival binds farming families, workers, and neighbours in shared thanksgiving.',
    significanceHindi: 'पोंगल कृतज्ञता का उत्सव है — सूर्य, वर्षा, मिट्टी और पशुओं के प्रति। उफनती हांडी प्रार्थना है कि समृद्धि सभी तक छलके, और यह पर्व किसान परिवारों, मज़दूरों और पड़ोसियों को साझा कृतज्ञता में जोड़ता है।',
    duration: '4 days',
    durationHindi: '४ दिन',
    colors: ['Yellow', 'Green', 'Red', 'Gold'],
  },

  // ============================================================================
  // HANUMAN JAYANTI
  // ============================================================================
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    nameHindi: 'हनुमान जयंती',
    emoji: '🐒',
    story: `Hanuman Jayanti celebrates the birth of Lord Hanuman, the devoted servant of Rama and embodiment of strength, humility, and selfless service. Born of Anjana with the blessings of Vayu, the wind god, Hanuman could fly across oceans yet chose to kneel at Rama’s feet.

Devotees recall his leap to Lanka, his carrying of the life-saving Sanjeevani herb, and his burning of Ravana’s city — every feat performed not for glory but out of love for Rama. Temples chant the Hanuman Chalisa through the day, and his vermilion-covered form reminds devotees that true power serves devotion.`,
    storyHindi: `हनुमान जयंती राम के परम भक्त, बल, विनम्रता और निःस्वार्थ सेवा के प्रतीक भगवान हनुमान के जन्म का उत्सव है। अंजनी के पुत्र हनुमान को वायु देव का आशीर्वाद मिला; वे समुद्र लांघ सकते थे फिर भी राम के चरणों में नतमस्तक रहना चुना।

भक्त उनकी लंका छलांग, संजीवनी बूटी लाने और रावण की नगरी जलाने की याद करते हैं — हर पराक्रम यश के लिए नहीं, राम प्रेम से किया गया। मंदिरों में दिन भर हनुमान चालीसा गूंजती है, और उनका सिंदूरी रूप याद दिलाता है कि सच्ची शक्ति भक्ति की सेवा करती है।`,
    rituals: [
      'Fast or take a single sattvik meal while chanting the Hanuman Chalisa',
      'Offer vermilion (sindoor), jasmine oil, marigold garlands, and boondi ladoos',
      'Recite the Sundara Kanda from the Ramayana in temples and homes',
      'Visit Hanuman temples at dawn for aarti and prasad distribution',
      'Serve the needy and practise brahmacharya (self-restraint) on the day',
      'Apply a tilak of temple sindoor for courage and protection'
    ],
    ritualsHindi: [
      'हनुमान चालीसा का जाप करते हुए व्रत रखें या एक बार सात्विक भोजन लें',
      'सिंदूर, चमेली का तेल, गेंदा की माला और बूंदी के लड्डू चढ़ाएं',
      'मंदिरों और घरों में रामायण के सुंदरकांड का पाठ करें',
      'भोर में हनुमान मंदिर जाकर आरती और प्रसाद वितरण में भाग लें',
      'दीन-दुखियों की सेवा करें और दिन भर ब्रह्मचर्य (संयम) रखें',
      'साहस और रक्षा के लिए मंदिर के सिंदूर का तिलक लगाएं'
    ],
    regionalVariations: [
      {
        region: 'North and Central India',
        regionHindi: 'उत्तर और मध्य भारत',
        variation: 'Grand bhandaras (community feasts) and all-night Sundara Kanda recitations at major Hanuman temples.',
        variationHindi: 'प्रमुख हनुमान मंदिरों में विशाल भंडारे और रात्रिभर सुंदरकांड पाठ।'
      },
      {
        region: 'Maharashtra and South India',
        regionHindi: 'महाराष्ट्र और दक्षिण भारत',
        variation: 'Celebrated as Hanumath Jayanthi with abhishekam, processions, and martial-arts displays honouring his strength.',
        variationHindi: 'हनुमत जयंती के रूप में अभिषेक, शोभायात्रा और उनके बल के सम्मान में शारीरिक प्रदर्शन के साथ मनाई जाती है।'
      }
    ],
    significance: 'Hanuman Jayanti honours devotion that never seeks reward. Hanuman’s life shows that humility magnifies strength, and that service offered with a pure heart makes even the impossible — an ocean crossed, a mountain carried — achievable.',
    significanceHindi: 'हनुमान जयंती उस भक्ति का सम्मान है जो कभी फल नहीं मांगती। हनुमान का जीवन दिखाता है कि विनम्रता शक्ति को बढ़ाती है, और शुद्ध हृदय से की गई सेवा असंभव को भी संभव करती है — समुद्र लांघना, पर्वत उठाना।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Orange', 'Red', 'Saffron', 'Gold'],
  },

  // ============================================================================
  // VARALAKSHMI VRATAM
  // ============================================================================
  {
    id: 'varalakshmi-vratam',
    name: 'Varalakshmi Vratam',
    nameHindi: 'वरलक्ष्मी व्रतम्',
    emoji: '🌺',
    story: `Varalakshmi Vratam is observed by married women seeking the blessings of Goddess Lakshmi in her boon-granting form as Varalakshmi — she who fulfils righteous wishes. The vrat recalls Charumati, a devout woman who dreamt that worshipping Varalakshmi would bring prosperity to her household, and whose devotion was richly rewarded.

Women invite the goddess into their homes with a decorated kalasha, tie sacred threads, and pray for the wellbeing of their husbands, children, and families. The fast honours Lakshmi not only as wealth but as grace, patience, and household harmony.`,
    storyHindi: `वरलक्ष्मी व्रतम् विवाहित महिलाओं द्वारा वर देने वाली लक्ष्मी — वरलक्ष्मी — के आशीर्वाद हेतु रखा जाता है, जो धर्मपूर्ण इच्छाएं पूर्ण करती हैं। यह व्रत भक्त चारुमती की याद दिलाता है, जिन्होंने स्वप्न में देखा कि वरलक्ष्मी की पूजा से घर में समृद्धि आएगी, और जिनकी भक्ति का भरपूर फल मिला।

महिलाएं सजे कलश से देवी का घर में आवाहन करती हैं, पवित्र धागे बांधती हैं और पति, संतान व परिवार के कल्याण की प्रार्थना करती हैं। यह व्रत लक्ष्मी का केवल धन के रूप में नहीं, कृपा, धैर्य और गृह शांति के रूप में सम्मान करता है।`,
    rituals: [
      'Fast during the day and decorate a kalasha as the goddess with turmeric and flowers',
      'Tie the sacred yellow thread (toram) on the right wrist while chanting Lakshmi mantras',
      'Offer nine varieties of flowers, fruits, and homemade sweets to the goddess',
      'Invite married women home, honour them with haldi-kumkum and gifts',
      'Recite the Varalakshmi Vratam katha (sacred story) in the evening',
      'Conclude with aarti and share prasad with family and neighbours'
    ],
    ritualsHindi: [
      'दिन में व्रत रखें और हल्दी-फूलों से कलश को देवी रूप में सजाएं',
      'लक्ष्मी मंत्रों के साथ दाईं कलाई पर पवित्र पीला धागा (तोरम) बांधें',
      'देवी को नौ प्रकार के फूल, फल और घर की मिठाई अर्पित करें',
      'सुहागिन महिलाओं को घर बुलाकर हल्दी-कुमकुम और उपहार से सम्मानित करें',
      'सांयकाल वरलक्ष्मी व्रत कथा का पाठ करें',
      'आरती से समापन करें और परिवार-पड़ोस में प्रसाद बांटें'
    ],
    regionalVariations: [
      {
        region: 'Karnataka, Tamil Nadu, and Andhra Pradesh',
        regionHindi: 'कर्नाटक, तमिलनाडु और आंध्र प्रदेश',
        variation: 'The most elaborate observance — neighbourhood women gather, exchange gifts, and compare kalasha decorations.',
        variationHindi: 'सबसे भव्य अनुष्ठान — मोहल्ले की महिलाएं एकत्र होती हैं, उपहार बांटती हैं और कलश सज्जा दिखाती हैं।'
      },
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Observed in similar spirit alongside Jyeshtha Gauri customs, with haldi-kumkum gatherings.',
        variationHindi: 'ज्येष्ठा गौरी परंपराओं के साथ समान भाव से, हल्दी-कुमकुम समारोहों के साथ मनाया जाता है।'
      }
    ],
    significance: 'Varalakshmi Vratam honours the feminine divine as the keeper of household welfare. It strengthens bonds among women, turns the home into a temple for a day, and teaches that prosperity follows discipline, generosity, and devotion.',
    significanceHindi: 'वरलक्ष्मी व्रतम् गृह कल्याण की रक्षिका के रूप में दिव्य नारी शक्ति का सम्मान है। यह महिलाओं के बंधन मजबूत करता है, घर को एक दिन के लिए मंदिर बनाता है, और सिखाता है कि समृद्धि अनुशासन, उदारता और भक्ति के पीछे आती है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Red', 'Gold', 'Yellow', 'Green'],
  },

  // ============================================================================
  // KARTIK PURNIMA
  // ============================================================================
  {
    id: 'kartik-purnima',
    name: 'Kartik Purnima',
    nameHindi: 'कार्तिक पूर्णिमा',
    emoji: '🌕',
    story: `Kartik Purnima is the luminous full-moon night that closes the holy month, sacred to both Shiva and Vishnu. On this night Shiva destroyed the demon Tripurasura and his three flying cities, and the gods are said to have celebrated by lighting lamps — hence the name Deva Deepavali, the Diwali of the gods.

Devotees recall Guru Nanak’s birth, also honoured on this day, and the vow of the month-long Kartik fasters who rise before dawn for holy baths. Rivers glow with thousands of floating diyas as the faithful offer light back to the heavens.`,
    storyHindi: `कार्तिक पूर्णिमा पवित्र मास का समापन करने वाली उज्ज्वल पूर्णिमा रात्रि है, जो शिव और विष्णु दोनों को पावन है। इस रात शिव ने असुर त्रिपुरासुर और उसके तीन उड़ते नगरों का नाश किया, और कहा जाता है कि देवताओं ने दीप जलाकर उत्सव मनाया — इसलिए इसका नाम देव दीपावली, देवताओं की दीपावली पड़ा।

भक्त इस दिन मनाए जाने वाले गुरु नानक के जन्म का भी स्मरण करते हैं, और मास भर के कार्तिक व्रतियों के संकल्प का, जो पवित्र स्नान हेतु भोर से पहले उठते हैं। नदियाँ हज़ारों तैरते दीयों से जगमगाती हैं जब श्रद्धालु आकाश को प्रकाश लौटाते हैं।`,
    rituals: [
      'Take a holy dip in a river or sacred water body before sunrise',
      'Float earthen diyas on rivers and lakes in the evening',
      'Observe a day-long fast and light a 365-wick lamp where possible',
      'Worship Shiva and Vishnu together with tulsi and lotus offerings',
      'Donate lamps, sesame oil, food, and warm clothes to the needy',
      'Stay awake in bhajan and kirtan through part of the night'
    ],
    ritualsHindi: [
      'सूर्योदय से पहले नदी या पवित्र जल में स्नान करें',
      'सांयकाल नदियों और झीलों में मिट्टी के दीये तैराएं',
      'दिन भर व्रत रखें और संभव हो तो 365 बत्तियों वाला दीप जलाएं',
      'तुलसी और कमल अर्पित कर शिव-विष्णु दोनों की पूजा करें',
      'दीप, तिल का तेल, भोजन और गर्म वस्त्र ज़रूरतमंदों को दान करें',
      'रात्रि के कुछ भाग में भजन-कीर्तन में जागरण करें'
    ],
    regionalVariations: [
      {
        region: 'Varanasi',
        regionHindi: 'वाराणसी',
        variation: 'Dev Deepavali — the ghats blaze with over a million lamps; the grandest Kartik Purnima celebration in India.',
        variationHindi: 'देव दीपावली — घाट दस लाख से अधिक दीयों से जगमगाते हैं; भारत का सबसे भव्य कार्तिक पूर्णिमा उत्सव।'
      },
      {
        region: 'Punjab',
        regionHindi: 'पंजाब',
        variation: 'Guru Nanak Gurpurab — Gurudwaras hold processions, kirtans, and langars honouring Guru Nanak’s birth.',
        variationHindi: 'गुरु नानक गुरपुरब — गुरु नानक के जन्म के सम्मान में गुरुद्वारों में शोभायात्रा, कीर्तन और लंगर।'
      },
      {
        region: 'Odisha',
        regionHindi: 'ओडिशा',
        variation: 'Boita Bandana — miniature boats with lamps are floated, recalling ancient maritime voyages.',
        variationHindi: 'बोइता बंदना — दीयों वाली छोटी नावें तैराई जाती हैं, प्राचीन समुद्री यात्राओं की याद में।'
      }
    ],
    significance: 'Kartik Purnima celebrates light conquering darkness on the grandest scale — the gods’ own Diwali. Floating lamps on dark waters remind devotees that every small act of devotion joins a river of collective faith.',
    significanceHindi: 'कार्तिक पूर्णिमा सबसे भव्य स्तर पर अंधकार पर प्रकाश की विजय का उत्सव है — देवताओं की अपनी दीपावली। काले जल पर तैरते दीप याद दिलाते हैं कि भक्ति का हर छोटा कार्य सामूहिक आस्था की नदी में मिलता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Gold', 'White', 'Orange', 'Blue'],
  },

  // ============================================================================
  // NAG PANCHAMI
  // ============================================================================
  {
    id: 'nag-panchami',
    name: 'Nag Panchami',
    nameHindi: 'नाग पंचमी',
    emoji: '🐍',
    story: `Nag Panchami honours the serpent deities, ancient guardians of water, fertility, and hidden treasures. The observance recalls Krishna’s subduing of the venomous serpent Kaliya in the Yamuna — not by killing him, but by dancing on his hoods until he surrendered and was forgiven.

It also recalls the rescue of Takshaka’s kin and the vow that serpents would never harm those who honour them on this day. Devotees offer milk to snake images and anthills, seeking protection from snakebite and blessings of fertility and prosperity.`,
    storyHindi: `नाग पंचमी सर्प देवताओं का सम्मान है, जो जल, उर्वरता और छिपे खजानों के प्राचीन रक्षक हैं। यह व्रत यमुना में विषैले सर्प कालिया पर कृष्ण की विजय की याद दिलाता है — उसे मारकर नहीं, उसके फनों पर नृत्य करके जब तक उसने समर्पण नहीं किया और क्षमा नहीं पाई।

यह तक्षक के वंश की रक्षा और उस वचन की भी याद है कि सर्प इस दिन उनका सम्मान करने वालों को कभी हानि नहीं पहुंचाएंगे। भक्त सर्प चित्रों और बांबियों को दूध चढ़ाते हैं, सर्पदंश से रक्षा और उर्वरता-समृद्धि का आशीर्वाद मांगते हैं।`,
    rituals: [
      'Offer milk, honey, and flowers to snake images or anthills',
      'Fast for the day and avoid digging or tilling the earth',
      'Draw serpent figures on walls or paper with turmeric and sandalwood paste',
      'Recite the Nag Gayatri and stories of Kaliya and Takshaka',
      'Feed Brahmins and donate to snake rescuers or forest conservancies',
      'Women pray for the wellbeing of their brothers and family fertility'
    ],
    ritualsHindi: [
      'सर्प चित्रों या बांबियों को दूध, शहद और फूल चढ़ाएं',
      'दिन भर व्रत रखें और धरती खोदने या हल चलाने से बचें',
      'हल्दी और चंदन से दीवारों या कागज़ पर सर्प चित्र बनाएं',
      'नाग गायत्री और कालिया-तक्षक की कथाओं का पाठ करें',
      'ब्राह्मणों को भोजन कराएं और सर्प रक्षकों या वन संरक्षण को दान दें',
      'महिलाएं भाइयों के कल्याण और परिवार की उर्वरता की प्रार्थना करें'
    ],
    regionalVariations: [
      {
        region: 'Maharashtra and Karnataka',
        regionHindi: 'महाराष्ट्र और कर्नाटक',
        variation: 'Women gather at anthills and temples with milk offerings; village processions carry live serpents handled by sapera communities.',
        variationHindi: 'महिलाएं दूध लेकर बांबियों और मंदिरों में एकत्र होती हैं; गाँवों में सपेरा समुदाय सर्पों के साथ शोभायात्रा निकालते हैं।'
      },
      {
        region: 'Bengal and Assam',
        regionHindi: 'बंगाल और असम',
        variation: 'Worshipped as the goddess Manasa with songs recounting her legends and offerings of hibiscus.',
        variationHindi: 'देवी मनसा के रूप में उनकी कथाओं के गीतों और गुड़हल के अर्पण के साथ पूजा होती है।'
      }
    ],
    significance: 'Nag Panchami teaches reverence for creatures that inspire fear — honouring snakes as part of divine creation rather than enemies. It links water, earth, and fertility in one rite, and asks protection through respect instead of conflict.',
    significanceHindi: 'नाग पंचमी भय पैदा करने वाले जीवों के प्रति श्रद्धा सिखाती है — सर्पों को शत्रु नहीं, दिव्य सृष्टि का अंग मानना। यह जल, धरती और उर्वरता को एक अनुष्ठान में जोड़ती है, और संघर्ष के बजाय सम्मान से रक्षा मांगती है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Green', 'Yellow', 'White', 'Gold'],
  },
];

/**
 * Get festival story by ID
 */
export function getFestivalStory(id: string): FestivalStory | undefined {
  return FESTIVAL_STORIES.find(f => f.id === id);
}

/**
 * Get all festival IDs
 */
export function getAllFestivalIds(): string[] {
  return FESTIVAL_STORIES.map(f => f.id);
}

/**
 * Search festivals by name
 */
export function searchFestivals(query: string): FestivalStory[] {
  const lowerQuery = query.toLowerCase();
  return FESTIVAL_STORIES.filter(f =>
    f.name.toLowerCase().includes(lowerQuery) ||
    f.nameHindi.includes(query) ||
    f.story.toLowerCase().includes(lowerQuery) ||
    f.significance.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Find a festival story by name (supports name, nameHindi, or id matching)
 * Case-insensitive and trims whitespace for robust matching
 */
export function findFestivalStoryByName(name: string): FestivalStory | undefined {
  if (!name) return undefined;
  const normalizedName = name.trim().toLowerCase();
  return FESTIVAL_STORIES.find(f =>
    f.id.toLowerCase() === normalizedName ||
    f.name.toLowerCase() === normalizedName ||
    f.nameHindi === name.trim() ||
    f.name.toLowerCase().includes(normalizedName) ||
    normalizedName.includes(f.name.toLowerCase())
  );
}
