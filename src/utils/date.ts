/**
 * Date calculation and formatting utilities for EventAura
 */

export function calculateDaysRemaining(targetDateStr: string, referenceTime = Date.now()): number {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr).getTime();
  const diffTime = target - referenceTime;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function formatEventDate(targetDateStr: string): string {
  if (!targetDateStr) return '';
  const date = new Date(targetDateStr);
  if (isNaN(date.getTime())) return targetDateStr;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
