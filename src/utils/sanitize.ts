/**
 * Input sanitization and security utility for EventAura
 * Prevents XSS, script injection, and malicious payload rendering in DOM.
 */

/** Escapes all HTML special characters to their safe entity equivalents. */
export function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/** Trims and enforces max-120-char limit on event plan titles. */
export function sanitizePlanTitle(title: string): string {
  if (!title) return '';
  return sanitizeString(title.trim().slice(0, 120));
}

/** Trims and enforces max-500-char limit on freeform notes and accessibility fields. */
export function sanitizeNotes(notes: string): string {
  if (!notes) return '';
  return sanitizeString(notes.trim().slice(0, 500));
}

/** Strips non-printable control characters from vendor or location text. */
export function sanitizeLocation(location: string): string {
  if (!location) return '';
  // Remove control characters (ASCII 0-31 except tab/newline) then trim
  // eslint-disable-next-line no-control-regex
  return sanitizeString(location.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, 200));
}

/**
 * Guards against javascript: and data: URI schemes that can execute code.
 * Returns '#' for any unsafe URL.
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return '#';
  }
  return url.trim();
}
