
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import Background from './components/Background';
import FloatingHearts from './components/FloatingHearts';
import AzkarSection from './components/AzkarSection';
import { LightRays, SparklesParticles } from './components/SpiritualEffects';
import { AppState, Mood, QuranicMessage } from './types';
import { verses } from './data/verses';
import { morningAzkar, eveningAzkar, muawwidhat, duas } from './data/azkar';
import { RefreshCw, Volume2, VolumeX, Sparkles, Layout, Copy, Check, BookOpen, Play, Pause, Info, ChevronDown, Share2, Download, Heart, Wind, Shield, Sun, Moon, Coffee, Stars } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { selectedMood: Mood | null }>({
    view: 'home',
    currentMessage: null,
    selectedMood: null,
    settings: {
      quietMode: false,
      minimalEffects: false
    }
  });

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // إيقاف وتصفير الصوت تماماً لضمان عدم حدوث أخطاء عند التحميل التالي
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // تصفير المصدر
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Transition to Result
  const getMessage = useCallback((mood: Mood | null = state.selectedMood) => {
    stopAudio();
    setState(prev => ({ ...prev, view: 'loading', selectedMood: mood }));
    setCopied(false);
    
    const filteredVerses = mood 
      ? verses.filter(v => v.mood === mood)
      : verses;
    
    const randomIdx = Math.floor(Math.random() * filteredVerses.length);
    const selected = filteredVerses[randomIdx] || verses[Math.floor(Math.random() * verses.length)];

    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        view: 'result', 
        currentMessage: selected 
      }));
    }, 2500);
  }, [stopAudio, state.selectedMood]);

  const toggleQuiet = () => setState(s => ({ 
    ...s, settings: { ...s.settings, quietMode: !s.settings.quietMode } 
  }));

  const toggleMinimal = () => setState(s => ({ 
    ...s, settings: { ...s.settings, minimalEffects: !s.settings.minimalEffects } 
  }));

  const goHome = () => {
    stopAudio();
    setState(s => ({ ...s, view: 'home', currentMessage: null, selectedMood: null }));
  };

  const copyToClipboard = () => {
    if (state.currentMessage) {
      const text = `"${state.currentMessage.ayah}"\nسورة ${state.currentMessage.surah} - آية ${state.currentMessage.ayahNumber}\n\nتلقيت هذه الرسالة اليوم من تطبيق آية لك.`;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const toggleAudio = () => {
    if (!state.currentMessage?.audioUrl) return;

    // إذا لم يكن هناك كائن صوت أو كان المصدر قديماً، ننشئ واحداً جديداً
    if (!audioRef.current || audioRef.current.src !== state.currentMessage.audioUrl) {
      if (audioRef.current) stopAudio();
      
      const audio = new Audio(state.currentMessage.audioUrl);
      // إزالة crossOrigin لتجنب مشاكل CORS غير الضرورية للتشغيل البسيط
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error("Audio failed to load from:", audio.src);
        
        // محاولة مصدر بديل إذا فشل الأول
        if (audio.src.includes('everyayah.com')) {
          const fallbackUrl = audio.src.replace('everyayah.com/data/Alafasy_128kbps', 'audio.qurancdn.com/Alafasy/mp3');
          console.log("Trying fallback source:", fallbackUrl);
          audio.src = fallbackUrl;
          audio.load();
          audio.play().catch(() => {
            setIsPlaying(false);
            alert("عذراً، تعذر تحميل التلاوة حالياً. يرجى المحاولة لاحقاً.");
          });
          return;
        }

        setIsPlaying(false);
        alert("عذراً، تعذر تحميل التلاوة حالياً. يرجى المحاولة لاحقاً.");
      };
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (state.settings.quietMode) {
        alert("يرجى إلغاء كتم الصوت من الأعلى أولاً");
        return;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Audio playback failed", err);
          setIsPlaying(false);
        });
    }
  };

  const shareAsImage = async () => {
    if (!shareCardRef.current) return;
    setIsSharing(true);
    try {
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `ayah-for-you-${state.currentMessage?.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('عذراً، تعذر إنشاء الصورة حالياً.');
    } finally {
      setIsSharing(false);
    }
  };

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const moodFilters = [
    { mood: Mood.PEACE, icon: <Wind className="w-5 h-5" />, label: 'طمأنينة' },
    { mood: Mood.HOPE, icon: <Sun className="w-5 h-5" />, label: 'أمل' },
    { mood: Mood.STRENGTH, icon: <Shield className="w-5 h-5" />, label: 'قوة' },
    { mood: Mood.COMFORT, icon: <Heart className="w-5 h-5" />, label: 'راحة' },
  ];

  return (
    <div className="relative min-h-screen bg-midnight text-offwhite overflow-hidden flex flex-col transition-all duration-700 font-sans">
      <Background minimal={state.settings.minimalEffects} />

      {/* Top Navbar */}
      <nav className="relative z-50 p-6 flex justify-between items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goHome}>
          <div className="w-11 h-11 bg-gradient-to-tr from-gold to-amber-200 rounded-xl flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all duration-300">
            <BookOpen className="text-midnight w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-offwhite via-amber-100 to-gold tracking-wide">
            آية لك
          </h1>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={toggleQuiet}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gold"
            title={state.settings.quietMode ? "تفعيل الصوت" : "كتم الصوت"}
          >
            {state.settings.quietMode ? <VolumeX className="w-5 h-5 opacity-60" /> : <Volume2 className="w-5 h-5 opacity-80" />}
          </button>
          <button 
            onClick={toggleMinimal}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gold"
            title="تبديل الوضع"
          >
            <Layout className={`w-5 h-5 ${state.settings.minimalEffects ? 'opacity-40' : 'opacity-80'}`} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          {state.view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl flex flex-col items-center"
            >
              <FloatingHearts />
              
              <div className="max-w-3xl min-h-[140px] flex items-center justify-center mb-6">
                <h2 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-offwhite via-offwhite to-gray-500 leading-[1.3] md:leading-[1.1] tracking-tight">
                  قد تكون هذه هي الرسالة التي تحتاجها الآن
                </h2>
              </div>

              <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-xl mx-auto leading-relaxed opacity-80 font-light">
                منصة روحانية فاخرة تقدم لك رسالة من القرآن في اللحظة التي تحتاجها، لتكون مصدر طمأنينة وإلهام.
              </p>
              
              <div className="flex flex-col gap-8 items-center w-full">
                <button
                  onClick={() => getMessage(null)}
                  className="group relative px-16 py-8 bg-gradient-to-r from-gold to-amber-500 text-midnight font-bold text-3xl rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transform hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    تلقى رسالة عشوائية
                  </span>
                </button>

                <div className="w-full max-w-2xl">
                  <p className="text-gold/60 text-sm mb-6 uppercase tracking-[0.2em] font-medium">أو اختر حالتك الشعورية</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodFilters.map((f) => (
                      <button
                        key={f.mood}
                        onClick={() => getMessage(f.mood)}
                        className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                          {f.icon}
                        </div>
                        <span className="text-offwhite font-medium">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full max-w-2xl">
                  <p className="text-gold/60 text-sm mb-6 uppercase tracking-[0.2em] font-medium">الأذكار والأدعية</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setState(s => ({ ...s, view: 'morning_azkar' }))}
                      className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Coffee className="w-6 h-6" />
                      </div>
                      <span className="text-offwhite font-medium">أذكار الصباح</span>
                    </button>
                    <button
                      onClick={() => setState(s => ({ ...s, view: 'evening_azkar' }))}
                      className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        <Moon className="w-6 h-6" />
                      </div>
                      <span className="text-offwhite font-medium">أذكار المساء</span>
                    </button>
                    <button
                      onClick={() => setState(s => ({ ...s, view: 'muawwidhat' }))}
                      className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Stars className="w-6 h-6" />
                      </div>
                      <span className="text-offwhite font-medium">المعوذات</span>
                    </button>
                    <button
                      onClick={() => setState(s => ({ ...s, view: 'duas' }))}
                      className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-offwhite font-medium">الأدعية</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-20 flex flex-col items-center gap-6 text-gold/40 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span>رسالتك اليوم بانتظارك</span>
                </div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 opacity-40"
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {state.view === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-12">
                <div className="w-32 h-32 border-4 border-gold/10 border-t-gold rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-gold animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-light text-amber-100 tracking-[0.3em] uppercase">
                يتم اختيار رسالة لك...
              </h2>
              <p className="mt-6 text-gold/40 italic text-lg">لحظة سكينة من فضلك</p>
            </motion.div>
          )}

          {state.view === 'result' && state.currentMessage && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-4xl mx-auto relative"
            >
              {!state.settings.minimalEffects && <LightRays />}

              <div className="mb-8 flex items-center justify-center gap-4">
                <span className="inline-block px-6 py-2 rounded-full bg-gold/10 text-gold border border-gold/20 text-sm font-bold tracking-widest uppercase">
                  رسالة {state.currentMessage.mood}
                </span>
                
                <button 
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-all border-2 ${isPlaying ? 'bg-gold text-midnight border-gold shadow-[0_0_25px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-gold border-white/10 hover:bg-white/10'}`}
                  title={isPlaying ? "إيقاف التلاوة" : "استماع للتلاوة"}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
              </div>

              {/* Share Card Container */}
              <div ref={shareCardRef} className="relative bg-midnight border border-white/10 rounded-[3rem] p-10 md:p-20 shadow-2xl overflow-hidden group">
                {!state.settings.minimalEffects && <SparklesParticles />}

                <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold/5 blur-[120px] rounded-full group-hover:bg-gold/10 transition-all duration-1000" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-1000" />

                <div className="relative z-10">
                  <p className="quran-text text-4xl md:text-6xl leading-[1.6] mb-12 text-offwhite text-center tracking-tight font-medium">
                    " {state.currentMessage.ayah} "
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mb-16">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/50" />
                    <span className="text-gold font-bold text-lg tracking-wider">سورة {state.currentMessage.surah} | آية {state.currentMessage.ayahNumber}</span>
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/50" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 text-right border-t border-white/5 pt-12">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-offwhite flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                        تفسير مبسط
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {state.currentMessage.explanation}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-offwhite flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                        حكمة عملية
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-lg font-light">
                        {state.currentMessage.wisdom}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Branding for share image */}
                <div className="absolute bottom-8 left-10 opacity-20 text-[10px] tracking-[0.5em] uppercase text-gold">
                  Ayah For You Platform
                </div>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                <button 
                  onClick={() => getMessage(state.selectedMood)}
                  className="flex items-center gap-3 px-10 py-5 bg-gold text-midnight hover:bg-amber-400 rounded-[2rem] transition-all active:scale-95 shadow-2xl font-bold text-xl"
                >
                  <RefreshCw className="w-6 h-6" />
                  <span>آية أخرى</span>
                </button>

                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] transition-all border-2 active:scale-95 shadow-2xl font-bold text-xl ${copied ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gold border-gold/20 hover:bg-white/10'}`}
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>

                <button 
                  onClick={shareAsImage}
                  disabled={isSharing}
                  className="flex items-center gap-3 px-10 py-5 bg-white/5 text-gold border-2 border-gold/20 hover:bg-white/10 rounded-[2rem] transition-all active:scale-95 shadow-2xl font-bold text-xl disabled:opacity-50"
                >
                  {isSharing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                  <span>تحميل كصورة</span>
                </button>
              </div>

              <p className="mt-16 text-gold/30 text-sm tracking-widest uppercase">
                "قد تكون هذه الآية هي ما تحتاجه لتبدأ يومك بسكينة"
              </p>
            </motion.div>
          )}

          {state.view === 'morning_azkar' && (
            <AzkarSection 
              title="أذكار الصباح" 
              items={morningAzkar} 
              onBack={goHome} 
            />
          )}

          {state.view === 'evening_azkar' && (
            <AzkarSection 
              title="أذكار المساء" 
              items={eveningAzkar} 
              onBack={goHome} 
            />
          )}

          {state.view === 'muawwidhat' && (
            <AzkarSection 
              title="المعوذات والرقية" 
              items={muawwidhat} 
              onBack={goHome} 
            />
          )}

          {state.view === 'duas' && (
            <AzkarSection 
              title="أدعية مختارة" 
              items={duas} 
              onBack={goHome} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 p-12 text-center text-gold/20 text-xs space-y-3 tracking-widest uppercase">
        <p>© {new Date().getFullYear()} آية لك - منصة إيمانية فاخرة</p>
        <p className="opacity-50">جميع حقوق الموقع محفوظة باسم حبيب الله محمد</p>
      </footer>
    </div>
  );
};

export default App;
