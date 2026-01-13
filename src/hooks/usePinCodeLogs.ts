import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/api/apiClient';

export interface PinCodeLog {
  pinCode: string;
  status: 'voted' | 'not_voted';
  maleCandidate: string | null;
  femaleCandidate: string | null;
  votedAt: string | null;
}

export function usePinCodeLogs() {
  return useQuery<PinCodeLog[]>({
    queryKey: ['pincode-logs'],
    queryFn: () => apiRequest<PinCodeLog[]>('/admin/pincodes/logs'),
    staleTime: 30000,
  });
}
