import React, { useCallback, useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScratchCard, type ScratchCardPrize } from '@/components/ui/scratch-card';
import { GameModal } from '@/components/shared/GameModal';
import { EmailInput } from '@/components/shared/EmailInput';
import { PrizeReveal } from '@/components/shared/PrizeReveal';
import { Confetti } from '@/components/shared/Confetti';
import { useGameModal } from '@/hooks/useGameModal';
import { defaultScratchCardConfig } from '@/lib/config-loader';

interface FloatingScratchCardGameProps {
  prize: ScratchCardPrize;
  cardWidth?: number;
  cardHeight?: number;
  scratchColor?: string;
  scratchPattern?: string;
  revealThreshold?: number;
  title?: string;
  resetButtonText?: string;
  instructions?: string;
  className?: string;
}

export const FloatingScratchCardGame: React.FC<FloatingScratchCardGameProps> = ({
  prize,
  cardWidth,
  cardHeight,
  scratchColor,
  scratchPattern,
  revealThreshold,
  title,
  resetButtonText,
  instructions,
  className,
}) => {
  const [activePrize, setActivePrize] = useState<ScratchCardPrize>(
    prize ?? defaultScratchCardConfig.prizes[0]
  );
  const {
    // state
    isModalOpen,
    showPrize,
    currentPrize,
    showConfetti,
    showEmailInput,
    userEmail,
    // actions
    handleOpenModal,
    handleCloseModal,
    handleEmailSubmit,
    handleCancelEmail,
    requestEmailThenReveal,
  } = useGameModal({ startWithEmail: false, revealDelayMs: 0 });

  // Coachmark: show once per user for scratch game
  const [showCoachmark, setShowCoachmark] = useState(false);
  useEffect(() => {
    try {
      const key = 'coachmark_shown_scratch';
      const seen = typeof window !== 'undefined' ? localStorage.getItem(key) : '1';
      if (!seen) setShowCoachmark(true);
    } catch {}
  }, []);

  const onReveal = useCallback((wonPrize: ScratchCardPrize) => {
    // After user finishes scratching, request email and then reveal the prize
    requestEmailThenReveal(wonPrize);
  }, [requestEmailThenReveal]);

  const handleOpenWithRandomPrize = useCallback(() => {
    const pool = defaultScratchCardConfig.prizes;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setActivePrize(next);
    handleOpenModal();
    try { localStorage.setItem('coachmark_shown_scratch', '1'); } catch {}
    setShowCoachmark(false);
  }, [handleOpenModal]);

  return (
    <>
      {/* Confetti Effect (above the centered popup) */}
      <Confetti isActive={showConfetti} zIndexClass="z-[70]" />

      {/* Floating Icon */}
      <button
        onClick={handleOpenWithRandomPrize}
        className={cn(
          'fixed bottom-6 right-24 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group',
          'flex items-center justify-center text-white',
          'animate-pulse hover:animate-none',
          'focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50',
          className,
        )}
        aria-label="Open Scratch Card Game"
      >
        <Gift className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
      </button>

      {/* Coachmark tooltip (once) */}
      {showCoachmark && (
        <div
          className="fixed bottom-24 right-24 z-50 max-w-xs bg-white text-gray-800 border border-gray-200 shadow-xl rounded-lg p-3 animate-in fade-in duration-200"
          onClick={() => setShowCoachmark(false)}
          role="dialog"
          aria-live="polite"
        >
          <div className="text-sm font-semibold mb-1">Try Scratch Card</div>
          <div className="text-xs">Open to reveal surprise rewards after simple banking actions.</div>
          <div className="mt-2 text-right">
            <button
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                try { localStorage.setItem('coachmark_shown_scratch', '1'); } catch {}
                setShowCoachmark(false);
              }}
            >Got it</button>
          </div>
        </div>
      )}

      <GameModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        {/* Email step overlay */}
        <EmailInput isVisible={showEmailInput} onSubmit={handleEmailSubmit} onCancel={handleCancelEmail} />

        {/* Content (keep visible when prize is shown so it appears behind the popup) */}
        <div className={cn('p-6 transition-opacity duration-200', showEmailInput && 'opacity-0')}> 
          <ScratchCard
            prize={activePrize}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            scratchColor={scratchColor}
            scratchPattern={scratchPattern}
            revealThreshold={revealThreshold}
            title={title}
            resetButtonText={resetButtonText}
            instructions={instructions}
            externalReveal
            variant="card"
            size="lg"
            onReveal={onReveal}
            disabled={showEmailInput}
            className="w-full"
          />
          {/* Content is faded when prize is visible; fullscreen reveal rendered outside modal below */}
        </div>
      </GameModal>

      {/* Fullscreen Prize Reveal (matches FloatingWheel) */}
      {currentPrize && (
        <PrizeReveal
          isVisible={showPrize}
          prize={currentPrize}
          userEmail={userEmail}
          onClose={handleCloseModal}
          centeredCard
        />
      )}

    </>
  );
};
