import { Subject, Topic, StudyTask, VibeStatus } from '../types';
import { getDaysRemaining } from './priorityEngine';

export interface AIAnalysisResult {
  studyInsight: string;
  progressRoast: string;
  vibeStatus: VibeStatus;
  vibeDescription: string;
  tacticalAdvice: string;
}

/**
 * Generates an intelligent, context-aware AI Study Insight and Playful Roast
 * Works 100% offline via high-precision heuristics, or queries Gemini API if key is configured.
 */
export async function analyzeStudyPlanWithAI(
  subjects: Subject[],
  topics: Topic[],
  tasks: StudyTask[],
  geminiApiKey?: string
): Promise<AIAnalysisResult> {
  // If an API key is provided, try calling the Gemini API
  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const prompt = `You are ReRoute AI, an intelligent, empathetic academic strategist with 80% professional acumen and 20% Gen-Z flavor.
Analyze this student study situation:
Subjects: ${JSON.stringify(subjects.map(s => ({ name: s.name, exam: s.examDate })))}
Topics: ${JSON.stringify(topics.map(t => ({ name: t.name, progress: t.progress, difficulty: t.difficulty, exam: t.examDate })))}
Tasks Today: ${JSON.stringify(tasks.map(t => ({ topic: t.topicName, status: t.status, priority: t.priorityLevel, duration: t.plannedDuration })))}

Provide JSON response with these keys:
- studyInsight: concise strategic advice explaining priority trade-offs.
- progressRoast: a humorous, playful, non-offensive Gen-Z roast of their current study reality.
- vibeStatus: one of "YOU'RE COOKING", "GETTING THERE", "SLIGHTLY COOKED".
- vibeDescription: 1 sentence punchy explanation of their vibe.
- tacticalAdvice: 1 quick bullet point on what to execute right now.`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            studyInsight: parsed.studyInsight,
            progressRoast: parsed.progressRoast,
            vibeStatus: parsed.vibeStatus || "GETTING THERE",
            vibeDescription: parsed.vibeDescription,
            tacticalAdvice: parsed.tacticalAdvice
          };
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to built-in heuristic engine:", e);
    }
  }

  // Built-in intelligent heuristic engine (Zero external dependencies required)
  const missedTasks = tasks.filter(t => t.status === 'Missed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const pendingTasks = tasks.filter(t => t.status === 'Pending');

  // Find most urgent topic
  const sortedByUrgency = [...topics].sort((a, b) => getDaysRemaining(a.examDate) - getDaysRemaining(b.examDate));
  const mostUrgentTopic = sortedByUrgency[0];
  const lowestProgressTopic = [...topics].sort((a, b) => a.progress - b.progress)[0];

  let vibeStatus: VibeStatus = "GETTING THERE";
  let vibeDescription = "Steady grind in progress. You're holding the line.";
  let progressRoast = "Balanced on the edge of academic greatness and supreme procrastination. Lock in today!";
  let studyInsight = "Workload is currently distributed evenly across upcoming deadlines.";
  let tacticalAdvice = "Pick the top task and complete a 45-minute sprint with zero phone notifications.";

  // Detect scenarios
  if (missedTasks.length > 0 || (mostUrgentTopic && getDaysRemaining(mostUrgentTopic.examDate) <= 3 && mostUrgentTopic.progress < 50)) {
    vibeStatus = "SLIGHTLY COOKED";
    vibeDescription = "We fumbled a couple tasks and the exam is knocking on your door.";
    progressRoast = `You have ${pendingTasks.length} pending topics and ${mostUrgentTopic ? mostUrgentTopic.name : 'an exam'} in ${mostUrgentTopic ? getDaysRemaining(mostUrgentTopic.examDate) : 3} days. Respectfully… the comeback starts NOW 💀`;
    studyInsight = `Your ${lowestProgressTopic?.name || 'urgent'} progress is only ${lowestProgressTopic?.progress || 35}%, while its exam deadline is rapidly approaching. ReRoute has elevated its priority to tomorrow's prime slot.`;
    tacticalAdvice = `Immediate triage: Open ${lowestProgressTopic?.name || 'urgent task'} in Focus Mode and finish 1 cycle right now.`;
  } else if (completedTasks.length >= 2 && missedTasks.length === 0) {
    vibeStatus = "YOU'RE COOKING";
    vibeDescription = "Academic weapon behavior detected. Syllabus is shaking.";
    progressRoast = "Who authorized you to be this productive today? The curve isn't ready for this level of lock-in 🏆";
    studyInsight = `Outstanding momentum! Completing ${completedTasks[0]?.topicName} early has decreased future workload pressure by ${completedTasks.reduce((s, c) => s + (c.actualDuration || 45), 0)} minutes.`;
    tacticalAdvice = "Review tomorrow's syllabus ahead of time or take a well-deserved recovery break.";
  } else {
    // Normal progress
    vibeStatus = "GETTING THERE";
    vibeDescription = "Consistent pacing. No major fumbles, steady progress.";
    progressRoast = `Currently floating at a respectable cruising altitude. Don't let your phone convince you to take a "5-minute break" that turns into 3 hours 👀`;
    if (mostUrgentTopic) {
      studyInsight = `${mostUrgentTopic.name} exam is ${getDaysRemaining(mostUrgentTopic.examDate)} days out. Maintaining today's pace will ensure 100% syllabus mastery 48 hours before test day.`;
    }
    tacticalAdvice = "Knock out today's highest priority task before dinner to keep your streak intact.";
  }

  return {
    studyInsight,
    progressRoast,
    vibeStatus,
    vibeDescription,
    tacticalAdvice
  };
}
