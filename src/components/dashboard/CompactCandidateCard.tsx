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
      <CardContent className="p-2 md:p-3">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <img 
              src={candidate.profileImg} 
              alt={candidate.name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-primary/30"
            />
            <Badge className={`absolute -bottom-1 -right-1 ${config.color} border text-[8px] px-1 py-0`}>
              <Crown className="h-2 w-2" />
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-display text-xs md:text-sm font-semibold text-foreground truncate">
              {candidate.name}
            </h3>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-1 md:gap-2">
              <div className="flex items-center gap-0.5 text-[9px] md:text-[10px] text-muted-foreground">
                <Users className="h-2.5 w-2.5 text-blue-400" />
                <span>{candidate.studentVotes}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[9px] md:text-[10px] text-muted-foreground">
                <GraduationCap className="h-2.5 w-2.5 text-green-400" />
                <span>{candidate.teacherScore > 0 ? Number(candidate.teacherScore).toFixed(2) : '--'}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[9px] md:text-[10px] text-muted-foreground">
                <UserCheck className="h-2.5 w-2.5 text-purple-400" />
                <span>{candidate.committeeScore > 0 ? Number(candidate.committeeScore).toFixed(2) : '--'}</span>
              </div>
            </div>
          </div>

          {/* Final Score */}
          <div className="flex-shrink-0 text-right">
            {candidate.hasScores ? (
              <div className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-display text-sm md:text-base font-bold text-primary">
                  {Number(candidate.finalScore).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="px-2 py-1 rounded-lg bg-muted/50">
                <span className="text-[10px] md:text-xs text-muted-foreground">--</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
