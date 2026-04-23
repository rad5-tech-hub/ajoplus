/**
 * Currency conversion utilities for Naira to USD display
 * Exchange rate is currently set to 1 USD = 1550 NGN (can be adjusted)
 */

const EXCHANGE_RATE = 1550; // 1 USD to NGN

export const formatCurrency = (amount: number, currency: 'NGN' | 'USD' = 'NGN'): string => {
	if (currency === 'NGN') {
		return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
	}
	return `$${(amount / EXCHANGE_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDualCurrency = (amount: number): string => {
	const naira = formatCurrency(amount, 'NGN');
	const usd = formatCurrency(amount, 'USD');
	return `${naira} (${usd})`;
};

export const convertToUSD = (amountNGN: number): number => {
	return Number((amountNGN / EXCHANGE_RATE).toFixed(2));
};

export const convertToNGN = (amountUSD: number): number => {
	return Number((amountUSD * EXCHANGE_RATE).toFixed(0));
};
