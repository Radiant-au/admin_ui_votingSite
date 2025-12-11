import { create } from 'zustand';
import { UTSelection, VotingStatus, SSEConnection, ActivityLog, User, Category } from '@/types';

// Mock data
const mockCandidates: UTSelection[] = [
  {
    id: '1',
    name: 'Alexandra Chen',
    gender: 'female',
    profileImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    category: 'king-queen',
    major: 'Computer Science',
    description: 'Passionate about technology and leadership.',
    images: [],
    voteCount: 245,
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    gender: 'male',
    profileImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    category: 'king-queen',
    major: 'Business Administration',
    description: 'Dedicated to community service and excellence.',
    images: [],
    voteCount: 312,
  },
  {
    id: '3',
    name: 'Sofia Rodriguez',
    gender: 'female',
    profileImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    category: 'prince-princess',
    major: 'Psychology',
    description: 'Advocating for mental health awareness.',
    images: [],
    voteCount: 189,
  },
  {
    id: '4',
    name: 'James Wilson',
    gender: 'male',
    profileImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    category: 'prince-princess',
    major: 'Engineering',
    description: 'Building bridges between communities.',
    images: [],
    voteCount: 156,
  },
  {
    id: '5',
    name: 'Emily Davis',
    gender: 'female',
    profileImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    category: 'king-queen',
    major: 'Marketing',
    description: 'Creative visionary with a passion for innovation.',
    images: [],
    voteCount: 278,
  },
  {
    id: '6',
    name: 'Daniel Park',
    gender: 'male',
    profileImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    category: 'prince-princess',
    major: 'Architecture',
    description: 'Designing spaces that inspire.',
    images: [],
    voteCount: 201,
  },
];

const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Voting opened', timestamp: new Date(Date.now() - 3600000), user: 'admin' },
  { id: '2', action: 'New candidate added', timestamp: new Date(Date.now() - 7200000), user: 'admin' },
  { id: '3', action: 'Voting closed', timestamp: new Date(Date.now() - 86400000), user: 'admin' },
];

interface VotingStore {
  // Auth
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Candidates
  candidates: UTSelection[];
  addCandidate: (candidate: Omit<UTSelection, 'id' | 'voteCount' | 'images'>) => void;
  updateCandidate: (id: string, candidate: Partial<UTSelection>) => void;
  deleteCandidate: (id: string) => void;
  
  // Voting Status
  votingStatus: VotingStatus;
  toggleVoting: () => void;
  
  // SSE Connections
  sseConnections: SSEConnection[];
  
  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (action: string) => void;
  
  // Computed
  getTotalVotes: () => number;
  getCandidatesByCategory: (category: Category) => UTSelection[];
  getVotePercentage: (candidateId: string) => number;
}

// Mock users for authentication
const mockUsers: { username: string; password: string; user: User }[] = [
  { username: 'admin', password: 'admin123', user: { id: '1', username: 'admin', role: 'admin' } },
  { username: 'moderator', password: 'mod123', user: { id: '2', username: 'moderator', role: 'vote_moderator' } },
];

export const useVotingStore = create<VotingStore>((set, get) => ({
  currentUser: null,
  
  login: (username: string, password: string) => {
    const found = mockUsers.find(u => u.username === username && u.password === password);
    if (found) {
      set({ currentUser: found.user });
      return true;
    }
    return false;
  },
  
  logout: () => set({ currentUser: null }),
  
  candidates: mockCandidates,
  
  addCandidate: (candidate) => {
    const newCandidate: UTSelection = {
      ...candidate,
      id: Date.now().toString(),
      voteCount: 0,
      images: [],
    };
    set((state) => ({ 
      candidates: [...state.candidates, newCandidate] 
    }));
    get().addActivityLog(`New candidate "${candidate.name}" added`);
  },
  
  updateCandidate: (id, updates) => {
    set((state) => ({
      candidates: state.candidates.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
    get().addActivityLog(`Candidate updated`);
  },
  
  deleteCandidate: (id) => {
    const candidate = get().candidates.find(c => c.id === id);
    set((state) => ({
      candidates: state.candidates.filter(c => c.id !== id),
    }));
    if (candidate) {
      get().addActivityLog(`Candidate "${candidate.name}" deleted`);
    }
  },
  
  votingStatus: {
    id: '1',
    isOpen: true,
    updatedAt: new Date(),
    updatedBy: 'admin',
  },
  
  toggleVoting: () => {
    set((state) => ({
      votingStatus: {
        ...state.votingStatus,
        isOpen: !state.votingStatus.isOpen,
        updatedAt: new Date(),
        updatedBy: state.currentUser?.username || 'system',
      },
    }));
    const newStatus = get().votingStatus.isOpen ? 'opened' : 'closed';
    get().addActivityLog(`Voting ${newStatus}`);
  },
  
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
  
  getVotePercentage: (candidateId) => {
    const total = get().getTotalVotes();
    if (total === 0) return 0;
    const candidate = get().candidates.find(c => c.id === candidateId);
    return candidate ? (candidate.voteCount / total) * 100 : 0;
  },
}));
