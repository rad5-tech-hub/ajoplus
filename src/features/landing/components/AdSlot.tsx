import { useMemo } from 'react';
import { getAdForSlot } from '../utils/utils';
import { AdBanner } from './AdBanner';
import type { AdSlotId } from '../types/adTypes';

interface AdSlotProps {
	slotId: AdSlotId;
	/** Extra classes applied to the outer container (use for vertical margins) */
	className?: string;
}

export function AdSlot({ slotId, className }: AdSlotProps) {
	// Memoised so scheduling logic only runs once per mount, not on every render
	const ad = useMemo(() => getAdForSlot(slotId), [slotId]);

	if (!ad) return null;

	return (
		<section
			aria-label="Sponsored content"
			className={className}
		>
			<AdBanner ad={ad} />
		</section>
	);
}

export default AdSlot;