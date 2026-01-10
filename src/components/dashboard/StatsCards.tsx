import { Card, CardContent } from '@/components/ui/card';
import { Users, Vote, KeyRound, TrendingUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoteData } from '@/hooks/useVoteData';
import { useVotingStatus, useWinnerStatus } from '@/hooks/useStatus';

export function StatsCards() {
  const { totalVoters, isLoading: votesLoading } = useVoteData();
  const { data: votingStatusData, isLoading: votingLoading } = useVotingStatus();
  const { data: winnerStatusData, isLoading: winnerLoading } = useWinnerStatus();

  const stats = [
    {
      label: 'Total PinCodes',
      value: votesLoading ? '...' : totalVoters.totalCodes,
      icon: Vote,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Winner Status',
      value: winnerLoading ? '...' : (winnerStatusData?.status || 'CLOSED'),
      icon: Trophy,
      color: winnerStatusData?.status === 'OPEN' ? 'text-success' : 'text-destructive',
      bgColor: winnerStatusData?.status === 'OPEN' ? 'bg-success/10' : 'bg-destructive/10',
    },
    {
      label: 'PinCodes Voted',
      value: votesLoading ? '...' : totalVoters.votedCodes,
      icon: KeyRound,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Voting Status',
      value: votingLoading ? '...' : (votingStatusData?.status || 'CLOSED'),
      icon: TrendingUp,
      color: votingStatusData?.status === 'OPEN' ? 'text-success' : 'text-destructive',
      bgColor: votingStatusData?.status === 'OPEN' ? 'bg-success/10' : 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label}
          className="golden-card animate-slide-up overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-4 md:p-6 relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-3 md:gap-4">
              <div className={cn("p-2 md:p-3 rounded-xl border border-primary/20", stat.bgColor)}>
                <stat.icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn(
                  "text-xl md:text-2xl font-bold font-display",
                  (stat.label === 'Voting Status' || stat.label === 'Winner Status') ? stat.color : 'text-foreground'
                )}>
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}