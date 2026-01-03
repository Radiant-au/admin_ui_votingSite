import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiJson, apiPutJson, apiRequest } from '@/api/apiClient';

type BackendSelection = {
  id: number;
  name: string;
  gender: string;
  profileImg?: string;
  major: string;
  description: string;
  category: 'king-queen' | 'prince-princess';
  images: string[];
};

export type Category = 'king-queen' | 'prince-princess';
export type CandidateType = 'king' | 'queen' | 'prince' | 'princess';
export type UserRole = 'admin' | 'vote_moderator' | 'user';
export type Gender = 'male' | 'female';

export interface UTSelection {
  id: string;
  name: string;
  gender: Gender;
  profileImg: string;
  category: Category;
  candidateType: CandidateType;
  major: string;
  description: string;
  images: string[];
}

function computeCandidateType(selection: BackendSelection): CandidateType {
  const gender = (selection.gender || '').toLowerCase();
  const isMale = gender === 'male';
  if (selection.category === 'king-queen') return isMale ? 'king' : 'queen';
  return isMale ? 'prince' : 'princess';
}

function mapBackendSelectionToUi(selection: BackendSelection): UTSelection {

  return {
    id: String(selection.id),
    name: selection.name,
    gender: (selection.gender as any) || 'male',
    profileImg: selection.profileImg,
    category: selection.category,
    candidateType: computeCandidateType(selection),
    major: selection.major,
    description: selection.description,
    images: selection.images || [],
  };
}

const candidatesKey = ['candidates'];

export function useCandidates() {
  return useQuery({
    queryKey: candidatesKey,
    queryFn: async () => {
      const selections = await apiRequest<BackendSelection[]>('/selection/get/all');
      return selections.map(mapBackendSelectionToUi);
    },
  });
}

export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (candidate: Omit<UTSelection, 'id'>) => {
      await apiJson('/selection', {
        name: candidate.name,
        gender: candidate.gender,
        major: candidate.major,
        description: candidate.description,
        category: candidate.category,
        profileImg: candidate.profileImg,
        images: candidate.images,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: candidatesKey });
    },
  });
}

export function useUpdateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; updates: Partial<UTSelection> }) => {
      const { id, updates } = params;
      console.log(params);
      await apiPutJson(`/selection/${id}`, {
        ...(updates.name != null ? { name: updates.name } : {}),
        ...(updates.gender != null ? { gender: updates.gender } : {}),
        ...(updates.major != null ? { major: updates.major } : {}),
        ...(updates.description != null ? { description: updates.description } : {}),
        ...(updates.category != null ? { category: updates.category } : {}),
        ...(updates.profileImg != null ? { profileImg: updates.profileImg } : {}),
        ...(updates.images != null ? { images: updates.images } : {}),
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: candidatesKey });
    },
  });
}

export function useDeleteCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/selection/${id}`, { method: 'DELETE' });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: candidatesKey });
    },
  });
}
