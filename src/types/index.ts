export type Category = 'king-queen' | 'prince-princess';
export type UserRole = 'admin' | 'vote_moderator' | 'user';
export type Gender = 'male' | 'female';

export interface UTSelection {
  id: string;
  name: string;
  gender: Gender;
  profileImg: string;
  category: Category;
  major: string;
  description: string;
  images: SelectionImage[];
  voteCount: number;
}

export interface SelectionImage {
  id: string;
  imageUrl: string;
  order: number;
  selectionId: string;
}

export interface Vote {
  id: string;
  userId: string;
  selectionId: string;
  votedAt: Date;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface VotingStatus {
  id: string;
  isOpen: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface SSEConnection {
  id: string;
  connectedAt: Date;
  duration: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  user: string;
}
