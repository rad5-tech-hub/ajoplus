import { http, HttpResponse } from 'msw';
import {
  mockAjoSettings, mockUser, mockAgentUser, mockPayment,
  mockWithdrawal, mockAgentDashboard, mockRegistrationFee,
  mockAdminUser, mockWallet, mockSavingPlan, mockAgentWithdrawal,
} from './fixtures';

const B = 'https://ajoplus.bookbank.com.ng';

export const handlers = [
  // SETTINGS
  http.get(`${B}/api/setting/ajo`, () =>
    HttpResponse.json({ success: true, data: mockAjoSettings })),
  http.patch(`${B}/api/setting/ajo`, () =>
    HttpResponse.json({ success: true, data: mockAjoSettings })),

  // AUTH
  http.post(`${B}/api/auth/login`, () =>
    HttpResponse.json({ success: true, data: { user: mockUser, accessToken: 'test-token', refreshToken: 'test-refresh' } })),
  http.post(`${B}/api/auth/signup`, () =>
    HttpResponse.json({ success: true, data: { user: mockUser } })),

  // PAYMENTS — admin
  http.get(`${B}/api/payment/payments/pending`, () =>
    HttpResponse.json({ success: true, data: { summary: { total: 1, byType: { package: 0, product: 0, saving: 1 } }, payments: [mockPayment] } })),
  http.get(`${B}/api/payment/payments/approved`, () =>
    HttpResponse.json({ success: true, data: { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] } })),
  http.get(`${B}/api/payment/payments/rejected`, () =>
    HttpResponse.json({ success: true, data: { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] } })),
  http.patch(`${B}/api/payment/payment/:id/approve`, () =>
    HttpResponse.json({ success: true, data: { payment: { ...mockPayment, status: 'approved' } } })),
  http.patch(`${B}/api/payment/payment/:id/reject`, () =>
    HttpResponse.json({ success: true, data: { payment: { ...mockPayment, status: 'rejected', rejectionReason: 'Does not match' } } })),

  // PAYMENTS — customer
  http.get(`${B}/api/payment/payments/me/pending`, () =>
    HttpResponse.json({ success: true, data: { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] } })),
  http.post(`${B}/api/payment/manual-payment`, () =>
    HttpResponse.json({ success: true, data: { payment: mockPayment } })),

  // WITHDRAWALS — customer
  http.get(`${B}/api/customer/wallet/withdrawals/pending`, () =>
    HttpResponse.json({ success: true, data: { count: 0, withdrawals: [] } })),
  http.post(`${B}/api/customer/wallet/withdrawals`, () =>
    HttpResponse.json({ success: true, data: { withdrawal: mockWithdrawal } })),

  // WITHDRAWALS — admin
  http.get(`${B}/api/admin/withdrawals/approved`, () =>
    HttpResponse.json({ success: true, data: { count: 0, withdrawals: [] } })),
  http.get(`${B}/api/admin/withdrawals/rejected`, () =>
    HttpResponse.json({ success: true, data: { count: 0, withdrawals: [] } })),
  http.patch(`${B}/api/admin/withdrawals/:id/approve`, () =>
    HttpResponse.json({ success: true, data: {} })),
  http.patch(`${B}/api/admin/withdrawals/:id/reject`, () =>
    HttpResponse.json({ success: true, data: {} })),

  // AGENT WITHDRAWALS
  http.get(`${B}/api/admin/agent-withdrawals/pending`, () =>
    HttpResponse.json({ success: true, data: { pagination: { total: 1, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPreviousPage: false }, withdrawals: [mockAgentWithdrawal] } })),
  http.patch(`${B}/api/admin/agent-withdrawals/:id/approve`, () =>
    HttpResponse.json({ success: true, data: { withdrawal: { id: 'agent-withdrawal-123', amount: 300, status: 'success', approvedAt: '2026-05-19T17:34:10.000Z' } } })),
  http.post(`${B}/api/agents/wallet/withdrawals`, () =>
    HttpResponse.json({ success: true, statusCode: 201, data: { withdrawal: { ...mockAgentWithdrawal, status: 'pending' }, availableBalance: 100, totalAvailable: 400 } })),

  // REGISTRATION FEES
  http.get(`${B}/api/registration-fee/admin/pending`, () =>
    HttpResponse.json({ success: true, data: { count: 1, fees: [mockRegistrationFee] } })),
  http.get(`${B}/api/registration-fee/admin/approved-rejected`, () =>
    HttpResponse.json({ success: true, data: { pagination: { currentPage: 1, totalPages: 1, totalRecords: 1, recordsPerPage: 10, hasNextPage: false, hasPreviousPage: false }, fees: [{ ...mockRegistrationFee, status: 'approved', amount: 1000 }] } })),
  http.get(`${B}/api/registration-fee/me/status`, () =>
    HttpResponse.json({ success: true, data: { status: 'approved' } })),
  http.patch(`${B}/api/registration-fee/:id/approve`, () =>
    HttpResponse.json({ success: true, data: {} })),
  http.patch(`${B}/api/registration-fee/:id/reject`, () =>
    HttpResponse.json({ success: true, data: {} })),

  // AGENT
  http.get(`${B}/api/agents/dashboard`, () =>
    HttpResponse.json({ success: true, data: mockAgentDashboard })),
  http.get(`${B}/api/agents/:referralCode/downline`, () =>
    HttpResponse.json({ success: true, data: { agent: mockAgentUser, totalCustomers: 1, customers: [{ id: 'user-123', fullName: 'John Doe', email: 'john@example.com', phoneNumber: '08012345678', bankName: null, accountNumber: null, accountStatus: 'active', createdAt: '2026-04-19T04:26:39.000Z' }] } })),

  // ADMIN USERS
  http.get(`${B}/api/admin/users`, () =>
    HttpResponse.json({ success: true, data: { pagination: { total: 1, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPreviousPage: false }, filters: { role: 'all', status: 'all', search: null }, users: [mockAdminUser] } })),

  // CUSTOMER
  http.get(`${B}/api/customer/wallet`, () =>
    HttpResponse.json({ success: true, data: mockWallet })),
  http.get(`${B}/api/customer/dashboard`, () =>
    HttpResponse.json({ success: true, data: { totalSaved: 12000, totalPackages: 2, recentTransactions: [] } })),

  // SAVING PLANS
  http.get(`${B}/api/saving-plan/setup`, () =>
    HttpResponse.json({ success: true, data: [mockSavingPlan] })),
  http.post(`${B}/api/saving-plan/setup`, () =>
    HttpResponse.json({ success: true, data: mockSavingPlan })),

  // PACKAGES
  http.get(`${B}/api/package/public`, () =>
    HttpResponse.json({ success: true, data: [] })),
  http.get(`${B}/api/package`, () =>
    HttpResponse.json({ success: true, data: [] })),

  // PRODUCTS
  http.get(`${B}/api/product/public`, () =>
    HttpResponse.json({ success: true, data: { products: [], total: 0 } })),

  // ADS
  http.get(`${B}/api/ads/advert`, () =>
    HttpResponse.json({ success: true, data: { adverts: [], total: 0 } })),
];
