// src/components/ui/Button.tsx
import { cn } from '@/lib/utils'; 
import { ArrowRight } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'default' | 'lg';
  showArrow?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  showArrow = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-semibold rounded-3xl transition-all duration-300 active:scale-[0.985]",
        
        // Size
        size === 'lg' && "px-10 py-4 text-base",
        size === 'default' && "px-8 py-3.5 text-sm",

        // Variants
        variant === 'primary' && [
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200",
          "hover:shadow-xl hover:shadow-emerald-300"
        ],
        
        variant === 'outline' && [
          "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
          "hover:text-emerald-700 hover:border-emerald-700"
        ],

        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight 
            className="w-5 h-5 transition-transform group-hover:translate-x-0.5" 
            strokeWidth={2.75}
          />
        )}
      </span>
    </button>
  );
}