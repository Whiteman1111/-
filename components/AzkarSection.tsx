
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zikr } from '../data/azkar';
import { ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface AzkarSectionProps {
  title: string;
  items: Zikr[];
  onBack: () => void;
}

const AzkarSection: React.FC<AzkarSectionProps> = ({ title, items, onBack }) => {
  const [counts, setCounts] = useState<Record<number, number>>({});

  const handleIncrement = (id: number, max: number) => {
    const current = counts[id] || 0;
    if (current < max) {
      setCounts({ ...counts, [id]: current + 1 });
      // Haptic feedback if available
      if (window.navigator.vibrate) {
        window.navigator.vibrate(20);
      }
    }
  };

  const resetCount = (id: number) => {
    setCounts({ ...counts, [id]: 0 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-4xl mx-auto py-10"
    >
      <div className="flex items-center justify-between mb-12 px-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gold transition-all"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </button>
        <h2 className="text-3xl md:text-4xl font-bold text-gold">{title}</h2>
      </div>

      <div className="space-y-6 px-4">
        {items.map((item) => {
          const currentCount = counts[item.id] || 0;
          const isCompleted = currentCount >= item.count;

          return (
            <motion.div 
              key={item.id}
              layout
              className={`relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 ${
                isCompleted 
                ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                : 'bg-white/5 border-white/10 hover:border-gold/30'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-4 left-4 text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}

              <p className="text-2xl md:text-3xl leading-relaxed text-offwhite text-right mb-8 quran-text">
                {item.text}
              </p>

              {item.benefit && (
                <div className="mb-8 p-4 bg-gold/5 rounded-2xl border border-gold/10 text-gold/70 text-sm text-right italic">
                  {item.benefit}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => resetCount(item.id)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-gold transition-colors"
                  title="إعادة العداد"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gold">{currentCount}</span>
                    <span className="text-gold/40 mx-2">/</span>
                    <span className="text-xl text-gold/60">{item.count}</span>
                  </div>

                  <button 
                    onClick={() => handleIncrement(item.id, item.count)}
                    disabled={isCompleted}
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold transition-all active:scale-90 relative overflow-hidden group ${
                      isCompleted 
                      ? 'bg-green-500 text-midnight shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                      : 'bg-gold text-midnight shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:bg-amber-400'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">
                      {isCompleted ? <Sparkles className="w-8 h-8" /> : currentCount + 1}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AzkarSection;
