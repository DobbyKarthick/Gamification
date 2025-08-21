import React from 'react';
import ReactDOM from 'react-dom/client';
import { PickAGift, type PickAGiftPrize } from '@/components/ui/pick-a-gift';
import { ScratchCard, type ScratchCardPrize } from '@/components/ui/scratch-card';
import { defaultPickAGiftConfig, defaultScratchCardConfig } from '@/lib/config-loader';
import '@/index.css';
import { FloatingPickAGiftGame } from '@/components/FloatingPickAGiftGame';
import { FloatingScratchCardGame } from '@/components/FloatingScratchCardGame';

// Helper to mount a React component into a container
function mount(component: React.ReactElement, container: HTMLElement) {
  const root = ReactDOM.createRoot(container);
  root.render(component);
  return () => root.unmount();
}

export type RenderPickAGiftProps = {
  prizes?: PickAGiftPrize[];
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'card' | 'minimal';
};

export type RenderScratchCardProps = {
  prize?: ScratchCardPrize;
  cardWidth?: number;
  cardHeight?: number;
  scratchColor?: string;
  scratchPattern?: string;
  revealThreshold?: number;
  title?: string;
  resetButtonText?: string;
  instructions?: string;
  className?: string;
};

function renderPickAGift(container: HTMLElement, props: RenderPickAGiftProps = {}) {
  const prizes = props.prizes ?? defaultPickAGiftConfig.prizes;
  return mount(
    <PickAGift
      prizes={prizes}
      className={props.className}
      size={props.size}
      variant={props.variant as any}
    />,
    container
  );
}

function renderScratchCard(container: HTMLElement, props: RenderScratchCardProps = {}) {
  const prize = props.prize ?? defaultScratchCardConfig.prizes[0];
  return mount(
    <ScratchCard
      prize={prize}
      cardWidth={props.cardWidth ?? defaultScratchCardConfig.defaults.cardWidth}
      cardHeight={props.cardHeight ?? defaultScratchCardConfig.defaults.cardHeight}
      scratchColor={props.scratchColor ?? defaultScratchCardConfig.defaults.scratchColor}
      scratchPattern={props.scratchPattern ?? defaultScratchCardConfig.defaults.scratchPattern}
      revealThreshold={props.revealThreshold ?? defaultScratchCardConfig.defaults.revealThreshold}
      title={props.title ?? defaultScratchCardConfig.defaults.title}
      resetButtonText={props.resetButtonText ?? defaultScratchCardConfig.defaults.resetButtonText}
      instructions={props.instructions ?? defaultScratchCardConfig.defaults.instructions}
      variant="card"
      size="lg"
    />,
    container
  );
}

// Floating experiences matching app behavior
function renderFloatingPickAGift(container: HTMLElement, props: RenderPickAGiftProps = {}) {
  const prizes = props.prizes ?? defaultPickAGiftConfig.prizes;
  return mount(
    <FloatingPickAGiftGame prizes={prizes} className={props.className} />,
    container
  );
}

function renderFloatingScratchCard(container: HTMLElement, props: RenderScratchCardProps = {}) {
  const prize = props.prize ?? defaultScratchCardConfig.prizes[0];
  return mount(
    <FloatingScratchCardGame
      prize={prize}
      cardWidth={props.cardWidth ?? defaultScratchCardConfig.defaults.cardWidth}
      cardHeight={props.cardHeight ?? defaultScratchCardConfig.defaults.cardHeight}
      scratchColor={props.scratchColor ?? defaultScratchCardConfig.defaults.scratchColor}
      scratchPattern={props.scratchPattern ?? defaultScratchCardConfig.defaults.scratchPattern}
      revealThreshold={props.revealThreshold ?? defaultScratchCardConfig.defaults.revealThreshold}
      title={props.title ?? defaultScratchCardConfig.defaults.title}
      resetButtonText={props.resetButtonText ?? defaultScratchCardConfig.defaults.resetButtonText}
      instructions={props.instructions ?? defaultScratchCardConfig.defaults.instructions}
      className={props.className}
    />,
    container
  );
}

// Export functions for UMD
const gamificationAPI = {
  renderPickAGift,
  renderScratchCard,
  renderFloatingPickAGift,
  renderFloatingScratchCard,
};

// Assign to window for direct browser usage
if (typeof window !== 'undefined') {
  (window as any).Gamification = gamificationAPI;
}

// Default export for UMD
export default gamificationAPI;

// Named exports
export { renderPickAGift, renderScratchCard, renderFloatingPickAGift, renderFloatingScratchCard };
