// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn (className) — merges Tailwind CSS classes safely.
 *
 * Combines `clsx` (conditional class logic) with `tailwind-merge`
 * (conflict resolution) so that later classes always win without
 * duplicates or specificity bugs.
 *
 * @example
 * cn('px-4 py-2', isLarge && 'px-8')
 * // → 'py-2 px-8'  (px-4 is overridden, not duplicated)
 *
 * @example
 * cn('bg-red-500', undefined, ['text-white', 'font-bold'])
 * // → 'bg-red-500 text-white font-bold'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}