import type { PublicPackage, PublicProduct, ProductsResponse } from '@/api/public';

export type { PublicPackage, PublicProduct, ProductsResponse };

export function formatNaira(amount: string | number): string {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

export function formatFrequency(freq: string): string {
  return ({ daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }[freq] ?? freq);
}

export function getCategoryName(cat: { id: string; name: string } | null): string {
  return cat?.name ?? 'Package';
}
