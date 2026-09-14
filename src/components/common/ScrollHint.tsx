import React from 'react';
import { ArrowDown } from 'lucide-react';

interface ScrollHintProps {
  label?: string;
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const ScrollHint: React.FC<ScrollHintProps> = ({
  label = 'SCROLL TO EXPLORE',
  theme = 'light',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-hidden={!onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-transform duration-300 hover:scale-110 ${
          theme === 'dark'
            ? 'border-neutral-700 text-neutral-400'
            : 'border-neutral-300 text-neutral-600'
        }`}
      >
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </div>
      <span
        className={`font-mono text-[10px] tracking-[0.2em] uppercase ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};
