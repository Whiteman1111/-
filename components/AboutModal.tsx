
import React from 'react';
import { X, Heart, Info, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 left-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="p-8 md:p-12 text-right">
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                  <Info className="text-amber-400 w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">عن تطبيق "آية لك"</h2>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 justify-end">
                    الهدف من التطبيق
                    <Sparkles className="w-5 h-5" />
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    "آية لك" هو مساحة رقمية هادئة تهدف إلى ربط قلوبنا بكلام الله في لحظاتنا اليومية. نحن نؤمن أن القرآن الكريم يحمل رسائل خاصة لكل إنسان، وفي كل وقت، قادرة على تبديد القلق ومنح السكينة.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-indigo-400 mb-3 flex items-center gap-2 justify-end">
                    الإلهام
                    <Heart className="w-5 h-5 fill-current" />
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    استلهمنا فكرة التطبيق من الحاجة إلى "لحظة توقف" وسط صخب الحياة الحديثة. أردنا خلق تجربة بصرية وسمعية غامرة تجعل قراءة الآية وتدبرها تجربة روحانية فريدة، تذكرنا دائماً بمعية الله ولطفه.
                  </p>
                </section>

                <section className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 justify-end">
                    مميزات التجربة
                    <BookOpen className="w-5 h-5" />
                  </h3>
                  <ul className="space-y-3 text-gray-400 text-sm md:text-base">
                    <li className="flex items-center gap-2 justify-end">
                      <span>اختيار دقيق لآيات الطمأنينة والرجاء</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </li>
                    <li className="flex items-center gap-2 justify-end">
                      <span>تفسير مبسط وحكمة عملية لكل آية</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </li>
                    <li className="flex items-center gap-2 justify-end">
                      <span>تلاوات صوتية خاشعة بصوت الشيخ مشاري العفاسي</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </li>
                    <li className="flex items-center gap-2 justify-end">
                      <span>تصميم بصري ساحر يساعد على التركيز والهدوء</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </li>
                  </ul>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-500 text-sm italic">
                  "نسأل الله أن يجعل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به كل من يمر من هنا."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
