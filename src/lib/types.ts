// lib/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  level: number;
  experience: number;
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  experienceReward: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface DefaultMission {
  id: string;
  title: string;
  description: string;
  experienceReward: number;
}
