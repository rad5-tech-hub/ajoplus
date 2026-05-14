import { useGetSavingsOverview } from '@/app/store/SavingsAdminStore';
import { formatCurrency } from '@/lib/currency';

const SummaryCard = ({ label, value }: { label: string; value: string }) => (
	<div className="rounded-3xl bg-amber-50 border border-amber-100 p-5">
		<p className="text-sm text-slate-500">{label}</p>
		<p className="mt-3 text-2xl font-bold text-blue-950">{value}</p>
	</div>
);

const SavingsOverview = () => {
	const { data, isLoading, isError, error, refetch } = useGetSavingsOverview();

	const summary = data?.summary;
	const savers = data?.savers ?? [];

	return (
		<div className="min-h-screen bg-slate-50 py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-blue-950">Ajo Savings Overview</h1>
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
								<div key={item} className="h-24 rounded-3xl bg-white border border-amber-200 animate-pulse" />
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
							className="px-4 py-2 rounded-2xl bg-amber-600 text-white hover:bg-amber-700 transition-colors"
						>
							Retry
						</button>
					</div>
				)}

				{!isLoading && !isError && !summary && (
					<div className="rounded-3xl bg-white border border-amber-200 p-10 text-center">
						<p className="text-slate-700 font-semibold mb-2">No active savings plans yet.</p>
						<p className="text-sm text-slate-500">Savings plan details will appear here once users start contributing.</p>
					</div>
				)}

				{!isLoading && !isError && summary && (
					<>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-4 mb-8">
							<SummaryCard label="Total Savers" value={`${summary.totalSavers}`} />
							<SummaryCard label="Total Saved" value={formatCurrency(summary.totalSaved)} />
							<SummaryCard label="Total Commission" value={formatCurrency(summary.totalCommission)} />
							<SummaryCard label="Total Payable" value={formatCurrency(summary.totalPayable)} />
						</div>

						<div className="overflow-hidden rounded-3xl border border-amber-200 bg-white">
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
									{savers.map((saver) => (
										<tr key={saver.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
											<td className="py-5 px-5">
												<p className="font-semibold text-blue-950">{saver.name}</p>
											</td>
											<td className="py-5 px-5 text-slate-500 text-sm truncate" title={saver.email}>
												{saver.email}
											</td>
											<td className="py-5 px-5 font-semibold text-amber-600">{formatCurrency(saver.dailyAmount)}</td>
											<td className="py-5 px-5 text-blue-950">{formatCurrency(saver.totalSaved)}</td>
											<td className="py-5 px-5 text-blue-950">{formatCurrency(saver.payable)}</td>
											<td className="py-5 px-5 text-blue-950">{formatCurrency(saver.commission)}</td>
											<td className="py-5 px-5 text-slate-500">{saver.daysSaved}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SavingsOverview;
