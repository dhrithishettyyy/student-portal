import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Subject, Topic, StudyTask, StudySession, ReRouteLog, 
  DemoStepState, GamificationLevel, VibeStatus 
} from '../types';
import { 
  getDemoScenarioData, loadFromStorage, saveToStorage, STORAGE_KEYS, clearAllStorage 
} from '../services/storage';
import { 
  handleTaskCompleted, handleTaskMissed, handleTaskPartiallyCompleted, 
  generateSmartSchedule, getTodayDateStr 
} from '../services/rerouteEngine';
import { getLevelForXp, calculateXpGain } from '../services/gamification';
import { analyzeStudyPlanWithAI, AIAnalysisResult } from '../services/geminiService';
import confetti from 'canvas-confetti';

export type ActiveTab = 
  | 'dashboard' 
  | 'study-plan' 
  | 'next-task' 
  | 'focus-mode' 
  | 'reroute-audit' 
  | 'subjects' 
  | 'progress' 
  | 'calendar' 
  | 'settings';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  subjects: Subject[];
  topics: Topic[];
  tasks: StudyTask[];
  sessions: StudySession[];
  logs: ReRouteLog[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeFocusTask: StudyTask | null;
  setActiveFocusTask: (task: StudyTask | null) => void;
  
  // ReRoute Actions
  completeTask: (taskId: string) => void;
  missTask: (taskId: string) => void;
  partialCompleteTask: (taskId: string, percent?: number) => void;
  rebuildSchedule: () => void;
  
  // Demo Mode
  demoStepState: DemoStepState;
  executeDemoStep: (step: number) => void;
  loadDemoScenario: () => void;
  resetAll: () => void;
  
  // Auth
  login: (name: string, email: string) => void;
  logout: () => void;
  updateUserHours: (hours: number) => void;

  // Subjects & Topics CRUD
  addSubject: (subject: Omit<Subject, 'id' | 'userId'>) => void;
  deleteSubject: (subjectId: string) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  updateTopic: (topic: Topic) => void;
  deleteTopic: (topicId: string) => void;

  // Computed state
  userLevel: GamificationLevel;
  nextBestTask: StudyTask | null;
  academicGlowUp: number; // overall progress percentage
  vibeStatus: VibeStatus;
  aiInsights: AIAnalysisResult | null;
  refreshAiInsights: () => void;
  
  // ReRoute Transition Modal
  isRerouteModalOpen: boolean;
  setIsRerouteModalOpen: (open: boolean) => void;
  latestRerouteLog: ReRouteLog | null;

  // Toast notifications
  toastMessage: { title: string; desc: string; type: 'success' | 'reroute' | 'warning' } | null;
  setToastMessage: (msg: { title: string; desc: string; type: 'success' | 'reroute' | 'warning' } | null) => void;
  showToast: (title: string, desc: string, type?: 'success' | 'reroute' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial demo data as baseline if empty
  const initialData = getDemoScenarioData();

  const [user, setUser] = useState<User | null>(() => 
    loadFromStorage<User | null>(STORAGE_KEYS.USER, initialData.user)
  );

  const [subjects, setSubjects] = useState<Subject[]>(() => 
    loadFromStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, initialData.subjects)
  );

  const [topics, setTopics] = useState<Topic[]>(() => 
    loadFromStorage<Topic[]>(STORAGE_KEYS.TOPICS, initialData.topics)
  );

  const [tasks, setTasks] = useState<StudyTask[]>(() => 
    loadFromStorage<StudyTask[]>(STORAGE_KEYS.TASKS, initialData.tasks)
  );

  const [sessions, setSessions] = useState<StudySession[]>(() => 
    loadFromStorage<StudySession[]>(STORAGE_KEYS.SESSIONS, [])
  );

  const [logs, setLogs] = useState<ReRouteLog[]>(() => 
    loadFromStorage<ReRouteLog[]>(STORAGE_KEYS.LOGS, initialData.logs)
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeFocusTask, setActiveFocusTask] = useState<StudyTask | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'reroute' | 'warning' } | null>(null);

  // Demo Walkthrough tracker for judges
  const [demoStepState, setDemoStepState] = useState<DemoStepState>({
    currentStep: 1,
    step1Completed: false,
    step2Completed: false,
    step3Completed: false,
    step4Completed: false
  });

  const [aiInsights, setAiInsights] = useState<AIAnalysisResult | null>(null);
  const [isRerouteModalOpen, setIsRerouteModalOpen] = useState(false);
  const [latestRerouteLog, setLatestRerouteLog] = useState<ReRouteLog | null>(null);

  // Save changes to storage
  useEffect(() => {
    if (user) saveToStorage(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
  }, [subjects]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TOPICS, topics);
  }, [topics]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LOGS, logs);
  }, [logs]);

  // Compute AI insights & vibe check whenever tasks/topics change
  const refreshAiInsights = async () => {
    const geminiKey = localStorage.getItem('reroute_gemini_api_key') || undefined;
    const result = await analyzeStudyPlanWithAI(subjects, topics, tasks, geminiKey);
    setAiInsights(result);
  };

  useEffect(() => {
    refreshAiInsights();
  }, [tasks, topics, subjects]);

  // Compute Gamification level
  const userLevel = getLevelForXp(user?.xp || 0);

  // Compute Academic Glow-Up (% syllabus progress)
  const academicGlowUp = topics.length > 0
    ? Math.round(topics.reduce((acc, t) => acc + t.progress, 0) / topics.length)
    : 0;

  // Next Best Task: highest priority pending task for today
  const todayStr = getTodayDateStr();
  const pendingTasksToday = tasks.filter(t => t.date === todayStr && t.status === 'Pending');
  const sortedPending = [...pendingTasksToday].sort((a, b) => b.priorityScore - a.priorityScore);
  const nextBestTask = sortedPending.length > 0 ? sortedPending[0] : (tasks.find(t => t.status === 'Pending') || null);

  // Compute Vibe Status
  const vibeStatus: VibeStatus = aiInsights?.vibeStatus || (
    tasks.some(t => t.status === 'Missed') ? 'SLIGHTLY COOKED' :
    tasks.filter(t => t.status === 'Completed').length >= 1 ? "YOU'RE COOKING" : 'GETTING THERE'
  );

  // Toast trigger (Respects Task 1 Visual Popup Alerts toggle)
  const showToast = (title: string, desc: string, type: 'success' | 'reroute' | 'warning' = 'reroute') => {
    const alertSetting = localStorage.getItem('reroute_popup_alerts');
    if (alertSetting === 'false') return;

    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4500);

    // Optional browser notification if user permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: desc });
      } catch (e) {}
    }
  };

  // ReRoute Action: Complete Task
  const completeTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const res = handleTaskCompleted(
      targetTask, 
      tasks, 
      topics, 
      subjects, 
      user?.availableStudyHours || 3
    );

    // Calculate XP
    const xpGained = calculateXpGain('Completed', targetTask.plannedDuration, targetTask.priorityLevel, user?.streak || 1);
    
    // Update State
    setTasks(res.updatedTasks);
    setTopics(res.updatedTopics);
    setLogs(prev => [res.log, ...prev]);

    if (user) {
      setUser({
        ...user,
        xp: user.xp + xpGained,
        rerouteCountThisWeek: user.rerouteCountThisWeek + 1
      });
    }

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast("🔄 Plan Rerouted — Today's W Locked!", `Marked "${targetTask.topicName}" as Cooked (+${xpGained} XP)`, 'success');
  };

  // ReRoute Action: Miss Task ("Fumbled")
  const missTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const res = handleTaskMissed(
      targetTask, 
      tasks, 
      topics, 
      subjects, 
      user?.availableStudyHours || 3
    );

    setTasks(res.updatedTasks);
    setTopics(res.updatedTopics);
    setLogs(prev => [res.log, ...prev]);

    if (user) {
      setUser({
        ...user,
        rerouteCountThisWeek: user.rerouteCountThisWeek + 1
      });
    }

    setLatestRerouteLog(res.log);
    setIsRerouteModalOpen(true);
    showToast("You fumbled. We rerouted. 🫡", `"${targetTask.topicName}" moved to tomorrow's top priority slot!`, 'reroute');
  };

  // ReRoute Action: Partial Complete Task
  const partialCompleteTask = (taskId: string, percent: number = 50) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const res = handleTaskPartiallyCompleted(
      targetTask, 
      tasks, 
      topics, 
      subjects, 
      percent, 
      user?.availableStudyHours || 3
    );

    const xpGained = calculateXpGain('Partially Completed', targetTask.plannedDuration, targetTask.priorityLevel, user?.streak || 1);

    setTasks(res.updatedTasks);
    setTopics(res.updatedTopics);
    setLogs(prev => [res.log, ...prev]);

    if (user) {
      setUser({
        ...user,
        xp: user.xp + xpGained,
        rerouteCountThisWeek: user.rerouteCountThisWeek + 1
      });
    }

    // PART 8 BUG FIX: Do NOT open the tomorrow-reschedule modal or claim shifted to tomorrow.
    // Simply confirm progress update:
    showToast("✅ Good job!", `Your task has been updated. Progress saved! (+${xpGained} XP)`, 'success');
  };

  // Manual Rebalance / Rebuild
  const rebuildSchedule = () => {
    const rebuilt = generateSmartSchedule(
      topics,
      subjects,
      (user?.availableStudyHours || 3) * 60,
      tasks
    );
    setTasks(rebuilt);
    showToast("🔄 Schedule Rebalanced", "All priorities recalculated based on latest deadlines and progress.", 'reroute');
  };

  // Execute Judge Demo Walkthrough Steps
  const executeDemoStep = (step: number) => {
    if (step === 1) {
      // Step 1: Mark DBMS as Completed
      const dbmsTask = tasks.find(t => t.subjectName === 'DBMS' && t.status === 'Pending');
      if (dbmsTask) {
        completeTask(dbmsTask.id);
        setDemoStepState(prev => ({ ...prev, currentStep: 2, step1Completed: true }));
      }
    } else if (step === 2) {
      // Step 2: Mark Java as Missed
      const javaTask = tasks.find(t => t.subjectName === 'Java' && t.status === 'Pending');
      if (javaTask) {
        missTask(javaTask.id);
        setDemoStepState(prev => ({ ...prev, currentStep: 3, step2Completed: true }));
      }
    } else if (step === 3) {
      // Step 3: Mark AI as Partially Completed
      const aiTask = tasks.find(t => t.subjectName === 'AI' && t.status === 'Pending');
      if (aiTask) {
        partialCompleteTask(aiTask.id, 50);
        setDemoStepState(prev => ({ ...prev, currentStep: 4, step3Completed: true, step4Completed: true }));
      }
    } else if (step === 4) {
      // Step 4: Open ReRoute Audit View
      setActiveTab('reroute-audit');
    }
  };

  // Reset Demo Scenario to baseline
  const loadDemoScenario = () => {
    const demo = getDemoScenarioData();
    setUser(demo.user);
    setSubjects(demo.subjects);
    setTopics(demo.topics);
    setTasks(demo.tasks);
    setLogs(demo.logs);
    setDemoStepState({
      currentStep: 1,
      step1Completed: false,
      step2Completed: false,
      step3Completed: false,
      step4Completed: false
    });
    showToast("Demo Scenario Loaded 🚀", "DBMS (3d, Hard), Java (7d, Med), AI (10d, Easy) loaded with 3 hrs/day", 'success');
  };

  const resetAll = () => {
    clearAllStorage();
    loadDemoScenario();
  };

  // Authentication
  const login = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      availableStudyHours: 3,
      xp: 150,
      streak: 1,
      lastActiveDate: getTodayDateStr(),
      rerouteCountThisWeek: 0
    };
    setUser(newUser);
    showToast("Welcome to ReRoute! 🔄", `Signed in as ${name}`, 'success');
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserHours = (hours: number) => {
    if (!user) return;
    setUser({ ...user, availableStudyHours: hours });
    // Rebalance with new hours
    const rebuilt = generateSmartSchedule(topics, subjects, hours * 60, tasks);
    setTasks(rebuilt);
    showToast("Study Hours Updated ⏰", `Adjusted daily capacity to ${hours} hours/day`, 'reroute');
  };

  // Subject & Topic CRUD
  const addSubject = (sub: Omit<Subject, 'id' | 'userId'>) => {
    const newSub: Subject = {
      ...sub,
      id: `sub-${Date.now()}`,
      userId: user?.id || 'demo'
    };
    setSubjects(prev => [...prev, newSub]);
    showToast("Subject Added 📚", `Created ${sub.name}`, 'success');
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setTopics(prev => prev.filter(t => t.subjectId !== subjectId));
    setTasks(prev => prev.filter(t => t.subjectId !== subjectId));
    showToast("Subject Deleted", "Subject and its topics removed.", 'warning');
  };

  const addTopic = (top: Omit<Topic, 'id'>) => {
    const newTop: Topic = {
      ...top,
      id: `top-${Date.now()}`
    };
    const updatedTopics = [...topics, newTop];
    setTopics(updatedTopics);
    // Regenerate tasks
    const rebuilt = generateSmartSchedule(
      updatedTopics,
      subjects,
      (user?.availableStudyHours || 3) * 60,
      tasks
    );
    setTasks(rebuilt);
    showToast("Topic Added 📝", `Added "${newTop.name}" and scheduled study slots`, 'reroute');
  };

  const updateTopic = (updated: Topic) => {
    const newTopics = topics.map(t => t.id === updated.id ? updated : t);
    setTopics(newTopics);
    const rebuilt = generateSmartSchedule(
      newTopics,
      subjects,
      (user?.availableStudyHours || 3) * 60,
      tasks
    );
    setTasks(rebuilt);
    showToast("Topic Updated", `Adjusted "${updated.name}" progress and recalculated priorities`, 'reroute');
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    setTasks(prev => prev.filter(t => t.topicId !== topicId));
    showToast("Topic Removed", "Topic removed from study plan.", 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        subjects,
        topics,
        tasks,
        sessions,
        logs,
        activeTab,
        setActiveTab,
        activeFocusTask,
        setActiveFocusTask,
        completeTask,
        missTask,
        partialCompleteTask,
        rebuildSchedule,
        demoStepState,
        executeDemoStep,
        loadDemoScenario,
        resetAll,
        login,
        logout,
        updateUserHours,
        addSubject,
        deleteSubject,
        addTopic,
        updateTopic,
        deleteTopic,
        userLevel,
        nextBestTask,
        academicGlowUp,
        vibeStatus,
        aiInsights,
        refreshAiInsights,
        toastMessage,
        setToastMessage,
        isRerouteModalOpen,
        setIsRerouteModalOpen,
        latestRerouteLog,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
