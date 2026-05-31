export const API_BASE = 'https://ajoplus.bookbank.com.ng';

export const mockUser = {
  id: 'user-123',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '08012345678',
  role: 'customer' as const,
  accountStatus: 'active' as const,
  registrationFeeStatus: 'approved' as const,
};

export const mockAgentUser = {
  id: 'agent-123',
  fullName: 'Adebayo Oluwaseun',
  email: 'adebayo@example.com',
  phoneNumber: '08087654321',
  role: 'agent' as const,
  accountStatus: 'active' as const,
  registrationFeeStatus: 'approved' as const,
};

export const mockAjoSettings = {
  id: 'settings-123',
  commissionRate: 10,
  bankName: 'Access Bank',
  accountNumber: '0123456789',
  accountName: 'Ajo Plus Limited',
  createdAt: '2026-04-21T09:34:58.000Z',
  updatedAt: '2026-04-21T10:13:31.000Z',
};

export const mockPayment = {
  id: 'payment-123',
  userId: 'user-123',
  userPackageId: null,
  cartId: null,
  productId: null,
  savingPlanId: null,
  amountPaid: '1000.00',
  expectedAmount: '1000.00',
  paymentType: 'saving' as const,
  receiptUrl: 'https://res.cloudinary.com/test/image/upload/test.png',
  rejectionReason: null,
  status: 'pending' as const,
  createdAt: '2026-05-13T10:58:16.000Z',
  updatedAt: '2026-05-13T11:08:45.000Z',
  user: {
    id: 'user-123',
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '08012345678',
  },
  userPackage: null,
};

export const mockWithdrawal = {
  id: 'withdrawal-123',
  userId: 'user-123',
  walletId: 'wallet-123',
  withdrawalType: 'wallet',
  amount: '500.00',
  description: 'For transport',
  status: 'pending' as const,
  rejectionReason: null,
  createdAt: '2026-05-13T08:32:31.000Z',
  updatedAt: '2026-05-13T08:36:26.000Z',
  wallet: {
    id: 'wallet-123',
    savingPlanId: 'plan-123',
    availableBalance: '11500.00',
    commissionPaid: '1000.00',
  },
};

export const mockAgentDashboard = {
  agent: {
    id: 'agent-123',
    fullName: 'Adebayo Oluwaseun',
    referralCode: 'AGENT-ADEBAYO-8417',
    createdAt: '2026-04-19T04:25:29.000Z',
  },
  stats: {
    totalReferrals: 11,
    totalEarnings: 400,
    commissionPaid: 400,
    totalWithdrawn: 300,
    pendingWithdrawalAmount: 0,
    availableBalance: 100,
    pendingEarnings: 1600,
    totalCommission: 2000,
    packageEarnings: 400,
    savingEarnings: 0,
    earningsPerReferral: 36.36,
    totalTransactions: 1,
  },
  referral: {
    code: 'AGENT-ADEBAYO-8417',
    link: 'https://ajoplus.com/ref/AGENT-ADEBAYO-8417',
  },
  earningsBreakdown: {
    thisMonth: 400,
    lastMonth: 0,
  },
  referredUsers: [
    {
      id: 'user-123',
      fullName: 'John Doe',
      email: 'john@example.com',
      joinedAt: '2026-04-23T21:30:38.000Z',
      commissions: 1,
      packageCommissions: 1,
      savingCommissions: 0,
      earnings: 400,
      pendingEarnings: 1600,
    },
  ],
};

export const mockRegistrationFee = {
  id: 'fee-123',
  userId: 'user-123',
  amount: '1000.00',
  paymentDate: '2026-05-13T00:00:00.000Z',
  proofFile: 'https://res.cloudinary.com/test/image/upload/proof.png',
  status: 'pending' as const,
  rejectionReason: null,
  createdAt: '2026-05-13T15:29:43.000Z',
  updatedAt: '2026-05-13T15:46:02.000Z',
  user: {
    id: 'user-123',
    fullName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '08012345678',
    role: 'customer',
    accountStatus: 'active',
    registrationFeeStatus: 'pending',
  },
};

export const mockAdminUser = {
  id: 'user-456',
  fullName: 'Jane Smith',
  email: 'jane@example.com',
  phoneNumber: '08023456789',
  imageUrl: null,
  accountName: 'Jane Smith',
  bankName: 'GTB',
  accountNumber: '1234567890',
  address: '7 Factory Road',
  role: 'customer' as const,
  accountStatus: 'active' as const,
  registrationFeeStatus: 'approved' as const,
  registrationExpiryDate: '2027-05-13T00:00:00.000Z',
  daysRemaining: 359,
  userStatus: 'active',
  referralCode: null,
  referredByAgentCode: 'AGENT-ADEBAYO-8417',
  referredBy: 'agent-123',
  createdAt: '2026-05-13T15:21:34.000Z',
  updatedAt: '2026-05-13T15:21:34.000Z',
};

export const mockWallet = {
  totalBalance: '12000.00',
  wallets: [
    {
      id: 'wallet-123',
      savingPlanId: 'plan-123',
      dailyAmount: '1000.00',
      totalSaved: '12000.00',
      availableBalance: '11500.00',
      commissionPaid: '500.00',
    },
  ],
};

export const mockSavingPlan = {
  id: 'plan-123',
  amount: '1000.00',
  installmentAmount: '900.00',
  commissionAmount: '100.00',
  description: 'Daily Savings Plan',
  createdAt: '2026-04-01T00:00:00.000Z',
};

export const mockAgentWithdrawal = {
  id: 'agent-withdrawal-123',
  agentId: 'agent-123',
  agent: {
    id: 'agent-123',
    fullName: 'Adebayo Oluwaseun',
    email: 'adebayo@example.com',
    phoneNumber: '08087654321',
    bankName: null,
    accountNumber: null,
  },
  amount: 300,
  description: 'For transport',
  status: 'pending' as const,
  createdAt: '2026-05-19T17:05:50.000Z',
};
