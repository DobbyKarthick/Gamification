import React from 'react';

export type PrizeRevealProps = {
  isVisible: boolean;
  prize: { text: string; value?: string; icon?: string };
  userEmail?: string;
  onClose: () => void;
  fullScreen?: boolean;
  centeredCard?: boolean; // when fullScreen, show a centered popup card with dim backdrop
};

export const PrizeReveal: React.FC<PrizeRevealProps> = ({
  isVisible,
  prize,
  userEmail,
  onClose,
  fullScreen = true,
  centeredCard = false,
}) => {
  if (!isVisible) return null;

  if (fullScreen && !centeredCard) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 animate-in fade-in duration-200">
        <div className="text-center text-white p-8 animate-prize-pop">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Congratulations!</h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            {prize.icon && (
              <div className="text-6xl mb-4">{prize.icon}</div>
            )}
            <p className="text-3xl font-bold mb-3 drop-shadow-lg">{prize.text}</p>
            {prize.value && (
              <p className="text-xl text-white/90 drop-shadow-lg">{prize.value}</p>
            )}
            {userEmail && (
              <p className="text-lg text-white/80 drop-shadow-lg mt-2">Email: {userEmail}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-8 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform"
          >
            Claim Prize
          </button>
        </div>
      </div>
    );
  }

  // Fullscreen overlay with centered popup card (background dimmed, game visible behind)
  if (fullScreen && centeredCard) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-xl mx-4 p-10 rounded-2xl shadow-2xl text-center text-white bg-gradient-to-br from-purple-500 to-pink-500 animate-prize-pop">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 border border-white/30"
          >
            ✕
          </button>
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold mb-5 drop-shadow-lg">Congratulations!</h2>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 shadow-xl">
            {prize.icon && <div className="text-5xl mb-3">{prize.icon}</div>}
            <p className="text-2xl font-bold mb-2 drop-shadow-lg">{prize.text}</p>
            {prize.value && <p className="text-lg text-white/90 drop-shadow-lg">{prize.value}</p>}
            {userEmail && <p className="text-base text-white/80 drop-shadow-lg mt-2">Email: {userEmail}</p>}
          </div>
          <button
            onClick={onClose}
            className="mt-6 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform"
          >
            Claim Prize
          </button>
        </div>
      </div>
    );
  }

  // Contained popup mode (inside modal): no extra backdrop; center a gradient card
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="relative w-full max-w-xl mx-4 p-10 rounded-2xl shadow-2xl text-center text-white bg-gradient-to-br from-purple-500 to-pink-500 animate-in fade-in duration-200">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold mb-5 drop-shadow-lg">Congratulations!</h2>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 shadow-xl">
          {prize.icon && (
            <div className="text-5xl mb-3">{prize.icon}</div>
          )}
          <p className="text-2xl font-bold mb-2 drop-shadow-lg">{prize.text}</p>
          {prize.value && (
            <p className="text-lg text-white/90 drop-shadow-lg">{prize.value}</p>
          )}
          {userEmail && (
            <p className="text-base text-white/80 drop-shadow-lg mt-2">Email: {userEmail}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform"
        >
          Claim Prize
        </button>
      </div>
    </div>
  );
}
;
