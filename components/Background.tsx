
import React, { useMemo } from 'react';

interface BackgroundProps {
  minimal?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ minimal = false }) => {
  const stars = useMemo(() => {
    return Array.from({ length: minimal ? 40 : 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, [minimal]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep night gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]" />
      
      {/* Glowing orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 blur-[120px] rounded-full" />
      
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
            animationDelay: star.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Very faint moving particles for "atmosphere" */}
      {!minimal && (
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 2 + 1}
                fill="white"
                filter="url(#blur)"
              >
                <animate
                  attributeName="cy"
                  from="100%"
                  to="-10%"
                  dur={`${Math.random() * 20 + 10}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.5;0"
                  dur={`${Math.random() * 5 + 5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};

export default Background;
