import { describe, it, expect } from 'vitest';
import { calculateDaysRemaining, formatEventDate } from '../utils/date';
import { sanitizeString, sanitizePlanTitle, sanitizeNotes, sanitizeUrl, sanitizeLocation } from '../utils/sanitize';

describe('Date & Security Utilities', () => {
  describe('calculateDaysRemaining', () => {
    it('calculates positive remaining days for future events', () => {
      const now = new Date('2026-06-01T00:00:00Z').getTime();
      const target = '2026-06-11T00:00:00Z';
      const days = calculateDaysRemaining(target, now);
      expect(days).toBe(10);
    });

    it('returns 0 for past events', () => {
      const now = new Date('2026-06-15T00:00:00Z').getTime();
      const target = '2026-06-01T00:00:00Z';
      const days = calculateDaysRemaining(target, now);
      expect(days).toBe(0);
    });

    it('handles empty input gracefully', () => {
      expect(calculateDaysRemaining('')).toBe(0);
    });
  });

  describe('formatEventDate', () => {
    it('formats ISO date string into readable text', () => {
      const formatted = formatEventDate('2026-12-25');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Dec');
    });

    it('returns original input when date is invalid', () => {
      expect(formatEventDate('not-a-date')).toBe('not-a-date');
    });
  });

  describe('sanitizeString', () => {
    it('escapes HTML tags and script injection vectors', () => {
      const malicious = '<script>alert("xss")</script>';
      const cleaned = sanitizeString(malicious);
      expect(cleaned).not.toContain('<script>');
      expect(cleaned).toContain('&lt;script&gt;');
      expect(cleaned).toContain('&quot;xss&quot;');
    });

    it('sanitizes quotes and ampersands properly', () => {
      const input = `Ben & Jerry's "Special" Event`;
      const cleaned = sanitizeString(input);
      expect(cleaned).toContain('&amp;');
      expect(cleaned).toContain('&#x27;');
      expect(cleaned).toContain('&quot;');
    });
  });

  describe('sanitizePlanTitle', () => {
    it('trims and enforces max length boundaries', () => {
      const longTitle = '   ' + 'A'.repeat(200) + '   ';
      const result = sanitizePlanTitle(longTitle);
      expect(result.length).toBeLessThanOrEqual(120);
      expect(result.startsWith(' ')).toBe(false);
    });
  });

  describe('sanitizeNotes', () => {
    it('bounds notes length to 500 chars', () => {
      const longNotes = 'X'.repeat(600);
      const result = sanitizeNotes(longNotes);
      expect(result.length).toBeLessThanOrEqual(500);
    });
  });

  describe('sanitizeUrl', () => {
    it('blocks javascript: protocol URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
      expect(sanitizeUrl('JAVASCRIPT:void(0)')).toBe('#');
    });

    it('blocks data: URI scheme', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    });

    it('blocks vbscript: protocol', () => {
      expect(sanitizeUrl('vbscript:MsgBox(1)')).toBe('#');
    });

    it('passes safe https URLs through unchanged', () => {
      const url = 'https://eventura.example.com/plan';
      expect(sanitizeUrl(url)).toBe(url);
    });

    it('returns # for empty string', () => {
      expect(sanitizeUrl('')).toBe('#');
    });
  });

  describe('sanitizeLocation', () => {
    it('removes control characters from location strings', () => {
      const dirty = 'Udaipur\x00\x1FPalace';
      const result = sanitizeLocation(dirty);
      expect(result).not.toContain('\x00');
      expect(result).not.toContain('\x1F');
      expect(result).toContain('Udaipur');
    });

    it('enforces max 200 char limit on location', () => {
      const longLoc = 'B'.repeat(300);
      expect(sanitizeLocation(longLoc).length).toBeLessThanOrEqual(200);
    });
  });
});
