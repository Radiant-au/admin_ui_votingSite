import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Hash, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface PinCodeStats {
  total: number;
  voted: number;
  notVoted: number;
  rate: string;
}

interface PinCodeStatsCardsProps {
  stats: PinCodeStats;
  isLoading: boolean;
}

const statsConfig: Array<{
  key: 'total' | 'voted' | 'notVoted' | 'rate';
  label: string;
  icon: typeof Hash;
  gradient: string;
  bgClass: string;
  textClass: string;
  suffix?: string;
}> = [
  {
    key: 'total',
    label: 'Total Codes',
    icon: Hash,
    gradient: 'from-blue-500 to-blue-600',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500',
  },
  {
    key: 'voted',
    label: 'Voted',
    icon: CheckCircle2,
    gradient: 'from-green-500 to-green-600',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-500',
  },
  {
    key: 'notVoted',
    label: 'Not Voted',
    icon: Clock,
    gradient: 'from-amber-500 to-amber-600',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-500',
  },
  {
    key: 'rate',
    label: 'Voting Rate',
    icon: TrendingUp,
    gradient: 'from-purple-500 to-purple-600',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-500',
    suffix: '%',
  },
];

export function PinCodeStatsCards({ stats, isLoading }: PinCodeStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsConfig.map((config) => {
        const Icon = config.icon;
        const value = config.key === 'rate' ? stats.rate : stats[config.key];
        
        return (
          <Card key={config.key} className="relative overflow-hidden border-border bg-card">
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`} />
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2.5 md:p-3 rounded-xl ${config.bgClass}`}>
                  <Icon className={`h-6 w-6 md:h-7 md:w-7 ${config.textClass}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base text-muted-foreground font-medium truncate">
                    {config.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className={`text-xl md:text-3xl font-bold ${config.textClass}`}>
                      {value.toLocaleString()}{config.suffix || ''}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
