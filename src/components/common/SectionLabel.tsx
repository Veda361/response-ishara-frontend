import React from 'react';

interface SectionLabelProps {
  number?: string | number;
  label: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  number,
  label,
  theme = 'light',
  className = '',
}) => {
  const formattedNumber =
    number !== undefined
      ? typeof number === 'number'
        ? String(number).padStart(2, '0')
        : number
      : null;

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] select-none ${
        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
      } ${className}`}
    >
      {formattedNumber && (
        <span className={theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}>
          [ {formattedNumber} ]
        </span>
      )}
      <span>{label}</span>
    </div>
  );
};
