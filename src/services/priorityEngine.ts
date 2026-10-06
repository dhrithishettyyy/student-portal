import { Difficulty, PriorityLevel, Topic } from '../types';

export interface PriorityEvaluation {
  score: number;
  level: PriorityLevel;
  explanation: string;
  urgencyScore: number;
  difficultyScore: number;
  gapScore: number;
  workloadScore: number;
}

/**
 * Calculates days remaining until a given date string (YYYY-MM-DD)
 */
export function getDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculates an explainable, transparent priority score for a topic/task:
 * Score (0-100) = Deadline Urgency (0-40) + Difficulty (5-25) + Progress Gap (0-25) + Workload (0-10) + Missed Penalty (0-20)
 */
export function calculatePriority(
  topic: Topic,
  isMissed: boolean = false
): PriorityEvaluation {
  const daysUntilExam = getDaysRemaining(topic.examDate);
  const daysUntilAssignment = topic.assignmentDeadline ? getDaysRemaining(topic.assignmentDeadline) : 999;
  const mostUrgentDays = Math.min(daysUntilExam, daysUntilAssignment);

  // 1. Deadline Urgency (0 - 40 pts)
  let urgencyScore = 10;
  if (mostUrgentDays <= 1) {
    urgencyScore = 40;
  } else if (mostUrgentDays <= 3) {
    urgencyScore = 35;
  } else if (mostUrgentDays <= 5) {
    urgencyScore = 28;
  } else if (mostUrgentDays <= 7) {
    urgencyScore = 20;
  } else if (mostUrgentDays <= 14) {
    urgencyScore = 14;
  } else {
    urgencyScore = 8;
  }

  // 2. Difficulty (5 - 25 pts)
  let difficultyScore = 10;
  if (topic.difficulty === 'Hard') {
    difficultyScore = 25;
  } else if (topic.difficulty === 'Medium') {
    difficultyScore = 16;
  } else {
    difficultyScore = 7;
  }

  // 3. Progress Gap (0 - 25 pts)
  // Topics with 0-30% progress need drastically more immediate attention than topics at 80%
  const progressGap = Math.max(0, 100 - topic.progress);
  const gapScore = Math.round((progressGap / 100) * 25);

  // 4. Remaining Workload (0 - 10 pts)
  // Higher estimated study minutes means more pressure to start early
  const workloadScore = Math.min(10, Math.round((topic.estimatedMinutes / 180) * 10));

  // 5. Missed Boost: When a task was missed, it gets a massive +20 urgency boost so it re-ranks at the top!
  const missedBoost = isMissed ? 20 : 0;

  // Total raw score capped between 5 and 100
  const rawScore = urgencyScore + difficultyScore + gapScore + workloadScore + missedBoost;
  const finalScore = Math.min(100, Math.max(5, rawScore));

  // Determine Level
  let level: PriorityLevel = 'Low';
  if (finalScore >= 68) {
    level = 'High';
  } else if (finalScore >= 38) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  // Generate transparent human & AI explainability text
  const reasonParts: string[] = [];

  if (isMissed) {
    reasonParts.push('Fumbled earlier 💀 (Priority Boosted)');
  }

  if (mostUrgentDays <= 3) {
    reasonParts.push(`Exam in ${mostUrgentDays <= 0 ? 'TODAY' : `${mostUrgentDays} days`} 🔥`);
  } else if (mostUrgentDays <= 7) {
    reasonParts.push(`Exam in ${mostUrgentDays} days`);
  } else {
    reasonParts.push(`Exam in ${mostUrgentDays} days`);
  }

  if (topic.progress < 40) {
    reasonParts.push(`Low progress (${topic.progress}%)`);
  } else if (topic.progress < 75) {
    reasonParts.push(`Moderate progress (${topic.progress}%)`);
  } else {
    reasonParts.push(`High progress (${topic.progress}%)`);
  }

  if (topic.difficulty === 'Hard') {
    reasonParts.push('Hard difficulty');
  } else if (topic.difficulty === 'Medium') {
    reasonParts.push('Medium difficulty');
  }

  const explanation = `Why ${level} Priority? ${reasonParts.join(' + ')}`;

  return {
    score: finalScore,
    level,
    explanation,
    urgencyScore,
    difficultyScore,
    gapScore,
    workloadScore
  };
}
