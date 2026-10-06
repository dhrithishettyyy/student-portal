import { StudyTask, Topic, Subject, ReRouteLog, TaskStatus } from '../types';
import { calculatePriority } from './priorityEngine';

export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getDateOffsetStr(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function formatDatePretty(dateStr: string): string {
  const today = getTodayDateStr();
  const tomorrow = getDateOffsetStr(1);
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  return dateStr;
}

export interface ReRouteResult {
  updatedTasks: StudyTask[];
  updatedTopics: Topic[];
  log: ReRouteLog;
}

/**
 * Builds the initial or rebuilt schedule across multiple days
 * strictly respecting availableStudyHours per day (e.g., 3 hours = 180 min max per day).
 */
export function generateSmartSchedule(
  topics: Topic[],
  subjects: Subject[],
  dailyMaxMinutes: number = 180,
  existingTasks: StudyTask[] = [],
  horizonDays: number = 7
): StudyTask[] {
  const subjectsMap = new Map<string, Subject>();
  subjects.forEach(s => subjectsMap.set(s.id, s));

  // Identify completed or partially completed topic workload
  // Only topics with progress < 100 need tasks scheduled
  const activeTopics = topics.filter(t => t.progress < 100);

  // Preserve existing completed tasks or tasks from earlier dates
  const todayStr = getTodayDateStr();
  const preservedTasks = existingTasks.filter(task => {
    // Keep all completed tasks
    if (task.status === 'Completed') return true;
    // Keep tasks from past dates
    if (task.date < todayStr) return true;
    return false;
  });

  const preservedTopicIdsCompleted = new Set(
    topics.filter(t => t.progress >= 100).map(t => t.id)
  );

  // Group pending or missed tasks that need rescheduling
  const tasksToSchedule: Array<{
    topic: Topic;
    subject: Subject;
    remainingMinutes: number;
    isMissed: boolean;
    originalTask?: StudyTask;
  }> = [];

  for (const topic of activeTopics) {
    if (preservedTopicIdsCompleted.has(topic.id)) continue;
    const subject = subjectsMap.get(topic.subjectId) || {
      id: topic.subjectId,
      userId: '',
      name: 'General',
      color: '#6366f1'
    };

    // Check if there was an existing pending or missed task for this topic today/upcoming
    const existingForTopic = existingTasks.find(
      t => t.topicId === topic.id && (t.status === 'Pending' || t.status === 'Missed')
    );

    const isMissed = existingForTopic?.status === 'Missed';
    
    // Calculate remaining minutes based on topic progress
    // e.g. estimatedMinutes * (100 - progress)%
    const calculatedMinutesLeft = Math.max(
      30,
      Math.round((topic.estimatedMinutes * (100 - topic.progress)) / 100 / 15) * 15
    );

    // If existing task has a planned duration, use the minimum of that or calculated
    const remainingMinutes = existingForTopic?.plannedDuration || calculatedMinutesLeft;

    tasksToSchedule.push({
      topic,
      subject,
      remainingMinutes,
      isMissed,
      originalTask: existingForTopic
    });
  }

  // Sort tasks by Priority Score descending (highest priority first)
  tasksToSchedule.sort((a, b) => {
    const prioA = calculatePriority(a.topic, a.isMissed).score;
    const prioB = calculatePriority(b.topic, b.isMissed).score;
    return prioB - prioA;
  });

  // Schedule tasks across days respecting dailyMaxMinutes
  const scheduledTasks: StudyTask[] = [...preservedTasks];
  const dayMinutesUsed: { [dateStr: string]: number } = {};

  // Initialize day minutes with any already preserved tasks on those days
  for (let d = 0; d < horizonDays; d++) {
    const dStr = getDateOffsetStr(d);
    const used = preservedTasks
      .filter(t => t.date === dStr)
      .reduce((sum, t) => sum + (t.actualDuration || t.plannedDuration), 0);
    dayMinutesUsed[dStr] = used;
  }

  for (const item of tasksToSchedule) {
    let minutesLeftToDistribute = item.remainingMinutes;
    const prio = calculatePriority(item.topic, item.isMissed);

    // Try placing into days starting from today (or tomorrow if missed)
    const startDayOffset = item.isMissed ? 1 : 0;

    for (let dayOffset = startDayOffset; dayOffset < horizonDays && minutesLeftToDistribute > 0; dayOffset++) {
      const dateStr = getDateOffsetStr(dayOffset);
      const currentUsed = dayMinutesUsed[dateStr] || 0;
      const availableToday = Math.max(0, dailyMaxMinutes - currentUsed);

      if (availableToday >= 30) {
        // Can fit a chunk
        const chunk = Math.min(minutesLeftToDistribute, availableToday, 90); // max 90 min per chunk
        minutesLeftToDistribute -= chunk;
        dayMinutesUsed[dateStr] = (dayMinutesUsed[dateStr] || 0) + chunk;

        const taskId = item.originalTask && item.originalTask.date === dateStr
          ? item.originalTask.id
          : `task-${item.topic.id}-${dateStr}-${Date.now().toString().slice(-4)}`;

        scheduledTasks.push({
          id: taskId,
          topicId: item.topic.id,
          subjectId: item.subject.id,
          subjectName: item.subject.name,
          topicName: item.topic.name,
          date: dateStr,
          plannedDuration: chunk,
          priorityScore: prio.score,
          priorityLevel: prio.level,
          priorityExplanation: prio.explanation,
          status: 'Pending',
          difficulty: item.topic.difficulty,
          reroutedFrom: item.isMissed ? getTodayDateStr() : undefined,
          isMissedRescheduled: item.isMissed
        });
      }
    }
  }

  return scheduledTasks;
}

/**
 * Handle marking a task as COMPLETED
 * - Increases topic progress (up to 100%)
 * - Removes completed workload from upcoming schedule
 * - Recalculates remaining priorities
 * - Generates clear ReRoute log
 */
export function handleTaskCompleted(
  task: StudyTask,
  allTasks: StudyTask[],
  allTopics: Topic[],
  allSubjects: Subject[],
  dailyMaxHours: number = 3
): ReRouteResult {
  const dailyMaxMinutes = dailyMaxHours * 60;
  const now = new Date();
  
  // 1. Update topic progress
  const updatedTopics = allTopics.map(t => {
    if (t.id === task.topicId) {
      // Calculate new progress. If completing a task that was 90m of 120m, advance progress
      const newProgress = Math.min(100, Math.max(t.progress + 40, 95));
      return {
        ...t,
        progress: newProgress,
        status: (newProgress >= 100 ? 'Completed' : 'In Progress') as Topic['status']
      };
    }
    return t;
  });

  // 2. Mark this specific task as Completed
  const updatedThisTask: StudyTask = {
    ...task,
    status: 'Completed',
    actualDuration: task.plannedDuration,
    completedAt: now.toISOString()
  };

  const remainingTasks = allTasks.map(t => t.id === task.id ? updatedThisTask : t);

  // 3. Rebuild future schedule with completed workload removed
  const rebuiltTasks = generateSmartSchedule(
    updatedTopics,
    allSubjects,
    dailyMaxMinutes,
    remainingTasks
  );

  const genzQuotes = [
    "Today's W locked in! 🏆 One less exam demon to fight.",
    "Cooked with absolute precision! Schedule cleaned up. 🚀",
    "Massive academic weapon behavior! ⚔️ Freed up future study time."
  ];

  const log: ReRouteLog = {
    id: `log-${Date.now()}`,
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    triggerEvent: 'Task Completed ✅',
    taskTitle: task.topicName,
    subjectTitle: task.subjectName,
    actionTaken: 'Completed workload permanently removed & priorities recalculated',
    changesSummary: [
      `Marked "${task.topicName}" as 100% Cooked (Completed)`,
      `Removed ${task.plannedDuration} min workload from future schedule`,
      `Overall progress increased & schedule rebalanced`
    ],
    genzQuote: genzQuotes[Math.floor(Math.random() * genzQuotes.length)],
    beforeOverview: `${task.subjectName} had ${task.plannedDuration}m pending today`,
    afterOverview: `Freed up ${task.plannedDuration}m capacity for upcoming days`
  };

  return {
    updatedTasks: rebuiltTasks,
    updatedTopics,
    log
  };
}

/**
 * Handle marking a task as MISSED ("Fumbled")
 * - Unfinished workload is preserved
 * - Urgency & priority boosted
 * - Moved automatically to tomorrow's first available study slot
 * - Non-urgent tasks shifted forward if daily limit is reached
 */
export function handleTaskMissed(
  task: StudyTask,
  allTasks: StudyTask[],
  allTopics: Topic[],
  allSubjects: Subject[],
  dailyMaxHours: number = 3
): ReRouteResult {
  const dailyMaxMinutes = dailyMaxHours * 60;
  const now = new Date();

  // 1. Mark current task as Missed for today's record
  const missedTaskToday: StudyTask = {
    ...task,
    status: 'Missed',
    actualDuration: 0,
    completedAt: now.toISOString()
  };

  // 2. Topics remain with current progress, but the topic's urgency spikes
  const updatedTopics = [...allTopics];

  // 3. Mark the task as missed in current list
  const intermediateTasks = allTasks.map(t => t.id === task.id ? missedTaskToday : t);

  // 4. Create rescheduled task for tomorrow with boosted priority
  const tomorrowStr = getDateOffsetStr(1);
  const targetTopic = allTopics.find(t => t.id === task.topicId);
  const boostedPrio = targetTopic 
    ? calculatePriority(targetTopic, true)
    : { score: 95, level: 'High' as const, explanation: 'Why High Priority? Fumbled task 💀 + Urgency boosted' };

  // Remove any future duplicate pending for this topic
  const cleanedTasks = intermediateTasks.filter(
    t => !(t.topicId === task.topicId && t.date >= tomorrowStr && t.status === 'Pending')
  );

  const rescheduledTask: StudyTask = {
    id: `rescheduled-${task.topicId}-${tomorrowStr}-${Date.now().toString().slice(-4)}`,
    topicId: task.topicId,
    subjectId: task.subjectId,
    subjectName: task.subjectName,
    topicName: task.topicName,
    date: tomorrowStr,
    plannedDuration: task.plannedDuration,
    priorityScore: Math.min(100, boostedPrio.score + 15),
    priorityLevel: 'High',
    priorityExplanation: `Why High Priority? Missed yesterday 💀 + Urgency automatically elevated + Exam closer`,
    status: 'Pending',
    difficulty: task.difficulty,
    reroutedFrom: getTodayDateStr(),
    isMissedRescheduled: true
  };

  // Filter out any lower priority pending task tomorrow if it would exceed daily study hours
  const tomorrowExistingDuration = cleanedTasks
    .filter(t => t.date === tomorrowStr && t.status === 'Pending')
    .reduce((sum, t) => sum + t.plannedDuration, 0);

  let finalTasks = [...cleanedTasks, rescheduledTask];

  // Re-run the schedule generator to smoothly slide non-urgent tasks into subsequent days
  finalTasks = generateSmartSchedule(
    updatedTopics,
    allSubjects,
    dailyMaxMinutes,
    finalTasks
  );

  const genzQuotes = [
    "You fell behind. We rebuilt the plan. 🔄 No panic, we bounce back.",
    "We fumbled this one 💀 but ReRoute just put it at top priority for tomorrow.",
    "L took today, but your comeback plan is ready. 🚀 Lock in tomorrow."
  ];

  const log: ReRouteLog = {
    id: `log-${Date.now()}`,
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    triggerEvent: 'Task Missed (Fumbled 💀)',
    taskTitle: task.topicName,
    subjectTitle: task.subjectName,
    actionTaken: `Automatically rerouted to Tomorrow (${tomorrowStr}) with elevated priority`,
    changesSummary: [
      `Preserved ${task.plannedDuration} min unfinished study workload`,
      `Boosted priority score to ${Math.min(100, boostedPrio.score + 15)} (High Priority 🔴)`,
      `Rescheduled into Tomorrow's priority slot without exceeding ${dailyMaxHours}h limit`,
      `Shifted lower-urgency tasks forward to prevent academic burnout`
    ],
    genzQuote: genzQuotes[Math.floor(Math.random() * genzQuotes.length)],
    beforeOverview: `Missed today at ${task.plannedDuration} mins`,
    afterOverview: `Shifted to tomorrow's #1 slot, future days balanced`
  };

  return {
    updatedTasks: finalTasks,
    updatedTopics,
    log
  };
}

/**
 * Handle marking a task as PARTIALLY COMPLETED
 * - Calculates completed portion vs remaining
 * - Updates topic progress partially
 * - Slices unfinished duration into future slot
 * - Recalculates schedule
 */
export function handleTaskPartiallyCompleted(
  task: StudyTask,
  allTasks: StudyTask[],
  allTopics: Topic[],
  allSubjects: Subject[],
  completionPercent: number = 50,
  dailyMaxHours: number = 3
): ReRouteResult {
  const dailyMaxMinutes = dailyMaxHours * 60;
  const now = new Date();

  const completedMinutes = Math.round((task.plannedDuration * completionPercent) / 100);
  const remainingMinutes = Math.max(20, task.plannedDuration - completedMinutes);

  // 1. Update topic progress
  const updatedTopics = allTopics.map(t => {
    if (t.id === task.topicId) {
      const addedProgress = Math.round((completedMinutes / Math.max(60, t.estimatedMinutes)) * 40);
      return {
        ...t,
        progress: Math.min(95, t.progress + Math.max(10, addedProgress)),
        status: 'In Progress' as Topic['status']
      };
    }
    return t;
  });

  // 2. Mark this task as Partially Completed
  const partialTask: StudyTask = {
    ...task,
    status: 'Partially Completed',
    actualDuration: completedMinutes,
    completedAt: now.toISOString()
  };

  // 3. Move remaining minutes to tomorrow or next available day
  const tomorrowStr = getDateOffsetStr(1);
  const targetTopic = updatedTopics.find(t => t.id === task.topicId)!;
  const updatedPrio = calculatePriority(targetTopic);

  const remainderTask: StudyTask = {
    id: `partial-remainder-${task.topicId}-${tomorrowStr}-${Date.now().toString().slice(-4)}`,
    topicId: task.topicId,
    subjectId: task.subjectId,
    subjectName: task.subjectName,
    topicName: `${task.topicName} (Part 2)`,
    date: tomorrowStr,
    plannedDuration: remainingMinutes,
    priorityScore: updatedPrio.score,
    priorityLevel: updatedPrio.level,
    priorityExplanation: `Why ${updatedPrio.level} Priority? Unfinished work (${remainingMinutes}m remaining) + Exam in ${targetTopic.examDate}`,
    status: 'Pending',
    difficulty: task.difficulty,
    reroutedFrom: getTodayDateStr()
  };

  const tasksWithPartial = allTasks.map(t => t.id === task.id ? partialTask : t);
  const tasksWithRemainder = [...tasksWithPartial, remainderTask];

  const rebuiltTasks = generateSmartSchedule(
    updatedTopics,
    allSubjects,
    dailyMaxMinutes,
    tasksWithRemainder
  );

  const genzQuotes = [
    "Halfway cooked is still cooking! 🍳 Remainder scheduled seamlessly.",
    "Solid effort! Remaining work shifted into tomorrow's plan.",
    "Progress is progress. ReRoute saved the rest for tomorrow. 🔄"
  ];

  const log: ReRouteLog = {
    id: `log-${Date.now()}`,
    timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    triggerEvent: 'Partially Completed (Partially Cooked 😐)',
    taskTitle: task.topicName,
    subjectTitle: task.subjectName,
    actionTaken: `Recorded ${completedMinutes}m done, shifted remaining ${remainingMinutes}m to tomorrow`,
    changesSummary: [
      `Logged ${completedMinutes}m of ${task.plannedDuration}m completed`,
      `Updated topic progress to ${updatedTopics.find(t => t.id === task.topicId)?.progress}%`,
      `Created adaptive Part 2 task (${remainingMinutes}m) in tomorrow's schedule`,
      `Rebalanced remaining study week`
    ],
    genzQuote: genzQuotes[Math.floor(Math.random() * genzQuotes.length)],
    beforeOverview: `${task.plannedDuration} mins scheduled today`,
    afterOverview: `${completedMinutes}m completed today + ${remainingMinutes}m rerouted to tomorrow`
  };

  return {
    updatedTasks: rebuiltTasks,
    updatedTopics,
    log
  };
}
