import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useGetSavingsOverview } from '@/app/store/SavingsAdminStore';
import { formatCurrency } from '@/lib/currency';

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
	<div className="rounded-3xl bg-brand-50 border border-brand-100 p-5">
		<p className="text-sm text-slate-500">{label}</p>
		<p className="mt-3 text-2xl font-bold text-brand-900">{value}</p>
	</div>
);

const SavingsOverview = () => {
	const { data, isLoading, isError, error, refetch } = useGetSavingsOverview();
	const [searchQuery, setSearchQuery] = useState('');

	const summary = data?.summary;
	const savers = useMemo(() => data?.savers ?? [], [data]);
	const filteredSavers = useMemo(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return savers;
		return savers.filter((s: { name: string; email: string }) =>
			s.name.toLowerCase().includes(q) ||
			s.email.toLowerCase().includes(q)
		);
	}, [savers, searchQuery]);

	return (
		<div className="min-h-screen bg-slate-50 py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-brand-900">Ajo Savings Overview</h1>
						<p className="text-sm text-slate-500 mt-1">Monitor savings plan performance and commissions.</p>
					</div>
				</div>

				{isLoading && (
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{[1, 2, 3, 4].map((item) => (
								<div key={item} className="h-28 rounded-3xl bg-slate-200 animate-pulse" />
							))}
						</div>
						<div className="space-y-3">
							{[1, 2, 3].map((item) => (
								<div key={item} className="h-24 rounded-3xl bg-white border border-brand-200 animate-pulse" />
							))}
						</div>
					</div>
				)}

				{isError && !isLoading && (
					<div className="rounded-3xl bg-white border border-red-200 p-8 text-center">
						<p className="text-red-600 font-semibold mb-3">Failed to load savings overview.</p>
						<p className="text-slate-600 mb-4">{error instanceof Error ? error.message : 'Please try again.'}</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="px-4 py-2 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 transition-colors"
						>
							Retry
						</button>
					</div>
				)}

				{!isLoading && !isError && !summary && (
					<div className="rounded-3xl bg-white border border-brand-200 p-10 text-center">
						<p className="text-slate-700 font-semibold mb-2">No active savings plans yet.</p>
						<p className="text-sm text-slate-500">Savings plan details will appear here once users start contributing.</p>
					</div>
				)}

				{!isLoading && !isError && summary && (
					<>
						<div className="grid grid-cols-2 gap-4 mb-8">
							<SummaryCard label="Total Savers" value={`${summary.totalSavers}`} />
							<SummaryCard label="Total Saved" value={formatCurrency(summary.totalSaved)} />
							<SummaryCard label="Total Commission" value={formatCurrency(summary.totalCommission)} />
							<SummaryCard label="Total Payable" value={formatCurrency(summary.totalPayable)} />
						</div>

						{/* ── Search Bar ── */}
						<div className="relative mb-4">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search savers by name or email..."
								className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
							/>
						</div>
						<div className="overflow-x-auto rounded-3xl border border-brand-200 bg-white">
							<div className="max-h-96 overflow-y-auto">
							<table className="w-full text-left">
								<thead className="bg-slate-50">
									<tr>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Name</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Email</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Daily Amount</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Total Saved</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Payable</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Commission</th>
										<th className="py-4 px-5 text-sm font-semibold text-slate-500">Days Saved</th>
									</tr>
								</thead>
								<tbody>
									{filteredSavers.length === 0 ? (
										<tr>
											<td colSpan={7} className="py-16 text-center">
												<p className="text-slate-400 font-medium text-sm">No savers match your search.</p>
											</td>
										</tr>
									) : filteredSavers.map((saver) => (
										<tr key={saver.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
											<td className="py-5 px-5">
												<p className="font-semibold text-brand-900">{saver.name}</p>
											</td>
											<td className="py-5 px-5 text-slate-500 text-sm truncate" title={saver.email}>
												{saver.email}
											</td>
											<td className="py-5 px-5 font-semibold text-brand-600">{formatCurrency(saver.dailyAmount)}</td>
											<td className="py-5 px-5 text-brand-900">{formatCurrency(saver.totalSaved)}</td>
											<td className="py-5 px-5 text-brand-900">{formatCurrency(saver.payable)}</td>
											<td className="py-5 px-5 text-brand-900">{formatCurrency(saver.commission)}</td>
											<td className="py-5 px-5 text-slate-500">{saver.daysSaved}</td>
										</tr>
									))}
								</tbody>
							</table>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SavingsOverview;
