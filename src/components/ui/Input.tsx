import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          'w-full h-10 px-3 rounded-lg bg-input-bg text-text-primary placeholder:text-text-tertiary',
          'border border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand',
          'transition-colors',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
