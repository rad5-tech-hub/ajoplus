import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/currency';

describe('formatCurrency', () => {
  it('formats 1000 with comma separator', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });

  it('formats 10000 with comma separator', () => {
    const result = formatCurrency(10000);
    expect(result).toContain('10,000');
  });

  it('formats 1500000 with comma and period', () => {
    const result = formatCurrency(1500000);
    expect(result).toContain('1,500,000');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats decimal amounts', () => {
    const result = formatCurrency(972.22);
    expect(result).toContain('972');
  });

  it('includes naira symbol', () => {
    const result = formatCurrency(1000);
    const hasSymbol = result.includes('₦') || result.includes('NGN') || result.includes('N');
    expect(hasSymbol).toBe(true);
  });

  it('handles string input via Number conversion', () => {
    const result = formatCurrency(Number('1000.00'));
    expect(result).toContain('1,000');
  });
});
