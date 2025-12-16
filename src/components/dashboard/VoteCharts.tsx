import { useState } from 'react';
import { useVotingStore } from '@/store/votingStore';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Sparkles } from 'lucide-react';

// Distinct vibrant colors for each slice
const CHART_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Teal
  '#9B59B6', // Purple
  '#3498DB', // Blue
];

export function VoteCharts() {
  const { getCandidatesByType } = useVotingStore();
  const [activeIndex, setActiveIndex] = useState<{ [key: string]: number | null }>({});

  const createPieData = (type: 'king' | 'queen' | 'prince' | 'princess') => {
    return getCandidatesByType(type).map((c, i) => ({
      name: c.name,
      shortName: c.name.split(' ')[0],
      value: c.voteCount,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  };

  const kingData = createPieData('king');
  const queenData = createPieData('queen');
  const princeData = createPieData('prince');
  const princessData = createPieData('princess');

  const chartConfig = [
    { key: 'king', title: 'King', data: kingData, icon: Crown },
    { key: 'queen', title: 'Queen', data: queenData, icon: Crown },
    { key: 'prince', title: 'Prince', data: princeData, icon: Sparkles },
    { key: 'princess', title: 'Princess', data: princessData, icon: Sparkles },
  ];

  const handlePieClick = (chartKey: string, index: number) => {
    setActiveIndex(prev => ({
      ...prev,
      [chartKey]: prev[chartKey] === index ? null : index
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-6">
      {chartConfig.map((chart) => {
        const selectedEntry = activeIndex[chart.key] !== null && activeIndex[chart.key] !== undefined
          ? chart.data[activeIndex[chart.key]!]
          : null;

        return (
          <Card 
            key={chart.title}
            className="golden-card animate-slide-up"
          >
            <CardHeader className="p-3 md:pb-2 md:p-6">
              <CardTitle className="text-xs md:text-lg font-display flex items-center gap-1 md:gap-2">
                <div className="p-1 md:p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <chart.icon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
                <span className="golden-text">{chart.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-6 pt-0">
              {/* Selected name display */}
              <div className="h-6 md:h-8 flex items-center justify-center mb-1">
                {selectedEntry && (
                  <div className="px-2 py-1 rounded-full bg-primary/20 border border-primary/30 animate-fade-in">
                    <span className="text-xs md:text-sm font-medium golden-text">
                      {selectedEntry.name}: {selectedEntry.value} votes
                    </span>
                  </div>
                )}
              </div>
              
              <div className="h-32 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chart.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                      paddingAngle={3}
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
                              ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))' 
                              : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                            transform: activeIndex[chart.key] === index ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))}
                    </Pie>
                    {/* <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(30, 15%, 10%)',
                        border: '1px solid hsl(45, 90%, 55%, 0.3)',
                        borderRadius: '0.75rem',
                        color: 'hsl(45, 30%, 96%)',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: number, name: string) => [`${value} votes`, name]}
                    /> */}
                    <Legend 
                      wrapperStyle={{ 
                        fontSize: '10px',
                        paddingTop: '8px'
                      }}
                      formatter={(value) => (
                        <span style={{ color: 'hsl(40, 15%, 70%)', fontSize: '10px' }}>
                          {value.split(' ')[0]}
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
