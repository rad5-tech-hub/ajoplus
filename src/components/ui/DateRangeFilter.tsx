import { useState } from 'react';
import { Filter } from 'lucide-react';

export type DatePreset = 'all' | 'today' | 'week' | 'sixMonths' | 'custom';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
  resultCount?: number;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

const presets: { value: DatePreset; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'sixMonths', label: 'Last 6 Months' },
  { value: 'custom', label: 'Custom' },
];

export default function DateRangeFilter({ onChange, resultCount }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [error, setError] = useState('');

  const applyPreset = (p: DatePreset) => {
    setPreset(p);
    setError('');
    const now = new Date();
    switch (p) {
      case 'all':
        onChange({ from: null, to: null });
        return;
      case 'today':
        onChange({ from: startOfDay(now), to: endOfDay(now) });
        return;
      case 'week': {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        onChange({ from: startOfDay(weekAgo), to: endOfDay(now) });
        return;
      }
      case 'sixMonths': {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        onChange({ from: startOfDay(sixMonthsAgo), to: endOfDay(now) });
        return;
      }
      case 'custom':
        break;
    }
  };

  const handleApplyCustom = () => {
    setError('');
    if (!customFrom || !customTo) return;
    const from = startOfDay(new Date(customFrom));
    const to = endOfDay(new Date(customTo));
    if (from > to) {
      setError('Start date cannot be after end date');
      return;
    }
    onChange({ from, to });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <span className="text-sm font-medium text-slate-600 mr-1 flex items-center gap-1.5">
        <Filter className="w-4 h-4" /> Filter by date:
      </span>

      <div className="flex gap-1.5 flex-wrap">
        {presets.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => applyPreset(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              preset === value
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto transition-all duration-200">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">From</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">To</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
          <button
            onClick={handleApplyCustom}
            disabled={!customFrom || !customTo}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            Apply
          </button>
          {error && <p className="text-red-500 text-xs w-full">{error}</p>}
        </div>
      )}

      {resultCount !== undefined && (
        <span className="text-sm text-slate-500 ml-auto">
          {resultCount} result{resultCount !== 1 ? 's' : ''} found
        </span>
      )}
    </div>
  );
}
