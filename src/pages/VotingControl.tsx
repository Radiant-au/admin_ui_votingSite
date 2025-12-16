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
import { Power, Clock, User, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function VotingControl() {
  const { votingStatus, toggleVoting, activityLogs, startVotingStatusSse } = useVotingStore();

  useEffect(() => {
    const stop = startVotingStatusSse();
    return () => {
      stop();
    };
  }, [startVotingStatusSse]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Voting Control</h1>
          <p className="text-muted-foreground mt-1">Manage voting status</p>
        </div>

        {/* Main Control */}
        <Card className="glass-card animate-slide-up overflow-hidden">
          <div className={cn(
            "h-2 w-full transition-colors",
            votingStatus.isOpen ? "bg-success" : "bg-destructive"
          )} />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Status Indicator */}
              <div className={cn(
                "w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center",
                "transition-all duration-500",
                votingStatus.isOpen 
                  ? "bg-success/10 ring-4 ring-success/30" 
                  : "bg-destructive/10 ring-4 ring-destructive/30"
              )}>
                <div className={cn(
                  "w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center",
                  votingStatus.isOpen ? "bg-success/20" : "bg-destructive/20"
                )}>
                  <Power className={cn(
                    "h-12 w-12 md:h-16 md:w-16 transition-colors",
                    votingStatus.isOpen ? "text-success" : "text-destructive"
                  )} />
                </div>
              </div>

              {/* Status Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-lg px-4 py-1 font-bold",
                      votingStatus.isOpen 
                        ? "border-success text-success" 
                        : "border-destructive text-destructive"
                    )}
                  >
                    {votingStatus.isOpen ? 'VOTING OPEN' : 'VOTING CLOSED'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {format(votingStatus.updatedAt, 'PPp')}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <User className="h-4 w-4" />
                    <span>By: {votingStatus.updatedBy}</span>
                  </div>
                </div>

                {/* Toggle Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      size="lg"
                      className={cn(
                        "w-full md:w-auto min-w-48 h-14 text-lg font-semibold transition-all",
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
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLogs.slice(0, 10).map((log, index) => (
                <div 
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
