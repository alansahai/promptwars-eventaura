import type { Currency } from '../types/event';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * Formats a numeric amount into localized currency string.
 * Special handling for Indian Lakhs/Crores when using INR.
 */
export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const rounded = Math.round(amount);

  if (currency === 'INR') {
    // For INR, format with Indian numbering system (e.g., ₹15,00,000)
    return `${symbol}${rounded.toLocaleString('en-IN')}`;
  }

  return `${symbol}${rounded.toLocaleString('en-US')}`;
}

/**
 * Provides an abbreviated representation (e.g. ₹15.5L or $150k)
 */
export function formatAbbreviatedCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  
  if (currency === 'INR') {
    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)} L`;
    }
    if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(0)}k`;
    }
    return `${symbol}${amount}`;
  }

  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}k`;
  }
  return `${symbol}${amount}`;
}
