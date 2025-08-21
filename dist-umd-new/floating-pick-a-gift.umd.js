(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FloatingPickAGift = {}, global.React, global.ReactDOM));
})(this, (function (exports, React, ReactDOM) { 'use strict';

  // Prize configuration
  const defaultPrizes = [
    { text: "10% Off", value: "Save 10% on your next order", icon: "🎯", color: "#3b82f6", probability: 30 },
    { text: "Free Shipping", value: "Free shipping on orders over $50", icon: "🚚", color: "#10b981", probability: 25 },
    { text: "15% Off", value: "Save 15% on your next order", icon: "💰", color: "#f59e0b", probability: 20 },
    { text: "Buy 1 Get 1", value: "Buy one get one free on select items", icon: "🎁", color: "#8b5cf6", probability: 15 },
    { text: "20% Off", value: "Save 20% on your next order", icon: "⭐", color: "#ef4444", probability: 8 },
    { text: "$25 Off", value: "Get $25 off orders over $100", icon: "💎", color: "#06b6d4", probability: 2 }
  ];

  // Game Modal Hook
  function useGameModal(options = {}) {
    const { startWithEmail = false, revealDelayMs = 300 } = options;
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [showPrize, setShowPrize] = React.useState(false);
    const [currentPrize, setCurrentPrize] = React.useState(null);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [showEmailInput, setShowEmailInput] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [pendingPrize, setPendingPrize] = React.useState(null);

    const validateEmail = React.useCallback((email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }, []);

    const handleEmailSubmit = React.useCallback((email) => {
      if (!validateEmail(email)) {
        return false;
      }
      setUserEmail(email);
      setShowEmailInput(false);
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
    }, [pendingPrize, revealDelayMs, validateEmail]);

    const handleOpenModal = React.useCallback(() => {
      setIsModalOpen(true);
      setShowPrize(false);
      setCurrentPrize(null);
      setShowConfetti(false);
      setShowEmailInput(false); // Changed: Don't show email input on modal open
      setUserEmail('');
      setPendingPrize(null);
      // Clear any existing confetti
      const existingConfetti = document.querySelectorAll('.confetti-piece');
      existingConfetti.forEach(piece => piece.remove());
    }, []);

    const handleCloseModal = React.useCallback(() => {
      setIsModalOpen(false);
      setShowPrize(false);
      setCurrentPrize(null);
      setShowConfetti(false);
      setShowEmailInput(false);
      setUserEmail('');
      setPendingPrize(null); // Clear pending prize on close
      // Clear any existing confetti
      const existingConfetti = document.querySelectorAll('.confetti-piece');
      existingConfetti.forEach(piece => piece.remove());
    }, []);

    const handlePrizeReveal = React.useCallback((prize) => {
      // Instead of showing prize immediately, show email input first
      setPendingPrize(prize);
      setShowEmailInput(true);
      setShowConfetti(false); // Reset confetti state
    }, []);

    const handleCancelEmail = React.useCallback(() => {
      setShowEmailInput(false);
      setIsModalOpen(false);
      setPendingPrize(null); // Clear pending prize on cancel
    }, []);

    return {
      isModalOpen,
      showPrize,
      currentPrize,
      showConfetti,
      showEmailInput,
      userEmail,
      handleOpenModal,
      handleCloseModal,
      handleEmailSubmit,
      handleCancelEmail,
      handlePrizeReveal,
      validateEmail,
    };
  }

  // Confetti Component
  function Confetti({ isActive, zIndexClass = "z-[70]" }) {
    if (!isActive) return null;

    return React.createElement('div', {
      className: 'fixed inset-0 pointer-events-none',
      style: { zIndex: 70 }
    },
      Array.from({ length: 100 }).map((_, i) =>
        React.createElement('div', {
          key: i,
          className: 'absolute animate-confetti',
          style: {
            left: Math.random() * 100 + '%',
            top: '-10px',
            animationDelay: Math.random() * 1 + 's',
            animationDuration: (1 + Math.random() * 1) + 's'
          }
        },
          React.createElement('div', {
            className: 'w-3 h-3 rounded-full shadow-lg',
            style: {
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFD93D', '#6BCF7F'][Math.floor(Math.random() * 8)],
              transform: 'rotate(' + (Math.random() * 360) + 'deg)'
            }
          })
        )
      )
    );
  }

  // Email Input Component
  function EmailInput({ isVisible, onSubmit, onCancel }) {
    const [email, setEmail] = React.useState('');
    const [hasError, setHasError] = React.useState(false);

    const handleSubmit = () => {
      const success = onSubmit(email);
      if (!success) {
        setHasError(true);
      } else {
        setHasError(false);
        setEmail('');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    if (!isVisible) return null;

    return React.createElement('div', { className: `email-overlay ${isVisible ? 'active' : ''}` },
      React.createElement('div', { className: 'email-form' },
        React.createElement('h2', null, 'Enter Your Email'),
        React.createElement('p', null, 'Please enter your email address to play the Pick-a-Gift game and claim your prize!'),
        React.createElement('input', {
          type: 'email',
          className: `email-input ${hasError ? 'error' : ''}`,
          placeholder: 'Enter your email address',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          onKeyPress: handleKeyPress,
          autoFocus: true
        }),
        React.createElement('div', { className: 'email-buttons' },
          React.createElement('button', { className: 'btn btn-secondary', onClick: onCancel }, 'Cancel'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleSubmit }, 'Continue')
        )
      )
    );
  }

  // Game Modal Component
  function GameModal({ isOpen, onClose, children }) {
    React.useEffect(() => {
      const handleEscape = (event) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);

    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return React.createElement('div', {
      className: `modal-backdrop ${isOpen ? 'active' : ''}`,
      onClick: handleBackdropClick
    },
      React.createElement('div', { className: 'modal-content' },
        React.createElement('button', {
          className: 'modal-close',
          onClick: onClose,
          'aria-label': 'Close modal'
        },
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
            React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
          )
        ),
        children
      )
    );
  }

  // Prize Reveal Component
  function PrizeReveal({ isVisible, prize, userEmail, onClose }) {
    if (!isVisible || !prize) return null;

    return React.createElement('div', { className: `prize-overlay ${isVisible ? 'active' : ''}` },
      React.createElement('div', { className: 'prize-card' },
        React.createElement('span', { className: 'prize-icon' }, prize.icon || '🎁'),
        React.createElement('h3', { className: 'prize-title' }, 'Congratulations!'),
        React.createElement('p', { className: 'prize-text' }, 
          'You won: ', React.createElement('span', null, prize.text)
        ),
        prize.value && React.createElement('p', { className: 'prize-value' }, prize.value),
        React.createElement('p', { className: 'prize-email' }, `Email: ${userEmail}`),
        React.createElement('button', { className: 'prize-button', onClick: onClose }, 'Claim Prize')
      )
    );
  }

  // Pick-A-Gift Component
  function PickAGift({ prizes = defaultPrizes, onReveal }) {
    const [selectedGift, setSelectedGift] = React.useState(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [giftBoxes, setGiftBoxes] = React.useState([]);

    React.useEffect(() => {
      const boxes = [];
      for (let i = 0; i < 3; i++) {
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        boxes.push(randomPrize);
      }
      setGiftBoxes(boxes);
    }, [prizes]);

    const handleGiftSelect = (giftIndex) => {
      if (selectedGift !== null || isAnimating) return;

      setIsAnimating(true);
      setSelectedGift(giftIndex);

      setTimeout(() => {
        const prize = giftBoxes[giftIndex];
        setIsAnimating(false);
        onReveal(prize);
      }, 1000);
    };

    const renderGiftBox = (index) => {
      return React.createElement('button', {
        key: `gift-box-${index}`,
        className: `gift-box ${selectedGift === index && isAnimating ? 'animating' : ''}`,
        onClick: () => handleGiftSelect(index),
        'aria-label': `Select gift box ${index + 1}`,
        type: 'button'
      },
        React.createElement('div', { className: 'gift-box-inner' },
          React.createElement('div', { className: 'gift-highlight' }),
          React.createElement('div', { className: 'ribbon-vertical' }),
          React.createElement('div', { className: 'ribbon-horizontal' }),
          React.createElement('div', { className: 'bow' },
            React.createElement('div', { className: 'bow-left' }),
            React.createElement('div', { className: 'bow-right' }),
            React.createElement('div', { className: 'bow-center' })
          )
        ),
        selectedGift === index && isAnimating && React.createElement('div', { className: 'selection-indicator' })
      );
    };

    return React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'game-container' },
        React.createElement('div', { className: 'game-rays' }),
        React.createElement('div', { className: 'game-inner' },
          React.createElement('h2', { className: 'game-title' }, 
            'Pick a gift for a chance to win a', React.createElement('br'), 'prize for your next order!'
          ),
          React.createElement('div', { className: 'gift-boxes' },
            giftBoxes.map((_, index) => renderGiftBox(index))
          ),
          React.createElement('p', { className: 'game-instruction' }, 'Choose any gift box to reveal your prize!')
        ),
        React.createElement('div', { className: `loading-overlay ${isAnimating ? 'active' : ''}` },
          React.createElement('div', { className: 'loading-content' },
            React.createElement('div', { className: 'loading-spinner' }),
            React.createElement('p', { className: 'loading-text' }, 'Opening your gift...')
          )
        )
      ),
      // Prize Information Section
      React.createElement('div', { className: 'prize-info' },
        React.createElement('h3', null, 'Available Prizes'),
        React.createElement('div', { className: 'prize-grid' },
          prizes.map((prize, index) =>
            React.createElement('div', {
              key: `prize-${prize.text}-${index}`,
              className: 'prize-item',
              style: { borderColor: prize.color || '#e5e7eb' }
            },
              React.createElement('div', { className: 'prize-item-icon' }, prize.icon),
              React.createElement('div', { className: 'prize-item-text' }, prize.text),
              prize.value && React.createElement('div', { className: 'prize-item-value' }, prize.value)
            )
          )
        )
      )
    );
  }

  // Main Floating Pick-A-Gift Game Component
  function FloatingPickAGiftGame({ prizes = defaultPrizes, className = '' }) {
    const {
      isModalOpen,
      showPrize,
      currentPrize,
      showConfetti,
      showEmailInput,
      userEmail,
      handleOpenModal,
      handleCloseModal,
      handleEmailSubmit,
      handleCancelEmail,
      handlePrizeReveal,
    } = useGameModal();

    const onReveal = React.useCallback((wonPrize) => {
      handlePrizeReveal(wonPrize);
    }, [handlePrizeReveal]);

    return React.createElement(React.Fragment, null,
      // Confetti Effect
      React.createElement(Confetti, { isActive: showConfetti, zIndexClass: "z-[70]" }),

      // Floating Button
      React.createElement('button', {
        onClick: handleOpenModal,
        className: `floating-button ${className}`,
        'aria-label': 'Open Pick a Gift Game'
      },
        React.createElement('svg', {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
          React.createElement('rect', { x: '3', y: '8', width: '18', height: '4', rx: '1' }),
          React.createElement('path', { d: 'm12 8-1-4h2l-1 4' }),
          React.createElement('path', { d: 'm12 16 1 4h-2l1-4' })
        )
      ),

      // Game Modal
      React.createElement(GameModal, { isOpen: isModalOpen, onClose: handleCloseModal },
        // Email Input Overlay
        React.createElement(EmailInput, {
          isVisible: showEmailInput,
          onSubmit: handleEmailSubmit,
          onCancel: handleCancelEmail
        }),

        // Game Content
        React.createElement('div', {
          className: `game-content ${showEmailInput ? 'hidden' : ''}`
        },
          React.createElement(PickAGift, {
            prizes: prizes,
            onReveal: onReveal
          })
        ),

        // Prize Reveal Overlay
        currentPrize && React.createElement(PrizeReveal, {
          isVisible: showPrize,
          prize: currentPrize,
          userEmail: userEmail,
          onClose: handleCloseModal
        })
      )
    );
  }

  // Render functions for UMD usage
  function renderFloatingPickAGift(container, options = {}) {
    const { prizes = defaultPrizes, ...props } = options;
    const element = React.createElement(FloatingPickAGiftGame, { prizes, ...props });
    ReactDOM.render(element, container);
  }

  function renderPickAGift(container, options = {}) {
    // For backward compatibility, render the floating version
    renderFloatingPickAGift(container, options);
  }

  // Export functions
  exports.FloatingPickAGiftGame = FloatingPickAGiftGame;
  exports.renderFloatingPickAGift = renderFloatingPickAGift;
  exports.renderPickAGift = renderPickAGift;
  exports.defaultPrizes = defaultPrizes;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
