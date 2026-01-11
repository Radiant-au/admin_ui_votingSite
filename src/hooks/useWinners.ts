import { apiPutJson, apiRequest } from '@/api/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface WinnerScoreRequest {
  teacherScore: number; // 0-100
  committeeScore: number; // 0-10
}

export interface CandidateWithScores {
  id: number;
  name: string;
  profileImg: string;
  studentVotes: number;
  teacherScore: number;
  committeeScore: number;
  finalScore: number;
  hasScores: boolean;
}

export interface SaveWinnerResponse {
  message: string;
}

export interface Winner{
  selectionId: number;
  selectionName: string;
  major:string;
  voteCount: number;
  teacher_score: number;
  commitee_score: number;
  profileImg: string;
}

export interface VoteWinner{
  selectionId: number;
  selectionName: string;
  voteCount: number;
  profileImg: string;
}

export interface GetWinners{
  King: Winner;
  Queen: Winner;
  Prince: Winner;
  Princess: Winner;
  PopularMale: VoteWinner;
  PopularFemale: VoteWinner;
}

/**
 * Hook to save winner scores for a candidate
 * PUT /winner/:id - admin only
 */
export function useSaveWinner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, scores }: { id: number; scores: WinnerScoreRequest }) => {
      return await apiPutJson<SaveWinnerResponse>(
        `/winner/${id}`,
        scores,
        { auth: true }
      );
    },
    onSuccess: () => {
      // Invalidate candidates queries to refetch updated scores
      queryClient.invalidateQueries({ queryKey: ['winners', 'candidates'] });
    },
  });
}

/**
 * Hook to get candidates with scores by gender
 * GET /winner/candidates?gender=male|female - admin only
 */
export function useCandidatesWithScores(gender: 'male' | 'female') {
  return useQuery({
    queryKey: ['winners', 'candidates', gender],
    queryFn: async () => {
      return await apiRequest<CandidateWithScores[]>(
        `/winner/candidates?gender=${gender}`,
        { auth: true }
      );
    },
    staleTime: 30000, // 30 seconds
  });
}

export function usefinalWinner(){
  return useQuery({
    queryKey: ['finalWinner'],
    queryFn: async () => {
      return await apiRequest<GetWinners>('/winner/final', { auth: true });
    },
    enabled: false, // Only fetch when winners are unlocked
  });
}