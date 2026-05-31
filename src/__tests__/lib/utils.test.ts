import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges two class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolves Tailwind color conflicts — last wins', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-red-500');
  });

  it('handles undefined without throwing', () => {
    expect(() => cn('foo', undefined)).not.toThrow();
  });

  it('handles null without throwing', () => {
    expect(() => cn('foo', null as unknown as string)).not.toThrow();
  });

  it('handles conditional object — true includes class', () => {
    const result = cn({ 'text-red-500': true });
    expect(result).toContain('text-red-500');
  });

  it('handles conditional object — false excludes class', () => {
    const result = cn({ 'text-blue-500': false });
    expect(result).not.toContain('text-blue-500');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});
