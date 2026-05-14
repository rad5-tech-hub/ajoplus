import { Plus } from 'lucide-react';

interface SavingsSetupButtonProps {
  onClick: () => void;
}

const SavingsSetupButton = ({ onClick }: SavingsSetupButtonProps) => (
  <button
    onClick={onClick}
    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.985] text-white font-semibold py-3 px-6 rounded-2xl text-sm transition-all duration-200 shadow-sm cursor-pointer"
  >
    <Plus className="w-4 h-4" />
    Set Up New Savings
  </button>
);

export default SavingsSetupButton;
