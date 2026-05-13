import type { AdConfig } from '../types/adTypes';

export const AD_REGISTRY: AdConfig[] = [
	// ── Slot 1: After "How It Works" ─────────────────────────────────────────
	{
		id: 'ad_001',
		slotId: 'landing_after_how_it_works',
		variant: 'banner',
		status: 'active',
		badge: 'Sponsored',
		headline: `Secure your family's future with AbaGold Premium`,
		subtext: 'Earn up to 18% annual returns on your locked savings plans.',
		cta: { label: 'Learn More', href: '/browse' },
		campaignId: 'camp_premium_q1',
	},

	// ── Slot 2: After "Products" ──────────────────────────────────────────────
	{
		id: 'ad_002',
		slotId: 'landing_after_products',
		variant: 'card',
		status: 'active',
		badge: 'Partner',
		headline: 'Shop smarter. Save faster.',
		subtext: 'Pay with your AbaGold wallet and earn bonus cashback on every order.',
		imageUrl: '', // Replace with partner image URL
		imageAlt: 'Partner promotion',
		cta: { label: 'Shop Now', href: '/browse' },
		campaignId: 'camp_partner_shop',
	},

	// ── Slot 3: After "Referral" ─────────────────────────────────────────────
	{
		id: 'ad_003',
		slotId: 'landing_after_referral',
		variant: 'inline',
		status: 'inactive', // Toggle to 'active' when ready
		badge: 'Promo',
		headline: 'Refer 5 friends. Get ₦5,000 bonus.',
		subtext: 'Limited-time referral bonus. Terms apply.',
		cta: { label: 'Refer Now', href: '/signup' },
		campaignId: 'camp_ref_bonus_q1',
	},

	// ── Slot 4: Before "FAQ" ──────────────────────────────────────────────────
	{
		id: 'ad_004',
		slotId: 'landing_before_faq',
		variant: 'banner',
		status: 'inactive',
		badge: 'Sponsored',
		headline: 'Your ad could be here',
		subtext: 'Reach thousands of active savers across Nigeria. Contact us to advertise.',
		cta: { label: 'Advertise With Us', href: 'mailto:ads@abagold.com' },
		campaignId: 'camp_house_ad',
	},
];