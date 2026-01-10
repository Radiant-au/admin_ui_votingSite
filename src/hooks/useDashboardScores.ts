import { apiRequest } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';

export interface CandidateScore {
  id: number;
  name: string;
  profileImg: string;
  studentVotes: number;
  teacherScore: number;
  committeeScore: number;
  finalScore: number;
  hasScores: boolean;
}

export function useDashboardScores() {
  const { data: maleScores, isLoading: maleLoading } = useQuery({
    queryKey: ['dashboardScores', 'MALE'],
    queryFn: () => apiRequest<CandidateScore[]>('/winner/candidates?gender=male'),
    refetchInterval: 60 * 1000,
    staleTime: 10000,
  });

  const { data: femaleScores, isLoading: femaleLoading } = useQuery({
    queryKey: ['dashboardScores', 'FEMALE'],
    queryFn: () => apiRequest<CandidateScore[]>('/winner/candidates?gender=female'),
    refetchInterval: 60 * 1000,
    staleTime: 10000,
  });

  const allMaleHaveScores = maleScores?.every(c => c.hasScores) ?? false;
  const allFemaleHaveScores = femaleScores?.every(c => c.hasScores) ?? false;

  return {
    maleScores: maleScores || [],
    femaleScores: femaleScores || [],
    isLoading: maleLoading || femaleLoading,
    allMaleHaveScores,
    allFemaleHaveScores,
  };
}
