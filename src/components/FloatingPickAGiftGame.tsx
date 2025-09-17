import React, { useCallback, useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PickAGift, type PickAGiftPrize } from '@/components/ui/pick-a-gift';
import { GameModal } from '@/components/shared/GameModal';
import { EmailInput } from '@/components/shared/EmailInput';
import { PrizeReveal } from '@/components/shared/PrizeReveal';
import { Confetti } from '@/components/shared/Confetti';
import { useGameModal } from '@/hooks/useGameModal';

interface FloatingPickAGiftGameProps {
  prizes: PickAGiftPrize[];
  className?: string;
}

export const FloatingPickAGiftGame: React.FC<FloatingPickAGiftGameProps> = ({
  prizes,
  className,
}) => {
  // Coachmark: show once per user for gift game
  const [showCoachmark, setShowCoachmark] = useState(false);
  useEffect(() => {
    try {
      const key = 'coachmark_shown_gift';
      const seen = typeof window !== 'undefined' ? localStorage.getItem(key) : '1';
      if (!seen) setShowCoachmark(true);
    } catch {}
  }, []);
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
    handlePrizeReveal,
  } = useGameModal();

  const onReveal = useCallback((wonPrize: PickAGiftPrize) => {
    handlePrizeReveal(wonPrize);
  }, [handlePrizeReveal]);

  return (
    <>
      {/* Confetti Effect (above centered popup) */}
      <Confetti isActive={showConfetti} zIndexClass="z-[70]" />

      {/* Floating Icon */}
      <button
        onClick={handleOpenModal}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group',
          'flex items-center justify-center text-white',
          'animate-pulse hover:animate-none',
          'focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50',
          className,
        )}
        aria-label="Open Pick a Gift Game"
      >
        <Gift className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
      </button>

      {/* Coachmark tooltip (once) */}
      {showCoachmark && (
        <div
          className="fixed bottom-24 right-6 z-50 max-w-xs bg-white text-gray-800 border border-gray-200 shadow-xl rounded-lg p-3 animate-in fade-in duration-200"
          onClick={() => setShowCoachmark(false)}
          role="dialog"
          aria-live="polite"
        >
          <div className="text-sm font-semibold mb-1">Pick a Gift</div>
          <div className="text-xs">Open to choose a mystery gift and redeem banking partner offers.</div>
          <div className="mt-2 text-right">
            <button
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                try { localStorage.setItem('coachmark_shown_gift', '1'); } catch {}
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

        {/* Content (keep visible when prize showing so it appears behind popup) */}
        <div className={cn('p-6 transition-opacity duration-200', showEmailInput && 'opacity-0')}>
          <PickAGift
            prizes={prizes}
            externalReveal
            onReveal={onReveal}
            className="py-4"
            variant="card"
            size="lg"
          />
        </div>

        {/* Prize Reveal Overlay */}
        {currentPrize && (
          <PrizeReveal
            isVisible={showPrize}
            prize={currentPrize}
            userEmail={userEmail}
            centeredCard
            onClose={handleCloseModal}
          />
        )}
      </GameModal>
    </>
  );
};
