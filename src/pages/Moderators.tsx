import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useVotingStore } from '@/store/votingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { UserPlus, Users, Shield } from 'lucide-react';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Moderators() {
  const { users, addModerator, currentUser } = useVotingStore();
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const moderators = users.filter(u => u.user.role === 'vote_moderator');

  const onSubmit = async (data: FormData) => {
    try {
      // Check if username already exists
      if (users.some(u => u.username === data.username)) {
        toast({ title: 'Username already exists', variant: 'destructive' });
        return;
      }

      addModerator(data.username, data.password);
      toast({ title: 'Moderator added successfully!' });
      reset();
      setIsAdding(false);
    } catch (error) {
      toast({ title: 'Error adding moderator', variant: 'destructive' });
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="golden-card p-8 text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-display text-foreground">Access Denied</h2>
            <p className="text-muted-foreground mt-2">Only admins can manage moderators.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-display golden-text">Moderators</h1>
            <p className="text-muted-foreground mt-1">Manage vote moderator accounts</p>
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            className="gradient-primary text-primary-foreground"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Moderator
          </Button>
        </div>

        {/* Stats */}
        <Card className="golden-card animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Moderators</p>
                <p className="text-2xl font-display font-bold text-foreground">{moderators.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Moderator Form */}
        {isAdding && (
          <Card className="golden-card animate-scale-in">
            <CardHeader>
              <CardTitle className="font-display golden-text flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New Moderator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Username</Label>
                    <Input 
                      placeholder="Enter username"
                      className="bg-secondary/50 border-border/50"
                      {...register('username')}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Password</Label>
                    <Input 
                      type="password"
                      placeholder="Enter password"
                      className="bg-secondary/50 border-border/50"
                      {...register('password')}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Confirm Password</Label>
                  <Input 
                    type="password"
                    placeholder="Confirm password"
                    className="bg-secondary/50 border-border/50"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { reset(); setIsAdding(false); }}
                    className="border-border/50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gradient-primary text-primary-foreground"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Moderator'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Moderators List */}
        <Card className="golden-card animate-slide-up">
          <CardHeader>
            <CardTitle className="font-display text-foreground">Current Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            {moderators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No moderators yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moderators.map((mod) => (
                  <div 
                    key={mod.user.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold uppercase">
                          {mod.username.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{mod.username}</p>
                        <p className="text-sm text-muted-foreground">ID: {mod.user.id}</p>
                      </div>
                    </div>
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      Vote Moderator
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
