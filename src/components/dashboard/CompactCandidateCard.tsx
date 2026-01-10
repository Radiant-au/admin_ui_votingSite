import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, GraduationCap, UserCheck } from 'lucide-react';
import { CandidateScore } from '@/hooks/useDashboardScores';

interface CompactCandidateCardProps {
  candidate: CandidateScore;
  type: 'king' | 'queen';
  index: number;
}

export function CompactCandidateCard({ candidate, type, index }: CompactCandidateCardProps) {
  const typeConfig = {
    king: { label: 'King', color: 'bg-primary/20 text-primary border-primary/30' },
    queen: { label: 'Queen', color: 'bg-primary/20 text-primary border-primary/30' },
  };

  const config = typeConfig[type];

  return (
    <Card 
      className="golden-card overflow-hidden group hover:border-primary/40 transition-all duration-300 animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <img 
              src={candidate.profileImg} 
              alt={candidate.name}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-primary/30"
            />
            <Badge className={`absolute -bottom-1 -right-1 ${config.color} border text-[10px] px-1.5 py-0.5`}>
              <Crown className="h-2.5 w-2.5" />
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="font-display text-sm md:text-base font-semibold text-foreground truncate">
              {candidate.name}
            </h3>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-400" />
                <span className="font-medium">{candidate.studentVotes}</span>
              </div>
              <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-400" />
                <span className="font-medium">{candidate.teacherScore > 0 ? candidate.teacherScore.toFixed(1) : '--'}</span>
              </div>
              <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-400" />
                <span className="font-medium">{candidate.committeeScore > 0 ? candidate.committeeScore.toFixed(1) : '--'}</span>
              </div>
            </div>
          </div>

          {/* Final Score */}
          <div className="flex-shrink-0 text-right">
            {candidate.hasScores ? (
              <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-display text-base md:text-lg font-bold text-primary">
                  {candidate.finalScore.toFixed(1)}
                </span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-muted/50">
                <span className="text-sm md:text-base text-muted-foreground">--</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
