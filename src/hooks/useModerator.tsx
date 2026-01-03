import { apiJson, apiRequest } from '@/api/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Moderator {
  id: number;
  username: string;
  role: string;
}

export interface AddModeratorDto {
  username: string;
  password: string;
}

export interface ModeratorResponse {
  message: string;
}


export function useModerators() {
  const queryClient = useQueryClient();

  // Fetch all moderators
  const { data: moderators = [], isLoading } = useQuery({
    queryKey: ['moderators'],
    queryFn: async () => {
        return await apiRequest<Moderator[]>('/auth/moderators');
    },
    staleTime: 30000, // 30 seconds
  });

  // Add moderator mutation
  const addModeratorMutation = useMutation({
    mutationFn: async(data: AddModeratorDto) => {
        return await apiJson<ModeratorResponse>('/auth/moderator', data);
    },
    onSuccess: () => {
      // Refetch moderators list after adding
      queryClient.invalidateQueries({ queryKey: ['moderators'] });
    },
  });

  return {
    moderators,
    isLoading,
    addModerator: addModeratorMutation.mutateAsync,
    isAdding: addModeratorMutation.isPending,
  };
}