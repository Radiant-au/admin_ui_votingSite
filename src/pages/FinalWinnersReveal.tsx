import { useState, useCallback, useEffect } from 'react';
import ParticleSystem from '@/components/reveal/ParticleSystem';
import ConfettiBurst from '@/components/reveal/ConfettiBurst';
import LightRays from '@/components/reveal/LightRays';
import WinnerCard, { Winner } from '@/components/reveal/WinnerCard';
import { RotateCcw, Crown, Loader2 } from 'lucide-react';
import { usefinalWinner } from '@/hooks/useWinners';

const FinalWinnersReveal = () => {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [particleMode, setParticleMode] = useState<'ambient' | 'celebration'>('ambient');
  const [winnersUnlocked, setWinnersUnlocked] = useState(false);

  // Fetch final winners
  const { data: winnersData, isLoading, isError, refetch } = usefinalWinner();

  // Auto-fetch when component mounts or when unlocked
  useEffect(() => {
    if (winnersUnlocked) {
      refetch();
    }
  }, [winnersUnlocked, refetch]);

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

  const handleUnlockWinners = useCallback(() => {
    setWinnersUnlocked(true);
  }, []);

  // Transform API data to Winner format
  const transformWinnerData = useCallback((apiData: typeof winnersData): Winner[] => {
    if (!apiData) return [];

    const winners: Winner[] = [];

    if (apiData.King) {
      winners.push({
        id: apiData.King.selectionId.toString(),
        name: apiData.King.selectionName,
        title: 'KING',
        department: apiData.King.major,
        year: '', // Not needed, but required by interface
        photoUrl: apiData.King.profileImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        votes: apiData.King.voteCount,
        teacherScore: apiData.King.teacher_score,
        committeeScore: apiData.King.commitee_score,
        finalScore: apiData.King.final_score,
      });
    }

    if (apiData.Queen) {
      winners.push({
        id: apiData.Queen.selectionId.toString(),
        name: apiData.Queen.selectionName,
        title: 'QUEEN',
        department: apiData.Queen.major,
        year: '', // Not needed, but required by interface
        photoUrl: apiData.Queen.profileImg || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
        votes: apiData.Queen.voteCount,
        teacherScore: apiData.Queen.teacher_score,
        committeeScore: apiData.Queen.commitee_score,
        finalScore: apiData.Queen.final_score,
      });
    }

    if (apiData.Prince) {
      winners.push({
        id: apiData.Prince.selectionId.toString(),
        name: apiData.Prince.selectionName,
        title: 'PRINCE',
        department: apiData.Prince.major,
        year: '', // Not needed, but required by interface
        photoUrl: apiData.Prince.profileImg || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        votes: apiData.Prince.voteCount,
        teacherScore: apiData.Prince.teacher_score,
        committeeScore: apiData.Prince.commitee_score,
        finalScore: apiData.Prince.final_score,
      });
    }

    if (apiData.Princess) {
      winners.push({
        id: apiData.Princess.selectionId.toString(),
        name: apiData.Princess.selectionName,
        title: 'PRINCESS',
        department: apiData.Princess.major,
        year: '', // Not needed, but required by interface
        photoUrl: apiData.Princess.profileImg || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        votes: apiData.Princess.voteCount,
        teacherScore: apiData.Princess.teacher_score,
        committeeScore: apiData.Princess.commitee_score,
        finalScore: apiData.Princess.final_score,
      });
    }

    return winners;
  }, []);

  // Get winners in correct order
  const orderedWinners = transformWinnerData(winnersData);

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

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20">
        {!winnersUnlocked ? (
          /* Unlock Screen */
          <div className="text-center">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full glass-card">
              <Crown className="w-12 h-12 text-gold" />
            </div>
            <h2 className="font-display text-3xl text-gold-gradient mb-4">
              Winners Are Ready
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Click the button below to reveal the final winners of Coronation 2026
            </p>
            <button
              onClick={handleUnlockWinners}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold font-display tracking-wider hover:from-gold/30 hover:to-gold/20 transition-all duration-300 hover:scale-105"
            >
              Unlock Winners
            </button>
          </div>
        ) : isLoading ? (
          /* Loading State */
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-display tracking-wider">
              Loading winners...
            </p>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="font-display text-2xl text-red-400 mb-4">
              Failed to Load Winners
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              There was an error loading the winner data. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-full glass-card text-muted-foreground hover:text-cream transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        ) : orderedWinners.length === 0 ? (
          /* No Data State */
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full glass-card">
              <Crown className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl text-muted-foreground mb-4">
              No Winners Available
            </h2>
            <p className="text-muted-foreground/70 max-w-md mx-auto">
              Winner data has not been configured yet. Please check back later.
            </p>
          </div>
        ) : (
          /* Winner Cards Grid */
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
        )}
      </main>

      {/* Reset Button - only show when at least one is revealed and winners are loaded */}
      {winnersUnlocked && !isLoading && !isError && orderedWinners.length > 0 && revealedCards.size > 0 && (
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