import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultPickAGiftConfig } from "@/lib/config-loader";

const pickAGiftVariants = cva(
  "relative w-full flex flex-col items-center justify-center cursor-pointer",
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      variant: {
        default: "bg-background",
        card: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl",
        minimal: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface PickAGiftPrize {
  text: string;
  value?: string;
  color?: string;
  icon?: string;
  probability?: number;
}

interface PickAGiftProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof pickAGiftVariants> {
  prizes: PickAGiftPrize[];
  externalReveal?: boolean;
  onGiftSelect?: (giftIndex: number) => void;
  onReveal?: (prize: PickAGiftPrize) => void;
  onReset?: () => void;
}

const PickAGift = React.forwardRef<HTMLDivElement, PickAGiftProps>(
  (
    {
      className,
      size,
      variant,
      prizes = defaultPickAGiftConfig.prizes,
      externalReveal = false,
      onGiftSelect,
      onReveal,
      onReset,
      ...props
    },
    ref
  ) => {
    const [selectedGift, setSelectedGift] = React.useState<number | null>(null);
    const [revealedPrize, setRevealedPrize] = React.useState<PickAGiftPrize | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [giftBoxes, setGiftBoxes] = React.useState<PickAGiftPrize[]>([]);

    // Initialize gift boxes with random prizes
    React.useEffect(() => {
      const boxes: PickAGiftPrize[] = [];
      for (let i = 0; i < 3; i++) {
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        boxes.push(randomPrize);
      }
      setGiftBoxes(boxes);
    }, [prizes]);

    const handleGiftSelect = (giftIndex: number) => {
      if (selectedGift !== null || isAnimating) return;

      console.log(`Gift selected: ${giftIndex}`);
      console.log('Gift Boxes:', giftBoxes);

      setIsAnimating(true);
      setSelectedGift(giftIndex);
      onGiftSelect?.(giftIndex);

      // Animate the reveal
      setTimeout(() => {
        const prize = giftBoxes[giftIndex];
        console.log('Revealed Prize:', prize);
        setRevealedPrize(prize);
        setIsAnimating(false);
        onReveal?.(prize);
      }, 1000);
    };

    const handleReset = () => {
      console.log('Resetting Pick-a-Gift');

      setSelectedGift(null);
      setRevealedPrize(null);
      setIsAnimating(false);

      // Regenerate gift boxes
      const boxes: PickAGiftPrize[] = [];
      for (let i = 0; i < 3; i++) {
        const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
        boxes.push(randomPrize);
      }
      setGiftBoxes(boxes);
      console.log('New Gift Boxes:', boxes);

      onReset?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          pickAGiftVariants({ size, variant, className }),
          "shadow-3d-light transition-all duration-300 hover:shadow-3d-heavy hover:scale-[1.01]"
        )}
        {...props}
      >
        {/* Purple Gradient Background with Rays */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl mx-auto"
          style={{
            background: `
              radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)
            `,
            backgroundSize: '30px 30px, 100% 100%',
            minHeight: '400px'
          }}
        >
          {/* Radial rays effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  transparent 0deg,
                  rgba(255, 255, 255, 0.3) 2deg,
                  transparent 4deg
                )
              `
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              Pick a gift for a chance to win a<br />
              prize for your next order!
            </h2>

            {/* Gift Boxes */}
            {!revealedPrize ? (
              <div className="flex justify-center items-center space-x-8 mb-8">
                {giftBoxes.map((_, index) => (
                  <button
                    key={`gift-box-${index}`}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300 hover:scale-110",
                      selectedGift === index && isAnimating && "animate-pulse scale-110"
                    )}
                    onClick={() => handleGiftSelect(index)}
                    aria-label={`Select gift box ${index + 1}`}
                    type="button"
                  >
                    {/* Gift Box */}
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg relative"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        border: '2px solid #7f1d1d'
                      }}
                    >
                      {/* Gift Box Highlight */}
                      <div
                        className="absolute inset-2 rounded-md opacity-30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)'
                        }}
                      />

                      {/* Ribbon Vertical */}
                      <div
                        className="absolute left-1/2 top-0 bottom-0 w-3 md:w-4 -ml-1.5 md:-ml-2"
                        style={{
                          background: 'linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                        }}
                      />

                      {/* Ribbon Horizontal */}
                      <div
                        className="absolute top-1/2 left-0 right-0 h-3 md:h-4 -mt-1.5 md:-mt-2"
                        style={{
                          background: 'linear-gradient(180deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                        }}
                      />

                      {/* Bow */}
                      <div className="absolute -top-2 left-1/2 -ml-3 md:-ml-4">
                        <div className="relative">
                          {/* Bow Left */}
                          <div
                            className="absolute w-3 h-4 md:w-4 md:h-5 -left-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                              transform: 'rotate(-30deg)'
                            }}
                          />
                          {/* Bow Right */}
                          <div
                            className="absolute w-3 h-4 md:w-4 md:h-5 -right-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                              transform: 'rotate(30deg)'
                            }}
                          />
                          {/* Bow Center */}
                          <div
                            className="absolute w-2 h-2 md:w-3 md:h-3 -left-1 top-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedGift === index && isAnimating && (
                      <div className="absolute inset-0 rounded-lg border-4 border-yellow-400 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Prize Reveal */
              !externalReveal && (
                <div className="text-center mb-8">
                  <div className="inline-block p-8 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
                    <div className="text-6xl mb-4">{revealedPrize.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Congratulations!
                    </h3>
                    <p className="text-xl text-white/90 mb-2">
                      You won: <span className="font-bold">{revealedPrize.text}</span>
                    </p>
                    {revealedPrize.value && (
                      <p className="text-white/80 text-sm">
                        {revealedPrize.value}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Action Buttons */}
            {!externalReveal && (
              <div className="flex justify-center space-x-4">
                {revealedPrize ? (
                  <>
                    <Button
                      onClick={handleReset}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                      size="lg"
                    >
                      Play Again
                    </Button>
                    <Button
                      className="bg-white text-purple-600 hover:bg-gray-100"
                      size="lg"
                    >
                      Claim Prize
                    </Button>
                  </>
                ) : (
                  <p className="text-white/80 text-sm mt-4">
                    Choose any gift box to reveal your prize!
                  </p>
                )}
              </div>
            )}

            {/* Loading Animation */}
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                  <p className="text-white text-lg font-medium">
                    Opening your gift...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prize Information */}
        <div className="mt-8 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Available Prizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prizes.map((prize, index) => (
              <div
                key={`prize-${prize.text}-${index}`}
                className="p-3 rounded-lg text-center border"
                style={{ borderColor: prize.color || '#e5e7eb' }}
              >
                <div className="text-2xl mb-1">{prize.icon}</div>
                <div className="font-medium text-sm">{prize.text}</div>
                {prize.value && (
                  <div className="text-xs text-gray-500 mt-1">{prize.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

PickAGift.displayName = "PickAGift";

export {
  PickAGift,
  pickAGiftVariants,
  type PickAGiftProps,
  type PickAGiftPrize,
}; 