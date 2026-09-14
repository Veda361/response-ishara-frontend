import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
  loading = false,
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-xs md:text-sm',
    lg: 'px-8 py-4 text-sm md:text-base',
  }[size];

  // Primary: dark background, white text, slide-fill lighter panel on hover
  // Dark: on dark sections, white button sliding to dark or inverse
  // Outline: border with slide-fill ink
  const baseStyles =
    'group relative overflow-hidden inline-flex items-center justify-center font-mono uppercase tracking-[0.18em] font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  let colorClasses = '';
  let slideBg = '';

  if (variant === 'primary') {
    colorClasses = 'bg-neutral-900 text-white border border-neutral-900';
    slideBg = 'bg-neutral-800';
  } else if (variant === 'dark') {
    colorClasses = 'bg-white text-neutral-900 border border-white';
    slideBg = 'bg-neutral-200';
  } else if (variant === 'outline') {
    colorClasses = 'bg-transparent text-neutral-900 border border-neutral-900 hover:text-white';
    slideBg = 'bg-neutral-900';
  } else {
    // Secondary / ghost
    colorClasses = 'bg-transparent text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:border-neutral-900';
    slideBg = 'bg-neutral-100';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`${baseStyles} ${colorClasses} ${sizeClasses} ${className}`}
    >
      {/* Signature sliding fill background layer */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-signature pointer-events-none ${slideBg}`}
      />

      {/* Content wrapper */}
      <span className="relative z-10 flex items-center gap-2.5">
        {loading ? (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                {icon}
              </span>
            )}
          </>
        )}
      </span>
    </button>
  );
};
