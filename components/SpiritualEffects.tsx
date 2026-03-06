
import React, { useMemo } from 'react';

export const LightRays: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center -z-10">
      <div className="relative w-full h-full flex items-center justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[200%] h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"
            style={{
              transform: `rotate(${i * 45}deg)`,
              animation: `pulse-rays ${4 + i}s infinite ease-in-out`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse-rays {
          0%, 100% { opacity: 0.1; transform: scale(0.8) rotate(var(--tw-rotate)); }
          50% { opacity: 0.4; transform: scale(1.1) rotate(var(--tw-rotate)); }
        }
      `}</style>
    </div>
  );
};

export const SparklesParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 2}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-gold rounded-full blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `sparkle-float ${p.duration} infinite ease-in-out`,
            animationDelay: p.delay,
            opacity: 0.6,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
