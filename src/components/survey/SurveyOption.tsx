import React from 'react';
import { Check } from 'lucide-react';

interface SurveyOptionProps {
  label: string;
  emoji?: string;
  selected: boolean;
  onSelect: () => void;
  type?: 'radio' | 'checkbox';
  description?: string;
}

export const SurveyOption: React.FC<SurveyOptionProps> = ({
  label,
  emoji,
  selected,
  onSelect,
  type = 'radio',
  description,
}) => {
  return (
    <button
      type="button"
      role={type}
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all duration-200 select-none ${
        selected
          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm shadow-emerald-600/10 ring-1 ring-emerald-600'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {emoji && (
          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
            {emoji}
          </span>
        )}
        <div>
          <span
            className={`block text-base font-medium transition-colors ${
              selected ? 'text-emerald-950 font-semibold' : 'text-slate-800'
            }`}
          >
            {label}
          </span>
          {description && (
            <span className="block text-xs text-slate-500 mt-0.5">{description}</span>
          )}
        </div>
      </div>

      {/* Indicator icon */}
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center transition-all ${
          type === 'checkbox' ? 'rounded-md' : 'rounded-full'
        } ${
          selected
            ? 'bg-emerald-600 text-white'
            : 'border border-slate-300 bg-white group-hover:border-slate-400'
        }`}
      >
        {selected && (
          type === 'checkbox' ? (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-white" />
          )
        )}
      </div>
    </button>
  );
};
