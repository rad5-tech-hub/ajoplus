import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Loader2, Check } from 'lucide-react';
import { useCategories } from '@/app/store/PackageStore';
import { createCategory } from '@/api/categories';
import { useQueryClient } from '@tanstack/react-query';

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const CategorySelect = ({ value, onChange, disabled, error }: CategorySelectProps) => {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = categories.find((c) => c.id === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCreate(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) { setCreateError('Category name is required'); return; }
    setCreating(true);
    setCreateError('');
    try {
      const created = await createCategory({ name: newName.trim(), description: '' });
      await qc.invalidateQueries({ queryKey: ['categories'] });
      onChange(created.id);
      setShowCreate(false);
      setNewName('');
      setOpen(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(!open); }}
        disabled={disabled || catLoading}
        className={`w-full flex items-center justify-between px-4 py-3 text-base border rounded-2xl focus:outline-none focus:border-amber-600 bg-white disabled:bg-slate-50 transition-colors cursor-pointer
          ${error ? 'border-red-400' : 'border-amber-200'}`}
      >
        <span className={value ? 'text-blue-950' : 'text-slate-400'}>
          {catLoading ? 'Loading…' : selected ? selected.name : 'Select category'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-amber-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onChange(cat.id); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-amber-50 transition-colors flex items-center justify-between cursor-pointer
                ${cat.id === value ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-700'}`}
            >
              {cat.name}
              {cat.id === value && <Check className="w-4 h-4 text-amber-600" />}
            </button>
          ))}

          <div className="border-t border-amber-100">
            {!showCreate ? (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="w-full text-left px-4 py-3 text-sm text-amber-600 hover:bg-amber-50 font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create new category
              </button>
            ) : (
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setCreateError(''); }}
                  placeholder="Category name"
                  disabled={creating}
                  className="w-full px-3 py-2 text-sm border border-amber-200 rounded-xl focus:outline-none focus:border-amber-600 disabled:bg-slate-50"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreate(); } }}
                />
                {createError && <p className="text-xs text-red-500">{createError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowCreate(false); setNewName(''); setCreateError(''); }}
                    disabled={creating}
                    className="flex-1 px-3 py-1.5 border border-slate-300 text-slate-600 text-xs rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating || !newName.trim()}
                    className="flex-1 px-3 py-1.5 bg-amber-600 text-white text-xs rounded-xl hover:bg-amber-700 disabled:bg-amber-400 transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
