import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { CategoryTabs } from '@/components/dashboard/CategoryTabs';
import { VoteCharts } from '@/components/dashboard/VoteCharts';
import { useVoteData } from '@/hooks/useVoteData';

export default function Dashboard() {
  const { isLoading, totalVoters } = useVoteData();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 md:space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>

          {/* Charts Skeleton */}
          <section className="space-y-3">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </section>

          {/* Candidates Skeleton */}
          <section className="space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-xl md:text-3xl font-display golden-text">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of voting statistics • Total Voters: {totalVoters.totalCodes}
          </p>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts - 2 columns */}
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-display golden-text">Vote Distribution</h2>
          <VoteCharts />
        </section>

        {/* Swipeable Category Tabs - No props needed */}
        <CategoryTabs />
      </div>
    </DashboardLayout>
  );
}