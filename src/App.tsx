import React, { useState, useCallback, useEffect } from 'react';
import { SidebarLayout } from '@/components/Layout';
import { SpinWheel } from '@/components/ui/spin-wheel';
import { FloatingWheelGame } from '@/components/FloatingWheelGame';
import { FloatingScratchCardGame } from '@/components/FloatingScratchCardGame';
import { FloatingPickAGiftGame } from '@/components/FloatingPickAGiftGame';
import { Plinko } from '@/components/ui/plinko';
import { SlotMachine } from '@/components/SlotMachine/Game';
import { AdvancedScavengerHunt } from '@/components/ScavengerHunt/AdvancedScavengerHunt';
import SidebarTest from '@/components/SidebarTest';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { playGameSound, setSoundEnabled } from '@/lib/sound-effects';
import { loadConfig, defaultSpinWheelConfig, defaultPickAGiftConfig, defaultScratchCardConfig, defaultPlinkoConfig } from "@/lib/config-loader";
import { getRandomQuiz } from "@/lib/quiz-data";
import { Quiz } from "@/components/OneQuestionQuiz";
import { Quiz as MultiStepQuiz } from "@/components/MultiStepQuiz";
import { MemoryMatchGame } from "@/components/MemoryMatchGame";
import { MysteryPrizeEgg } from "@/components/MysteryPrizeEgg";
import "./index.css";

interface AppProps {
  prizes?: string[];
  colors?: string[];
  redeemCodes?: string[];
  title?: string;
  buttonText?: string;
  spinningText?: string;
}

