import React, { useState, useEffect, useCallback } from 'react';
import { SpinWheel } from '@/components/ui/spin-wheel';
import { X, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

// Confetti component for prize celebration
const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
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

interface SpinWheelSegment {
  text: string;
  color: string;
  value?: string;
}

interface FloatingWheelGameProps {
  segments: SpinWheelSegment[];
  wheelSize?: number;
  animationDuration?: number;
  minRevolutions?: number;
  maxRevolutions?: number;
  title?: string;
  buttonText?: string;
  spinningText?: string;
  disabled?: boolean;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinWheelSegment) => void;
  className?: string;
}

export const FloatingWheelGame: React.FC<FloatingWheelGameProps> = ({
  segments,
  wheelSize = 400,
  animationDuration,
  minRevolutions,
  maxRevolutions,
  title,
  buttonText,
  spinningText,
  disabled,
  onSpinStart,
  onSpinEnd,
  className,
}: FloatingWheelGameProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<SpinWheelSegment | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // Onboarding coachmark for bottom-right initiator icon (once per user)
  const [showCoachmark, setShowCoachmark] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Show coachmark once per user for the wheel game
  useEffect(() => {
    try {
      const key = 'coachmark_shown_wheel';
      const seen = typeof window !== 'undefined' ? localStorage.getItem(key) : '1';
      if (!seen) {
        setShowCoachmark(true);
      }
    } catch {}
  }, []);



  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  // Enhanced prize reveal handler
  const handleSpinEnd = useCallback((result: SpinWheelSegment) => {
    setCurrentPrize(result);
    
    // Trigger confetti and prize reveal sequence - much faster timing
    setTimeout(() => {
      setShowConfetti(true);
      setShowPrize(true); // Show prize immediately with confetti
    }, 300); // Reduced from 1000ms to 300ms
    
    // Call original onSpinEnd if provided
    onSpinEnd?.(result);
  }, [onSpinEnd]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email submission
  const handleEmailSubmit = useCallback((email: string) => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setUserEmail(email);
    setEmailError('');
    setShowEmailInput(false);
    // After email is submitted, trigger the actual spin
    setTimeout(() => {
      // Trigger spin by calling the spin function directly
      const spinButton = document.querySelector('[data-spin-button]') as HTMLButtonElement;
      if (spinButton) {
        spinButton.click();
      }
    }, 100);
    return true;
  }, []);

  // Handle spin button click - show email input first
  const handleSpinClick = useCallback(() => {
    setShowEmailInput(true);
  }, []);

  // Reset prize state when modal opens
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setShowPrize(false);
    setCurrentPrize(null);
    setShowConfetti(false);
    setShowEmailInput(false);
    setUserEmail('');
    setEmailError('');
    // Dismiss coachmark and persist
    try {
      localStorage.setItem('coachmark_shown_wheel', '1');
    } catch {}
    setShowCoachmark(false);
  }, []);

  return (
    <>
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />
      
      {/* Floating Icon */}
      <button
        onClick={handleOpenModal}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group",
          "flex items-center justify-center text-white",
          "animate-pulse hover:animate-none",
          "focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50",
          className
        )}
        aria-label="Open Wheel Spin Game"
      >
        <Gift className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        
        {/* Pulse ring */}
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
          <div className="text-sm font-semibold mb-1">Try the Wheel</div>
          <div className="text-xs">Click here to spin and unlock instant banking offers and coupons.</div>
          <div className="mt-2 text-right">
            <button
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                try { localStorage.setItem('coachmark_shown_wheel', '1'); } catch {}
                setShowCoachmark(false);
              }}
            >Got it</button>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Email Input Popup */}
            {showEmailInput && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                  <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Enter Your Email
                  </h3>
                  <p className="text-center mb-6 text-gray-600">
                    Please enter your email address to spin the wheel and claim your prize!
                  </p>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEmailSubmit(userEmail);
                      }
                    }}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mb-4 text-center">{emailError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEmailInput(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEmailSubmit(userEmail)}
                      className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Game Content */}
            <div className={cn("p-6 transition-opacity duration-200", (showPrize || showEmailInput) && "opacity-0")}>
              <SpinWheel
                segments={segments}
                wheelSize={wheelSize}
                animationDuration={animationDuration}
                minRevolutions={minRevolutions}
                maxRevolutions={maxRevolutions}
                title={title}
                buttonText={buttonText}
                spinningText={spinningText}
                disabled={disabled}
                onSpinStart={onSpinStart}
                onSpinEnd={handleSpinEnd}
                onSpinClick={handleSpinClick}
                userEmail={userEmail}
                variant="card"
                size="lg"
                className="w-full"
              />
            </div>

            {/* Prize Reveal Overlay */}
            {showPrize && currentPrize && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl animate-in fade-in duration-200">
                <div className="text-center text-white p-8 animate-prize-pop">
                  <div className="text-8xl mb-6 animate-bounce">🎉</div>
                  <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Congratulations!</h2>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <p className="text-3xl font-bold mb-3 drop-shadow-lg">{currentPrize.text}</p>
                    {currentPrize.value && (
                      <p className="text-xl text-white/90 drop-shadow-lg">{currentPrize.value}</p>
                    )}
                    {userEmail && (
                      <p className="text-lg text-white/80 drop-shadow-lg mt-2">Email: {userEmail}</p>
                    )}
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="mt-8 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform"
                  >
                    Claim Prize
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
