import { useState, useRef } from 'react';
import { CandidateCard } from './CandidateCard';
import { Crown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoteData } from '@/hooks/useVoteData';

type CandidateType = 'king' | 'queen';

const tabs: { key: CandidateType; label: string; icon: typeof Crown }[] = [
  { key: 'king', label: 'King', icon: Crown },
  { key: 'queen', label: 'Queen', icon: Crown },
];

export function CategoryTabs() {
  const { getCandidatesByType, getVotePercentage, isLoading } = useVoteData();
  const [activeTab, setActiveTab] = useState<CandidateType>('king');
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentIndex = tabs.findIndex(t => t.key === activeTab);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].key);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleSwipe('left');
      } else {
        handleSwipe('right');
      }
    }
  };

  const candidates = getCandidatesByType(activeTab);

  if (isLoading) {
    return (
      <section className="space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-display golden-text">Candidates</h2>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <span>Swipe to navigate</span>
          <ChevronLeft className="h-3 w-3" />
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>

      {/* Tab Navigation - Horizontally Scrollable */}
      <div 
        ref={tabsContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getCandidatesByType(tab.key).length;
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0",
                isActive
                  ? "bg-primary/20 border border-primary/40 text-primary shadow-lg shadow-primary/10"
                  : "bg-card/50 border border-border/50 text-muted-foreground hover:bg-card hover:border-primary/20"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{tab.label}</span>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                isActive ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Swipeable Content Area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden"
      >
        {/* Navigation Arrows for Desktop */}
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentIndex === 0}
          className={cn(
            "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-card/90 border border-primary/30 text-primary hover:bg-primary/10 transition-all",
            currentIndex === 0 && "opacity-30 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => handleSwipe('left')}
          disabled={currentIndex === tabs.length - 1}
          className={cn(
            "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-card/90 border border-primary/30 text-primary hover:bg-primary/10 transition-all",
            currentIndex === tabs.length - 1 && "opacity-30 cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Candidates Grid - 2 Columns */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 px-0 md:px-12">
          {candidates.map((candidate, index) => (
            <CandidateCard 
              key={candidate.selectionId} 
              candidate={candidate}
              percentage={getVotePercentage(candidate.selectionId)}
              index={index}
            />
          ))}
        </div>

        {/* Tab Indicator Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                activeTab === tab.key 
                  ? "w-6 bg-primary" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}