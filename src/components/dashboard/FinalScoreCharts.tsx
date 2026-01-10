import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CandidateScore } from '@/hooks/useDashboardScores';

const CHART_COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB',
  '#E67E22', '#1ABC9C', '#E91E63',
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
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number | null }>({});

  if (!allMaleHaveScores && !allFemaleHaveScores) {
    return null;
  }

  const createPieData = (candidates: CandidateScore[]) => {
    return candidates
      .filter(c => c.hasScores)
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((c, index) => ({
        name: c.name,
        shortName: c.name.split(' ')[0],
        value: Number(c.finalScore), // Convert to number in case backend sends string
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }));
  };

  const handlePieClick = (chartKey: string, index: number) => {
    setActiveIndex(prev => ({
      ...prev,
      [chartKey]: prev[chartKey] === index ? null : index
    }));
  };

  const chartConfig = [
    { key: 'king', title: 'King Final Scores', data: createPieData(maleScores), show: allMaleHaveScores },
    { key: 'queen', title: 'Queen Final Scores', data: createPieData(femaleScores), show: allFemaleHaveScores },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-display golden-text flex items-center gap-2">
        <Trophy className="h-6 w-6 md:h-7 md:w-7" />
        Final Scores
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chartConfig.map((chart) => {
          if (!chart.show || chart.data.length === 0) return null;

          const selectedEntry = activeIndex[chart.key] !== null && activeIndex[chart.key] !== undefined
            ? chart.data[activeIndex[chart.key]!]
            : null;

          return (
            <Card 
              key={chart.key}
              className="golden-card animate-slide-up overflow-hidden"
            >
              <CardHeader className="p-3 pb-1 md:p-5 md:pb-2">
                <CardTitle className="text-base md:text-lg font-display flex items-center gap-2">
                  <Crown className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  <span className="golden-text">{chart.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-5 pt-0">
                <div className="h-8 md:h-10 flex items-center justify-center">
                  {selectedEntry && (
                    <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 animate-fade-in">
                      <span className="text-sm md:text-base font-medium golden-text truncate max-w-full">
                        {selectedEntry.name}: {selectedEntry.value.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="h-48 md:h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chart.data}
                        cx="50%"
                        cy="45%"
                        innerRadius="30%"
                        outerRadius="55%"
                        paddingAngle={2}
                        dataKey="value"
                        stroke="hsl(30, 10%, 8%)"
                        strokeWidth={1}
                        onClick={(_, index) => handlePieClick(chart.key, index)}
                        style={{ cursor: 'pointer' }}
                      >
                        {chart.data.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.fill}
                            style={{ 
                              filter: activeIndex[chart.key] === index 
                                ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))' 
                                : 'none',
                              transform: activeIndex[chart.key] === index ? 'scale(1.02)' : 'scale(1)',
                              transformOrigin: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border border-border rounded-lg px-4 py-2.5 shadow-lg">
                                <p className="text-base font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Final Score: <span className="text-primary font-bold text-base">{data.value.toFixed(1)}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px' }}
                        iconSize={10}
                        formatter={(value) => (
                          <span style={{ color: 'hsl(40, 15%, 70%)', fontSize: '12px', fontWeight: 500 }}>
                            {String(value).split(' ')[0].slice(0, 8)}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}