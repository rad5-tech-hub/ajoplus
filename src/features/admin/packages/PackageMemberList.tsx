import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useGetPackageMembers, useUpdateMemberStatus } from '@/app/store/PackageStore';
import { formatCurrency } from '@/lib/currency';

const statusStyles = {
	active: 'bg-sky-100 text-sky-700',
	completed: 'bg-emerald-100 text-emerald-700',
	finalised: 'bg-slate-100 text-slate-700',
	suspended: 'bg-red-100 text-red-700',
	inactive: 'bg-slate-100 text-slate-700',
} as const;

const PackageMemberList = () => {
	const { packageId } = useParams<{ packageId: string }>();
	const navigate = useNavigate();
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const { data, isLoading, isError, error, refetch } = useGetPackageMembers(packageId ?? '');
	const updateStatus = useUpdateMemberStatus();
	const isUpdating = updateStatus.status === 'pending';

	const handleFinalize = (userPackageId: string) => {
		if (!packageId) return;
		setUpdatingId(userPackageId);
		updateStatus.mutate(
			{ packageId, userPackageId, status: 'finalised' },
			{
				onSettled: () => setUpdatingId(null),
			}
		);
	};

	const headerLabel = data?.package.name ?? 'Package Members';
	const totalRevenue = data?.totalRevenue ?? 0;
	const members = data?.members ?? [];

	return (
		<div className="min-h-screen bg-slate-50 py-6">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl px-4 py-2 transition-colors"
					>
						<ChevronLeft className="w-4 h-4" /> Back
					</button>
					<div className="space-y-1">
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{headerLabel}</h1>
						<p className="text-sm text-slate-500">Member list and package revenue details</p>
					</div>
					<div className="rounded-3xl border border-slate-200 bg-white p-5 text-center min-w-[200px]">
						<p className="text-sm text-slate-500">Total Revenue</p>
						<p className="mt-2 text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
					</div>
				</div>

				{isLoading && (
					<div className="space-y-4">
						{[1, 2, 3].map((item) => (
							<div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 animate-pulse space-y-4" />
						))}
					</div>
				)}

				{isError && !isLoading && (
					<div className="rounded-3xl bg-white border border-red-200 p-8 text-center">
						<p className="text-red-600 font-semibold mb-3">Failed to load package members.</p>
						<p className="text-slate-600 mb-4">{error instanceof Error ? error.message : 'Please try again.'}</p>
						<button
							type="button"
							onClick={() => refetch()}
							className="px-4 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
						>
							Retry
						</button>
					</div>
				)}

				{!isLoading && !isError && members.length === 0 && (
					<div className="rounded-3xl bg-white border border-slate-200 p-10 text-center">
						<p className="text-slate-700 font-semibold mb-2">No customers are subscribed to this package yet.</p>
						<p className="text-sm text-slate-500">Once customers join the package, you’ll see them listed here.</p>
					</div>
				)}

				<div className="space-y-4">
					{members.map((member) => (
						<div key={member.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center font-semibold text-lg">
										{member.user.fullName
											.split(' ')
											.map((segment) => segment[0])
											.slice(0, 2)
											.join('')}
									</div>
									<div>
										<p className="text-lg font-semibold text-slate-900">{member.user.fullName}</p>
										<p className="text-sm text-slate-500">{member.user.email}</p>
										<p className="text-sm text-slate-500">{member.user.phoneNumber}</p>
									</div>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[member.status]}`}>
										{member.status}
									</span>
									<span className="text-sm text-slate-500">Installment: ₦{member.installmentAmount}</span>
								</div>
							</div>

							<div className="mt-5 grid gap-4 sm:grid-cols-3">
								<div className="rounded-3xl bg-slate-50 p-4">
									<p className="text-sm text-slate-500">Paid</p>
									<p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(member.totalPaid)}</p>
								</div>
								<div className="rounded-3xl bg-slate-50 p-4">
									<p className="text-sm text-slate-500">Remaining</p>
									<p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(member.remainingBalance)}</p>
								</div>
								<div className="rounded-3xl bg-slate-50 p-4">
									<p className="text-sm text-slate-500">Progress</p>
									<p className="mt-2 text-lg font-semibold text-slate-900">{member.progress}%</p>
								</div>
							</div>

							<div className="mt-5">
								<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
									<div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(Math.max(member.progress, 0), 100)}%` }} />
								</div>
								<div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
									<div className="text-sm text-slate-500">Started {new Date(member.startDate).toLocaleDateString()}</div>
									{member.status === 'completed' && (
										<button
											type="button"
											onClick={() => handleFinalize(member.id)}
											disabled={isUpdating && updatingId === member.id}
											className="rounded-2xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
										>
											{isUpdating && updatingId === member.id ? 'Updating…' : 'Mark as Finalised'}
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PackageMemberList;
