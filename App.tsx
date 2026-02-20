
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Background from './components/Background';
import FloatingHearts from './components/FloatingHearts';
import { LightRays, SparklesParticles } from './components/SpiritualEffects';
import { AppState } from './types';
import { verses } from './data/verses';
import { RefreshCw, Volume2, VolumeX, Sparkles, Layout, Copy, Check, BookOpen, Play, Pause } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    currentMessage: null,
    settings: {
      quietMode: false,
      minimalEffects: false
    }
  });

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  const getMessage = useCallback(() => {
    stopAudio();
    setState(prev => ({ ...prev, view: 'loading' }));
    setCopied(false);
    
    const randomIdx = Math.floor(Math.random() * verses.length);
    const selected = verses[randomIdx];

    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        view: 'result', 
        currentMessage: selected 
      }));
    }, 2500);
  }, [stopAudio]);

  const toggleQuiet = () => setState(s => ({ 
    ...s, settings: { ...s.settings, quietMode: !s.settings.quietMode } 
  }));

  const toggleMinimal = () => setState(s => ({ 
    ...s, settings: { ...s.settings, minimalEffects: !s.settings.minimalEffects } 
  }));

  const goHome = () => {
    stopAudio();
    setState(s => ({ ...s, view: 'home', currentMessage: null }));
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
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error("Audio failed to load from:", state.currentMessage?.audioUrl);
        setIsPlaying(false);
        alert("عذراً، تعذر تحميل التلاوة حالياً. يرجى المحاولة لاحقاً.");
      };
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Audio playback failed", err);
          setIsPlaying(false);
        });
    }
  };

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col transition-all duration-700">
      <Background minimal={state.settings.minimalEffects} />

      {/* Top Navbar */}
      <nav className="relative z-10 p-6 flex justify-between items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={goHome}>
          <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-amber-200 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/40 transition-all duration-300">
            <BookOpen className="text-amber-900 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-amber-100 via-amber-300 to-amber-500 tracking-wide">
            آية لك
          </h1>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={toggleQuiet}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title={state.settings.quietMode ? "تفعيل الصوت" : "كتم الصوت"}
          >
            {state.settings.quietMode ? <VolumeX className="w-5 h-5 opacity-60" /> : <Volume2 className="w-5 h-5 opacity-80" />}
          </button>
          <button 
            onClick={toggleMinimal}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="تبديل الوضع"
          >
            <Layout className={`w-5 h-5 ${state.settings.minimalEffects ? 'opacity-40' : 'opacity-80'}`} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 text-center">
        
        {state.view === 'home' && (
          <div className="max-w-4xl animate-fade-in flex flex-col items-center">
            <FloatingHearts />
            
            <div className="max-w-3xl min-h-[140px] flex items-center justify-center mb-6">
              <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 leading-[1.3] md:leading-[1.2]">
                قد تكون هذه هي الرسالة التي تحتاجها الآن
              </h2>
            </div>

            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed opacity-80">
              منصة تقدم لك رسالة من القرآن في اللحظة التي تحتاجها، لتكون مصدر طمأنينة وإلهام في حياتك اليومية.
            </p>
            
            <button
              onClick={getMessage}
              className="group relative px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-bold text-2xl rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">اضغط لتتلقى رسالتك</span>
            </button>
            
            <div className="mt-14 flex items-center justify-center gap-2 text-amber-400/60 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>رسالتك اليوم بانتظارك</span>
            </div>
          </div>
        )}

        {state.view === 'loading' && (
          <div className="flex flex-col items-center animate-pulse">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-light text-amber-200 tracking-widest">
              يتم اختيار رسالة لك...
            </h2>
            <p className="mt-4 text-gray-500 italic">لحظة سكينة من فضلك</p>
          </div>
        )}

        {state.view === 'result' && state.currentMessage && (
          <div className="w-full max-w-3xl mx-auto animate-slide-up relative">
            {!state.settings.minimalEffects && <LightRays />}

            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-semibold tracking-wide">
                رسالة {state.currentMessage.mood}
              </span>
              
              <button 
                onClick={toggleAudio}
                className={`p-2 rounded-full transition-all border ${isPlaying ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-white/5 text-amber-400 border-white/10 hover:bg-white/10'}`}
                title={isPlaying ? "إيقاف التلاوة" : "استماع للتلاوة"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-hidden group">
              {!state.settings.minimalEffects && <SparklesParticles />}

              <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full group-hover:bg-amber-400/20 transition-all duration-1000" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />

              <div className="relative z-10">
                <p className="quran-text text-3xl md:text-5xl leading-relaxed mb-8 text-amber-50 text-center tracking-tight">
                  " {state.currentMessage.ayah} "
                </p>
                
                <div className="flex items-center justify-center gap-3 mb-12">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400/50" />
                  <span className="text-amber-400 font-medium">سورة {state.currentMessage.surah} | آية {state.currentMessage.ayahNumber}</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400/50" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-right border-t border-white/5 pt-8">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      تفسير مبسط
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                      {state.currentMessage.explanation}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      حكمة عملية
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                      {state.currentMessage.wisdom}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={getMessage}
                className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 active:scale-95 shadow-xl"
              >
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-lg">آية أخرى</span>
              </button>

              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl transition-all border border-white/10 active:scale-95 shadow-xl ${copied ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-white/5 hover:bg-white/10'}`}
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6 text-amber-400" />}
                <span className="font-semibold text-lg">{copied ? 'تم النسخ' : 'نسخ الآية'}</span>
              </button>
            </div>

            <p className="mt-12 text-gray-500 text-sm">
              "قد تكون هذه الآية هي ما تحتاجه لتبدأ يومك بسكينة"
            </p>
          </div>
        )}
      </main>

      <footer className="relative z-10 p-8 text-center text-gray-600 text-xs space-y-2">
        <p>© {new Date().getFullYear()} آية لك - منصة إيمانية</p>
        <p className="text-gray-500 opacity-80">جميع حقوق الموقع محفوظة باسم حبيب الله محمد</p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
