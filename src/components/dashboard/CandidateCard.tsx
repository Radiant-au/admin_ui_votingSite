import { UTSelection } from '@/types';
import { useVotingStore } from '@/store/votingStore';
import { Crown, GraduationCap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: UTSelection;
  index: number;
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
  const { getVotePercentage } = useVotingStore();
  const percentage = getVotePercentage(candidate.id);

  return (
    <div 
      className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img 
          src={candidate.profileImg} 
          alt={candidate.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        
        {/* Category Badge */}
        <Badge 
          className={cn(
            "absolute top-3 right-3 gap-1",
            candidate.category === 'king-queen' 
              ? "bg-accent text-accent-foreground" 
              : "bg-primary text-primary-foreground"
          )}
        >
          <Crown className="h-3 w-3" />
          {candidate.category === 'king-queen' ? 'King & Queen' : 'Prince & Princess'}
        </Badge>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg md:text-xl font-bold text-primary-foreground">
            {candidate.name}
          </h3>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
            <GraduationCap className="h-4 w-4" />
            <span>{candidate.major}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {candidate.description}
        </p>

        {/* Vote Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Votes</span>
            <span className="text-lg font-bold text-foreground">
              {candidate.voteCount.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={percentage} 
            className="h-2"
          />
          <p className="text-xs text-right text-muted-foreground">
            {percentage.toFixed(1)}% of total votes
          </p>
        </div>
      </div>
    </div>
  );
}
