/**
 * Festival Stories — Extra Batch 2
 * Eight missing stories. Merged into the story registry by the consumer.
 * Narrative content only — no dates (next occurrence is engine-computed).
 */

import type { FestivalStory } from './festivalStories';

export const EXTRA_STORIES_2: FestivalStory[] = [
  // ============================================================================
  // KRISHNA JAYANTI (Nandotsav angle — distinct from the Janmashtami prison-birth entry)
  // ============================================================================
  {
    id: 'krishna-jayanti',
    name: 'Krishna Jayanti',
    nameHindi: 'कृष्ण जयंती',
    emoji: '🦚',
    story: `Krishna Jayanti celebrates the same divine birth as Janmashtami, but this entry honours the morning after — Nandotsav in Gokul, when Nanda rejoiced at the arrival of baby Krishna and the whole village bathed the child in milk, curd, and flowers. While Janmashtami dwells on the midnight prison birth in Mathura, Krishna Jayanti belongs to the cowherd settlement (गोकुल) that raised him. The next-morning feasting and cradle-swinging (पालना) is the heart of this observance.`,
    storyHindi: `कृष्ण जयंती उसी दिव्य जन्म का उत्सव है जिसे जन्माष्टमी मनाती है, किंतु यह प्रविष्टि उसके अगले प्रभात — गोकुल के नंदोत्सव — का सम्मान करती है, जब नंद ने बालक कृष्ण के आगमन पर आनंद मनाया और समस्त गाँव ने शिशु को दूध, दही और फूलों से नहलाया। जन्माष्टमी मथुरा के मध्यरात्रि कारागार-जन्म पर केंद्रित है, जबकि कृष्ण जयंती उन्हें पालने वाली गो-संस्कृति (गोकुल) की है। अगले दिन का भोज और पालना झुलाना इस व्रत का हृदय है।`,
    rituals: [
      'Swing the cradle (Palna) with the baby Krishna idol the morning after the midnight birth',
      'Bathe the idol with milk, curd, honey, and water (Panchamrita Abhisheka)',
      'Distribute curd, butter, and sweets recalling the joy of Gokul village',
      'Sing Nandotsav kirtans celebrating Nanda and Yashoda',
    ],
    ritualsHindi: [
      'मध्यरात्रि जन्म के अगले प्रभात बालक कृष्ण की मूर्ति का पालना झुलाएं',
      'मूर्ति का दूध, दही, शहद और जल से पंचामृत अभिषेक करें',
      'गोकुल के आनंद की स्मृति में दही, मक्खन और मिठाई बांटें',
      'नंद और यशोदा का गुणगान करते नंदोत्सव कीर्तन गाएं',
    ],
    regionalVariations: [
      {
        region: 'Braj (Mathura, Gokul, Vrindavan)',
        regionHindi: 'ब्रज (मथुरा, गोकुल, वृंदावन)',
        variation: 'Nandotsav is the main event — temples reenact Nanda distributing gifts and the village bathing Krishna in dairy and flowers.',
        variationHindi: 'नंदोत्सव मुख्य आयोजन है — मंदिरों में नंद का उपहार बांटना और गाँव का कृष्ण को दूध-दही और फूलों से नहलाना दर्शाया जाता है।',
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Observed as Sri Jayanti with cradle-swinging (Uriyadi in Tamil Nadu) and butter offerings to the child Krishna.',
        variationHindi: 'श्री जयंती के रूप में मनाया जाता है — पालना झुलाना (तमिलनाडु में उरियडि) और बालक कृष्ण को मक्खन का भोग।',
      },
    ],
    significance: 'Krishna Jayanti honours the communal joy of Krishna’s arrival — the village that raised him. It teaches that the divine birth is completed by the love of the community that welcomes it.',
    significanceHindi: 'कृष्ण जयंती कृष्ण के आगमन के सामुदायिक आनंद का सम्मान करती है — उस गाँव का जिसने उन्हें पाला। यह सिखाती है कि दिव्य जन्म उसका स्वागत करने वाले समाज के प्रेम से पूर्ण होता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Yellow', 'Peacock Blue', 'White'],
  },

  // ============================================================================
  // GANESH JAYANTI (Magha Shukla Chaturthi — distinct from Bhadrapada Vinayaka Chaturthi)
  // ============================================================================
  {
    id: 'ganesh-jayanti',
    name: 'Ganesh Jayanti',
    nameHindi: 'गणेश जयंती',
    emoji: '🐘',
    story: `Ganesh Jayanti marks the birth of Lord Ganesha on Magha Shukla Chaturthi, the winter birth honoured especially in Maharashtra as Maghi Ganeshotsav. It is distinct from the grand Bhadrapada Vinayaka Chaturthi (Ganesh Chaturthi) of autumn — this is the quieter, older birthday rite. Devotees believe Ganesha first appeared on this day to bless his devotees and remove obstacles at the turn of the season.`,
    storyHindi: `गणेश जयंती माघ शुक्ल चतुर्थी को भगवान गणेश के जन्म का पर्व है, जिसे महाराष्ट्र में विशेष रूप से माघी गणेशोत्सव के रूप में मनाया जाता है। यह शरद ऋतु की भव्य भाद्रपद विनायक चतुर्थी (गणेश चतुर्थी) से भिन्न है — यह शांत, प्राचीन जन्म-तिथि पूजा है। भक्त मानते हैं कि गणेश ऋतु-संधि पर विघ्न हरने और भक्तों को आशीर्वाद देने इस दिन प्रथम प्रकट हुए।`,
    rituals: [
      'Offer red flowers, durva grass, and til-gud (sesame-jaggery) to Ganesha',
      'Recite the Ganapati Atharvashirsha and keep a day-long fast until evening puja',
      'Perform Abhisheka of the Ganesha idol with Panchamrita',
      'Light an akhanda diya and share modak prasad with neighbours',
    ],
    ritualsHindi: [
      'गणेश को लाल फूल, दूर्वा और तिल-गुड़ अर्पित करें',
      'गणपति अथर्वशीर्ष का पाठ करें और सांयकाल पूजा तक दिन भर उपवास रखें',
      'गणेश मूर्ति का पंचामृत अभिषेक करें',
      'अखंड दीया जलाएं और पड़ोसियों के साथ मोदक प्रसाद बांटें',
    ],
    regionalVariations: [
      {
        region: 'Maharashtra',
        regionHindi: 'महाराष्ट्र',
        variation: 'Maghi Ganeshotsav — celebrated at the Ashtavinayaka shrines, especially Morgaon and Siddhivinayak, with palanquin processions.',
        variationHindi: 'माघी गणेशोत्सव — अष्टविनायक तीर्थों, विशेषकर मोरगांव और सिद्धिविनायक में पालकी शोभायात्रा के साथ मनाया जाता है।',
      },
      {
        region: 'Konkan and Goa',
        regionHindi: 'कोंकण और गोवा',
        variation: 'Observed as Magha Shukla Vinayaki — a home puja with til-based sweets and no public immersion.',
        variationHindi: 'माघ शुक्ल विनायकी के रूप में — तिल की मिठाइयों के साथ घरेलू पूजा, कोई सार्वजनिक विसर्जन नहीं।',
      },
    ],
    significance: 'Ganesh Jayanti reminds devotees that Ganesha is worshipped first at every threshold of the year, not only in autumn. The winter birthday honours him as the turner of seasons and the remover of obstacles on new beginnings.',
    significanceHindi: 'गणेश जयंती याद दिलाती है कि गणेश की पूजा वर्ष की हर दहलीज़ पर सबसे पहले होती है, केवल शरद में नहीं। शीतकालीन जन्म-तिथि उनका ऋतुओं के मोड़ और नई शुरुआत के विघ्नहर्ता के रूप में सम्मान करती है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Red', 'Yellow', 'Orange'],
  },

  // ============================================================================
  // RAKHI PURNIMA (Sushravani-style variant — distinct from Janmashtami)
  // ============================================================================
  {
    id: 'rakhi-purnima',
    name: 'Rakhi Purnima',
    nameHindi: 'राखी पूर्णिमा',
    emoji: '🎀',
    story: `Rakhi Purnima celebrates the Shravana full moon as the day of the protective thread (रक्षा-सूत्र). Sisters tie a rakhi on their brothers' wrists praying for their long life, and brothers vow lifelong protection in return. The day also marks Hayagriva Jayanti and the Vedic rite of Upakarma, when the sacred thread is renewed for the year ahead.`,
    storyHindi: `राखी पूर्णिमा श्रावण पूर्णिमा को रक्षा-सूत्र के दिन के रूप में मनाती है। बहनें भाइयों की कलाई पर राखी बांधकर उनकी दीर्घायु की कामना करती हैं, और भाई आजीवन रक्षा का वचन देते हैं। यह दिन हयग्रीव जयंती और वैदिक उपाकर्म का भी दिन है, जब वर्ष भर के लिए यज्ञोपवीत नवीकृत किया जाता है।`,
    rituals: [
      'Sisters tie rakhi on brothers’ wrists and apply tilak with rice and kumkum',
      'Brothers offer gifts and vow lifelong protection to their sisters',
      'Brahmins perform Upakarma and renew the sacred thread (Yajnopavita)',
      'Offer coconut and water to rivers and the sea (Narali Purnima in coastal regions)',
    ],
    ritualsHindi: [
      'बहनें भाइयों की कलाई पर राखी बांधें और चावल-कुमकुम से तिलक करें',
      'भाई उपहार दें और बहनों को आजीवन रक्षा का वचन दें',
      'ब्राह्मण उपाकर्म करें और यज्ञोपवीत नवीकृत करें',
      'नदियों और समुद्र को नारियल और जल अर्पित करें (तटीय क्षेत्रों में नराली पूर्णिमा)',
    ],
    regionalVariations: [
      {
        region: 'Maharashtra and Konkan coast',
        regionHindi: 'महाराष्ट्र और कोंकण तट',
        variation: 'Narali Purnima — fisherfolk offer coconuts to the sea praying for safe voyages and a rich catch.',
        variationHindi: 'नराली पूर्णिमा — मछुआरे सुरक्षित यात्रा और समृद्ध पकड़ के लिए समुद्र को नारियल अर्पित करते हैं।',
      },
      {
        region: 'South India',
        regionHindi: 'दक्षिण भारत',
        variation: 'Avani Avittam — Vedic scholars change the sacred thread and begin the year’s study of the scriptures.',
        variationHindi: 'अवनी अविट्टम — वैदिक विद्वान यज्ञोपवीत बदलते हैं और वर्ष के शास्त्राध्ययन का आरंभ करते हैं।',
      },
    ],
    significance: 'Rakhi Purnima sanctifies the bond of protection — between siblings, between teacher and student, and between the community and the waters it depends on. The thread is a vow made visible.',
    significanceHindi: 'राखी पूर्णिमा रक्षा के बंधन को पावन करती है — भाई-बहन के बीच, गुरु-शिष्य के बीच, और समाज व उन जल-स्रोतों के बीच जिन पर वह निर्भर है। यह धागा दिखने वाला वचन है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Red', 'Gold', 'Yellow'],
  },

  // ============================================================================
  // PRABODHINI EKADASHI (Vishnu wakes — Tulsi Vivah — Chaturmasya ends)
  // ============================================================================
  {
    id: 'prabodhini-ekadashi',
    name: 'Prabodhini Ekadashi',
    nameHindi: 'प्रबोधिनी एकादशी',
    emoji: '🪔',
    story: `Prabodhini Ekadashi is the day Lord Vishnu wakes from his four-month cosmic sleep (Chaturmasya), which began on Shayani Ekadashi. His awakening reopens the heavens for auspicious rites — weddings, pilgrimages, and vows suspended during his rest. On or just after this day the ceremonial wedding of Tulsi and Shaligrama (Tulsi Vivah) is celebrated, marking the start of the marriage season.`,
    storyHindi: `प्रबोधिनी एकादशी वह दिन है जब भगवान विष्णु अपनी चार मास की योगनिद्रा (चातुर्मास्य) से जागते हैं, जो शयनी एकादशी से आरंभ हुई थी। उनके जागरण से शुभ कार्यों — विवाह, तीर्थयात्रा और विश्रामकाल में स्थगित व्रतों — के द्वार पुनः खुलते हैं। इसी दिन या इसके तुरंत बाद तुलसी और शालिग्राम का विवाह (तुलसी विवाह) मनाया जाता है, जो विवाह ऋतु का आरंभ है।`,
    rituals: [
      'Observe an Ekadashi fast and keep night vigil with Vishnu bhajans',
      'Perform Tulsi Vivah — marry the Tulsi plant to Shaligrama with wedding rites',
      'Light rows of diyas at temples and Tulsi shrines at dusk',
      'Break the fast on Dwadashi with anna-dana (feeding the hungry)',
    ],
    ritualsHindi: [
      'एकादशी व्रत रखें और विष्णु भजनों के साथ रात्रि जागरण करें',
      'तुलसी विवाह करें — वैवाहिक विधि से तुलसी का शालिग्राम से विवाह',
      'सांयकाल मंदिरों और तुलसी चौरों पर दीपों की पंक्तियाँ जलाएं',
      'द्वादशी को अन्नदान (भूखों को भोजन) के साथ व्रत का पारण करें',
    ],
    regionalVariations: [
      {
        region: 'Maharashtra and North India',
        regionHindi: 'महाराष्ट्र और उत्तर भारत',
        variation: 'Tulsi Vivah is celebrated as a full wedding — bridal dress for Tulsi, baraat, and community feasting.',
        variationHindi: 'तुलसी विवाह पूर्ण विवाह की तरह मनाया जाता है — तुलसी के लिए दुल्हन का श्रृंगार, बारात और सामुदायिक भोज।',
      },
      {
        region: 'Gujarat',
        regionHindi: 'गुजरात',
        variation: 'Known as Dev Uthi Ekadashi — sugarcane and cotton bolls are offered to the waking Vishnu.',
        variationHindi: 'देवउठी एकादशी के नाम से प्रसिद्ध — जागते विष्णु को गन्ना और कपास के गोले अर्पित किए जाते हैं।',
      },
    ],
    significance: 'Prabodhini marks the end of Chaturmasya and the return of auspicious beginnings. Vishnu’s awakening symbolises the renewal of dharma after a season of restraint — the gods themselves resume their work.',
    significanceHindi: 'प्रबोधिनी चातुर्मास्य का समापन और शुभ आरंभों की वापसी है। विष्णु का जागरण संयम की ऋतु के बाद धर्म के नवीकरण का प्रतीक है — देवता स्वयं अपना कार्य पुनः आरंभ करते हैं।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Gold', 'Green', 'Orange'],
  },

  // ============================================================================
  // BHEESHMA EKADASHI (Vishnu Sahasranama discourse on the arrow-bed)
  // ============================================================================
  {
    id: 'bheeshma-ekadashi',
    name: 'Bheeshma Ekadashi',
    nameHindi: 'भीष्म एकादशी',
    emoji: '🏹',
    story: `Bheeshma Ekadashi honours the day the grandsire Bhishma, lying wounded on his bed of arrows after the Kurukshetra war, delivered his final teaching to the Pandavas. Asked by Yudhishthira who the supreme refuge is, Bhishma recited the Vishnu Sahasranama — the thousand names of Vishnu — as his deathbed gift of wisdom. Devotees fast and chant the Sahasranama on this day in his memory.`,
    storyHindi: `भीष्म एकादशी उन पितामह भीष्म का सम्मान करती है, जिन्होंने कुरुक्षेत्र युद्ध के बाद शरशय्या पर लेटे हुए पांडवों को अंतिम उपदेश दिया। युधिष्ठिर के पूछने पर कि परम आश्रय कौन है, भीष्म ने विष्णु सहस्रनाम — विष्णु के सहस्र नामों — का पाठ ज्ञान की अंतिम भेंट के रूप में सुनाया। भक्त उनकी स्मृति में इस दिन उपवास रखते हैं और सहस्रनाम का जप करते हैं।`,
    rituals: [
      'Fast on Ekadashi and recite the full Vishnu Sahasranama',
      'Read or listen to the Bhishma Parva discourse from the Mahabharata',
      'Offer sesame, water, and flowers in Bhishma’s memory (Bhishma Tarpana)',
      'Keep night vigil with discourses on dharma and devotion',
    ],
    ritualsHindi: [
      'एकादशी का उपवास रखें और पूर्ण विष्णु सहस्रनाम का पाठ करें',
      'महाभारत के भीष्म पर्व की कथा पढ़ें या सुनें',
      'भीष्म की स्मृति में तिल, जल और फूल अर्पित करें (भीष्म तर्पण)',
      'धर्म और भक्ति की कथा के साथ रात्रि जागरण करें',
    ],
    regionalVariations: [
      {
        region: 'Andhra Pradesh and Telangana',
        regionHindi: 'आंध्र प्रदेश और तेलंगाना',
        variation: 'Major temple festival — the Sahasranama is chanted in unison at Vishnu temples through the day.',
        variationHindi: 'प्रमुख मंदिर उत्सव — विष्णु मंदिरों में दिन भर सहस्रनाम का सामूहिक पाठ होता है।',
      },
      {
        region: 'Karnataka',
        regionHindi: 'कर्नाटक',
        variation: 'Bhishma Tarpana with sesame and water is offered for ancestors alongside the fast.',
        variationHindi: 'उपवास के साथ पितरों के लिए तिल-जल से भीष्म तर्पण किया जाता है।',
      },
    ],
    significance: 'Bheeshma Ekadashi teaches that wisdom ripens in suffering — Bhishma’s greatest gift came from his bed of pain. The thousand names are his legacy: a complete refuge for all who chant them.',
    significanceHindi: 'भीष्म एकादशी सिखाती है कि ज्ञान कष्ट में पकता है — भीष्म की महानतम भेंट उनकी पीड़ा की शय्या से आई। सहस्र नाम उनकी विरासत हैं: जपने वालों के लिए पूर्ण आश्रय।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Saffron', 'Gold', 'White'],
  },

  // ============================================================================
  // JANMASHTAMI-SMART (Smartism emphasis — distinct from the main Janmashtami entry)
  // ============================================================================
  {
    id: 'janmashtami-smart',
    name: 'Janmashtami (Smart)',
    nameHindi: 'जन्माष्टमी (स्मार्त)',
    emoji: '🌙',
    story: `The Smarta observance of Janmashtami follows the sunrise-based Ashtami tithi (Udaya-tithi), honouring Krishna’s birth through Vedic rite rather than the midnight Nishita moment of the Vaishnava calendar. Where the main Janmashtami entry celebrates the midnight prison birth, the Smarta day centres on dawn puja, Veda-patha, and householder fast. The two days together let every tradition honour the same birth by its own reckoning.`,
    storyHindi: `जन्माष्टमी का स्मार्त पालन सूर्योदय-आधारित अष्टमी तिथि (उदया तिथि) का अनुसरण करता है, जो वैष्णव पंचांग के मध्यरात्रि निशिता क्षण के बजाय वैदिक विधि से कृष्ण जन्म का सम्मान करता है। जहाँ मुख्य जन्माष्टमी प्रविष्टि मध्यरात्रि कारागार-जन्म मनाती है, वहीं स्मार्त दिवस प्रातः पूजा, वेदपाठ और गृहस्थ उपवास पर केंद्रित है। दोनों दिन मिलकर हर परंपरा को अपनी गणना से उसी जन्म का सम्मान करने देते हैं।`,
    rituals: [
      'Observe the fast on the Udaya-tithi Ashtami with sunrise Sankalpa',
      'Perform dawn puja with Vedic mantras and Tulsi archana',
      'Read the Bhagavata Purana birth canto (Dashama Skandha) at home',
      'Break the fast after sunrise puja on the following morning',
    ],
    ritualsHindi: [
      'सूर्योदय संकल्प के साथ उदया तिथि अष्टमी को उपवास रखें',
      'वैदिक मंत्रों और तुलसी अर्चना के साथ प्रातः पूजा करें',
      'घर में भागवत पुराण का जन्म प्रसंग (दशम स्कंध) पढ़ें',
      'अगले प्रभात सूर्योदय पूजा के बाद व्रत का पारण करें',
    ],
    regionalVariations: [
      {
        region: 'Smarta households (pan-India)',
        regionHindi: 'स्मार्त परिवार (समस्त भारत)',
        variation: 'The emphasis is on domestic Vedic rite — havan and Purana reading rather than temple midnight crowds.',
        variationHindi: 'घरेलू वैदिक विधि पर जोर — मंदिर की मध्यरात्रि भीड़ के बजाय हवन और पुराण पाठ।',
      },
    ],
    significance: 'The Smarta Janmashtami preserves the Vedic householder’s way of honouring Krishna — by sunrise reckoning and scriptural study. It shows how one divine birth can unite many calendars in a single devotion.',
    significanceHindi: 'स्मार्त जन्माष्टमी कृष्ण-सम्मान की वैदिक गृहस्थ परंपरा को सुरक्षित रखती है — सूर्योदय गणना और शास्त्राध्ययन से। यह दिखाती है कि एक दिव्य जन्म अनेक पंचांगों को एक भक्ति में कैसे जोड़ता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Yellow', 'Peacock Blue', 'White'],
  },

  // ============================================================================
  // VAIKUNTHA EKADASHI (Pausha Shukla — Mura/Ekadashi Devi — Vaikuntha Dwara)
  // ============================================================================
  {
    id: 'vaikuntha-ekadashi',
    name: 'Vaikuntha Ekadashi',
    nameHindi: 'वैकुंठ एकादशी',
    emoji: '🚪',
    story: `Vaikuntha Ekadashi, the Shukla Ekadashi of Pausha, celebrates Vishnu’s victory over the demon Mura through the goddess Ekadashi Devi, who emerged from Vishnu to slay the asura — as told in the Padma Purana. On this one day the northern gate of Vaikuntha (Vaikuntha Dwara, called Paramapada Vasal in Tamil temples) is believed to stand open, and passing through it in temples like Srirangam and Tirupati grants liberation. Tradition holds that observing this single fast equals the merit of all twenty-four Ekadashis of the year.`,
    storyHindi: `वैकुंठ एकादशी, पौष मास की शुक्ल एकादशी, देवी एकादशी के द्वारा विष्णु की असुर मुर पर विजय का उत्सव है — देवी विष्णु से प्रकट हुईं और असुर का वध किया, जैसा पद्म पुराण में कहा गया है। इस एक दिन वैकुंठ का उत्तरी द्वार (वैकुंठ द्वार, तमिल मंदिरों में परमपद वासल) खुला माना जाता है, और श्रीरंगम-तिरुपति जैसे मंदिरों में इससे गुजरना मोक्ष देता है। परंपरा मानती है कि इस एक व्रत का पुण्य वर्ष की चौबीसों एकादशियों के बराबर है।`,
    rituals: [
      'Fast strictly on Ekadashi and pass through the Vaikuntha Dwara (Paramapada Vasal) at Vishnu temples',
      'Keep night vigil chanting the Vishnu Sahasranama and Suprabhatam',
      'Recite the Mura-vadha legend from the Padma Purana',
      'Break the fast on Dwadashi after offering Tulsi and naivedya to Vishnu',
      'Donate food and lamps to temples and the poor',
    ],
    ritualsHindi: [
      'एकादशी को कठोर उपवास रखें और विष्णु मंदिरों में वैकुंठ द्वार (परमपद वासल) से गुजरें',
      'विष्णु सहस्रनाम और सुप्रभातम के जप के साथ रात्रि जागरण करें',
      'पद्म पुराण से मुर-वध की कथा का पाठ करें',
      'विष्णु को तुलसी और नैवेद्य अर्पित कर द्वादशी को पारण करें',
      'मंदिरों और निर्धनों को भोजन और दीप दान करें',
    ],
    regionalVariations: [
      {
        region: 'Tamil Nadu (Srirangam)',
        regionHindi: 'तमिलनाडु (श्रीरंगम)',
        variation: 'Known as Swargavathil Ekadashi — the Paramapada Vasal opens once a year and lakhs pass through it during the 21-day Pagal Pathu festival.',
        variationHindi: 'स्वर्गवातिल एकादशी के नाम से प्रसिद्ध — परमपद वासल वर्ष में एक बार खुलता है और 21 दिवसीय पगल पत्तु उत्सव में लाखों इससे गुजरते हैं।',
      },
      {
        region: 'Andhra Pradesh, Telangana, and Tirupati',
        regionHindi: 'आंध्र प्रदेश, तेलंगाना और तिरुपति',
        variation: 'Celebrated as Mukkoti Ekadashi — all thirty-three crore deities are believed to witness Vishnu on this day.',
        variationHindi: 'मुक्कोटि एकादशी के रूप में मनाया जाता है — माना जाता है कि तैंतीस करोड़ देवता इस दिन विष्णु के दर्शन करते हैं।',
      },
    ],
    significance: 'Vaikuntha Ekadashi is the gateway fast — one open door to liberation. The Mura legend teaches that divine grace itself takes form (as Ekadashi Devi) to protect the devotee, and that a single sincere observance can carry the weight of a whole year.',
    significanceHindi: 'वैकुंठ एकादशी मोक्ष का द्वार-व्रत है — मुक्ति का एक खुला द्वार। मुर की कथा सिखाती है कि दिव्य कृपा स्वयं रूप धरकर (देवी एकादशी बनकर) भक्त की रक्षा करती है, और एक निष्ठापूर्ण पालन पूरे वर्ष का भार वहन कर सकता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Gold', 'White', 'Peacock Blue'],
  },

  // ============================================================================
  // BASANT PANCHAMI (North-Indian Basant angle — distinct from Vasant Panchami)
  // ============================================================================
  {
    id: 'basant-panchami',
    name: 'Basant Panchami',
    nameHindi: 'बसंत पंचमी',
    emoji: '🪁',
    story: `Basant Panchami greets the arrival of spring (बसंत) in North India — fields of flowering mustard, clear skies, and the yellow garments of the season. While the companion Vasant Panchami entry honours Goddess Saraswati and learning, this Basant observance belongs to the fields and rooftops: farmers celebrate the mustard bloom and towns fill the sky with kites. It is spring itself, welcomed as a guest.`,
    storyHindi: `बसंत पंचमी उत्तर भारत में वसंत (बसंत) के आगमन का स्वागत करती है — फूली सरसों के खेत, निर्मल आकाश और ऋतु के पीले वस्त्र। जहाँ सहयोगी वसंत पंचमी प्रविष्टि देवी सरस्वती और विद्या का सम्मान करती है, वहीं यह बसंत पालन खेतों और छतों का है: किसान सरसों के फूल का उत्सव मनाते हैं और नगरों का आकाश पतंगों से भर जाता है। यह स्वयं वसंत है, अतिथि की तरह स्वागत किया गया।`,
    rituals: [
      'Wear yellow garments and offer yellow flowers and mustard blossoms',
      'Fly kites from rooftops with family and neighbours',
      'Prepare and share saffron rice (meethe chawal) and ber sweets',
      'Walk through mustard fields and offer the first blossoms at local shrines',
    ],
    ritualsHindi: [
      'पीले वस्त्र पहनें और पीले फूल व सरसों के फूल अर्पित करें',
      'परिवार और पड़ोसियों के साथ छतों से पतंग उड़ाएं',
      'केसरिया चावल (मीठे चावल) और बेर की मिठाई बनाकर बांटें',
      'सरसों के खेतों में घूमें और पहले फूल स्थानीय मंदिरों में चढ़ाएं',
    ],
    regionalVariations: [
      {
        region: 'Punjab and Haryana',
        regionHindi: 'पंजाब और हरियाणा',
        variation: 'A harvest-festival mood — fairs, folk songs, and saffron-tinted feasts in the mustard country.',
        variationHindi: 'फसल-उत्सव का माहौल — सरसों के देश में मेले, लोकगीत और केसरिया भोज।',
      },
      {
        region: 'Delhi and Uttar Pradesh',
        regionHindi: 'दिल्ली और उत्तर प्रदेश',
        variation: 'Famous for rooftop kite-flying battles and the seasonal sweet of ber and jaggery.',
        variationHindi: 'छतों की पतंगबाज़ी और बेर-गुड़ की मौसमी मिठाई के लिए प्रसिद्ध।',
      },
    ],
    significance: 'Basant Panchami honours the turning of the earth itself — the moment winter loosens and the land flowers. Its yellow is not decoration but declaration: life returns, and the community greets it together.',
    significanceHindi: 'बसंत पंचमी स्वयं धरती के करवट बदलने का सम्मान है — वह क्षण जब शीत ढीला पड़ता है और धरती फूल उठती है। इसका पीला रंग सज्जा नहीं, घोषणा है: जीवन लौटता है, और समाज मिलकर उसका स्वागत करता है।',
    duration: '1 day',
    durationHindi: '१ दिन',
    colors: ['Yellow', 'Gold', 'Green'],
  },
];
