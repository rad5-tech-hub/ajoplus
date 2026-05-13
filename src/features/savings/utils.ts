const MONTH_DAYS = 30;

export function calculateMonthlySummary(dailyAmount: number): number {
  return dailyAmount * MONTH_DAYS;
}

export function calculateCommission(dailyAmount: number, daysSaved: number): number {
  return Math.round(dailyAmount * daysSaved * 0.05);
}

export function calculatePayable(totalSaved: number, commission: number): number {
  return Math.max(0, totalSaved - commission);
}

export function daysUntilNextMonth(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatSavingsDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
