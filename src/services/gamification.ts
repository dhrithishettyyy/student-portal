import { GamificationLevel, PriorityLevel } from '../types';

export const LEVELS: GamificationLevel[] = [
  { level: 1, title: 'Procrastination Era 💀', minXp: 0, maxXp: 200, badge: '💀' },
  { level: 2, title: 'Trying My Best 🥲', minXp: 200, maxXp: 500, badge: '🥲' },
  { level: 3, title: 'Getting Serious 👀', minXp: 500, maxXp: 900, badge: '👀' },
  { level: 4, title: 'Locked In 🔒', minXp: 900, maxXp: 1600, badge: '🔒' },
  { level: 5, title: 'Academic Weapon ⚔️', minXp: 1600, maxXp: 2600, badge: '⚔️' },
  { level: 6, title: 'Final Boss Mode 👑', minXp: 2600, maxXp: 99999, badge: '👑' }
];

export function getLevelForXp(xp: number): GamificationLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function calculateXpGain(
  status: 'Completed' | 'Partially Completed' | 'Missed',
  durationMinutes: number,
  priorityLevel: PriorityLevel,
  currentStreak: number
): number {
  if (status === 'Missed') return 0;

  let baseXp = status === 'Completed' ? 50 : 25;
  // duration bonus: +5 xp per 15 min block
  baseXp += Math.floor(durationMinutes / 15) * 5;

  // priority bonus
  if (priorityLevel === 'High') baseXp += 25;
  else if (priorityLevel === 'Medium') baseXp += 15;
  else baseXp += 5;

  // streak multiplier (e.g. 5% bonus per streak day, up to +50%)
  const streakMultiplier = 1 + Math.min(0.5, (currentStreak * 0.05));
  return Math.round(baseXp * streakMultiplier);
}
