import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Eye, Search } from 'lucide-react';
import { useGetProductTransactions } from '@/app/store/SavingsAdminStore';
import { formatCurrency } from '@/lib/currency';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';

const statusStyles: Record<'approved' | 'rejected' | 'pending', string> = {
	approved: 'bg-brand-100 text-brand-700',
	rejected: 'bg-red-100 text-red-700',
	pending: 'bg-slate-100 text-slate-700',
};

const formatDate = (value: string) =>
	new Date(value).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

const ProductTransactions = () => {
	const { productId } = useParams<{ productId: string }>();
	const navigate = useNavigate();

	const { data, isLoading, isError, error, refetch } = useGetProductTransactions(productId ?? '');
	const [showReceipt, setShowReceipt] = useState(false);
	const [receiptUrl, setReceiptUrl] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const transactions = useMemo(() => data?.transactions ?? [], [data]);
	const filteredTransactions = useMemo(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return transactions;
		return transactions.filter((t: { user: { fullName: string; email: string } }) =>
			t.user.fullName.toLowerCase().includes(q) ||
			t.user.email.toLowerCase().includes(q)
		);
	}, [transactions, searchQuery]);
	const transactionCount = data?.transactionCount ?? 0;
	const totalRevenue = data?.totalRevenue ?? 0;
	const productName = data?.product.name ?? 'Product Transactions';

	const headerSubtitle = useMemo(
		() => `${transactionCount} payment${transactionCount === 1 ? '' : 's'}`,
		[transactionCount]
	);

	return (
		<div className="min-h-screen bg-slate-50 py-6">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-900 bg-white border border-brand-200 rounded-2xl px-4 py-2 transition-colors"
					>
						<ChevronLeft className="w-4 h-4" /> Back
					</button>
					<div className="space-y-1">
						<h1 className="text-2xl sm:text-3xl font-bold text-brand-900">{productName}</h1>
						<p className="text-sm text-slate-500">All transactions for this product</p>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="rounded-3xl border border-brand-200 bg-white p-5 text-center">
							<p className="text-sm text-slate-500">Total Revenue</p>
							<p className="mt-2 text-2xl font-bold text-brand-600">{formatCurrency(totalRevenue)}</p>
						</div>
						<div className="rounded-3xl border border-brand-200 bg-white p-5 text-center">
							<p className="text-sm text-slate-500">Transaction Count</p>
							<p className="mt-2 text-2xl font-bold text-brand-900">{headerSubtitle}</p>
						</div>
					</div>
				</div>

				{isLoading && (
					<div className="space-y-3">
						{[1, 2, 3, 4].map((index) => (
							<div key={index} className="rounded-3xl border border-brand-200 bg-white p-5 animate-pulse h-28" />
						))}
					</div>
				)}

				{isError && !isLoading && (
					<div className="rounded-3xl bg-white border border-red-200 p-8 text-center">
						<p className="text-red-600 font-semibold mb-3">Failed to load transactions.</p>
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

				{!isLoading && !isError && transactions.length === 0 && (
					<div className="rounded-3xl bg-white border border-brand-200 p-10 text-center">
						<p className="text-slate-700 font-semibold mb-2">No transactions yet for this product.</p>
						<p className="text-sm text-slate-500">Transactions will appear here when customers make purchases.</p>
					</div>
				)}

				{!isLoading && !isError && transactions.length > 0 && (
					<>
						<div className="relative mb-4">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search by customer name or email..."
								className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
							/>
						</div>
						<div className="overflow-hidden rounded-3xl border border-brand-200 bg-white">
						<table className="w-full text-left">
							<thead className="bg-slate-50">
								<tr>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Customer</th>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Email</th>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Amount</th>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Date</th>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Status</th>
									<th className="py-4 px-5 text-sm font-semibold text-slate-500">Receipt</th>
								</tr>
							</thead>
							<tbody>
								{filteredTransactions.length === 0 ? (
									<tr>
										<td colSpan={6} className="py-16 text-center">
											<p className="text-slate-400 font-medium text-sm">No transactions match your search.</p>
										</td>
									</tr>
								) : filteredTransactions.map((transaction) => (
									<tr key={transaction.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
										<td className="py-5 px-5">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 grid place-items-center font-semibold">
													{transaction.user.fullName
														.split(' ')
														.map((part) => part[0])
														.slice(0, 2)
														.join('')}
												</div>
												<div>
													<p className="font-semibold text-brand-900">{transaction.user.fullName}</p>
												</div>
											</div>
										</td>
										<td className="py-5 px-5 text-slate-500 text-sm">{transaction.user.email}</td>
										<td className="py-5 px-5 font-semibold text-brand-600">{formatCurrency(transaction.amount)}</td>
										<td className="py-5 px-5 text-slate-500 text-sm">{formatDate(transaction.date)}</td>
										<td className="py-5 px-5">
											<span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles[transaction.status]}`}>
												{transaction.status}
											</span>
										</td>
										<td className="py-5 px-5">
											{transaction.receiptUrl && (
												<button
													onClick={() => { setReceiptUrl(transaction.receiptUrl); setShowReceipt(true); }}
													className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs underline cursor-pointer"
												>
													<Eye className="w-3 h-3" /> View Receipt
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>)}
			</div>

			<ReceiptPreviewModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} imageUrl={receiptUrl} />
		</div>
	);
};

export default ProductTransactions;
