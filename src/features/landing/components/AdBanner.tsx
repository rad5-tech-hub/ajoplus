import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdConfig } from '../types/adTypes';

interface AdBannerProps {
	ad: AdConfig;
	className?: string;
}

export function AdBanner({ ad, className }: AdBannerProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	const sharedProps = {
		'data-campaign-id': ad.campaignId,
		'aria-label': `Advertisement: ${ad.headline}`,
		role: 'complementary' as const,
	};

	if (ad.variant === 'banner') {
		return (
			<BannerVariant
				ad={ad}
				onDismiss={() => setDismissed(true)}
				className={className}
				{...sharedProps}
			/>
		);
	}

	if (ad.variant === 'card') {
		return (
			<CardVariant
				ad={ad}
				onDismiss={() => setDismissed(true)}
				className={className}
				{...sharedProps}
			/>
		);
	}

	// inline (default)
	return (
		<InlineVariant
			ad={ad}
			onDismiss={() => setDismissed(true)}
			className={className}
			{...sharedProps}
		/>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal sub-components (kept in same file since they're tightly coupled)
// ─────────────────────────────────────────────────────────────────────────────

interface VariantProps {
	ad: AdConfig;
	onDismiss: () => void;
	className?: string;
	'data-campaign-id'?: string;
	'aria-label'?: string;
	role?: 'complementary';
}

/** Full-width horizontal banner with gradient accent */
function BannerVariant({ ad, onDismiss, className, ...rest }: VariantProps) {
	return (
		<div
			className={cn(
				'relative w-full bg-gradient-to-r from-brand-600 to-brand-500',
				'px-4 py-5 sm:px-6',
				className,
			)}
			{...rest}
		>
			<div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Left: badge + copy */}
				<div className="flex flex-col gap-1 pr-8">
					{ad.badge && (
						<span className="inline-block w-fit text-xs font-semibold uppercase tracking-wider text-brand-100 bg-white/20 rounded-full px-2.5 py-0.5">
							{ad.badge}
						</span>
					)}
					<p className="text-white font-bold text-base sm:text-lg leading-snug">
						{ad.headline}
					</p>
					{ad.subtext && (
						<p className="text-brand-100 text-sm leading-relaxed">{ad.subtext}</p>
					)}
				</div>

				{/* Right: CTA */}
				{ad.cta && (
					<a
						href={ad.cta.href}
						className={cn(
							'flex-shrink-0 inline-flex items-center gap-1.5',
							'bg-white text-brand-700 font-semibold text-sm',
							'px-4 py-2.5 rounded-2xl',
							'hover:bg-brand-50 active:scale-95 transition-all duration-200',
							'focus:outline-none focus:ring-2 focus:ring-white/60',
						)}
						rel="noopener noreferrer"
					>
						{ad.cta.label}
						<ExternalLink className="w-3.5 h-3.5" />
					</a>
				)}
			</div>

			{/* Dismiss button */}
			<DismissButton onDismiss={onDismiss} dark />
		</div>
	);
}

/** Image + text card — good for partner promos */
function CardVariant({ ad, onDismiss, className, ...rest }: VariantProps) {
	return (
		<div
			className={cn(
				'relative w-full border border-brand-200 bg-white rounded-2xl overflow-hidden',
				'shadow-sm',
				className,
			)}
			{...rest}
		>
			<div className="flex flex-col sm:flex-row">
				{/* Optional image */}
				{ad.imageUrl && (
					<div className="sm:w-48 flex-shrink-0 bg-slate-100">
						<img
							src={ad.imageUrl}
							alt={ad.imageAlt ?? ''}
							loading="lazy"
							className="w-full h-36 sm:h-full object-cover"
						/>
					</div>
				)}

				{/* Content */}
				<div className="flex-1 p-5 flex flex-col justify-center gap-3 pr-10">
					{ad.badge && <AdBadge label={ad.badge} />}
					<div>
						<p className="text-brand-900 font-semibold text-base leading-snug">
							{ad.headline}
						</p>
						{ad.subtext && (
							<p className="text-slate-500 text-sm mt-1 leading-relaxed">{ad.subtext}</p>
						)}
					</div>
					{ad.cta && (
						<a
							href={ad.cta.href}
							className={cn(
								'self-start inline-flex items-center gap-1.5',
								'bg-brand-600 text-white font-semibold text-sm',
								'px-4 py-2 rounded-2xl',
								'hover:bg-brand-700 active:scale-95 transition-all duration-200',
								'focus:outline-none focus:ring-2 focus:ring-brand-500',
							)}
							rel="noopener noreferrer"
						>
							{ad.cta.label}
							<ExternalLink className="w-3.5 h-3.5" />
						</a>
					)}
				</div>
			</div>

			<DismissButton onDismiss={onDismiss} />
		</div>
	);
}

/** Subtle horizontal pill — least intrusive */
function InlineVariant({ ad, onDismiss, className, ...rest }: VariantProps) {
	return (
		<div
			className={cn(
				'relative w-full bg-slate-50 border border-brand-200 rounded-2xl',
				'px-4 py-3 pr-10',
				'flex flex-wrap items-center gap-x-3 gap-y-1',
				className,
			)}
			{...rest}
		>
			{ad.badge && <AdBadge label={ad.badge} />}

			<span className="text-slate-700 text-sm font-medium">{ad.headline}</span>

			{ad.subtext && (
				<span className="text-slate-500 text-sm hidden sm:inline">{ad.subtext}</span>
			)}

			{ad.cta && (
				<a
					href={ad.cta.href}
					className={cn(
						'ml-auto text-brand-600 text-sm font-semibold',
						'hover:text-brand-700 underline-offset-2 hover:underline',
						'active:scale-95 transition-all duration-200',
						'focus:outline-none focus:ring-2 focus:ring-brand-500 rounded',
					)}
					rel="noopener noreferrer"
				>
					{ad.cta.label}
				</a>
			)}

			<DismissButton onDismiss={onDismiss} />
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared micro-components
// ─────────────────────────────────────────────────────────────────────────────

function AdBadge({ label }: { label: string }) {
	return (
		<span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-2.5 py-0.5">
			{label}
		</span>
	);
}

function DismissButton({ onDismiss, dark }: { onDismiss: () => void; dark?: boolean }) {
	return (
		<button
			onClick={onDismiss}
			aria-label="Dismiss advertisement"
			className={cn(
				'absolute top-3 right-3 p-1 rounded-full',
				'transition-colors duration-150',
				dark
					? 'text-white/70 hover:text-white hover:bg-white/20'
					: 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
			)}
		>
			<X className="w-4 h-4" />
		</button>
	);
}

export default AdBanner;