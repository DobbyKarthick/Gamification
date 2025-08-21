import React, { useCallback } from 'react';
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
