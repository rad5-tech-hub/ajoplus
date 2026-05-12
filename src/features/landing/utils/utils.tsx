// src/features/landing/utils/getAdForSlot.ts
//
// Pure utility — isolated so TypeScript resolves the named export cleanly.

import { AD_REGISTRY } from '../constants/adConfig';
import type { AdConfig, AdSlotId } from '../types/adTypes';

export function getAdForSlot(slotId: AdSlotId): AdConfig | null {
	const now = Date.now();

	return (
		AD_REGISTRY.find((ad) => {
			if (ad.slotId !== slotId) return false;
			if (ad.status !== 'active') return false;
			if (ad.startsAt && new Date(ad.startsAt).getTime() > now) return false;
			if (ad.endsAt && new Date(ad.endsAt).getTime() < now) return false;
			return true;
		}) ?? null
	);
}