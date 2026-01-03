import { useState } from 'react';
import { useVoteData } from '@/hooks/useVoteData';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';

const CHART_COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB',
];

export function VoteCharts() {
  const { getCandidatesByType, isLoading } = useVoteData();
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number | null }>({});

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="golden-card animate-pulse">
            <CardContent className="h-64" />
          </Card>
        ))}
      </div>
    );
  }

  const createPieData = (type: 'king' | 'queen' | 'prince' | 'princess') => {
    return getCandidatesByType(type).map((c, i) => ({
      name: c.selectionName,
      shortName: c.selectionName.split(' ')[0],
      value: c.voteCount,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  };

  const chartConfig = [
    { key: 'king', title: 'King', data: createPieData('king'), icon: Crown },
    { key: 'queen', title: 'Queen', data: createPieData('queen'), icon: Crown },
    // { key: 'prince', title: 'Prince', data: createPieData('prince'), icon: Sparkles },
    // { key: 'princess', title: 'Princess', data: createPieData('princess'), icon: Sparkles },
  ];

  const handlePieClick = (chartKey: string, index: number) => {
    setActiveIndex(prev => ({
      ...prev,
      [chartKey]: prev[chartKey] === index ? null : index
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4">
      {chartConfig.map((chart) => {
        const selectedEntry = activeIndex[chart.key] !== null && activeIndex[chart.key] !== undefined
          ? chart.data[activeIndex[chart.key]!]
          : null;

        return (
          <Card 
            key={chart.title}
            className="golden-card animate-slide-up overflow-hidden"
          >
            <CardHeader className="p-2 pb-1 md:p-4 md:pb-2">
              <CardTitle className="text-xs md:text-base font-display flex items-center gap-1">
                <chart.icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="golden-text">{chart.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4 pt-0">
              <div className="h-6 md:h-8 flex items-center justify-center">
                {selectedEntry && (
                  <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 animate-fade-in">
                    <span className="text-[9px] md:text-sm font-medium golden-text truncate max-w-full">
                      {selectedEntry.name}: {selectedEntry.value}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="h-36 md:h-52">
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
                    <Legend 
                      wrapperStyle={{ fontSize: '8px' }}
                      iconSize={6}
                      formatter={(value) => (
                        <span style={{ color: 'hsl(40, 15%, 70%)', fontSize: '8px' }}>
                          {value.split(' ')[0].slice(0, 6)}
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
  );
}