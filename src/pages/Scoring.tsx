import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Trophy, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCandidatesWithScores, useSaveWinner, CandidateWithScores } from "@/hooks/useWinners";


interface ScoreInputState {
  teacherScore: string;
  committeeScore: string;
  errors: {
    teacherScore?: string;
    committeeScore?: string;
  };
}

const ScoringCard = ({ 
  candidate, 
  onScoreSubmitted 
}: { 
  candidate: CandidateWithScores; 
  onScoreSubmitted: () => void;
}) => {
  const [state, setState] = useState<ScoreInputState>({
    teacherScore: candidate.hasScores ? candidate.teacherScore.toString() : "",
    committeeScore: candidate.hasScores ? candidate.committeeScore.toString() : "",
    errors: {},
  });

  const validateScore = (value: string, fieldName: string, max: number): string | undefined => {
    if (!value.trim()) {
      return `${fieldName} is required`;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return "Must be a valid number";
    }
    if (num < 0 || num > max) {
      return `Must be between 0 and ${max}`;
    }
    return undefined;
  };

  const saveWinnerMutation = useSaveWinner();

  const handleSubmit = () => {
    const teacherError = validateScore(state.teacherScore, "Teacher score", 100);
    const committeeError = validateScore(state.committeeScore, "Committee score", 100);

    if (teacherError || committeeError) {
      setState(prev => ({
        ...prev,
        errors: {
          teacherScore: teacherError,
          committeeScore: committeeError,
        }
      }));
      return;
    }

    setState(prev => ({ ...prev, errors: {} }));

    saveWinnerMutation.mutate(
      {
        id: candidate.id,
        scores: {
          teacherScore: parseFloat(state.teacherScore),
          committeeScore: parseFloat(state.committeeScore),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Score Submitted",
            description: `Scores for ${candidate.name} have been saved successfully.`,
          });
          onScoreSubmitted();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to submit scores. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card className={`transition-all duration-200 ${
      candidate.hasScores 
        ? "border-green-500/50 bg-green-50/30 dark:bg-green-950/10" 
        : "border-border"
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Image */}
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={candidate.profileImg} alt={candidate.name} className="object-cover" />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <h3 className="text-xl font-bold text-foreground">{candidate.name}</h3>

          {/* Student Votes Badge */}
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Users className="h-4 w-4" />
            <span>Student Votes: {candidate.studentVotes}</span>
          </Badge>

          {/* Score Inputs */}
          <div className="w-full space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor={`teacher-${candidate.id}`} className="text-sm font-medium">
                Teacher Score
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`teacher-${candidate.id}`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0.0"
                  value={state.teacherScore}
                  onChange={(e) => setState(prev => ({ 
                    ...prev, 
                    teacherScore: e.target.value,
                    errors: { ...prev.errors, teacherScore: undefined }
                  }))}
                  className={state.errors.teacherScore ? "border-destructive" : ""}
                />
                <span className="text-muted-foreground font-medium">/ 100</span>
              </div>
              {state.errors.teacherScore && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.teacherScore}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`committee-${candidate.id}`} className="text-sm font-medium">
                Committee Score
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`committee-${candidate.id}`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0.0"
                  value={state.committeeScore}
                  onChange={(e) => setState(prev => ({ 
                    ...prev, 
                    committeeScore: e.target.value,
                    errors: { ...prev.errors, committeeScore: undefined }
                  }))}
                  className={state.errors.committeeScore ? "border-destructive" : ""}
                />
                <span className="text-muted-foreground font-medium">/ 100</span>
              </div>
              {state.errors.committeeScore && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {state.errors.committeeScore}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={saveWinnerMutation.isPending}
            className="w-full"
          >
            {saveWinnerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Score"
            )}
          </Button>

          {/* Final Score Display */}
          <div className={`w-full p-4 rounded-lg ${
            candidate.hasScores 
              ? "bg-primary/10" 
              : "bg-muted"
          }`}>
            <div className="flex items-center justify-center gap-2">
              <Trophy className={`h-5 w-5 ${candidate.hasScores ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-semibold">Final Score:</span>
              {candidate.hasScores ? (
                <span className="text-xl font-bold text-primary">
                  {candidate.finalScore.toFixed(2)} / 100
                </span>
              ) : (
                <span className="text-muted-foreground">--</span>
              )}
            </div>
            {candidate.hasScores && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                Scores submitted
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Scoring = () => {
  const [activeTab, setActiveTab] = useState<"male" | "female">("male");
  const { data: candidates = [], isLoading, refetch } = useCandidatesWithScores(activeTab);
  // Sort candidates by final score (highest first), then by name
  const sortedCandidates = [...candidates].sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    return a.name.localeCompare(b.name);
  });

  const handleScoreSubmitted = () => {
    refetch();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Candidate Scoring</h1>
          <p className="text-muted-foreground mt-1">
            Enter teacher and committee scores for each candidate
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "male" | "female")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="male">Male Candidates</TabsTrigger>
            <TabsTrigger value="female">Female Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="male" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedCandidates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No male candidates found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCandidates.map((candidate) => (
                  <ScoringCard
                    key={candidate.id}
                    candidate={candidate}
                    onScoreSubmitted={handleScoreSubmitted}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="female" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sortedCandidates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No female candidates found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCandidates.map((candidate) => (
                  <ScoringCard
                    key={candidate.id}
                    candidate={candidate}
                    onScoreSubmitted={handleScoreSubmitted}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Scoring;
