import React from 'react';
import { Check } from 'lucide-react';

interface SurveyOptionProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onSelect: () => void;
  type?: 'radio' | 'checkbox';
  description?: string;
  theme?: 'light' | 'dark';
}

export const SurveyOption: React.FC<SurveyOptionProps> = ({
  label,
  emoji,
  selected,
  onSelect,
  type = 'radio',
  description,
  theme = 'light',
}) => {
  return (
    <button
      type="button"
      role={type}
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative flex w-full items-center justify-between gap-4 border p-4 text-left transition-all duration-300 ease-signature select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 cursor-pointer ${
        theme === 'dark'
          ? selected
            ? 'border-white bg-white text-black shadow-sm'
            : 'border-neutral-800 bg-[#111111] text-neutral-200 hover:border-neutral-600 hover:bg-[#161616]'
          : selected
          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
          : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900 hover:bg-neutral-50/80'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {emoji && (
          <span className="text-xl shrink-0 transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        )}
        <div>
          <span
            className={`block text-sm md:text-[15px] font-medium tracking-tight transition-colors ${
              selected
                ? theme === 'dark'
                  ? 'text-black'
                  : 'text-white'
                : theme === 'dark'
                ? 'text-neutral-200'
                : 'text-neutral-900'
            }`}
          >
            {label}
          </span>
          {description && (
            <span
              className={`block text-xs mt-0.5 ${
                selected
                  ? theme === 'dark'
                    ? 'text-neutral-700'
                    : 'text-neutral-300'
                  : 'text-neutral-500'
              }`}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Check / Radio Status Indicator */}
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors ${
          type === 'checkbox' ? 'rounded-none' : 'rounded-full'
        } ${
          selected
            ? theme === 'dark'
              ? 'bg-black text-white'
              : 'bg-white text-neutral-900'
            : theme === 'dark'
            ? 'border border-neutral-700 bg-transparent'
            : 'border border-neutral-300 bg-transparent group-hover:border-neutral-600'
        }`}
      >
        {selected &&
          (type === 'checkbox' ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <div
              className={`w-2 h-2 rounded-full ${
                theme === 'dark' ? 'bg-white' : 'bg-neutral-900'
              }`}
            />
          ))}
      </div>
    </button>
  );
};
