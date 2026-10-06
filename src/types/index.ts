export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type TaskStatus = 'Pending' | 'Completed' | 'Partially Completed' | 'Missed';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type VibeStatus = "YOU'RE COOKING" | "GETTING THERE" | "SLIGHTLY COOKED";

export interface User {
  id: string;
  name: string;
  email: string;
  availableStudyHours: number; // e.g. 3 (hours per day)
  xp: number;
  streak: number;
  lastActiveDate: string;
  rerouteCountThisWeek: number;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string;
  color: string;
  icon?: string;
  examDate?: string; // YYYY-MM-DD
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: Difficulty;
  progress: number; // 0 to 100
  estimatedMinutes: number; // e.g. 120 (2 hours)
  examDate: string; // YYYY-MM-DD
  assignmentDeadline?: string;
  notes?: string;
  status?: 'Not Started' | 'In Progress' | 'Completed';
}

export interface StudyTask {
  id: string;
  topicId: string;
  subjectId: string;
  subjectName: string;
  topicName: string;
  date: string; // YYYY-MM-DD
  plannedDuration: number; // minutes
  actualDuration?: number;
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  priorityExplanation: string;
  status: TaskStatus;
  difficulty: Difficulty;
  completedAt?: string;
  reroutedFrom?: string; // date it was originally scheduled on
  isMissedRescheduled?: boolean;
}

export interface StudySession {
  id: string;
  taskId: string;
  topicId: string;
  subjectName: string;
  topicName: string;
  startTime: string;
  duration: number; // minutes
  result: 'Completed' | 'Partially Completed' | 'Missed';
  notes?: string;
  xpEarned: number;
}

export interface ReRouteLog {
  id: string;
  timestamp: string;
  triggerEvent: string;
  taskTitle: string;
  subjectTitle: string;
  actionTaken: string;
  changesSummary: string[];
  genzQuote: string;
  beforeOverview?: string;
  afterOverview?: string;
}

export interface GamificationLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badge: string;
}

export interface DemoStepState {
  currentStep: number;
  step1Completed: boolean;
  step2Completed: boolean;
  step3Completed: boolean;
  step4Completed: boolean;
}
