import { useState, useCallback } from 'react';
import ParticleSystem from '@/components/reveal/ParticleSystem';
import ConfettiBurst from '@/components/reveal/ConfettiBurst';
import LightRays from '@/components/reveal/LightRays';
import WinnerCard, { Winner } from '@/components/reveal/WinnerCard';
import { RotateCcw } from 'lucide-react';

// Mock winner data - for demonstration purposes
const MOCK_WINNERS: Winner[] = [
  {
    id: '1',
    name: 'Alexander Chen',
    title: 'KING',
    department: 'College of Engineering',
    year: '4th Year',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    votes: 2847,
    teacherScore: 92,
    committeeScore: 9,
    finalScore: 94.7,
  },
  {
    id: '2',
    name: 'Isabella Martinez',
    title: 'QUEEN',
    department: 'College of Arts & Sciences',
    year: '3rd Year',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    votes: 3124,
    teacherScore: 95,
    committeeScore: 10,
    finalScore: 97.2,
  },
  {
    id: '3',
    name: 'Marcus Williams',
    title: 'PRINCE',
    department: 'School of Business',
    year: '2nd Year',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    votes: 2156,
    teacherScore: 88,
    committeeScore: 8,
    finalScore: 89.4,
  },
  {
    id: '4',
    name: 'Sophia Kim',
    title: 'PRINCESS',
    department: 'College of Nursing',
    year: '2nd Year',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    votes: 2398,
    teacherScore: 90,
    committeeScore: 9,
    finalScore: 91.8,
  },
];

const FinalWinnersReveal = () => {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [particleMode, setParticleMode] = useState<'ambient' | 'celebration'>('ambient');

  const handleRevealCard = useCallback((winnerId: string) => {
    setRevealedCards(prev => new Set([...prev, winnerId]));
    setShowCelebration(true);
    setParticleMode('celebration');

    setTimeout(() => {
      setShowCelebration(false);
      setParticleMode('ambient');
    }, 3000);
  }, []);

  const handleReset = useCallback(() => {
    setRevealedCards(new Set());
    setShowCelebration(false);
    setParticleMode('ambient');
  }, []);

  // Reorder winners: King, Queen, Prince, Princess
  const orderedWinners = [
    MOCK_WINNERS.find(w => w.title === 'KING')!,
    MOCK_WINNERS.find(w => w.title === 'QUEEN')!,
    MOCK_WINNERS.find(w => w.title === 'PRINCE')!,
    MOCK_WINNERS.find(w => w.title === 'PRINCESS')!,
  ];

  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(270 30% 12%) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, hsl(230 40% 8%) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, hsl(230 40% 8%) 0%, transparent 50%),
            hsl(230 25% 5%)
          `,
        }}
      />

      {/* Particle System */}
      <ParticleSystem intensity={particleMode} active={true} />

      {/* Light Rays Effect */}
      <LightRays active={showCelebration} />

      {/* Confetti */}
      <ConfettiBurst active={showCelebration} />

      {/* Header */}
      <header className="relative z-20 pt-6 pb-4 text-center shrink-0">
        <h1 className="font-display text-4xl md:text-5xl text-gold-gradient mb-2">
          Final Winners
        </h1>
        <p className="text-muted-foreground text-lg tracking-widest uppercase">
          Coronation Ceremony 2026
        </p>
        
        {/* Decorative divider */}
        <div className="mt-4 mx-auto flex items-center justify-center gap-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-gold/50" />
          <div className="w-2 h-2 rotate-45 bg-gold" />
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </header>

      {/* Winner Cards Grid - fills remaining space */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20">
        <div className="grid grid-cols-4 gap-6 max-w-[1600px] w-full">
          {orderedWinners.map((winner) => (
            <WinnerCard
              key={winner.id}
              winner={winner}
              revealed={revealedCards.has(winner.id)}
              onReveal={() => handleRevealCard(winner.id)}
            />
          ))}
        </div>
      </main>

      {/* Reset Button - only show when at least one is revealed */}
      {revealedCards.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 px-6 py-3 rounded-full glass-card text-muted-foreground hover:text-cream transition-colors duration-300 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-360deg] transition-transform duration-700" />
            <span className="font-display tracking-wider text-sm">Reset All</span>
          </button>
        </div>
      )}

      {/* Admin Badge */}
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-card px-3 py-1.5 text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Admin View
        </div>
      </div>
    </div>
  );
};

export default FinalWinnersReveal;
