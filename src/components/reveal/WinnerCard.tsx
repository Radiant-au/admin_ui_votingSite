import { useEffect, useState } from 'react';
import CrownIcon from './CrownIcon';
import { Eye } from 'lucide-react';

export interface Winner {
  id: string;
  name: string;
  title: 'KING' | 'QUEEN' | 'PRINCE' | 'PRINCESS';
  department: string;
  year: string;
  photoUrl: string;
  votes: number;
  teacherScore: number;
  committeeScore: number;
  finalScore: number;
}

interface WinnerCardProps {
  winner: Winner;
  revealed: boolean;
  onReveal?: () => void;
}

const WinnerCard = ({ winner, revealed, onReveal }: WinnerCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (revealed) {
      setIsAnimating(true);
      setTimeout(() => setShowContent(true), 600);
    } else {
      setIsAnimating(false);
      setShowContent(false);
    }
  }, [revealed]);

  const crownVariant = winner.title.toLowerCase() as 'king' | 'queen' | 'prince' | 'princess';

  return (
    <div className="relative">
      {/* Glow effect behind card */}
      <div 
        className={`absolute inset-0 rounded-2xl transition-opacity duration-1000 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, hsl(var(--gold) / 0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'scale(1.1)',
        }}
      />

      <div 
        className={`relative glass-card-gold p-4 transition-all duration-700 aspect-[3/4] flex flex-col ${
          isAnimating ? 'winner-revealed' : ''
        }`}
      >
        {/* Hidden overlay with reveal button */}
        {!revealed && (
          <div className="absolute inset-0 z-20 rounded-2xl bg-background backdrop-blur-3xl flex flex-col items-center justify-center">
            {/* Mystery silhouette */}
            <div className="w-20 h-20 rounded-full bg-muted/20 mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-muted/30 blur-sm" />
            </div>
            <div className="w-10 h-10 mb-2 opacity-40">
              <CrownIcon 
                variant={crownVariant} 
                className="w-full h-full"
                animated={false}
              />
            </div>
            <span className="text-gold/50 text-sm tracking-[0.3em] mb-6">{winner.title}</span>
            <button
              onClick={onReveal}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 group"
            >
              <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-display tracking-wider text-xs">Reveal</span>
            </button>
          </div>
        )}

        {/* Crown Icon */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 z-10">
          <CrownIcon 
            variant={crownVariant} 
            className="w-full h-full drop-shadow-lg"
            animated={isAnimating}
          />
        </div>

        {/* Profile Image */}
        <div className="relative mt-4 mb-3">
          <div 
            className={`mx-auto w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-700 ${
              isAnimating ? 'border-gold glow-gold' : 'border-muted'
            }`}
          >
            <img 
              src={winner.photoUrl} 
              alt={winner.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Title Badge */}
        <div className="text-center mb-1">
          <span className="winner-title text-gold text-sm tracking-[0.3em]">
            {winner.title}
          </span>
        </div>

        {/* Name */}
        <h2 className="font-display text-xl text-center text-cream mb-1 leading-tight">
          {winner.name}
        </h2>

        {/* Academic Info */}
        <p className="text-center text-muted-foreground text-sm mb-2 leading-tight">
          {winner.department}
        </p>
        {winner.year && (
          <p className="text-center text-muted-foreground text-xs mb-2 leading-tight">
            {winner.year}
          </p>
        )}

        {/* Score Breakdown */}
        {showContent && (
          <div className="space-y-2 animate-reveal flex-1 flex flex-col text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-gold/20">
              <span className="text-muted-foreground">🗳️ Votes</span>
              <span className="text-cream font-semibold">{winner.votes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gold/20">
              <span className="text-muted-foreground">👨‍🏫 Teacher</span>
              <span className="text-cream font-semibold">{winner.teacherScore}%</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gold/20">
              <span className="text-muted-foreground">🧑‍⚖️ Committee</span>
              <span className="text-cream font-semibold">{winner.committeeScore}%</span>
            </div>

            {/* Final Score */}
            <div className="mt-auto pt-3 text-center">
              <p className="text-muted-foreground uppercase tracking-widest text-xs mb-1">Final Score</p>
              <span className="text-score-gradient text-4xl font-display font-bold">
                {winner.finalScore.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerCard;
