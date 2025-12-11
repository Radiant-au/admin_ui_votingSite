import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CandidateCard } from '@/components/dashboard/CandidateCard';
import { VoteCharts } from '@/components/dashboard/VoteCharts';
import { useVotingStore } from '@/store/votingStore';
import { Crown, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { getCandidatesByCategory } = useVotingStore();
  
  const kingQueenCandidates = getCandidatesByCategory('king-queen');
  const princePrincessCandidates = getCandidatesByCategory('prince-princess');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of voting statistics</p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts */}
        <VoteCharts />

        {/* King & Queen Candidates */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Crown className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">King & Queen</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {kingQueenCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} />
            ))}
          </div>
        </section>

        {/* Prince & Princess Candidates */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Prince & Princess</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {princePrincessCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
