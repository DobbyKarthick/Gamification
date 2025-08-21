import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Gamepad2,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  activeGame: string;
  onGameChange: (game: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  gameStats: {
    totalPlays: number;
    prizesWon: number;
    scratchProgress: number;
    giftsSelected: number;
    plinkoDrops: number;
    quizAttempts: number;
    memoryMoves: number;
    mysteryEggs: number;
    slotSpins: number;
    scavengerHunts: number;
    [key: string]: any;
  };
  winRate: number;
  getGameTitle: () => string;
  getGameDescription: () => string;
  getGameInstructions: () => React.ReactNode;
}

const gameItems = [
  { id: "wheel", icon: "🎡", label: "Spin Wheel", color: "from-blue-500 to-purple-500" },
  { id: "scratch", icon: "🎫", label: "Scratch Card", color: "from-orange-500 to-red-500" },
  { id: "gift", icon: "🎁", label: "Pick-a-Gift", color: "from-pink-500 to-rose-500" },
  { id: "plinko", icon: "🎰", label: "Plinko", color: "from-green-500 to-emerald-500" },
  { id: "quiz", icon: "🎯", label: "1Q Quiz", color: "from-indigo-500 to-blue-500" },
  { id: "multistep", icon: "📋", label: "Multi-Step", color: "from-purple-500 to-violet-500" },
  { id: "memory", icon: "🧠", label: "Memory Match", color: "from-yellow-500 to-orange-500" },
  { id: "mystery", icon: "🥚", label: "Mystery Egg", color: "from-teal-500 to-cyan-500" },
  { id: "slot", icon: "🎰", label: "Slot Machine", color: "from-red-500 to-pink-500" },
  { id: "scavenger", icon: "🗺️", label: "Scavenger Hunt", color: "from-emerald-500 to-green-500" },
];

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  activeGame,
  onGameChange,
  soundEnabled,
  onSoundToggle,
  gameStats,
  winRate,
  getGameTitle,
  getGameDescription,
  getGameInstructions,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle hover behavior for desktop only
  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHovering(true);
      setSidebarExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(false);
        setSidebarExpanded(false);
      }, 150); // Small delay to prevent flickering
    }
  };

  // Handle click toggle for mobile
  const handleToggleClick = () => {
    if (window.innerWidth < 768) { // mobile only
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <div 
          className={cn(
            "fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out font-['Inter',sans-serif]",
            sidebarExpanded ? "w-[240px]" : "w-[140px]"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-full bg-gradient-to-br from-[#6C63FF]/20 via-[#000000]/20 to-[#6C63FF]/10 backdrop-blur-md border border-white/10 shadow-lg">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className={cn(
                    "text-lg font-bold text-[#E5E5F0] transition-all duration-300 ease-in-out",
                    sidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}>
                    Gamification Hub
                  </h1>
                </div>
                {/* Only show toggle button on mobile */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleClick}
                    className="text-[#D1C4E9] hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
                  >
                    <ChevronRight className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      sidebarExpanded && "rotate-180"
                    )} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {gameItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onGameChange(item.id)}
                  className={cn(
                    "w-full justify-start transition-all duration-300 ease-in-out group relative overflow-hidden",
                    activeGame === item.id
                      ? "text-white bg-white/10 rounded-md shadow-lg border border-white/20"
                      : "text-[#E5E5F0] hover:text-white hover:bg-white/10 rounded-md"
                  )}
                >
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 rounded-md",
                    item.color,
                    activeGame === item.id && "opacity-20"
                  )} />

                  <div className="relative flex items-center w-full">
                    <span className={cn(
                      "text-xl mr-3 flex-shrink-0 transition-all duration-200",
                      activeGame === item.id ? "text-white" : "text-[#D1C4E9] group-hover:text-white"
                    )}>
                      {item.icon}
                    </span>
                    <span className={cn(
                      "font-medium transition-all duration-300 ease-in-out whitespace-nowrap",
                      sidebarExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"
                    )}>
                      {item.label}
                    </span>
                  </div>

                  {/* Active Indicator */}
                  {activeGame === item.id && (
                    <div className="absolute right-2 w-2 h-2 bg-[#6C63FF] rounded-full animate-pulse shadow-lg" />
                  )}
                </Button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10 space-y-3">
              {/* Sound Toggle */}
              <Button
                variant="ghost"
                onClick={onSoundToggle}
                className="w-full justify-start text-[#E5E5F0] hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 mr-3 flex-shrink-0 text-[#D1C4E9] group-hover:text-white transition-all duration-200" />
                ) : (
                  <VolumeX className="w-5 h-5 mr-3 flex-shrink-0 text-[#D1C4E9] group-hover:text-white transition-all duration-200" />
                )}
                <span className={cn(
                  "transition-all duration-300 ease-in-out whitespace-nowrap",
                  sidebarExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0"
                )}>
                  {soundEnabled ? "Sound On" : "Sound Off"}
                </span>
              </Button>

              {/* Game Stats */}
              {sidebarExpanded && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs text-[#D1C4E9] font-medium">Game Stats</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                      <div className="font-bold text-[#6C63FF]">
                        {gameStats.prizesWon}
                      </div>
                      <div className="text-xs text-[#D1C4E9]">Wins</div>
                    </div>
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                      <div className="font-bold text-[#8B5CF6]">
                        {winRate}%
                      </div>
                      <div className="text-xs text-[#D1C4E9]">Rate</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarExpanded ? "ml-[240px]" : "ml-[140px]"
        )}>
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-40">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* Current Game Info */}
                  <div className="flex-1 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {getGameTitle()}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {getGameDescription()}
                    </p>
                  </div>

                  {/* Game Stats Summary */}
                  <div className="hidden md:flex items-center space-x-6 text-sm">
                    <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {gameStats.prizesWon}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Wins</div>
                    </div>
                    <div className="text-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {winRate}%
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Container with Glassy Effect */}
            <div className="min-h-full bg-white/5 backdrop-blur-sm">
              <div className="container mx-auto px-6 py-8">
                {/* Game Content */}
                <div className="flex items-center justify-center min-h-[600px] mb-8">
                  {children}
                </div>

                {/* Game Instructions (sticky in viewport) */}
                <div className="sticky bottom-0 z-30 flex justify-center px-2 pb-2 pt-4 bg-gradient-to-t from-white/70 to-transparent dark:from-slate-900/70">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl p-4 md:p-6 shadow-2xl max-w-4xl w-full">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
                      🎮 How to Play
                    </h3>
                    <div className={cn(
                      "text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed",
                      activeGame === 'scratch' ? 'text-left' : 'text-center'
                    )}>
                      {getGameInstructions()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 