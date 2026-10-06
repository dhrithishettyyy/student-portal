import { User, Subject, Topic, StudyTask, StudySession, ReRouteLog } from '../types';
import { getTodayDateStr, getDateOffsetStr } from './rerouteEngine';

const STORAGE_KEYS = {
  USER: 'reroute_user_v1',
  SUBJECTS: 'reroute_subjects_v1',
  TOPICS: 'reroute_topics_v1',
  TASKS: 'reroute_tasks_v1',
  SESSIONS: 'reroute_sessions_v1',
  LOGS: 'reroute_logs_v1',
  DEMO_MODE: 'reroute_demo_mode_v1'
};

/**
 * Creates the exact Hackathon Demo Scenario requested in Section 18:
 * - DBMS (Exam in 3 days, Hard, 35% progress) -> 90 min (High Priority)
 * - Java (Exam in 7 days, Medium, 60% progress) -> 60 min (Medium Priority)
 * - AI (Exam in 10 days, Easy, 80% progress) -> 30 min (Low Priority)
 * Total: 3 hours/day (180 mins)
 */
export function getDemoScenarioData(): {
  user: User;
  subjects: Subject[];
  topics: Topic[];
  tasks: StudyTask[];
  logs: ReRouteLog[];
} {
  const today = getTodayDateStr();

  const user: User = {
    id: 'demo-student-001',
    name: 'Alex Chen',
    email: 'alex@reroute.ai',
    availableStudyHours: 3,
    xp: 640,
    streak: 4,
    lastActiveDate: today,
    rerouteCountThisWeek: 2
  };

  const subjects: Subject[] = [
    {
      id: 'sub-dbms',
      userId: user.id,
      name: 'DBMS',
      code: 'CS301',
      color: '#ef4444', // Red
      examDate: getDateOffsetStr(3)
    },
    {
      id: 'sub-java',
      userId: user.id,
      name: 'Java',
      code: 'CS204',
      color: '#eab308', // Amber/Yellow
      examDate: getDateOffsetStr(7)
    },
    {
      id: 'sub-ai',
      userId: user.id,
      name: 'AI',
      code: 'CS410',
      color: '#10b981', // Emerald/Green
      examDate: getDateOffsetStr(10)
    }
  ];

  const topics: Topic[] = [
    {
      id: 'top-dbms-norm',
      subjectId: 'sub-dbms',
      name: 'Normalization',
      difficulty: 'Hard',
      progress: 35,
      estimatedMinutes: 180,
      examDate: getDateOffsetStr(3),
      assignmentDeadline: getDateOffsetStr(2),
      notes: '1NF, 2NF, 3NF, BCNF and multi-valued dependencies'
    },
    {
      id: 'top-java-graphs',
      subjectId: 'sub-java',
      name: 'Graph Algorithms',
      difficulty: 'Medium',
      progress: 60,
      estimatedMinutes: 120,
      examDate: getDateOffsetStr(7),
      notes: 'BFS, DFS, Dijkstra, and cycle detection'
    },
    {
      id: 'top-ai-intro',
      subjectId: 'sub-ai',
      name: 'Introduction',
      difficulty: 'Easy',
      progress: 80,
      estimatedMinutes: 60,
      examDate: getDateOffsetStr(10),
      notes: 'State-space search, heuristics, and agent types'
    }
  ];

  const tasks: StudyTask[] = [
    {
      id: 'demo-task-dbms-1',
      topicId: 'top-dbms-norm',
      subjectId: 'sub-dbms',
      subjectName: 'DBMS',
      topicName: 'Normalization',
      date: today,
      plannedDuration: 90,
      priorityScore: 92,
      priorityLevel: 'High',
      priorityExplanation: 'Why High Priority? Exam in 3 days 🔥 + Low progress (35%) + Hard difficulty',
      status: 'Pending',
      difficulty: 'Hard'
    },
    {
      id: 'demo-task-java-1',
      topicId: 'top-java-graphs',
      subjectId: 'sub-java',
      subjectName: 'Java',
      topicName: 'Graph Algorithms',
      date: today,
      plannedDuration: 60,
      priorityScore: 62,
      priorityLevel: 'Medium',
      priorityExplanation: 'Why Medium Priority? Exam in 7 days + Moderate progress (60%) + Medium difficulty',
      status: 'Pending',
      difficulty: 'Medium'
    },
    {
      id: 'demo-task-ai-1',
      topicId: 'top-ai-intro',
      subjectId: 'sub-ai',
      subjectName: 'AI',
      topicName: 'Introduction',
      date: today,
      plannedDuration: 30,
      priorityScore: 28,
      priorityLevel: 'Low',
      priorityExplanation: 'Why Low Priority? Exam in 10 days + High progress (80%) + Easy difficulty',
      status: 'Pending',
      difficulty: 'Easy'
    }
  ];

  const logs: ReRouteLog[] = [
    {
      id: 'log-init',
      timestamp: '09:00 AM',
      triggerEvent: 'Plan Initialized 🔄',
      taskTitle: 'Full Academic Workload',
      subjectTitle: '3 Subjects',
      actionTaken: 'Calculated initial optimal 3-hour daily distribution',
      changesSummary: [
        'Balanced 90 min DBMS (Urgent), 60 min Java, 30 min AI',
        'Respects strict 3.0 hr daily maximum study ceiling',
        'Prioritized hard deadline in 3 days'
      ],
      genzQuote: 'Your battle plan is cooked. Time to lock in 🔒'
    }
  ];

  return { user, subjects, topics, tasks, logs };
}

// Storage helpers
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}

export { STORAGE_KEYS };
