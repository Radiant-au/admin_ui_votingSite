import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CandidateCarousel } from '@/components/dashboard/CandidateCarousel';
import { VoteCharts } from '@/components/dashboard/VoteCharts';
import { useVotingStore } from '@/store/votingStore';

export default function Dashboard() {
  const { getCandidatesByType } = useVotingStore();
  
  const kingCandidates = getCandidatesByType('king');
  const queenCandidates = getCandidatesByType('queen');
  const princeCandidates = getCandidatesByType('prince');
  const princessCandidates = getCandidatesByType('princess');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-display golden-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of voting statistics</p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts - 2 columns */}
        <section className="space-y-4">
          <h2 className="text-xl font-display golden-text">Vote Distribution</h2>
          <VoteCharts />
        </section>

        {/* Candidate Carousels */}
        <div className="space-y-8">
          <CandidateCarousel candidates={kingCandidates} title="King" type="king" />
          <CandidateCarousel candidates={queenCandidates} title="Queen" type="queen" />
          <CandidateCarousel candidates={princeCandidates} title="Prince" type="prince" />
          <CandidateCarousel candidates={princessCandidates} title="Princess" type="princess" />
        </div>
      </div>
    </DashboardLayout>
  );
}
