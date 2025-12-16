import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateForm } from '@/components/candidates/CandidateForm';
import { useVotingStore } from '@/store/votingStore';
import { UTSelection } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Crown, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCandidates, useDeleteCandidate } from '@/hooks/useCandidates';

export default function Candidates() {
  const { currentUser } = useVotingStore();
  const { data: candidates = [] } = useCandidates();
  const deleteCandidate = useDeleteCandidate();
  const [formOpen, setFormOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<UTSelection | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const handleEdit = (candidate: UTSelection) => {
    setEditCandidate(candidate);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;

    deleteCandidate
      .mutateAsync(deleteId)
      .then(() => {
        toast({ title: 'Candidate deleted successfully' });
        setDeleteId(null);
      })
      .catch(() => {
        toast({ title: 'Error deleting candidate', variant: 'destructive' });
      });
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditCandidate(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-1">Manage all voting candidates</p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => setFormOpen(true)}
              className="gradient-primary text-primary-foreground gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Candidate
            </Button>
          )}
        </div>

        {/* Candidates List */}
        <div className="grid gap-4">
          {candidates.map((candidate, index) => (
            <Card 
              key={candidate.id}
              className="glass-card overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-40 md:w-48 h-48 sm:h-auto relative overflow-hidden">
                    <img 
                      src={candidate.profileImg}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={cn(
                        "absolute top-2 left-2",
                        candidate.category === 'king-queen' 
                          ? "bg-accent text-accent-foreground" 
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      {candidate.category === 'king-queen' ? 'K&Q' : 'P&P'}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{candidate.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{candidate.major}</span>
                            <span className="capitalize">• {candidate.gender}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{candidate.voteCount}</p>
                          <p className="text-xs text-muted-foreground">votes</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {candidate.description}
                      </p>
                    </div>

                    {/* Actions */}
                    {isAdmin && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(candidate)}
                          className="gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteId(candidate.id)}
                          className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No candidates yet.</p>
            {isAdmin && (
              <Button 
                onClick={() => setFormOpen(true)} 
                className="mt-4 gradient-primary text-primary-foreground"
              >
                Add your first candidate
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <CandidateForm 
        open={formOpen}
        onClose={handleFormClose}
        candidate={editCandidate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The candidate will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
