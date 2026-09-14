import React from 'react';

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  active = false,
  onClick,
  icon,
  theme = 'light',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-[11px] md:text-xs',
    lg: 'px-5 py-2.5 text-xs md:text-sm',
  }[size];

  const themeClasses =
    theme === 'dark'
      ? active
        ? 'bg-white text-black border-white shadow-sm'
        : 'bg-transparent text-neutral-300 border-neutral-700 hover:border-neutral-400 hover:text-white'
      : active
      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900 hover:bg-neutral-50';

  return (
    <button
      type={type}
      role="button"
      aria-pressed={active}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border font-mono tracking-[0.15em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${sizeClasses} ${themeClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
