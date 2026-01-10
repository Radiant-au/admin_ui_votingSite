import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CandidateScore } from '@/hooks/useDashboardScores';

const COLORS = [
  '#E6A817',  // golden
  '#B8860B',  // dark golden
  '#3B82F6',  // blue
  '#A855F7',  // purple
  '#14B8A6',  // teal
  '#EF4444',  // red
  '#EC4899',  // pink
  '#60A5FA',  // light blue
];

interface FinalScoreChartsProps {
  maleScores: CandidateScore[];
  femaleScores: CandidateScore[];
  allMaleHaveScores: boolean;
  allFemaleHaveScores: boolean;
}

export function FinalScoreCharts({
  maleScores,
  femaleScores,
  allMaleHaveScores,
  allFemaleHaveScores,
}: FinalScoreChartsProps) {
  if (!allMaleHaveScores && !allFemaleHaveScores) {
    return null;
  }

  const createPieData = (candidates: CandidateScore[]) => {
    return candidates
      .filter(c => c.hasScores)
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((c, index) => ({
        name: c.name,
        value: c.finalScore,
        color: COLORS[index % COLORS.length],
      }));
  };

  const renderChart = (
    title: string,
    icon: React.ReactNode,
    data: { name: string; value: number; color: string }[],
    show: boolean
  ) => {
    if (!show || data.length === 0) return null;

    return (
      <Card className="golden-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            {icon}
            <span className="golden-text">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Final Score: <span className="text-primary font-bold">{data.value.toFixed(1)}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[10px] md:text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg md:text-xl font-display golden-text flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Final Scores
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderChart(
          'King Final Scores',
          <Crown className="h-4 w-4 text-primary" />,
          createPieData(maleScores),
          allMaleHaveScores
        )}
        {renderChart(
          'Queen Final Scores',
          <Crown className="h-4 w-4 text-primary" />,
          createPieData(femaleScores),
          allFemaleHaveScores
        )}
      </div>
    </section>
  );
}
