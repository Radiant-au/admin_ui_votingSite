import { create } from 'zustand';
import { UTSelection, VotingStatus, SSEConnection, ActivityLog, User, Category, CandidateType, PinCodeVote } from '@/types';
import { apiJson, apiRequest, getApiBaseUrl } from '@/lib/apiClient';

const mockCandidates: UTSelection[] = [
  // Kings
  { id: '1', name: 'Marcus Thompson', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', category: 'king-queen', candidateType: 'king', major: 'Business Administration', description: 'Dedicated to community service.', images: [], voteCount: 312 },
  { id: '2', name: 'James Wilson', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', category: 'king-queen', candidateType: 'king', major: 'Engineering', description: 'Building bridges between communities.', images: [], voteCount: 287 },
  { id: '3', name: 'Daniel Park', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', category: 'king-queen', candidateType: 'king', major: 'Architecture', description: 'Designing spaces that inspire.', images: [], voteCount: 265 },
  { id: '4', name: 'Michael Chen', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400', category: 'king-queen', candidateType: 'king', major: 'Computer Science', description: 'Tech innovator and leader.', images: [], voteCount: 234 },
  { id: '5', name: 'David Kim', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', category: 'king-queen', candidateType: 'king', major: 'Finance', description: 'Aspiring entrepreneur.', images: [], voteCount: 198 },
  
  // Queens
  { id: '6', name: 'Alexandra Chen', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', category: 'king-queen', candidateType: 'queen', major: 'Computer Science', description: 'Passionate about technology.', images: [], voteCount: 345 },
  { id: '7', name: 'Emily Davis', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', category: 'king-queen', candidateType: 'queen', major: 'Marketing', description: 'Creative visionary.', images: [], voteCount: 298 },
  { id: '8', name: 'Sophia Lee', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', category: 'king-queen', candidateType: 'queen', major: 'Psychology', description: 'Mental health advocate.', images: [], voteCount: 276 },
  { id: '9', name: 'Olivia Martinez', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', category: 'king-queen', candidateType: 'queen', major: 'Medicine', description: 'Future healthcare leader.', images: [], voteCount: 254 },
  { id: '10', name: 'Isabella Brown', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', category: 'king-queen', candidateType: 'queen', major: 'Law', description: 'Justice advocate.', images: [], voteCount: 221 },
  
  // Princes
  { id: '11', name: 'Ryan Garcia', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400', category: 'prince-princess', candidateType: 'prince', major: 'Sports Science', description: 'Athletic champion.', images: [], voteCount: 189 },
  { id: '12', name: 'Tyler Johnson', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400', category: 'prince-princess', candidateType: 'prince', major: 'Arts', description: 'Creative artist.', images: [], voteCount: 167 },
  { id: '13', name: 'Brandon Lee', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400', category: 'prince-princess', candidateType: 'prince', major: 'Music', description: 'Musical prodigy.', images: [], voteCount: 145 },
  { id: '14', name: 'Andrew White', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400', category: 'prince-princess', candidateType: 'prince', major: 'Physics', description: 'Future scientist.', images: [], voteCount: 132 },
  { id: '15', name: 'Kevin Brown', gender: 'male', profileImg: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400', category: 'prince-princess', candidateType: 'prince', major: 'Chemistry', description: 'Lab enthusiast.', images: [], voteCount: 118 },
  
  // Princesses
  { id: '16', name: 'Sofia Rodriguez', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400', category: 'prince-princess', candidateType: 'princess', major: 'Dance', description: 'Graceful performer.', images: [], voteCount: 201 },
  { id: '17', name: 'Mia Anderson', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400', category: 'prince-princess', candidateType: 'princess', major: 'Fashion', description: 'Style icon.', images: [], voteCount: 178 },
  { id: '18', name: 'Chloe Taylor', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400', category: 'prince-princess', candidateType: 'princess', major: 'Literature', description: 'Aspiring author.', images: [], voteCount: 156 },
  { id: '19', name: 'Emma Wilson', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', category: 'prince-princess', candidateType: 'princess', major: 'Theater', description: 'Drama star.', images: [], voteCount: 143 },
  { id: '20', name: 'Ava Thomas', gender: 'female', profileImg: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', category: 'prince-princess', candidateType: 'princess', major: 'Journalism', description: 'Truth seeker.', images: [], voteCount: 127 },
];

const mockPinCodeVotes: PinCodeVote[] = [
  { pinCode: 'PIN001', votedAt: new Date(Date.now() - 3600000) },
  { pinCode: 'PIN002', votedAt: new Date(Date.now() - 7200000) },
  { pinCode: 'PIN003', votedAt: new Date(Date.now() - 10800000) },
  { pinCode: 'PIN004', votedAt: new Date(Date.now() - 14400000) },
  { pinCode: 'PIN005', votedAt: new Date(Date.now() - 18000000) },
  { pinCode: 'PIN006', votedAt: new Date(Date.now() - 21600000) },
  { pinCode: 'PIN007', votedAt: new Date(Date.now() - 25200000) },
  { pinCode: 'PIN008', votedAt: new Date(Date.now() - 28800000) },
];

const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Voting opened', timestamp: new Date(Date.now() - 3600000), user: 'admin' },
  { id: '2', action: 'New candidate added', timestamp: new Date(Date.now() - 7200000), user: 'admin' },
  { id: '3', action: 'Voting closed', timestamp: new Date(Date.now() - 86400000), user: 'admin' },
];

const TOKEN_STORAGE_KEY = 'admin_token';

interface VotingStore {
  // Auth
  currentUser: User | null;
  authToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addModerator: (username: string, password: string) => Promise<void>;
  
  // Candidates (server state now handled by TanStack Query)
  candidates: UTSelection[];
  
  // Voting Status
  votingStatus: VotingStatus;
  fetchVotingStatus: () => Promise<void>;
  startVotingStatusSse: () => () => void;
  toggleVoting: () => Promise<void>;
  
  // PinCode Votes
  pinCodeVotes: PinCodeVote[];
  getTotalPinCodesVoted: () => number;
  
  // SSE Connections
  sseConnections: SSEConnection[];
  
  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (action: string) => void;
  
  // Computed
  getTotalVotes: () => number;
  getCandidatesByCategory: (category: Category) => UTSelection[];
  getCandidatesByType: (type: CandidateType) => UTSelection[];
  getVotePercentage: (candidateId: string) => number;
  getVotesByType: (type: CandidateType) => number;
}

type AdminLoginResponse = { token: string };
type BackendAppStatusResponse = { status: boolean };
type BackendChangeStatusResponse = { success: boolean; status: boolean };

export const useVotingStore = create<VotingStore>((set, get) => ({
  currentUser: localStorage.getItem(TOKEN_STORAGE_KEY) ? { id: '0', username: 'admin', role: 'admin' } : null,
  authToken: localStorage.getItem(TOKEN_STORAGE_KEY),

  login: async (username: string, password: string) => {
    const resp = await apiJson<AdminLoginResponse>('/auth/Alogin', { username, password }, { auth: false });
    localStorage.setItem(TOKEN_STORAGE_KEY, resp.token);
    set({
      authToken: resp.token,
      currentUser: { id: '0', username, role: 'admin' },
    });
    return true;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ currentUser: null, authToken: null });
  },

  addModerator: async (username: string, password: string) => {
    // Backend does not currently expose moderator management endpoints.
    // Keep UI behavior by logging activity only.
    get().addActivityLog(`New moderator "${username}" added`);
    void password;
  },

  candidates: mockCandidates,

  votingStatus: {
    id: '1',
    isOpen: true,
    updatedAt: new Date(),
    updatedBy: 'admin',
  },

  fetchVotingStatus: async () => {
    const resp = await apiRequest<BackendAppStatusResponse>('/appStatus', { auth: false });
    set((state) => ({
      votingStatus: {
        ...state.votingStatus,
        isOpen: !!resp.status,
        updatedAt: new Date(),
        updatedBy: state.currentUser?.username || 'system',
      },
    }));
  },

  startVotingStatusSse: () => {
    const url = `${getApiBaseUrl()}/appStatus`;
    const es = new EventSource(url);

    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data) as BackendAppStatusResponse;
        set((state) => ({
          votingStatus: {
            ...state.votingStatus,
            isOpen: !!data.status,
            updatedAt: new Date(),
            updatedBy: state.currentUser?.username || 'system',
          },
        }));
      } catch {
        // ignore malformed event
      }
    };

    return () => {
      es.close();
    };
  },

  toggleVoting: async () => {
    const desired = !get().votingStatus.isOpen;
    const resp = await apiRequest<BackendChangeStatusResponse>(`/appStatus/${desired}`, {
      method: 'PUT',
    });
    set((state) => ({
      votingStatus: {
        ...state.votingStatus,
        isOpen: !!resp.status,
        updatedAt: new Date(),
        updatedBy: state.currentUser?.username || 'system',
      },
    }));
    const newStatus = get().votingStatus.isOpen ? 'opened' : 'closed';
    get().addActivityLog(`Voting ${newStatus}`);
  },
  
  pinCodeVotes: mockPinCodeVotes,
  
  getTotalPinCodesVoted: () => get().pinCodeVotes.length,
  
  sseConnections: [
    { id: '1', connectedAt: new Date(Date.now() - 120000), duration: 120 },
    { id: '2', connectedAt: new Date(Date.now() - 300000), duration: 300 },
    { id: '3', connectedAt: new Date(Date.now() - 60000), duration: 60 },
    { id: '4', connectedAt: new Date(Date.now() - 180000), duration: 180 },
  ],
  
  activityLogs: mockActivityLogs,
  
  addActivityLog: (action) => {
    const log: ActivityLog = {
      id: Date.now().toString(),
      action,
      timestamp: new Date(),
      user: get().currentUser?.username || 'system',
    };
    set((state) => ({
      activityLogs: [log, ...state.activityLogs].slice(0, 50),
    }));
  },
  
  getTotalVotes: () => {
    return get().candidates.reduce((sum, c) => sum + c.voteCount, 0);
  },
  
  getCandidatesByCategory: (category) => {
    return get().candidates.filter(c => c.category === category);
  },
  
  getCandidatesByType: (type) => {
    return get().candidates.filter(c => c.candidateType === type);
  },
  
  getVotePercentage: (candidateId) => {
    const total = get().getTotalVotes();
    if (total === 0) return 0;
    const candidate = get().candidates.find(c => c.id === candidateId);
    return candidate ? (candidate.voteCount / total) * 100 : 0;
  },
  
  getVotesByType: (type) => {
    return get().getCandidatesByType(type).reduce((sum, c) => sum + c.voteCount, 0);
  },
}));
