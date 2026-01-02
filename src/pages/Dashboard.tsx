import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CategoryTabs } from '@/components/dashboard/CategoryTabs';
import { VoteCharts } from '@/components/dashboard/VoteCharts';
import { useVotingStore } from '@/store/votingStore';

export default function Dashboard() {
  const { getCandidatesByType } = useVotingStore();
  
  const kingCandidates = getCandidatesByType('king');
  const queenCandidates = getCandidatesByType('queen');

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-xl md:text-3xl font-display golden-text">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of voting statistics</p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts - 2 columns */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-display golden-text">Vote Distribution</h2>
          <VoteCharts />
        </section>

        {/* Swipeable Category Tabs */}
        <CategoryTabs
          kingCandidates={kingCandidates}
          queenCandidates={queenCandidates}
        />
      </div>
    </DashboardLayout>
  );
}
