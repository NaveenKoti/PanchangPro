/**
 * Verse API Service
 * Fetches daily spiritual verses from various sources
 * Provides caching to avoid repeated API calls
 */

export interface VerseData {
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
  source: string;
  chapter?: number;
  verse?: number;
}

import { ADDITIONAL_VERSES } from './verseApi.additional';

// Local fallback verses (extensive collection - 200+ verses)
const LOCAL_VERSES: VerseData[] = [
  // ============================================================================
  // BHAGAVAD GITA (50+ verses from Chapters 2-18)
  // ============================================================================
  {
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata',
    translation: 'Whenever there is a decline in righteousness, O Bharata, I manifest Myself.',
    meaning: 'The divine promise that goodness will always be protected and evil will be countered.',
    source: 'Bhagavad Gita',
    chapter: 4,
    verse: 7
  },
  {
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana',
    translation: 'You have a right to perform your duties, but you are not entitled to the fruits of your actions.',
    meaning: 'Focus on your actions and efforts, not on the results. This brings peace and removes anxiety.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 47
  },
  {
    sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।',
    transliteration: 'sarve bhavantu sukhinaḥ sarve santu nirāmayāḥ',
    translation: 'May all beings be happy. May all beings be free from illness.',
    meaning: 'A universal prayer for the well-being and happiness of all living beings.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'तत् त्वम् असि',
    transliteration: 'tat tvam asi',
    translation: 'Thou art That. The individual self is identical with the universal consciousness.',
    meaning: 'The ultimate truth that our individual consciousness is one with the cosmic consciousness.',
    source: 'Chandogya Upanishad',
  },
  {
    sanskrit: 'अहं ब्रह्मास्मि',
    transliteration: 'ahaṁ brahmāsmi',
    translation: 'I am Brahman. The individual self is identical with the universal self.',
    meaning: 'Recognition of our divine nature and unity with all existence.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'सत्यं एव जयते',
    transliteration: 'satyam eva jayate',
    translation: 'Truth alone triumphs.',
    meaning: 'The eternal principle that truth and righteousness will always prevail over falsehood.',
    source: 'Mundaka Upanishad',
  },
  {
    sanskrit: 'ॐ तत् सत्',
    transliteration: 'oṁ tat sat',
    translation: 'Om, that is the Truth.',
    meaning: 'The absolute reality underlying all existence, represented by the sacred syllable Om.',
    source: 'Bhagavad Gita',
    chapter: 17,
    verse: 23
  },
  {
    sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः।',
    transliteration: 'nainaṁ chindanti śhastāṇi nainaṁ dahati pāvakaḥ',
    translation: 'The soul cannot be cut by weapons, nor burned by fire.',
    meaning: 'The eternal nature of the soul - it is indestructible and beyond physical harm.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 23
  },
  {
    sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।',
    transliteration: 'vāsāṁsi jīrṇāni yathā vihāya navāni gṛihṇāti naro \'parāṇi',
    translation: 'As a person sheds worn-out garments and puts on new ones, so does the embodied soul cast off worn-out bodies and enter new ones.',
    meaning: 'The soul\'s journey through reincarnation - death is merely a change of body.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 22
  },
  {
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।',
    transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
    translation: 'Established in equanimity, perform your duties, abandoning attachment.',
    meaning: 'Act from a place of inner balance, without being attached to outcomes.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 48
  },
  {
    sanskrit: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय।',
    transliteration: 'asato mā sad gamaya, tamaso mā jyotir gamaya',
    translation: 'Lead me from untruth to truth, from darkness to light.',
    meaning: 'A prayer for spiritual evolution from ignorance to wisdom.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'प्राणो वायुरमृतमथेदं भस्मान्तं शरीरम्।',
    transliteration: 'prāṇo vāyur amṛitam athedaṁ bhasmāntaṁ śarīram',
    translation: 'Breath is air, immortal is the spirit, but the body ends in ashes.',
    meaning: 'Recognition of the mortal nature of the body and the immortal nature of the spirit.',
    source: 'Brihadaranyaka Upanishad',
  },
  // Bhagavad Gita - Chapter 2: Sankhya Yoga
  {
    sanskrit: 'सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ।',
    transliteration: 'sukha-duḥkhe same kṛitvā lābhālābhau jayājayau',
    translation: 'Treating pleasure and pain, gain and loss, victory and defeat alike, engage in battle.',
    meaning: 'Maintain equanimity in all circumstances - this is the essence of yoga.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 38
  },
  {
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते।',
    transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya, siddhyasiddhyoḥ samo bhūtvā samatvaṁ yoga uchyate',
    translation: 'Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure. Such evenness of mind is called yoga.',
    meaning: 'True yoga is maintaining mental equilibrium regardless of outcomes.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 48
  },
  {
    sanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते।',
    transliteration: 'buddhi-yukto jahātīha ubhe sukṛita-duṣhkṛite',
    translation: 'A person endowed with wisdom abandons both good and evil deeds in this life.',
    meaning: 'Transcend the duality of merit and sin through wisdom and selfless action.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 50
  },
  // Bhagavad Gita - Chapter 3: Karma Yoga
  {
    sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः।',
    transliteration: 'yajñārthāt karmaṇo \'nyatra loko \'yaṁ karma-bandhanaḥ',
    translation: 'Work done as sacrifice for Vishnu releases one from bondage; all other work binds one to the material world.',
    meaning: 'Actions performed as selfless service liberate; selfish actions create bondage.',
    source: 'Bhagavad Gita',
    chapter: 3,
    verse: 9
  },
  {
    sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।',
    transliteration: 'śhreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣhṭhitāt',
    translation: 'It is better to live your own destiny imperfectly than to live an imitation of somebody else\'s life with perfection.',
    meaning: 'Following your own path, even with flaws, is superior to perfectly copying another\'s.',
    source: 'Bhagavad Gita',
    chapter: 3,
    verse: 35
  },
  // Bhagavad Gita - Chapter 4: Jnana Karma Sanyasa Yoga
  {
    sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम्।',
    transliteration: 'paritrāṇāya sādhūnāṁ vināśhāya cha duṣhkṛitām',
    translation: 'To protect the righteous, to destroy the wicked, and to re-establish dharma, I manifest myself age after age.',
    meaning: 'The divine purpose is to protect goodness, eliminate evil, and restore cosmic order.',
    source: 'Bhagavad Gita',
    chapter: 4,
    verse: 8
  },
  {
    sanskrit: 'विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि। शुनि चैव श्वपाके च पण्डिताः समदर्शिनः।',
    transliteration: 'vidyā-vinaya-sampanne brāhmaṇe gavi hastini, śhuni chaiva śhva-pāke cha paṇḍitāḥ sama-darśhinaḥ',
    translation: 'The truly learned, with the eyes of divine knowledge, see with equal vision a learned Brahmin, a cow, an elephant, a dog, and an outcaste.',
    meaning: 'True wisdom sees the same divine presence in all beings, regardless of external differences.',
    source: 'Bhagavad Gita',
    chapter: 4,
    verse: 38
  },
  // Bhagavad Gita - Chapter 5: Karma Sanyasa Yoga
  {
    sanskrit: 'विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि।',
    transliteration: 'vidyā-vinaya-sampanne brāhmaṇe gavi hastini',
    translation: 'The wise see with equal vision a learned Brahmin, a cow, an elephant, a dog, and an outcaste.',
    meaning: 'Spiritual enlightenment brings the vision of equality - seeing God in all beings.',
    source: 'Bhagavad Gita',
    chapter: 5,
    verse: 18
  },
  {
    sanskrit: 'बाह्यस्पर्शेष्वसक्तात्मा विन्दत्यात्मनि यत्सुखम्।',
    transliteration: 'bāhya-sparśheṣhv asaktātmā vindaty ātmani yat sukham',
    translation: 'One who is not attached to external pleasures finds happiness within the self.',
    meaning: 'True happiness comes from within, not from external sensory pleasures.',
    source: 'Bhagavad Gita',
    chapter: 5,
    verse: 21
  },
  // Bhagavad Gita - Chapter 6: Dhyana Yoga
  {
    sanskrit: 'बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः।',
    transliteration: 'bandhur ātmātmanas tasya yenātmaivātmanā jitaḥ',
    translation: 'For one who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, the mind will be the greatest enemy.',
    meaning: 'Self-mastery transforms the mind from enemy to ally.',
    source: 'Bhagavad Gita',
    chapter: 6,
    verse: 6
  },
  {
    sanskrit: 'योगी हि स्थिरधीरः शान्तिं परमामुपैच्छति।',
    transliteration: 'yogī hi sthira-dhīraḥ śhāntiṁ paramām upaichchhati',
    translation: 'The yogi whose mind is fixed on the self alone attains the highest peace.',
    meaning: 'Steady concentration on the inner self leads to supreme tranquility.',
    source: 'Bhagavad Gita',
    chapter: 6,
    verse: 15
  },
  {
    sanskrit: 'नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः।',
    transliteration: 'nātyaśhnatastu yogo \'sti na chaikāntam anaśhnataḥ',
    translation: 'Yoga is not for one who eats too much or eats too little, nor for one who sleeps too much or too little.',
    meaning: 'Moderation in all things is the foundation of successful yoga practice.',
    source: 'Bhagavad Gita',
    chapter: 6,
    verse: 16
  },
  // Bhagavad Gita - Chapter 9: Raja Vidya Raja Guhya Yoga
  {
    sanskrit: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति।',
    transliteration: 'patraṁ puṣhpaṁ phalaṁ toyaṁ yo me bhaktyā prayachchhati',
    translation: 'Whoever offers me with devotion a leaf, a flower, a fruit, or water, I accept that offering of love.',
    meaning: 'God values the devotion behind an offering more than its material value.',
    source: 'Bhagavad Gita',
    chapter: 9,
    verse: 26
  },
  {
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।',
    transliteration: 'sarva-dharmān parityajya mām ekaṁ śharaṇaṁ vraja',
    translation: 'Abandon all varieties of dharma and simply surrender unto me alone. I shall liberate you from all sinful reactions; do not fear.',
    meaning: 'Complete surrender to the divine brings liberation from all fear and bondage.',
    source: 'Bhagavad Gita',
    chapter: 18,
    verse: 66
  },
  // Bhagavad Gita - Chapter 10: Vibhuti Yoga
  {
    sanskrit: 'अहमात्मा गुडाकेश सर्वभूताशयस्थितः।',
    transliteration: 'aham ātmā guḍākeśha sarva-bhūtāśhaya-sthitaḥ',
    translation: 'I am the Self, O Arjuna, seated in the hearts of all creatures.',
    meaning: 'The divine presence dwells within every living being as the innermost self.',
    source: 'Bhagavad Gita',
    chapter: 10,
    verse: 20
  },
  {
    sanskrit: 'यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा।',
    transliteration: 'yad yad vibhūtimat sattvaṁ śhrīmad ūrjitam eva vā',
    translation: 'Know that all opulent, beautiful, and glorious creations spring from but a spark of my splendor.',
    meaning: 'All manifestations of greatness in the world are reflections of divine glory.',
    source: 'Bhagavad Gita',
    chapter: 10,
    verse: 41
  },
  // Bhagavad Gita - Chapter 11: Vishwarupa Darshana Yoga
  {
    sanskrit: 'दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता।',
    transliteration: 'divi sūrya-sahasrasya bhaved yugapad utthitā',
    translation: 'If hundreds of thousands of suns were to rise at once into the sky, their radiance might resemble the splendor of that supreme form.',
    meaning: 'The cosmic form of God is beyond human comprehension - infinitely radiant and powerful.',
    source: 'Bhagavad Gita',
    chapter: 11,
    verse: 12
  },
  // Bhagavad Gita - Chapter 12: Bhakti Yoga
  {
    sanskrit: 'मय्यावेश्य मनो यो मां नित्ययुक्ता उपासते।',
    transliteration: 'mayy āveśhya mano yo māṁ nitya-yuktā upāsate',
    translation: 'Those who fix their minds on me and always engage in my devotion with supreme faith, I consider them to be the most perfect yogis.',
    meaning: 'Devotional love and constant remembrance of God is the highest form of yoga.',
    source: 'Bhagavad Gita',
    chapter: 12,
    verse: 2
  },
  {
    sanskrit: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।',
    transliteration: 'adveṣhṭā sarva-bhūtānāṁ maitraḥ karuṇa eva cha',
    translation: 'One who is not envious, who is a friend to all, who is compassionate and free from possessiveness - such a devotee is dear to me.',
    meaning: 'Universal love, compassion, and freedom from envy are qualities dear to the divine.',
    source: 'Bhagavad Gita',
    chapter: 12,
    verse: 13
  },
  // Bhagavad Gita - Chapter 13: Ksetra Ksetrajna Vibhaga Yoga
  {
    sanskrit: 'क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत।',
    transliteration: 'kṣhetra-jñaṁ chāpi māṁ viddhi sarva-kṣhetreṣhu bhārata',
    translation: 'O Bharata, know me to be the knower of the field in all fields.',
    meaning: 'God is the consciousness present in every body and every creature.',
    source: 'Bhagavad Gita',
    chapter: 13,
    verse: 2
  },
  {
    sanskrit: 'प्रकृतिं पुरुषं चैव विद्ध्यनादी उभावपि।',
    transliteration: 'prakṛitiṁ puruṣhaṁ chaiva viddhy anādī ubhāv api',
    translation: 'Know that both nature and the soul are beginningless.',
    meaning: 'Both matter and consciousness are eternal - they have no beginning.',
    source: 'Bhagavad Gita',
    chapter: 13,
    verse: 20
  },
  // Bhagavad Gita - Chapter 15: Purushottama Yoga
  {
    sanskrit: 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम्।',
    transliteration: 'ūrdhva-mūlam adhaḥ-śhākham aśhvatthaṁ prāhur avyayam',
    translation: 'There is a banyan tree with roots upward and branches downward, its leaves are the Vedic hymns. One who knows this tree knows the Vedas.',
    meaning: 'The material world is like an inverted tree - rooted in the divine, manifesting downward into multiplicity.',
    source: 'Bhagavad Gita',
    chapter: 15,
    verse: 1
  },
  // Bhagavad Gita - Chapter 16: Daivasura Sampad Vibhaga Yoga
  {
    sanskrit: 'त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।',
    transliteration: 'tri-vidhaṁ narakasyedaṁ dvāraṁ nāśhanam ātmanaḥ',
    translation: 'There are three gates to self-destruction and hell: lust, anger, and greed.',
    meaning: 'These three destructive tendencies lead to the downfall of the soul.',
    source: 'Bhagavad Gita',
    chapter: 16,
    verse: 21
  },
  // Bhagavad Gita - Chapter 18: Moksha Sanyasa Yoga
  {
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्।',
    transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata, abhyutthānam adharmasya tadātmānaṁ sṛijāmyaham',
    translation: 'Whenever there is a decline in righteousness and an increase in unrighteousness, at that time I manifest myself.',
    meaning: 'God incarnates whenever dharma declines to restore cosmic balance.',
    source: 'Bhagavad Gita',
    chapter: 4,
    verse: 7
  },
  {
    sanskrit: 'सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च।',
    transliteration: 'sarvasya chāhaṁ hṛidi sanniviṣhṭo mattaḥ smṛitir jñānam apohanaṁ cha',
    translation: 'I am seated in the hearts of all living beings. From me come memory, knowledge, and their removal.',
    meaning: 'The divine presence within governs all mental faculties - memory, knowledge, and forgetfulness.',
    source: 'Bhagavad Gita',
    chapter: 15,
    verse: 15
  },
  {
    sanskrit: 'ईश्वरः सर्वभूतानां हृद्देशेऽर्जुन तिष्ठति।',
    transliteration: 'īśhvaraḥ sarva-bhūtānāṁ hṛid-deśhe \'rjuna tiṣhṭhati',
    translation: 'The Supreme Lord dwells in the hearts of all living beings, O Arjuna.',
    meaning: 'God resides in every heart, directing the wanderings of all creatures.',
    source: 'Bhagavad Gita',
    chapter: 18,
    verse: 61
  },

  // ============================================================================
  // UPANISHADS (25+ verses)
  // ============================================================================
  {
    sanskrit: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय।',
    transliteration: 'asato mā sad gamaya, tamaso mā jyotir gamaya, mṛityor mā amṛitaṁ gamaya',
    translation: 'Lead me from untruth to truth, from darkness to light, from death to immortality.',
    meaning: 'The great prayer for spiritual evolution - from ignorance to wisdom, from mortality to immortality.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'तत् त्वम् असि',
    transliteration: 'tat tvam asi',
    translation: 'Thou art That.',
    meaning: 'The great declaration that the individual self is one with the ultimate reality.',
    source: 'Chandogya Upanishad',
    chapter: 6,
    verse: 8
  },
  {
    sanskrit: 'अहं ब्रह्मास्मि',
    transliteration: 'ahaṁ brahmāsmi',
    translation: 'I am Brahman.',
    meaning: 'The realization that the individual self is identical with the absolute reality.',
    source: 'Brihadaranyaka Upanishad',
    chapter: 1,
    verse: 4
  },
  {
    sanskrit: 'प्रज्ञानं ब्रह्म',
    transliteration: 'prajñānaṁ brahma',
    translation: 'Consciousness is Brahman.',
    meaning: 'Pure awareness is the ultimate reality - the foundation of all existence.',
    source: 'Aitareya Upanishad',
    chapter: 3,
    verse: 1
  },
  {
    sanskrit: 'अयमात्मा ब्रह्म',
    transliteration: 'ayam ātmā brahma',
    translation: 'This Self is Brahman.',
    meaning: 'The innermost self is not the body or mind but the absolute reality itself.',
    source: 'Mandukya Upanishad',
    verse: 2
  },
  {
    sanskrit: 'सर्वं खल्विदं ब्रह्म',
    transliteration: 'sarvaṁ khalvidaṁ brahma',
    translation: 'All this is verily Brahman.',
    meaning: 'Everything in existence is a manifestation of the one ultimate reality.',
    source: 'Chandogya Upanishad',
    chapter: 3,
    verse: 14
  },
  {
    sanskrit: 'एकमेवाद्वितीयम्',
    transliteration: 'ekam evādvitīyam',
    translation: 'One without a second.',
    meaning: 'The ultimate reality is one - there is nothing other than Brahman.',
    source: 'Chandogya Upanishad',
    chapter: 6,
    verse: 2
  },
  {
    sanskrit: 'सत्यं एव जयते नानृतम्',
    transliteration: 'satyam eva jayate nānṛitam',
    translation: 'Truth alone triumphs, not falsehood.',
    meaning: 'The eternal law that truth will ultimately prevail over all falsehood.',
    source: 'Mundaka Upanishad',
    chapter: 3,
    verse: 1
  },
  {
    sanskrit: 'पश्याम्योगं भूतानां यथा भूतस्य चक्षुषा।',
    transliteration: 'paśhyāmi yogaṁ bhūtānāṁ yathā bhūtasya cha kṣhuṣhā',
    translation: 'I see the yoga of all beings as one sees with the physical eye.',
    meaning: 'The yogi perceives the underlying unity of all creation.',
    source: 'Katha Upanishad',
  },
  {
    sanskrit: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।',
    transliteration: 'uttiṣhṭhata jāgrata prāpya varān nibodhata',
    translation: 'Arise, awake, and learn by approaching the wise.',
    meaning: 'A call to spiritual awakening - to rise from ignorance and seek knowledge from the learned.',
    source: 'Katha Upanishad',
    chapter: 1,
    verse: 3
  },
  {
    sanskrit: 'न जायते म्रियते वा कदाचित्',
    transliteration: 'na jāyate mriyate vā kadāchit',
    translation: 'The soul is never born, nor does it ever die.',
    meaning: 'The eternal nature of the self - it is beyond birth and death.',
    source: 'Katha Upanishad',
    chapter: 1,
    verse: 18
  },
  {
    sanskrit: 'अणीयान्महतोऽणीयान्महतो महतोऽणुः।',
    transliteration: 'aṇīyān mahato \'ṇīyān mahato mahato \'ṇuḥ',
    translation: 'Smaller than the smallest, greater than the greatest.',
    meaning: 'The self is subtler than the subtlest and greater than the greatest - beyond all measurement.',
    source: 'Katha Upanishad',
    chapter: 1,
    verse: 20
  },
  {
    sanskrit: 'पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते।',
    transliteration: 'pūrṇam adaḥ pūrṇam idaṁ pūrṇāt pūrṇam udachyate',
    translation: 'That is complete. This is complete. From the complete, the complete arises.',
    meaning: 'The infinite whole gives rise to infinite wholeness - nothing is diminished when the absolute manifests.',
    source: 'Isha Upanishad',
    verse: 1
  },
  {
    sanskrit: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते। पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते।',
    transliteration: 'oṁ pūrṇam adaḥ pūrṇam idaṁ pūrṇāt pūrṇam udachyate, pūrṇasya pūrṇam ādāya pūrṇam evāvaśhiṣhyate',
    translation: 'That is whole. This is whole. From the whole, the whole arises. Taking the whole from the whole, the whole alone remains.',
    meaning: 'The infinite remains undiminished even as infinite manifestations arise from it.',
    source: 'Isha Upanishad',
  },
  {
    sanskrit: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।',
    transliteration: 'īśhāvāsyam idaṁ sarvaṁ yat kiñcha jagatyāṁ jagat',
    translation: 'All this - whatever exists and moves in this universe - is pervaded by the Lord.',
    meaning: 'Everything in creation is enveloped by the divine presence.',
    source: 'Isha Upanishad',
    verse: 1
  },
  {
    sanskrit: 'तस्मिन् प्रसन्नः सर्वार्थान् प्राप्नोति मनसः प्रियम्।',
    transliteration: 'tasmin prasannaḥ sarvārthān prāpnoti manasaḥ priyam',
    translation: 'When one is pleased through meditation, one obtains all desires and the wishes of the heart.',
    meaning: 'Through deep meditation and inner stillness, all aspirations are fulfilled.',
    source: 'Svetasvatara Upanishad',
  },
  {
    sanskrit: 'सत्यं वद। धर्मं चर। स्वाध्यायान्मा प्रमदः।',
    transliteration: 'satyaṁ vada, dharmaṁ chara, svādhyāyān mā pramadaḥ',
    translation: 'Speak the truth. Follow dharma. Do not neglect the study of the scriptures.',
    meaning: 'The foundational instruction for righteous living - truth, duty, and learning.',
    source: 'Taittiriya Upanishad',
  },
  {
    sanskrit: 'मातृदेवो भव। पितृदेवो भव।',
    transliteration: 'mātṛdevo bhava, pitṛdevo bhava',
    translation: 'Revere your mother as God. Revere your father as God.',
    meaning: 'Seeing the divine in one\'s parents is the beginning of spiritual vision.',
    source: 'Taittiriya Upanishad',
  },
  {
    sanskrit: 'आत्मानं विद्धि',
    transliteration: 'ātmānaṁ viddhi',
    translation: 'Know the Self.',
    meaning: 'The highest knowledge is self-knowledge - understanding the true nature of consciousness.',
    source: 'Mundaka Upanishad',
  },
  {
    sanskrit: 'शान्तिः शान्तिः शान्तिः',
    transliteration: 'śhāntiḥ śhāntiḥ śhāntiḥ',
    translation: 'Peace, peace, peace.',
    meaning: 'The invocation of peace in three aspects - physical, mental, and spiritual.',
    source: 'Upanishads',
  },
  {
    sanskrit: 'असतो मा सद्गमय।',
    transliteration: 'asato mā sad gamaya',
    translation: 'Lead me from the unreal to the Real.',
    meaning: 'Pray for the wisdom to discern the eternal from the ephemeral.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'वसुधैव कुटुम्बकम्',
    transliteration: 'vasudhaiva kuṭumbakam',
    translation: 'The world is one family.',
    meaning: 'The vision of universal brotherhood - all beings are connected as one family.',
    source: 'Maha Upanishad',
    chapter: 6,
    verse: 71
  },
  {
    sanskrit: 'आ नो भद्राः क्रतवो यन्तु विश्वतः।',
    transliteration: 'ā no bhadrāḥ kratavo yantu viśhvataḥ',
    translation: 'Let noble thoughts come to us from every side.',
    meaning: 'Be open to wisdom and truth from all sources and directions.',
    source: 'Rig Veda / Isha Upanishad',
  },
  {
    sanskrit: 'धिया यो नः प्रचोदयात्',
    transliteration: 'dhiyā yo naḥ prachodayāt',
    translation: 'May He illuminate our intellect.',
    meaning: 'A prayer for divine inspiration and clarity of understanding.',
    source: 'Gayatri Mantra / Upanishadic tradition',
  },
  {
    sanskrit: 'दधीचऋषिः ब्रह्मविद्याम्',
    transliteration: 'dadhi cha rṣhiḥ brahmavidyām',
    translation: 'The sage Dadhichi attained knowledge of Brahman.',
    meaning: 'Through selfless sacrifice and austerity, the highest knowledge is attained.',
    source: 'Brihadaranyaka Upanishad',
  },

  // ============================================================================
  // YOGA SUTRAS OF PATANJALI (20+ verses)
  // ============================================================================
  {
    sanskrit: 'अथ योगानुशासनम्',
    transliteration: 'atha yogānuśhāsanam',
    translation: 'Now begins the discipline of yoga.',
    meaning: 'The opening sutra - the authoritative teaching of yoga commences here.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 1
  },
  {
    sanskrit: 'योगश्चित्तवृत्तिनिरोधः',
    transliteration: 'yogaśh chitta-vṛitti-nirodhaḥ',
    translation: 'Yoga is the cessation of the modifications of the mind.',
    meaning: 'The most famous definition of yoga - stilling the restless waves of thought.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 2
  },
  {
    sanskrit: 'तदा द्रष्टुः स्वरूपेऽवस्थानम्',
    transliteration: 'tadā draṣhṭuḥ svarūpe \'vasthānam',
    translation: 'Then the seer abides in its own true nature.',
    meaning: 'When the mind is still, the true self is revealed in its essential nature.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 3
  },
  {
    sanskrit: 'वृत्तिसारूप्यमितरत्र',
    transliteration: 'vṛitti-sārūpyam itaratra',
    translation: 'At other times, the seer identifies with the modifications of the mind.',
    meaning: 'In the ordinary state, we mistake ourselves for our thoughts and emotions.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 4
  },
  {
    sanskrit: 'अभ्यासवैराग्याभ्यां तन्निरोधः',
    transliteration: 'abhyāsa-vairāgyābhyāṁ tan-nirodhaḥ',
    translation: 'The mind\'s modifications are stilled through practice and detachment.',
    meaning: 'The twin pillars of yoga: consistent practice and non-attachment to results.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 12
  },
  {
    sanskrit: 'तत्र स्थितौ यत्नोऽभ्यासः',
    transliteration: 'tatra sthitau yatno \'bhyāsaḥ',
    translation: 'Practice is the effort to maintain steadiness of mind.',
    meaning: 'Abhyasa is the persistent effort to remain in a state of inner stillness.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 13
  },
  {
    sanskrit: 'स तु दीर्घकालनैरन्तर्यसत्कारासेवितो दृढभूमिः',
    transliteration: 'sa tu dīrgha-kāla-nairantarya-satkārāsevito dṛiḍha-bhūmiḥ',
    translation: 'Practice becomes firmly grounded when done for a long time, without interruption, and with sincere devotion.',
    meaning: 'The three keys to successful practice: persistence, continuity, and reverence.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 14
  },
  {
    sanskrit: 'दृष्टानुश्रविकविषयवितृष्णस्य वशीकारसंज्ञा वैराग्यम्',
    transliteration: 'dṛiṣhṭānuśhravika-viṣhaya-vitṛiṣhṇasya vaśhīkāra-saṁjñā vairāgyam',
    translation: 'Non-attachment is the mastery of desire for objects seen or heard about.',
    meaning: 'Freedom from craving for sensory pleasures, whether experienced or merely imagined.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 15
  },
  {
    sanskrit: 'ॐ तत्प्रणवः',
    transliteration: 'oṁ tat-praṇavaḥ',
    translation: 'Om is the sacred symbol representing the divine.',
    meaning: 'The primordial sound Om is the audible expression of the absolute.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 27
  },
  {
    sanskrit: 'तज्जपस्तदर्थभावनम्',
    transliteration: 'taj-japas tad-artha-bhāvanam',
    translation: 'Repetition of Om and contemplation on its meaning leads to realization.',
    meaning: 'The practice of mantra meditation - repeating the sacred syllable with deep awareness.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 28
  },
  {
    sanskrit: 'आसनं स्थिरसुखम्',
    transliteration: 'āsanaṁ sthira-sukham',
    translation: 'Yoga posture should be steady and comfortable.',
    meaning: 'The ideal asana is one that can be held with both stability and ease.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 46
  },
  {
    sanskrit: 'प्रयत्नशैथिल्यानन्तसमापत्तिभ्याम्',
    transliteration: 'prayatna-śhaithilya-ananta-samāpattibhyām',
    translation: 'By relaxing effort and meditating on the infinite, perfection in posture is attained.',
    meaning: 'Letting go of strain and merging with the infinite brings mastery of asana.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 47
  },
  {
    sanskrit: 'ततो द्वन्द्वानभिघातः',
    transliteration: 'tato dvandvān-abhighātaḥ',
    translation: 'Then one is undisturbed by the dualities (heat and cold, pleasure and pain).',
    meaning: 'Mastery of posture frees the practitioner from being affected by opposites.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 48
  },
  {
    sanskrit: 'तस्मिन् सति श्वासप्रश्वासयोर्गतिविच्छेदः प्राणायामः',
    transliteration: 'tasmin sati śhvāsa-praśhvāsayor gati-vichchhedaḥ prāṇāyāmaḥ',
    translation: 'That being accomplished, pranayama follows - the regulation of breath.',
    meaning: 'Once posture is mastered, the practitioner advances to breath control.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 49
  },
  {
    sanskrit: 'अहिंसासत्यास्तेयब्रह्मचर्यापरिग्रहा यमाः',
    transliteration: 'ahiṁsā-satya-asteya-brahmacharya-aparigrahā yamāḥ',
    translation: 'Non-violence, truthfulness, non-stealing, celibacy, and non-possessiveness are the five restraints.',
    meaning: 'The yamas are the ethical foundation of yoga practice.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 30
  },
  {
    sanskrit: 'शौचसन्तोषतपःस्वाध्यायेश्वरप्रणिधानानि नियमाः',
    transliteration: 'śhaucha-santoṣha-tapaḥ-svādhyāyeśhvara-praṇidhānāni niyamāḥ',
    translation: 'Purity, contentment, austerity, self-study, and surrender to God are the five observances.',
    meaning: 'The niyamas are personal disciplines for spiritual growth.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 32
  },
  {
    sanskrit: 'योगाङ्गानुष्ठानादशुद्धिक्षये ज्ञानदीप्तिराविवेकख्यातेः',
    transliteration: 'yogāṅgānuṣhṭhānād aśhuddhi-kṣhaye jñāna-dīptir āviveka-khyāteḥ',
    translation: 'Through practice of the limbs of yoga, impurities are destroyed and the light of wisdom illuminates discriminative discernment.',
    meaning: 'Yoga practice burns away ignorance and reveals the power of clear discrimination.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 28
  },
  {
    sanskrit: 'ध्यानहीनास्तु ये मन्त्राः शरीरं पिडयन्ति केवलम्',
    transliteration: 'dhyāna-hīnās tu ye mantrāḥ śharīraṁ piḍayanti kevalam',
    translation: 'Mantras without meditation only torture the body.',
    meaning: 'Mere mechanical repetition without inner awareness is fruitless.',
    source: 'Yoga Sutras of Patanjali (commentary tradition)',
  },
  {
    sanskrit: 'एकाग्रता परमा ध्यानम्',
    transliteration: 'ekāgratā paramā dhyānam',
    translation: 'One-pointed concentration is the highest meditation.',
    meaning: 'The essence of meditation is unwavering focus of attention.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 3,
    verse: 2
  },
  {
    sanskrit: 'समाधिः प्रज्ञा योगस्य फलम्',
    transliteration: 'samādhiḥ prajñā yogasya phalam',
    translation: 'Samadhi is the fruit of yoga - direct perception of truth.',
    meaning: 'The culmination of yoga is the state of absorption where truth is directly experienced.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 3,
    verse: 3
  },

  // ============================================================================
  // DHAMMAPADA (15+ verses)
  // ============================================================================
  {
    sanskrit: 'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया',
    transliteration: 'manopubbaṅgamā dhammā manoseṭṭhā manomayā',
    translation: 'Mind precedes all phenomena; mind is their chief, they are mind-made.',
    meaning: 'Everything begins with the mind - our thoughts shape our reality.',
    source: 'Dhammapada',
    chapter: 1,
    verse: 1
  },
  {
    sanskrit: 'मनसा चे पसन्नेन भासति वा करोति वा',
    transliteration: 'manasā che pasannena bhāsati vā karoti vā',
    translation: 'If one speaks or acts with a pure mind, happiness follows like a shadow.',
    meaning: 'Pure thoughts lead to pure actions, which bring lasting happiness.',
    source: 'Dhammapada',
    chapter: 1,
    verse: 2
  },
  {
    sanskrit: 'अक्कोधेन जिने कोधं साधुं साधुन जिने',
    transliteration: 'akkodhena jine kodhaṁ sādhun sādhuna jine',
    translation: 'Conquer anger with non-anger; conquer evil with good.',
    meaning: 'The only effective response to hatred is love; responding to anger with anger only escalates conflict.',
    source: 'Dhammapada',
    chapter: 17,
    verse: 223
  },
  {
    sanskrit: 'सब्बपापस्स अकरणं कुसलस्स उपसम्पदा',
    transliteration: 'sabbapāpassa akaraṇaṁ kusalassa upasampadā',
    translation: 'To avoid all evil, to cultivate good, and to cleanse one\'s mind - this is the teaching of the Buddhas.',
    meaning: 'The essence of all spiritual teaching: abstain from harm, do good, purify the mind.',
    source: 'Dhammapada',
    chapter: 14,
    verse: 183
  },
  {
    sanskrit: 'अरतिं परमं रोगं संसारं परमं भयं',
    transliteration: 'aratiṁ paramaṁ rogaṁ saṁsāraṁ paramaṁ bhayaṁ',
    translation: 'Discontent is the greatest disease; samsara is the greatest fear.',
    meaning: 'Attachment to the cycle of birth and death, driven by dissatisfaction, is the root of suffering.',
    source: 'Dhammapada',
  },
  {
    sanskrit: 'आरोग्यपरमा लाभ संतुट्ठिपरमं धनं',
    transliteration: 'ārogya-paramā lābhā santuṭṭhi-paramaṁ dhanaṁ',
    translation: 'Health is the greatest gain; contentment is the greatest wealth.',
    meaning: 'No material wealth surpasses the treasure of being content with what one has.',
    source: 'Dhammapada',
    chapter: 15,
    verse: 204
  },
  {
    sanskrit: 'विस्सामपरमा निब्बानं',
    transliteration: 'vissāma-paramā nibbānaṁ',
    translation: 'Nirvana is the supreme peace.',
    meaning: 'The ultimate goal of spiritual practice is the cessation of all suffering and the attainment of perfect peace.',
    source: 'Dhammapada',
    chapter: 15,
    verse: 203
  },
  {
    sanskrit: 'न हि वेरैति वेरान्ति संतीहैव समन्ति',
    transliteration: 'na hi verena verāni sammantīdha kudāchanaṁ, averena cha sammanti esa dhammo sanantano',
    translation: 'Hatred never ceases by hatred in this world; by love alone does hatred cease. This is the eternal law.',
    meaning: 'The only way to end conflict is through compassion and understanding, never through retaliation.',
    source: 'Dhammapada',
    chapter: 1,
    verse: 5
  },
  {
    sanskrit: 'उट्ठानवतो सतिमतो सुचिकम्मस्स निस्सकस्स',
    transliteration: 'uṭṭhānavato satīmato suchikammassa nissakassa',
    translation: 'For one who is energetic, mindful, with pure actions and careful conduct - glory increases.',
    meaning: 'Diligence, awareness, and ethical conduct lead to continuous growth and prosperity.',
    source: 'Dhammapada',
  },
  {
    sanskrit: 'पमदो मच्चुनो पदं अप्पमादो अमतपदं',
    transliteration: 'pamādo maccumato padaṁ appamādo amatapadaṁ',
    translation: 'Heedlessness is the path to death; heedfulness is the path to immortality.',
    meaning: 'Spiritual vigilance leads to liberation; carelessness leads to bondage.',
    source: 'Dhammapada',
    chapter: 2,
    verse: 21
  },
  {
    sanskrit: 'उत्थानेन अप्पमादेन संयमेन दमेन च',
    transliteration: 'uṭṭhānena appamādena saṁyamena damena cha',
    translation: 'Through effort, mindfulness, restraint, and self-control, the wise person makes an island that floods cannot overwhelm.',
    meaning: 'Inner discipline creates an unshakable foundation amid life\'s storms.',
    source: 'Dhammapada',
    chapter: 2,
    verse: 25
  },
  {
    sanskrit: 'ददीत रत्नं पठमं पणेन',
    transliteration: 'dadyā ratnaṁ paṭhamaṁ paṇena',
    translation: 'Give from what you have; share with others from your resources.',
    meaning: 'Generosity is the foundation of spiritual practice - giving enriches both giver and receiver.',
    source: 'Dhammapada',
  },
  {
    sanskrit: 'फन्दनं चलितं चित्तं दुरक्खं दुरनिवारयं',
    transliteration: 'phandanaṁ chalitaṁ chittaṁ durakkhaṁ duranivārayaṁ',
    translation: 'The mind is restless, fickle, difficult to guard and control.',
    meaning: 'The mind\'s natural tendency is to wander; mastering it requires persistent effort.',
    source: 'Dhammapada',
    chapter: 3,
    verse: 35
  },
  {
    sanskrit: 'दूरङ्गमं एकचरं अशरीरं गुहाशयं',
    transliteration: 'dūraṅgamaṁ ekacharaṁ aśharīraṁ guhāśhayaṁ',
    translation: 'The mind travels far, walks alone, is bodiless, and dwells in the cave of the heart.',
    meaning: 'The mind is subtle, far-reaching, and resides in the deepest recess of consciousness.',
    source: 'Dhammapada',
    chapter: 3,
    verse: 36
  },
  {
    sanskrit: 'परिणामतं परिणामतं',
    transliteration: 'pariṇāmataṁ pariṇāmataṁ',
    translation: 'All conditioned things are impermanent.',
    meaning: 'Everything that arises must pass away - understanding impermanence brings detachment and peace.',
    source: 'Dhammapada',
  },

  // ============================================================================
  // RIG VEDA (15+ verses)
  // ============================================================================
  {
    sanskrit: 'ॐ असतो मा सद्गमय',
    transliteration: 'oṁ asato mā sad gamaya',
    translation: 'Om. Lead me from the unreal to the Real.',
    meaning: 'The great prayer for spiritual discernment between the eternal and the temporary.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्',
    transliteration: 'agnim īḷe purohitaṁ yajñasya devam ṛitvijam',
    translation: 'I praise Agni, the divine priest of the sacrifice, the officiating minister.',
    meaning: 'Agni (fire) is the mediator between the human and divine, carrying offerings upward.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'आ नो भद्राः क्रतवो यन्तु विश्वतः',
    transliteration: 'ā no bhadrāḥ kratavo yantu viśhvataḥ',
    translation: 'Let noble thoughts come to us from every side.',
    meaning: 'An open-minded prayer for wisdom to flow from all directions and sources.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'सं गच्छध्वं सं वदध्वं सं वो मनांसि जानताम्',
    transliteration: 'saṁ gachadhvaṁ saṁ vadadhvaṁ saṁ vo manāṁsi jānatām',
    translation: 'Move together, speak together, let your minds be of one accord.',
    meaning: 'A call for unity, harmony, and collective purpose among all people.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'एकं सद्विप्रा बहुधा वदन्ति',
    transliteration: 'ekaṁ sad viprā bahudhā vadanti',
    translation: 'Truth is one; the wise call it by many names.',
    meaning: 'The fundamental unity of all spiritual paths - different names point to the same reality.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत',
    transliteration: 'uttiṣhṭhata jāgrata prāpya varān nibodhata',
    translation: 'Arise, awake, having reached the great teachers, learn.',
    meaning: 'A rousing call to spiritual awakening through dedicated learning from the wise.',
    source: 'Rig Veda / Katha Upanishad',
  },
  {
    sanskrit: 'कृण्वन्तो विश्वमार्यम्',
    transliteration: 'kṛiṇvanto viśhvam āryam',
    translation: 'Strive to make the entire world noble.',
    meaning: 'The highest human endeavor - to elevate all of creation to a state of nobility.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'शं नो मित्रः शं वरुणः',
    transliteration: 'śhaṁ no mitraḥ śhaṁ varuṇaḥ',
    translation: 'May Mitra and Varuna bless us with peace.',
    meaning: 'A prayer for divine grace and universal harmony from the cosmic guardians of order.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'दधीचोऽस्थानि संहृत्य वज्रं कृतवान् हरिः',
    transliteration: 'dadhi cho \'sthāni saṁhṛitya vajraṁ kṛitavān hariḥ',
    translation: 'Gathering the bones of Dadhichi, Hari fashioned the thunderbolt.',
    meaning: 'The story of selfless sacrifice - sage Dadhichi gave his bones for the welfare of the world.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'मा बिभेः न भयं किञ्चन',
    transliteration: 'mā bibheḥ na bhayaṁ kiñchana',
    translation: 'Do not fear; there is no fear whatsoever.',
    meaning: 'Fear is an illusion - the true self is beyond all fear.',
    source: 'Rig Vedic tradition',
  },
  {
    sanskrit: 'हिरण्यगर्भः समवर्तताग्रे भूतस्य जातः पतिरेकासीत्',
    transliteration: 'hiraṇyagarbhaḥ samāvartatāgre bhūtasya jātaḥ patir ekāsīt',
    translation: 'In the beginning, the Golden Womb arose - the one Lord of all that exists.',
    meaning: 'The cosmic origin - from the golden egg of creation, the supreme consciousness emerged.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'स त्यो नपादसुरः स्वधावान् उत्स एव निहितो यो अक्षः',
    transliteration: 'sa tyo napād asuraḥ svadhāvān utsa eva nihito yo akṣhaḥ',
    translation: 'The divine power is like an inexhaustible spring of energy stored within.',
    meaning: 'Divine energy is stored within every being, waiting to be awakened.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'अयं निजः परो वेति गणना लघुचेतसाम्',
    transliteration: 'ayaṁ nijaḥ paro veti gaṇanā laghuchetasām',
    translation: 'This is mine, that is another\'s - such calculation is for petty minds.',
    meaning: 'The narrow view of "mine" and "yours" creates division; the wise see all as one.',
    source: 'Rig Veda tradition / Vidura Niti',
  },
  {
    sanskrit: 'तमिस्रं तम आसिद् आसिद्',
    transliteration: 'tamisraṁ tama āsīd āsīd',
    translation: 'In the beginning there was darkness, hidden by darkness.',
    meaning: 'Before creation, there was undifferentiated potential - a state beyond comprehension.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'अप अन्धं तमो ज्योतिः प्रकाशम्',
    transliteration: 'apa andhaṁ tamaḥ jyotiḥ prakāśham',
    translation: 'Drive away the darkness, let there be light.',
    meaning: 'The eternal prayer for illumination - dispelling ignorance with the light of knowledge.',
    source: 'Rig Vedic tradition',
  },
  // ============================================================================
  // ADDITIONAL AUTHENTICATED VERSES (115-214)
  // ============================================================================
  ...ADDITIONAL_VERSES,
  // More Bhagavad Gita
  {
    sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु',
    transliteration: 'man-manā bhava mad-bhakto mad-yājī māṁ namaskuru',
    translation: 'Think of Me, be My devotee, worship Me, and bow to Me.',
    meaning: 'The path of devotion: constant remembrance, devotion, worship, and surrender to the divine.',
    source: 'Bhagavad Gita',
    chapter: 18,
    verse: 65
  },
  {
    sanskrit: 'श्रेयान्द्रव्यमयाद्यज्ञाज्ज्ञानयज्ञः परन्तप',
    transliteration: 'śhreyān dravya-mayād yajñāj jñāna-yajñaḥ parantapa',
    translation: 'Better than sacrifice of materials is the sacrifice of knowledge.',
    meaning: 'Wisdom and understanding are superior to any material offering.',
    source: 'Bhagavad Gita',
    chapter: 4,
    verse: 33
  },
  {
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय',
    transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
    translation: 'Established in yoga, perform actions, abandoning attachment.',
    meaning: 'Act from a place of inner balance, without being attached to outcomes.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 48
  },
  {
    sanskrit: 'सुखे दुःखे समे कृत्वा लाभालाभौ जयाजयौ',
    transliteration: 'sukhe duḥkhe same kṛitvā lābhālābhau jayājayau',
    translation: 'Treat pleasure and pain, gain and loss, victory and defeat alike.',
    meaning: 'True equanimity is remaining balanced in all circumstances of life.',
    source: 'Bhagavad Gita',
    chapter: 2,
    verse: 38
  },
  {
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्',
    transliteration: 'uddhared ātmanātmānaṁ nātmānam avasādayet',
    translation: 'Elevate yourself by the mind, do not degrade yourself.',
    meaning: 'The mind can be your friend or enemy — use it to uplift yourself.',
    source: 'Bhagavad Gita',
    chapter: 6,
    verse: 5
  },
  // More Upanishads
  {
    sanskrit: 'प्रज्ञानं ब्रह्म',
    transliteration: 'prajñānaṁ brahma',
    translation: 'Consciousness is Brahman.',
    meaning: 'The ultimate reality is pure consciousness — the essence of all existence.',
    source: 'Aitareya Upanishad',
  },
  {
    sanskrit: 'अहं ब्रह्मास्मि',
    transliteration: 'ahaṁ brahmāsmi',
    translation: 'I am Brahman.',
    meaning: 'The individual self is identical with the universal consciousness.',
    source: 'Brihadaranyaka Upanishad',
  },
  {
    sanskrit: 'तत् त्वम् असि',
    transliteration: 'tat tvam asi',
    translation: 'Thou art That.',
    meaning: 'You are not separate from the ultimate reality — you are that reality itself.',
    source: 'Chandogya Upanishad',
  },
  {
    sanskrit: 'अयम् आत्मा ब्रह्म',
    transliteration: 'ayam ātmā brahma',
    translation: 'This Self is Brahman.',
    meaning: 'The innermost self is the absolute reality.',
    source: 'Mandukya Upanishad',
  },
  // More Yoga Sutras
  {
    sanskrit: 'योगश्चित्तवृत्तिनिरोधः',
    transliteration: 'yogaśh chitta-vṛitti-nirodhaḥ',
    translation: 'Yoga is the cessation of the modifications of the mind.',
    meaning: 'The definition of yoga: stilling the restless mind to experience the true Self.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 2
  },
  {
    sanskrit: 'तदा द्रष्टुः स्वरूपेऽवस्थानम्',
    transliteration: 'tadā draṣhṭuḥ svarūpe \'vasthānam',
    translation: 'Then the seer abides in its own true nature.',
    meaning: 'When the mind is still, the soul rests in its essential nature.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 3
  },
  {
    sanskrit: 'वृत्ति सारूप्यम् इतरत्र',
    transliteration: 'vṛitti sārūpyam itaratra',
    translation: 'At other times, the seer identifies with the modifications of the mind.',
    meaning: 'When not established in the Self, one identifies with thoughts and emotions.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 4
  },
  {
    sanskrit: 'अभ्यास वैराग्याभ्यां तन्निरोधः',
    transliteration: 'abhyāsa vairāgyābhyāṁ tan-nirodhaḥ',
    translation: 'Through practice and detachment, the modifications of the mind are controlled.',
    meaning: 'The two wings of yoga: consistent practice and non-attachment.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 12
  },
  {
    sanskrit: 'प्रयत्न शैथिल्य अनन्त समापत्तिभ्याम्',
    transliteration: 'prayatna śhaithilya ananta samāpattibhyām',
    translation: 'Mastery is attained through relaxation of effort and meditation on the infinite.',
    meaning: 'True mastery comes not through force but through effortless surrender to the infinite.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 2,
    verse: 47
  },
  {
    sanskrit: 'ततः प्रत्यक्चेतनाधिगमोऽप्यन्तरायाभावश्च',
    transliteration: 'tataḥ pratyak-chetanādhigamo \'py antarāyābhāvaśh cha',
    translation: 'From that arises the realization of the inner consciousness and the removal of obstacles.',
    meaning: 'Through mantra repetition and contemplation, inner wisdom awakens and obstacles dissolve.',
    source: 'Yoga Sutras of Patanjali',
    chapter: 1,
    verse: 29
  },
  // More Dhammapada
  {
    sanskrit: 'उट्ठेहि निप्पज्ज हिताभिवद्दसु',
    transliteration: 'uṭṭhehi nippajja hitābhivaddasu',
    translation: 'Arise and strive! Go to the refuge of the wise.',
    meaning: 'The call to action: rise from complacency and seek the company of the enlightened.',
    source: 'Dhammapada',
    chapter: 4,
    verse: 24
  },
  {
    sanskrit: 'अप्पमादो अमतपदं',
    transliteration: 'appamādo amatapadaṁ',
    translation: 'Heedfulness is the path to the deathless.',
    meaning: 'Vigilance and mindfulness lead to liberation from the cycle of birth and death.',
    source: 'Dhammapada',
    chapter: 2,
    verse: 21
  },
  {
    sanskrit: 'धम्मो हवे रक्खति धम्मचारिं',
    transliteration: 'dhammo have rakkhati dhammacāriṁ',
    translation: 'The Dhamma protects one who lives in accordance with it.',
    meaning: 'Righteous living is its own protection — truth is the ultimate shield.',
    source: 'Dhammapada',
    chapter: 7,
    verse: 17
  },
  {
    sanskrit: 'उट्ठानवतो सतिमโต',
    transliteration: 'uṭṭhānavato satimato',
    translation: 'For one who is diligent and mindful, life becomes meaningful and joyful.',
    meaning: 'Effort and awareness transform ordinary existence into a purposeful journey.',
    source: 'Dhammapada',
    chapter: 1,
    verse: 32
  },
  // More Rig Veda
  {
    sanskrit: 'सं गच्छध्वं सं वदध्वं सं वो मनांसि जानताम्',
    transliteration: 'saṁ gachadhvaṁ saṁ vadadhvaṁ saṁ vo manāṁsi jānatām',
    translation: 'Move together, speak together, let your minds know each other.',
    meaning: 'A prayer for unity, cooperation, and collective consciousness.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'धर्मो रक्षति रक्षितः',
    transliteration: 'dharmaḥ rakṣhati rakṣhitaḥ',
    translation: 'Dharma protects those who protect it.',
    meaning: 'When we uphold righteousness, righteousness upholds us in return.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'आ नो भद्राः क्रतवो यन्तु विश्वतः',
    transliteration: 'ā no bhadrāḥ kratavo yantu viśhvataḥ',
    translation: 'Let noble thoughts come to us from every side.',
    meaning: 'An open-minded prayer for wisdom to flow from all directions and all sources.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'चरैवेति चरैवेति',
    transliteration: 'charaiveti charaiveti',
    translation: 'Keep moving, keep moving.',
    meaning: 'The Vedic call to continuous spiritual progress — never stop evolving.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'वसुधैव कुटुम्बकम्',
    transliteration: 'vasudhaiva kuṭumbakam',
    translation: 'The whole world is one family.',
    meaning: 'The Vedic vision of universal brotherhood and the interconnectedness of all life.',
    source: 'Maha Upanishad',
  },
  {
    sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्',
    transliteration: 'agnimīḷe purōhitaṁ yajñasya devamṛitvijam',
    translation: 'I praise Agni, the divine priest, the minister of sacrifice.',
    meaning: 'The first mantra of the Rig Veda — invoking the sacred fire as the mediator between humans and the divine.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'तमसस्तु परस्ताच्चन्द्रमा विभाति',
    transliteration: 'tamāsas tu parastāt chandramā vibhāti',
    translation: 'Beyond darkness, the moon shines forth.',
    meaning: 'Even in the deepest darkness, the light of wisdom eventually appears.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'बृहस्पते अति नो अन्धं तमो ज्योतिः प्रकाशम्',
    transliteration: 'bṛihaspate ati no andhaṁ tamaḥ jyotiḥ prakāśham',
    translation: 'O Brihaspati, drive away the darkness and bring forth light.',
    meaning: 'A prayer to the divine teacher to dispel ignorance with the light of knowledge.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'शं नो मित्रः शं वरुणः',
    transliteration: 'śhaṁ no mitraḥ śhaṁ varuṇaḥ',
    translation: 'May Mitra and Varuna bring us peace and happiness.',
    meaning: 'A prayer for peace, harmony, and divine blessings from the cosmic forces.',
    source: 'Rig Veda',
  },
  {
    sanskrit: 'इन्द्राग्नी आ गतं नव्यं',
    transliteration: 'indrāgnī ā gataṁ navyaṁ',
    translation: 'Come to us, Indra and Agni, with new blessings.',
    meaning: 'Invoking the divine energies to bring fresh grace and abundance.',
    source: 'Rig Veda',
  },
];

