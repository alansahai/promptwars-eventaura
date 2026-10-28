/**
 * Input sanitization and security utility for EventAura
 * Prevents XSS, script injection, and malicious payload rendering in DOM.
 */

export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizePlanTitle(title: string): string {
  if (!title) return '';
  return sanitizeString(title.trim().slice(0, 120));
}

export function sanitizeNotes(notes: string): string {
  if (!notes) return '';
  return sanitizeString(notes.trim().slice(0, 500));
}
