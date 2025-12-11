import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useVotingStore } from '@/store/votingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, Wifi, Clock, Activity, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Connections() {
  const { sseConnections } = useVotingStore();

  const totalConnections = sseConnections.length;
  const avgDuration = sseConnections.reduce((sum, c) => sum + c.duration, 0) / totalConnections || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">SSE Connections</h1>
          <p className="text-muted-foreground mt-1">Monitor real-time connections</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-card animate-slide-up">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Connections</p>
                  <p className="text-2xl font-bold text-foreground">{totalConnections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Duration</p>
                  <p className="text-2xl font-bold text-foreground">{Math.round(avgDuration)}s</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-success text-success-foreground mt-1">Healthy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Health */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Connection Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse-soft" />
                <span className="font-medium text-success">All systems operational</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Last broadcast: {format(new Date(), 'h:mm:ss a')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Connections List */}
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sseConnections.map((connection, index) => (
                <div 
                  key={connection.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      "bg-success animate-pulse-soft"
                    )} />
                    <div>
                      <p className="font-medium text-foreground">Connection #{connection.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Connected: {format(connection.connectedAt, 'h:mm:ss a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {connection.duration}s
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {sseConnections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active connections
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
