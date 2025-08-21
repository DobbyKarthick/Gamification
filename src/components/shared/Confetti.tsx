import React from 'react';

interface ConfettiProps {
  isActive: boolean;
  zIndexClass?: string; // optional override for layering
}

export const Confetti: React.FC<ConfettiProps> = ({ isActive, zIndexClass = 'z-[60]' }) => {
  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none ${zIndexClass}`}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${1 + Math.random() * 1}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full shadow-lg"
            style={{
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFD93D', '#6BCF7F'][Math.floor(Math.random() * 8)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
