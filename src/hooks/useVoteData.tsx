import { apiRequest } from '@/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface VoteCountDto {
  selectionId: number;
  selectionName: string;
  profileImg: string;
  voteCount: number;
}

export interface VoteCountsResponseDto {
  maleVotes: VoteCountDto[];
  femaleVotes: VoteCountDto[];
}

export interface VotedPinCodeDto{
    totalCodes: number;
    votedCodes: number;
}

export interface CandidateWithType extends VoteCountDto {
  candidateType: 'king' | 'queen' | 'prince' | 'princess';
}

// Separate hook for total voters count
export function useTotalVoters() {
  const { data, isLoading } = useQuery({
    queryKey: ['totalVoters'],
    queryFn: () => apiRequest<VotedPinCodeDto>('/pinCode/voted'),
    refetchInterval: 60 * 1000, // Poll every 1 minute
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    data,
    isLoading,
  };
}

export function useVoteData() {
  const { data : totalVoters } = useTotalVoters();

  // Poll vote counts every 1 minute
  const { data, isLoading } = useQuery({
    queryKey: ['votes'],
    queryFn: () => apiRequest<VoteCountsResponseDto>('/vote/senior/admin'),
    refetchInterval: 60 * 1000, // Poll every 1 minute
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Combine male and female votes with types
  const candidates = useMemo((): CandidateWithType[] => {
    if (!data) return [];

    const males: CandidateWithType[] = data.maleVotes.map(vote => ({
      ...vote,
      candidateType: 'king' as const,
    }));

    const females: CandidateWithType[] = data.femaleVotes.map(vote => ({
      ...vote,
      candidateType: 'queen' as const,
    }));

    return [...males, ...females];
  }, [data]);

  // Get vote percentage for a candidate based on total voters
  const getVotePercentage = (selectionId: number) => {
    if (totalVoters?.votedCodes === 0) return 0;
    const candidate = candidates.find(c => c.selectionId === selectionId);
    return candidate ? (candidate.voteCount / totalVoters.votedCodes) * 100 : 0;
  };

  // Get candidates by type
  const getCandidatesByType = (type: 'king' | 'queen' | 'prince' | 'princess') => {
    return candidates
      .filter(c => c.candidateType === type)
      .sort((a, b) => b.voteCount - a.voteCount);
  };

  return {
    candidates,
    totalVoters,
    getVotePercentage,
    getCandidatesByType,
    isLoading,
    maleVotes: data?.maleVotes || [],
    femaleVotes: data?.femaleVotes || [],
  };
}