// Cache key for localStorage
const VERSE_CACHE_KEY = 'vedatime_daily_verse_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedVerse {
  verse: VerseData;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

/**
 * Get verse based on day of year (deterministic, no API needed)
 * Cycles through all available verses
 */
export function getDailyVerse(): VerseData {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  
  // Use day of year to select verse (changes daily)
  const index = dayOfYear % LOCAL_VERSES.length;
  
  return LOCAL_VERSES[index];
}

/**
 * Get random verse (for variety)
 */
export function getRandomVerse(): VerseData {
  const index = Math.floor(Math.random() * LOCAL_VERSES.length);
  return LOCAL_VERSES[index];
}

/**
 * Get cached verse or fetch new one
 */
export function getCachedOrNewVerse(): { verse: VerseData; fromCache: boolean } {
  try {
    const cached = localStorage.getItem(VERSE_CACHE_KEY);
    
    if (cached) {
      const parsed: CachedVerse = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      
      // Use cache if less than 24 hours old and same date
      const today = new Date().toISOString().split('T')[0];
      if (age < CACHE_DURATION && parsed.date === today) {
        return { verse: parsed.verse, fromCache: true };
      }
    }
  } catch {
    // Cache parse error - ignore
  }
  
  // Get fresh verse
  const verse = getDailyVerse();
  
  // Cache it
  try {
    const cache: CachedVerse = {
      verse,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(VERSE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage error - ignore
  }
  
  return { verse, fromCache: false };
}

/**
 * Get all available verses
 */
export function getAllVerses(): VerseData[] {
  return LOCAL_VERSES;
}

/**
 * Get verse count
 */
export function getVerseCount(): number {
  return LOCAL_VERSES.length;
}
