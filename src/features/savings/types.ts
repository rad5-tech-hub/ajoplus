export interface SavingsPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  dailyAmount: number;
  totalSaved: number;
  commission: number;
  availableBalance: number;
  daysSaved: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
  daysUntilCommission: number;
}

export interface SavingsPortfolio {
  totalSaved: number;
  totalCommission: number;
  totalPayable: number;
  activePlans: number;
  plans: SavingsPlan[];
}
