import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useVotingStore } from '@/store/votingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
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
import { Power, Trophy, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Control() {
  const { votingStatus, toggleVoting, winnerStatus, toggleWinner, activityLogs, startVotingStatusSse } = useVotingStore();

  useEffect(() => {
    const stop = startVotingStatusSse();
    return () => {
      stop();
    };
  }, [startVotingStatusSse]);

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
              votingStatus.isOpen ? "bg-success" : "bg-destructive"
            )} />
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center gap-4">
                {/* Status Indicator */}
                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                  "transition-all duration-500",
                  votingStatus.isOpen 
                    ? "bg-success/10 ring-2 ring-success/30" 
                    : "bg-destructive/10 ring-2 ring-destructive/30"
                )}>
                  <Power className={cn(
                    "h-8 w-8 md:h-10 md:w-10 transition-colors",
                    votingStatus.isOpen ? "text-success" : "text-destructive"
                  )} />
                </div>

                {/* Status Info */}
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-0.5 font-bold",
                      votingStatus.isOpen 
                        ? "border-success text-success" 
                        : "border-destructive text-destructive"
                    )}
                  >
                    {votingStatus.isOpen ? 'VOTING OPEN' : 'VOTING CLOSED'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Updated: {format(votingStatus.updatedAt, 'MMM d, h:mm a')}
                  </p>
                </div>

                {/* Toggle Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="default"
                      className={cn(
                        "w-full h-10 text-sm font-semibold transition-all",
                        votingStatus.isOpen 
                          ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                          : "bg-success hover:bg-success/90 text-success-foreground"
                      )}
                    >
                      {votingStatus.isOpen ? 'Close Voting' : 'Open Voting'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {votingStatus.isOpen ? 'Close Voting?' : 'Open Voting?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {votingStatus.isOpen 
                          ? 'Users will no longer be able to cast votes. You can reopen voting at any time.'
                          : 'This will allow users to start voting. Make sure everything is ready.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={toggleVoting}
                        className={cn(
                          votingStatus.isOpen 
                            ? "bg-destructive text-destructive-foreground" 
                            : "bg-success text-success-foreground"
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
              winnerStatus.isRevealed ? "bg-primary" : "bg-muted"
            )} />
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center gap-4">
                {/* Status Indicator */}
                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                  "transition-all duration-500",
                  winnerStatus.isRevealed 
                    ? "bg-primary/10 ring-2 ring-primary/30" 
                    : "bg-muted/30 ring-2 ring-muted/50"
                )}>
                  <Trophy className={cn(
                    "h-8 w-8 md:h-10 md:w-10 transition-colors",
                    winnerStatus.isRevealed ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>

                {/* Status Info */}
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-0.5 font-bold",
                      winnerStatus.isRevealed 
                        ? "border-primary text-primary" 
                        : "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {winnerStatus.isRevealed ? 'WINNER REVEALED' : 'WINNER HIDDEN'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Updated: {format(winnerStatus.updatedAt, 'MMM d, h:mm a')}
                  </p>
                </div>

                {/* Toggle Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="default"
                      className={cn(
                        "w-full h-10 text-sm font-semibold transition-all",
                        winnerStatus.isRevealed 
                          ? "bg-muted hover:bg-muted/80 text-foreground" 
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                    >
                      {winnerStatus.isRevealed ? 'Hide Winner' : 'Reveal Winner'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {winnerStatus.isRevealed ? 'Hide Winner?' : 'Reveal Winner?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {winnerStatus.isRevealed 
                          ? 'The winner will be hidden from public view.'
                          : 'This will reveal the winner to everyone. Make sure voting is closed.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={toggleWinner}
                        className={cn(
                          winnerStatus.isRevealed 
                            ? "bg-muted text-foreground" 
                            : "bg-primary text-primary-foreground"
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

        {/* Activity Log */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-primary" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {activityLogs.slice(0, 10).map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs text-foreground">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{log.user}</span>
                    <span>{format(log.timestamp, 'MMM d, h:mm a')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}