export enum ItemStatus {
  AVAILABLE = 'available',
  COLLECTED = 'collected',
  ARCHIVED = 'archived',
}

export enum UserRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface LostItem {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  dateFound: string;
  location: string;
  privateNote?: string;
  teacherName?: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  role: UserRole;
  email: string;
}
