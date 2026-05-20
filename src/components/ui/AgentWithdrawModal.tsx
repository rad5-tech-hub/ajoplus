// src/components/ui/AgentWithdrawModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAgentWithdrawal } from '@/api/agent';
import { formatCurrency } from '@/lib/currency';

interface AgentWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

const AgentWithdrawModal = ({ isOpen, onClose, availableBalance }: AgentWithdrawModalProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);

  const { mutate: submitWithdrawal, isPending } = useMutation({
    mutationFn: () => submitAgentWithdrawal({ amount: parsedAmount, description: description.trim() || 'Agent commission withdrawal' }),
    onSuccess: () => {
      setSubmittedAmount(parsedAmount);
      setIsSuccess(true);
      setErrorMessage('');
      queryClient.invalidateQueries({ queryKey: ['agentDashboard'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Withdrawal request failed. Please try again.';
      setErrorMessage(msg);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!isPending) handleClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isPending]);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setIsSuccess(false);
      setSubmittedAmount(0);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  const parsedAmount = parseInt(amount) || 0;
  const isExceeding = parsedAmount > availableBalance;
  const isValid = parsedAmount >= 100 && !isExceeding;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isPending) return;
    setErrorMessage('');
    submitWithdrawal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-2xl transition-all duration-300 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="p-1.5 -ml-1.5 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-blue-950">
            {isSuccess ? 'Withdrawal Submitted' : 'Withdraw Commission'}
          </h2>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="px-5 py-4 sm:px-7">
          {isSuccess ? (
            /* ── Success State ── */
            <div className="flex flex-col items-center text-center py-6">
              <div className="relative mb-5">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-1">Withdrawal Submitted!</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
                Your request for{' '}
                <span className="font-semibold text-slate-700">
                  {formatCurrency(submittedAmount)}
                </span>{' '}
                is pending admin approval.
              </p>

              <button
                onClick={handleClose}
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.985] text-white font-semibold py-3 rounded-2xl text-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-center">
                  <p className="text-xs text-amber-700 font-medium">Available Balance</p>
                  <p className="text-xl font-bold text-amber-700">{formatCurrency(availableBalance)}</p>
                </div>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Withdrawal Amount</label>
                    <button
                      type="button"
                      onClick={() => setAmount(String(availableBalance))}
                      disabled={isPending}
                      className="cursor-pointer text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Use Max
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₦</span>
                    <input
                      type="number"
                      value={amount}
                      onKeyDown={(e) => { if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') e.preventDefault(); }}
                      onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      disabled={isPending}
                      className={`w-full pl-9 pr-5 py-3 border rounded-2xl focus:outline-none text-base font-medium placeholder:text-slate-400 transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${isExceeding
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-amber-200 focus:border-amber-600'
                      }`}
                      min="100"
                      required
                    />
                  </div>
                  {isExceeding ? (
                    <p className="text-xs text-red-500 mt-1 pl-1">Amount exceeds your available balance</p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1 pl-1">Minimum ₦100 withdrawal</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Commission payout request"
                    disabled={isPending}
                    className="w-full px-4 py-3 border border-amber-200 rounded-2xl focus:outline-none focus:border-amber-600 h-20 resize-none text-sm leading-relaxed disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    `Withdraw ${formatCurrency(parsedAmount > 0 ? parsedAmount : 0)}`
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentWithdrawModal;
