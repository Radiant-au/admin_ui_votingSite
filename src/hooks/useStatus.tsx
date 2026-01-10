import { apiPutJson, apiRequest } from "@/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Status = { 
    status: 'OPEN' | 'CLOSED';
}

export const useVotingStatus = () => {
    return useQuery<Status>({
        queryKey: ['VotingStatus'],
        queryFn: async () => {
            const response = await apiRequest<Status>('/appStatus/app', { auth: true });
            return response;
        },
        staleTime: Infinity, // Never auto-refetch
    });
}

export const useWinnerStatus = () => {
    return useQuery<Status>({
        queryKey: ['WinnerStatus'],
        queryFn: async () => {
            const response = await apiRequest<Status>('/appStatus/winner', { auth: true });
            return response;
        },
        staleTime: Infinity, // Never auto-refetch
    });
}

export const useChangeVotingStatus = () => {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const response = await apiPutJson<{ success: boolean; status: 'OPEN' | 'CLOSED' }>(
                '/appStatus/app',
                {}, // Empty body if not needed
                { auth: true }
            );
            return response;
        },
        onSuccess: (data) => {
            // Update cache immediately with new status
            qc.setQueryData(['VotingStatus'], { status: data.status });
        }
    });
}

export const useChangeWinnerStatus = () => {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const response = await apiPutJson<{ success: boolean; status: 'OPEN' | 'CLOSED' }>(
                '/appStatus/winner',
                {}, // Empty body if not needed
                { auth: true }
            );
            return response;
        },
        onSuccess: (data) => {
            // Update cache immediately with new status
            qc.setQueryData(['WinnerStatus'], { status: data.status });
        }
    });
}