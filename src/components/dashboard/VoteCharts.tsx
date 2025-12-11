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

const GOLDEN_COLORS = ['#D4AF37', '#B8860B', '#DAA520', '#FFD700', '#F0E68C'];

export function VoteCharts() {
  const { getCandidatesByType } = useVotingStore();

  const createPieData = (type: 'king' | 'queen' | 'prince' | 'princess') => {
    return getCandidatesByType(type).map((c, i) => ({
      name: c.name.split(' ')[0],
      value: c.voteCount,
      fill: GOLDEN_COLORS[i % GOLDEN_COLORS.length],
    }));
  };

  const kingData = createPieData('king');
  const queenData = createPieData('queen');
  const princeData = createPieData('prince');
  const princessData = createPieData('princess');

  const chartConfig = [
    { title: 'King', data: kingData, icon: Crown, delay: '0.1s' },
    { title: 'Queen', data: queenData, icon: Crown, delay: '0.2s' },
    { title: 'Prince', data: princeData, icon: Sparkles, delay: '0.3s' },
    { title: 'Princess', data: princessData, icon: Sparkles, delay: '0.4s' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartConfig.map((chart) => (
        <Card 
          key={chart.title}
          className="golden-card animate-slide-up" 
          style={{ animationDelay: chart.delay }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <chart.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="golden-text">{chart.title}</span>
              <span className="text-muted-foreground font-sans text-sm font-normal">Vote Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="hsl(30, 10%, 8%)"
                    strokeWidth={2}
                  >
                    {chart.data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3))' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(30, 15%, 10%)',
                      border: '1px solid hsl(45, 90%, 55%, 0.3)',
                      borderRadius: '0.75rem',
                      color: 'hsl(45, 30%, 96%)',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)',
                    }}
                    formatter={(value: number) => [`${value} votes`, 'Votes']}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: '12px',
                      color: 'hsl(40, 15%, 60%)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
