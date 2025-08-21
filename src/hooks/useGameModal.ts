import { useState, useCallback } from 'react';

interface Prize {
  text: string;
  value?: string;
  icon?: string;
  color?: string;
}

type UseGameModalOptions = {
  startWithEmail?: boolean;
  revealDelayMs?: number; // delay before showing prize+confetti
};

export const useGameModal = (options: UseGameModalOptions = {}) => {
  const { startWithEmail = true, revealDelayMs = 300 } = options;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [pendingPrize, setPendingPrize] = useState<Prize | null>(null);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email submission
  const handleEmailSubmit = useCallback((email: string) => {
    if (!validateEmail(email)) {
      return false;
    }
    setUserEmail(email);
    setShowEmailInput(false);
    // If there is a pending prize (e.g., scratch completed before email), reveal now
    if (pendingPrize) {
      setCurrentPrize(pendingPrize);
      setPendingPrize(null);
      if (revealDelayMs > 0) {
        setTimeout(() => {
          setShowConfetti(true);
          setShowPrize(true);
        }, revealDelayMs);
      } else {
        setShowConfetti(true);
        setShowPrize(true);
      }
    }
    return true;
  }, [pendingPrize, revealDelayMs]);

  // Handle opening modal
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setShowPrize(false);
    setCurrentPrize(null);
    setShowConfetti(false);
    setShowEmailInput(startWithEmail); // optionally show email first
    setUserEmail('');
  }, [startWithEmail]);

  // Handle closing modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setShowPrize(false);
    setCurrentPrize(null);
    setShowConfetti(false);
    setShowEmailInput(false);
    setUserEmail('');
  }, []);

  // Handle prize reveal
  const handlePrizeReveal = useCallback((prize: Prize) => {
    setCurrentPrize(prize);
    
    // Trigger confetti and prize reveal sequence
    if (revealDelayMs > 0) {
      setTimeout(() => {
        setShowConfetti(true);
        setShowPrize(true);
      }, revealDelayMs);
    } else {
      setShowConfetti(true);
      setShowPrize(true);
    }
  }, [revealDelayMs]);

  // For flows where email is required AFTER game interaction
  const requestEmailThenReveal = useCallback((prize: Prize) => {
    setPendingPrize(prize);
    setShowEmailInput(true);
  }, []);

  // Handle canceling email input
  const handleCancelEmail = useCallback(() => {
    setShowEmailInput(false);
    setIsModalOpen(false);
  }, []);

  return {
    // State
    isModalOpen,
    showPrize,
    currentPrize,
    showConfetti,
    showEmailInput,
    userEmail,
    
    // Actions
    handleOpenModal,
    handleCloseModal,
    handleEmailSubmit,
    handleCancelEmail,
    handlePrizeReveal,
    requestEmailThenReveal,
    
    // Utilities
    validateEmail,
  };
};
