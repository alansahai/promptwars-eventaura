import { describe, it, expect } from 'vitest';
import { formatCurrency, formatAbbreviatedCurrency, CURRENCY_SYMBOLS } from '../utils/currency';

describe('Currency Utility Functions', () => {
  it('correctly maps currency symbols for all supported currencies', () => {
    expect(CURRENCY_SYMBOLS.INR).toBe('₹');
    expect(CURRENCY_SYMBOLS.USD).toBe('$');
    expect(CURRENCY_SYMBOLS.EUR).toBe('€');
    expect(CURRENCY_SYMBOLS.GBP).toBe('£');
  });

  describe('formatCurrency', () => {
    it('formats INR using the Indian numbering system', () => {
      const formatted = formatCurrency(1500000, 'INR');
      expect(formatted).toBe('₹15,00,000');
    });

    it('formats USD using the standard US numbering system', () => {
      const formatted = formatCurrency(50000, 'USD');
      expect(formatted).toBe('$50,000');
    });

    it('handles zero and fractional numbers cleanly', () => {
      expect(formatCurrency(0, 'EUR')).toBe('€0');
      expect(formatCurrency(199.99, 'GBP')).toBe('£200');
    });
  });

  describe('formatAbbreviatedCurrency', () => {
    it('abbreviates Lakhs and Crores for INR', () => {
      expect(formatAbbreviatedCurrency(25000000, 'INR')).toBe('₹2.50 Cr');
      expect(formatAbbreviatedCurrency(1500000, 'INR')).toBe('₹15.0 L');
      expect(formatAbbreviatedCurrency(50000, 'INR')).toBe('₹50k');
      expect(formatAbbreviatedCurrency(500, 'INR')).toBe('₹500');
    });

    it('abbreviates Millions and Thousands for USD/EUR/GBP', () => {
      expect(formatAbbreviatedCurrency(2500000, 'USD')).toBe('$2.5M');
      expect(formatAbbreviatedCurrency(75000, 'EUR')).toBe('€75k');
      expect(formatAbbreviatedCurrency(850, 'GBP')).toBe('£850');
    });
  });
});
