import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Power, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useVotingStatus, 
  useWinnerStatus, 
  useChangeVotingStatus, 
  useChangeWinnerStatus 
} from '@/hooks/useStatus';

export default function Control() {
  const { data: votingStatus, isLoading: votingLoading } = useVotingStatus();
  const { data: winnerStatus, isLoading: winnerLoading } = useWinnerStatus();
  
  const changeVotingStatus = useChangeVotingStatus();
  const changeWinnerStatus = useChangeWinnerStatus();

  const handleToggleVoting = async () => {
    await changeVotingStatus.mutateAsync();
  };

  const handleToggleWinner = async () => {
    await changeWinnerStatus.mutateAsync();
  };

  const isVotingOpen = votingStatus?.status === 'OPEN';
  const isWinnerRevealed = winnerStatus?.status === 'OPEN';

  if (votingLoading || winnerLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl">
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-xl md:text-3xl font-display golden-text">Control</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage voting and winner status</p>
        </div>

        {/* Control Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voting Control */}
          <Card className="glass-card animate-slide-up overflow-hidden">
            <div className={cn(
              "h-1.5 w-full transition-colors",
              isVotingOpen ? "bg-green-500" : "bg-red-500"
            )} />
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center gap-4">
                {/* Status Indicator */}
                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                  "transition-all duration-500",
                  isVotingOpen 
                    ? "bg-green-500/10 ring-2 ring-green-500/30" 
                    : "bg-red-500/10 ring-2 ring-red-500/30"
                )}>
                  <Power className={cn(
                    "h-8 w-8 md:h-10 md:w-10 transition-colors",
                    isVotingOpen ? "text-green-500" : "text-red-500"
                  )} />
                </div>

                {/* Status Info */}
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-0.5 font-bold",
                      isVotingOpen 
                        ? "border-green-500 text-green-500" 
                        : "border-red-500 text-red-500"
                    )}
                  >
                    {isVotingOpen ? 'VOTING OPEN' : 'VOTING CLOSED'}
                  </Badge>
                </div>

                {/* Toggle Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="default"
                      disabled={changeVotingStatus.isPending}
                      className={cn(
                        "w-full h-10 text-sm font-semibold transition-all",
                        isVotingOpen 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-green-500 hover:bg-green-600 text-white"
                      )}
                    >
                      {changeVotingStatus.isPending ? 'Updating...' : isVotingOpen ? 'Close Voting' : 'Open Voting'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isVotingOpen ? 'Close Voting?' : 'Open Voting?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isVotingOpen 
                          ? 'Users will no longer be able to cast votes. You can reopen voting at any time.'
                          : 'This will allow users to start voting. Make sure everything is ready.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleToggleVoting}
                        className={cn(
                          isVotingOpen 
                            ? "bg-red-500 text-white hover:bg-red-600" 
                            : "bg-green-500 text-white hover:bg-green-600"
                        )}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Winner Control */}
          <Card className="glass-card animate-slide-up overflow-hidden" style={{ animationDelay: '0.05s' }}>
            <div className={cn(
              "h-1.5 w-full transition-colors",
              isWinnerRevealed ? "bg-green-500" : "bg-red-500"
            )} />
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center gap-4">
                {/* Status Indicator */}
                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                  "transition-all duration-500",
                  isWinnerRevealed 
                    ? "bg-green-500/10 ring-2 ring-green-500/30" 
                    : "bg-red-500/10 ring-2 ring-red-500/30"
                )}>
                  <Trophy className={cn(
                    "h-8 w-8 md:h-10 md:w-10 transition-colors",
                    isWinnerRevealed ? "text-green-500" : "text-red-500"
                  )} />
                </div>

                {/* Status Info */}
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-0.5 font-bold",
                      isWinnerRevealed 
                        ? "border-green-500 text-green-500" 
                        : "border-red-500 text-red-500"
                    )}
                  >
                    {isWinnerRevealed ? 'WINNER REVEALED' : 'WINNER HIDDEN'}
                  </Badge>
                </div>

                {/* Toggle Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="default"
                      disabled={changeWinnerStatus.isPending}
                      className={cn(
                        "w-full h-10 text-sm font-semibold transition-all",
                        isWinnerRevealed 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-green-500 hover:bg-green-600 text-white"
                      )}
                    >
                      {changeWinnerStatus.isPending ? 'Updating...' : isWinnerRevealed ? 'Hide Winner' : 'Reveal Winner'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isWinnerRevealed ? 'Hide Winner?' : 'Reveal Winner?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isWinnerRevealed 
                          ? 'The winner will be hidden from public view.'
                          : 'This will reveal the winner to everyone. Make sure voting is closed.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleToggleWinner}
                        className={cn(
                          isWinnerRevealed 
                            ? "bg-red-500 text-white hover:bg-red-600" 
                            : "bg-green-500 text-white hover:bg-green-600"
                        )}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}