function App({ prizes, colors, redeemCodes, title, buttonText, spinningText }: AppProps) {
  const [activeGame, setActiveGame] = useState<'wheel' | 'scratch' | 'gift' | 'plinko' | 'quiz' | 'multistep' | 'memory' | 'mystery' | 'slot' | 'scavenger' | 'sidebar-test'>('wheel');
  const [configs, setConfigs] = useState(() => {
    // Prioritize props from AEM over default configurations
    const spinWheelPrizes = prizes ? prizes.map((prize, index) => ({
      text: prize,
      color: colors?.[index] || '#FFC300', // Default color if not provided
      value: prize
    })) : defaultSpinWheelConfig.segments;

    return {
      spinWheel: {
        ...defaultSpinWheelConfig,
        segments: spinWheelPrizes,
        defaults: {
          ...defaultSpinWheelConfig.defaults,
          title: title || defaultSpinWheelConfig.defaults.title,
          buttonText: buttonText || defaultSpinWheelConfig.defaults.buttonText,
          spinningText: spinningText || defaultSpinWheelConfig.defaults.spinningText,
        }
      },
      pickAGift: defaultPickAGiftConfig,
      scratchCard: defaultScratchCardConfig,
      plinko: defaultPlinkoConfig,
    };
  });

  // Load configurations on component mount
  useEffect(() => {
    const loadConfigurations = async () => {
      try {
        // If props are provided, use them instead of loading from JSON
        if (prizes || colors || redeemCodes || title || buttonText || spinningText) {
          setConfigs((prevConfigs: any) => {
            const spinWheelPrizes = prizes ? prizes.map((prize, index) => ({
              text: prize,
              color: colors?.[index] || '#FFC300',
              value: prize
            })) : prevConfigs.spinWheel.segments;

            return {
              ...prevConfigs,
              spinWheel: {
                ...prevConfigs.spinWheel,
                segments: spinWheelPrizes,
                defaults: {
                  ...prevConfigs.spinWheel.defaults,
                  title: title || prevConfigs.spinWheel.defaults.title,
                  buttonText: buttonText || prevConfigs.spinWheel.defaults.buttonText,
                  spinningText: spinningText || prevConfigs.spinWheel.defaults.spinningText,
                }
              }
            };
          });
          return; // Skip loading from JSON if props are present
        }

        const [spinWheelConfig, pickAGiftConfig, scratchCardConfig, plinkoConfig] = await Promise.all([
          loadConfig('/config/spin-wheel-prizes.json', defaultSpinWheelConfig),
          loadConfig('/config/pick-a-gift-prizes.json', defaultPickAGiftConfig),
          loadConfig('/config/scratch-card-prizes.json', defaultScratchCardConfig),
          loadConfig('/config/plinko-prizes.json', defaultPlinkoConfig),
        ]);

        setConfigs({
          spinWheel: spinWheelConfig,
          pickAGift: pickAGiftConfig,
          scratchCard: scratchCardConfig,
          plinko: plinkoConfig,
        });
      } catch (error) {
        console.warn('Failed to load configurations, using defaults:', error);
      }
    };

    loadConfigurations();
  }, []);

  const [currentScratchPrize] = useState(
    configs.scratchCard.prizes[Math.floor(Math.random() * configs.scratchCard.prizes.length)]
  );

  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    prizesWon: 0,
    scratchProgress: 0,
    giftsSelected: 0,
    plinkoDrops: 0,
    quizAttempts: 0,
    memoryMoves: 0,
    mysteryEggs: 0,
    slotSpins: 0,
    scavengerHunts: 0,
  });

  const [currentQuizData, setCurrentQuizData] = useState(getRandomQuiz());
  const [soundEnabled, setSoundEnabledState] = useState(true);

  // Spin Wheel Event Handlers
  const handleSpinStart = () => {
    console.log("Spin started!");
    playGameSound('wheel', 'spin').catch(console.warn);
  };

  const handleSpinEnd = (result: { text: string; color: string }) => {
    console.log("Spin ended! Result:", result);
    playGameSound('wheel', 'stop').catch(console.warn);
  };

  // Scratch Card: inline handlers removed; floating modal controls the flow



  // Pick-a-Gift flow is handled entirely inside FloatingPickAGiftGame

  // Plinko Event Handlers
  const handlePlinkoDropStart = () => {
    console.log("Plinko drop started!");
    playGameSound('plinko', 'drop').catch(console.warn);
    setGameStats(prev => ({ ...prev, plinkoDrops: prev.plinkoDrops + 1 }));
  };

  const handlePlinkoDropEnd = (result: { text: string; value?: string; multiplier?: number }) => {
    console.log("Plinko drop ended! Result:", result);
    playGameSound('plinko', 'land').catch(console.warn);
    if (result.multiplier && result.multiplier > 0) {
      setGameStats(prev => ({ ...prev, prizesWon: prev.prizesWon + 1 }));
    }
  };

  // Quiz Event Handlers
  const handleQuizAnswerSelect = (answer: string, isCorrect: boolean) => {
    console.log("Quiz answer selected:", answer, "Correct:", isCorrect);
    playGameSound('quiz', isCorrect ? 'correct' : 'incorrect').catch(console.warn);
    setGameStats(prev => ({ ...prev, quizAttempts: prev.quizAttempts + 1 }));
  };

  const handleQuizComplete = (result: { question: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean; feedback: string; offer?: any }) => {
    console.log("Quiz completed:", result);
    if (result.isCorrect) {
      setGameStats(prev => ({ ...prev, prizesWon: prev.prizesWon + 1 }));
    }
    // Load a new random quiz for next time
    setCurrentQuizData(getRandomQuiz());
  };

  // Multi-Step Quiz Event Handlers
  const handleMultiStepComplete = (products: any[]) => {
    console.log("Multi-step quiz completed! Recommended products:", products);
    setGameStats(prev => ({ ...prev, quizAttempts: prev.quizAttempts + 1 }));
  };

  const handleMultiStepStepChange = (stepIndex: number) => {
    console.log("Multi-step quiz step changed to:", stepIndex);
  };

  // Memory Match Game Event Handlers
  const handleMemoryMove = (moves: number) => {
    console.log("Memory match move made:", moves);
    setGameStats(prev => ({ ...prev, memoryMoves: moves }));
  };

  const handleMemoryComplete = (stats: { moves: number; matchedPairs: number; totalPairs: number }) => {
    console.log("Memory match completed:", stats);
    setGameStats(prev => ({ ...prev, totalPlays: prev.totalPlays + 1, prizesWon: prev.prizesWon + 1 }));
  };

  // Mystery Prize Egg Event Handlers
  const handleEggCrack = (eggIndex: number) => {
    console.log("Egg cracked:", eggIndex);
    setGameStats(prev => ({ ...prev, mysteryEggs: prev.mysteryEggs + 1 }));
  };

  const handleMysteryComplete = (prize: { id: string; name: string; value: string; rarity: string }) => {
    console.log("Mystery egg prize won:", prize);
    setGameStats(prev => ({ ...prev, totalPlays: prev.totalPlays + 1, prizesWon: prev.prizesWon + 1 }));
  };

  // Slot Machine Event Handlers
  const handleSlotSpinStart = () => {
    console.log("Slot machine spin started!");
    setGameStats(prev => ({ ...prev, slotSpins: prev.slotSpins + 1 }));
  };

  const handleSlotSpinEnd = (result: { isWin: boolean; winAmount: number }) => {
    console.log("Slot machine spin ended! Result:", result);
    if (result.isWin) {
      setGameStats(prev => ({ ...prev, prizesWon: prev.prizesWon + 1 }));
    }
  };

  // Scavenger Hunt Event Handlers
  const handleScavengerStepComplete = (clueId: string, reward: any) => {
    console.log("Scavenger hunt step completed:", clueId, reward);
    playGameSound('memory', 'flip').catch(console.warn);
  };

  const handleScavengerComplete = (totalRewards: any[]) => {
    console.log("Scavenger hunt completed! Total rewards:", totalRewards);
    playGameSound('wheel', 'win').catch(console.warn);
    setGameStats(prev => ({
      ...prev,
      prizesWon: prev.prizesWon + totalRewards.length,
      scavengerHunts: prev.scavengerHunts + 1
    }));
  };

  // Sound toggle handler
  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabledState(newState);
    setSoundEnabled(newState);
    // Test sound when enabling
    if (newState) {
      playGameSound('memory', 'flip').catch(console.warn);
    }
  };

  const winRate = gameStats.totalPlays > 0 ? Number(((gameStats.prizesWon / gameStats.totalPlays) * 100).toFixed(1)) : 0;

  const getGameTitle = () => {
    switch (activeGame) {
      case "wheel": return "🎡 Spin the Wheel!";
      case "scratch": return "🎫 Scratch Card Game";
      case "gift": return "🎁 Pick-a-Gift Game";
      case "plinko": return "🎰 Plinko Game";
      case "quiz": return "🎯 1Q Quiz Game";
      case "multistep": return "📋 Multi-Step Quiz";
      case "memory": return "🧠 Memory Match Game";
      case "mystery": return "🥚 Mystery Prize Egg";
      case "slot": return "🎰 Slot Machine";
      case "scavenger": return "🗺️ Scavenger Hunt";
      case "sidebar-test": return "📱 Sidebar Component Test";
      default: return "🎮 Game";
    }
  };

  const getGameDescription = () => {
    switch (activeGame) {
      case "wheel": return "Spin to win exciting prizes and discounts!";
      case "scratch": return "Scratch to reveal your surprise prizes!";
      case "gift": return "Choose a gift box to reveal your hidden reward!";
      case "plinko": return "Drop the ball and watch it bounce through the pins!";
      case "quiz": return "Answer one question and unlock exclusive offers!";
      case "multistep": return "Take a guided survey to get personalized product recommendations!";
      case "memory": return "Test your memory by matching pairs of cards!";
      case "mystery": return "Crack eggs to reveal random prizes with different rarities!";
      case "slot": return "Pull the lever to spin the reels and win big!";
      case "scavenger": return "Complete banking tasks to unlock exclusive rewards!";
      case "sidebar-test": return "Interactive sidebar with hover animations and responsive design";
      default: return "Choose your game!";
    }
  };

  const getGameInstructions = () => {
    switch (activeGame) {
      case "wheel": return "Click the SPIN button to rotate the wheel and win exciting prizes! Each spin is randomized for a fair chance at winning.";
      case "scratch": return (
        <div className="space-y-2">
          <p>🖱️ <strong>Desktop:</strong> Click and drag your mouse across the card to scratch</p>
          <p>📱 <strong>Mobile:</strong> Use your finger to scratch the surface</p>
          <p>🎯 <strong>Goal:</strong> Scratch at least 60% of the surface to reveal your prize</p>
        </div>
      );
      case "gift": return "Click on any gift box to reveal your surprise prize! Each box contains a different reward.";
      case "plinko": return "Click the DROP BALL button to release a ball and watch it bounce through the pins! The ball's path is determined by physics and chance, leading to exciting multiplier prizes.";
      case "quiz": return "Read the question carefully and select your answer. After submitting, you'll see if you're correct and unlock a special offer!";
      case "multistep": return "Answer a series of questions about your preferences and lifestyle. We'll use your answers to recommend products that match your needs perfectly!";
      case "memory": return "Click on cards to flip them and find matching pairs! Try to match all pairs with the fewest moves possible.";
      case "mystery": return "Click on any egg to crack it and reveal a random prize! Each egg contains prizes of different rarities - from common to legendary!";
      case "slot": return "Pull the lever to spin the reels! Match 3 symbols in a row (horizontally or diagonally) to win. Each symbol has different values - the rarer the symbol, the bigger the prize!";
      case "scavenger": return "Complete banking-related tasks to unlock exclusive rewards! Each task has different difficulty levels and rewards. Track your progress and build your streak!";
      case "sidebar-test": return "Hover over the sidebar to see it expand with smooth animations. On mobile, tap the menu icon to open the collapsible sidebar. This demonstrates responsive design and smooth transitions.";
      default: return "Choose your game!";
    }
  };

  return (
    <>
      <SidebarLayout
        activeGame={activeGame}
        onGameChange={(game: string) => setActiveGame(game as "wheel" | "scratch" | "gift" | "plinko" | "quiz" | "multistep" | "memory" | "mystery" | "slot" | "scavenger" | "sidebar-test")}
        gameStats={gameStats}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        winRate={winRate}
        getGameTitle={getGameTitle}
        getGameDescription={getGameDescription}
        getGameInstructions={getGameInstructions}
      >
        <div className="p-4 space-y-8">
          {/* Scratch card is intentionally not rendered inline.
              Use the floating icon to open the unified modal experience. */}

        {/* Pick-a-Gift is intentionally not rendered inline when active. */}
        {activeGame === "gift" && null}

        {activeGame === "plinko" && (
          <Plinko
            prizes={configs.plinko.prizes}
            boardWidth={600}
            boardHeight={800}
            pinRows={12}
            ballSize={12}
            pinSize={6}
            animationDuration={3000}
            title=""
            buttonText="DROP BALL"
            droppingText="Dropping..."
            variant="card"
            size="lg"
            onDropStart={handlePlinkoDropStart}
            onDropEnd={handlePlinkoDropEnd}
          />
        )}

        {activeGame === "quiz" && (
          <Quiz
            quizData={currentQuizData}
            title=""
            buttonText="Submit Answer"
            variant="card"
            size="lg"
            onAnswerSelect={handleQuizAnswerSelect}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {activeGame === "multistep" && (
          <MultiStepQuiz
            variant="card"
            size="lg"
            onComplete={handleMultiStepComplete}
            onStepChange={handleMultiStepStepChange}
          />
        )}

        {activeGame === "memory" && (
          <MemoryMatchGame
            onMoveMade={handleMemoryMove}
            onGameComplete={handleMemoryComplete}
            variant="card"
            size="lg"
          />
        )}

        {activeGame === "mystery" && (
          <MysteryPrizeEgg
            onEggCrack={handleEggCrack}
            onGameComplete={handleMysteryComplete}
            variant="card"
            size="lg"
          />
        )}

        {activeGame === "slot" && (
          <SlotMachine
            onSpinStart={handleSlotSpinStart}
            onSpinEnd={handleSlotSpinEnd}
            variant="card"
            size="lg"
          />
        )}

        {activeGame === "scavenger" && (
          <AdvancedScavengerHunt
            onStepComplete={handleScavengerStepComplete}
            onGameComplete={handleScavengerComplete}
            variant="card"
            size="lg"
            theme="banking"
          />
        )}

        {activeGame === "sidebar-test" && (
          <SidebarTest />
        )}
      </div>
    </SidebarLayout>
    
    {/* Floating Games */}
    {activeGame === 'scratch' ? (
      // On the Scratch screen, show only the Scratch floating icon/modal
      <FloatingScratchCardGame
        prize={currentScratchPrize}
        cardWidth={configs.scratchCard.defaults.cardWidth}
        cardHeight={configs.scratchCard.defaults.cardHeight}
        scratchColor={configs.scratchCard.defaults.scratchColor}
        scratchPattern={configs.scratchCard.defaults.scratchPattern}
        revealThreshold={configs.scratchCard.defaults.revealThreshold}
        title={configs.scratchCard.defaults.title}
        resetButtonText={configs.scratchCard.defaults.resetButtonText}
        instructions={configs.scratchCard.defaults.instructions}
      />
    ) : activeGame === 'wheel' ? (
      // On the Wheel screen, show only the Wheel floating icon/modal
      <FloatingWheelGame
        segments={configs.spinWheel.segments}
        onSpinStart={handleSpinStart}
        onSpinEnd={handleSpinEnd}
        buttonText={configs.spinWheel.defaults.buttonText}
        spinningText={configs.spinWheel.defaults.spinningText}
        title={configs.spinWheel.defaults.title}
        wheelSize={configs.spinWheel.defaults.wheelSize}
        animationDuration={configs.spinWheel.defaults.animationDuration}
        minRevolutions={configs.spinWheel.defaults.minRevolutions}
        maxRevolutions={configs.spinWheel.defaults.maxRevolutions}
      />
    ) : activeGame === 'gift' ? (
      // On the Pick-a-Gift screen, show only the Gift floating icon/modal
      <FloatingPickAGiftGame prizes={configs.pickAGift.prizes} className="right-6 bottom-6" />
    ) : (
      <>
        <FloatingWheelGame
          segments={configs.spinWheel.segments}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          buttonText={configs.spinWheel.defaults.buttonText}
          spinningText={configs.spinWheel.defaults.spinningText}
          title={configs.spinWheel.defaults.title}
          wheelSize={configs.spinWheel.defaults.wheelSize}
          animationDuration={configs.spinWheel.defaults.animationDuration}
          minRevolutions={configs.spinWheel.defaults.minRevolutions}
          maxRevolutions={configs.spinWheel.defaults.maxRevolutions}
        />

        <FloatingScratchCardGame
          prize={currentScratchPrize}
          cardWidth={configs.scratchCard.defaults.cardWidth}
          cardHeight={configs.scratchCard.defaults.cardHeight}
          scratchColor={configs.scratchCard.defaults.scratchColor}
          scratchPattern={configs.scratchCard.defaults.scratchPattern}
          revealThreshold={configs.scratchCard.defaults.revealThreshold}
          title={configs.scratchCard.defaults.title}
          resetButtonText={configs.scratchCard.defaults.resetButtonText}
          instructions={configs.scratchCard.defaults.instructions}
        />

        <FloatingPickAGiftGame prizes={configs.pickAGift.prizes} />
      </>
    )}
    </>
  );
}

export default App;
