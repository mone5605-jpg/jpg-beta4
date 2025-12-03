
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  SOCIAL = 'SOCIAL',
  GROWTH = 'GROWTH',
  QUEST = 'QUEST'
}

export enum Mood {
  GREAT = 'great',
  OKAY = 'okay',
  TIRED = 'tired',
  ANXIOUS = 'anxious',
  DOWN = 'down'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  xp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  feedback?: {
    score: number;
    advice: string;
  };
}

export interface UserStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streak: number;
  totalTasks: number;
  outdoorLevel: number; // Added for Exploration Quest
}
