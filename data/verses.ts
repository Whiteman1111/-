
import { QuranicMessage, Mood } from '../types';

/** 
 * خادم EveryAyah يتطلب أرقاماً ثلاثية الخانات للسورة والآية
 * مثال: السورة 13 والآية 28 تصبح 013028.mp3
 */
const getAudioUrl = (surah: number, ayah: number) => {
  const s = surah.toString().padStart(3, '0');
  const a = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

export const verses: QuranicMessage[] = [
  {
    id: 1,
    ayah: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    surah: "الرعد",
    ayahNumber: 28,
    mood: Mood.PEACE,
    explanation: "يخبرنا الله تعالى أن ذكره هو الدواء الحقيقي لكل قلق، وهو الملاذ الآمن للقلوب المتعبة.",
    wisdom: "اجعل لك ورداً يومياً من الذكر، ولو كان يسيراً، لتجد السكينة التي تبحث عنها.",
    audioUrl: getAudioUrl(13, 28)
  },
  {
    id: 2,
    ayah: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    surah: "الشرح",
    ayahNumber: 6,
    mood: Mood.RELIEF,
    explanation: "وعد رباني قاطع بأن الضيق لن يدوم، وأن الفرج ليس بعد العسر بل هو ملازم له.",
    wisdom: "لا تحزن إذا اشتدت بك الأمور، فاليُسر قد كُتب لك بالفعل، فقط ثق بتقدير الله.",
    audioUrl: getAudioUrl(94, 6)
  },
  {
    id: 3,
    ayah: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنْتُمُ الْأَعْلَوْنَ إِنْ كُنْتُمْ مُؤْمِنِينَ",
    surah: "آل عمران",
    ayahNumber: 139,
    mood: Mood.STRENGTH,
    explanation: "رسالة تقوية ربانية تنهى عن الضعف واليأس، وتذكّر المؤمن بمقامه العالي عند ربه.",
    wisdom: "ارفع رأسك وتوكل على الله، فإيمانك هو مصدر قوتك الحقيقية التي لا تُهزم.",
    audioUrl: getAudioUrl(3, 139)
  },
  {
    id: 4,
    ayah: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا",
    surah: "الطور",
    ayahNumber: 48,
    mood: Mood.PATIENCE,
    explanation: "تأكيد على أن الله يرى معاناتك ويحيطك بعنايته ورعايته في كل لحظة صبر.",
    wisdom: "عندما تشعر أن حملك ثقيل، تذكر أنك 'بأعين الله'، فهل يضيع من كان الله معه؟",
    audioUrl: getAudioUrl(52, 48)
  },
  {
    id: 5,
    ayah: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    surah: "الطلاق",
    ayahNumber: 3,
    mood: Mood.TRUST,
    explanation: "من فوّض أمره لله، كفاه الله كل ما أهمه وأغناه عن كل ما سواه.",
    wisdom: "ألقِ ببالك وحاجاتك بين يدي خالقك، واعلم أن تدبيره لك خير من تدبيرك لنفسك.",
    audioUrl: getAudioUrl(65, 3)
  },
  {
    id: 6,
    ayah: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    surah: "الزمر",
    ayahNumber: 53,
    mood: Mood.HOPE,
    explanation: "نداء محبة من الخالق، يفتح فيه أبواب الرجاء مهما كانت الذنوب أو العثرات.",
    wisdom: "لا تسمح لماضيك أن يحجب عنك شمس الأمل، فرحمة الله أوسع من أي خطأ ارتكبته.",
    audioUrl: getAudioUrl(39, 53)
  },
  {
    id: 7,
    ayah: "وَبَشِّرِ الصَّابِرِينَ",
    surah: "البقرة",
    ayahNumber: 155,
    mood: Mood.PATIENCE,
    explanation: "وعد من الله بالبشرى والفوز لكل من صبر على ابتلاءات الحياة.",
    wisdom: "الصبر ليس مجرد انتظار، بل هو ثبات النفس على الرضا حتى يأتي وعد الله.",
    audioUrl: getAudioUrl(2, 155)
  },
  {
    id: 8,
    ayah: "فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    surah: "البقرة",
    ayahNumber: 186,
    mood: Mood.COMFORT,
    explanation: "أعظم طمأنينة هي قرب الله منك، وأنه يسمع مناجاتك في كل وقت.",
    wisdom: "لا تتردد في الدعاء بأدق تفاصيل حياتك، فالذي خلقك هو الأقرب إليك.",
    audioUrl: getAudioUrl(2, 186)
  }
];
