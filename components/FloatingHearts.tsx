
import React from 'react';

const FloatingHearts: React.FC = () => {
  return (
    <div className="relative w-full h-64 flex items-center justify-center mb-12">
      {/* Central glow */}
      <div className="absolute w-40 h-40 bg-yellow-400/20 rounded-full blur-[60px] animate-pulse" />
      
      {/* Floating Elements (Abstract Heart-like Glows) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            animation: `float ${4 + i}s infinite ease-in-out`,
            animationDelay: `${i * 0.5}s`,
            transform: `rotate(${i * 60}deg) translateX(80px)`
          }}
        >
          <div 
            className={`w-6 h-6 rounded-full blur-[2px] shadow-lg shadow-current ${
              ['text-pink-400', 'text-purple-400', 'text-indigo-400', 'text-blue-400', 'text-amber-400', 'text-rose-400'][i]
            }`}
            style={{ backgroundColor: 'currentColor' }}
          />
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
