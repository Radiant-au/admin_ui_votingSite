import { UTSelection } from '@/types';
import { useVotingStore } from '@/store/votingStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Sparkles } from 'lucide-react';

interface CandidateCardProps {
  candidate: UTSelection;
  index: number;
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
  const { getVotePercentage } = useVotingStore();
  const percentage = getVotePercentage(candidate.id);

  const typeConfig = {
    king: { label: 'King', icon: Crown, color: 'bg-primary/20 text-primary border-primary/30' },
    queen: { label: 'Queen', icon: Crown, color: 'bg-primary/20 text-primary border-primary/30' },
    prince: { label: 'Prince', icon: Sparkles, color: 'bg-accent/20 text-accent border-accent/30' },
    princess: { label: 'Princess', icon: Sparkles, color: 'bg-accent/20 text-accent border-accent/30' },
  };

  const config = typeConfig[candidate.candidateType];
  const Icon = config.icon;

  return (
    <Card 
      className="golden-card overflow-hidden group hover:border-primary/40 transition-all duration-300 animate-scale-in h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={candidate.profileImg} 
            alt={candidate.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          <Badge className={`absolute top-2 right-2 ${config.color} border backdrop-blur-sm text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1`}>
            <Icon className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
            <span className="hidden sm:inline">{config.label}</span>
          </Badge>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
            <h3 className="font-display text-xs md:text-lg font-semibold text-foreground truncate">{candidate.name}</h3>
            <p className="text-[10px] md:text-sm text-muted-foreground truncate">{candidate.major}</p>
          </div>
        </div>
        
        <div className="p-2 md:p-4 space-y-2 md:space-y-3 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] md:text-sm text-muted-foreground">Votes</span>
            <span className="font-display text-sm md:text-lg font-bold text-primary">{candidate.voteCount.toLocaleString()}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] md:text-xs">
              <span className="text-muted-foreground">Share</span>
              <span className="text-primary font-medium">{percentage.toFixed(1)}%</span>
            </div>
            <Progress value={percentage} className="h-1.5 md:h-2 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
