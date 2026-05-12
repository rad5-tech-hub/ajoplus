// src/features/landing/types/adTypes.ts

export type AdVariant = 'banner' | 'card' | 'inline';
export type AdStatus = 'active' | 'inactive' | 'scheduled';

export interface AdCta {
	label: string;
	href: string;
}

export interface AdConfig {
	id: string;
	slotId: AdSlotId;
	variant: AdVariant;
	status: AdStatus;

	// Content
	headline: string;
	subtext?: string;
	imageUrl?: string;
	imageAlt?: string;
	cta?: AdCta;

	// Optional badge/tag (e.g. "Sponsored", "Partner")
	badge?: string;

	// Scheduling (ISO strings)
	startsAt?: string;
	endsAt?: string;

	// Analytics
	campaignId?: string;
}

/**
 * Named slots on the landing page where ads can be injected.
 * Add new slots here as the page grows — no component changes needed.
 */
export type AdSlotId =
	| 'landing_after_how_it_works'
	| 'landing_after_products'
	| 'landing_after_referral'
	| 'landing_before_faq';