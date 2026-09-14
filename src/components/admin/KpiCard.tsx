import React from 'react';
import { SectionLabel } from '../common/SectionLabel';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  index?: string | number;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  index,
}) => {
  return (
    <div className="border border-neutral-300 bg-white p-6 transition-all duration-300 hover:border-neutral-900 group">
      <div className="flex items-center justify-between gap-2 mb-3">
        <SectionLabel
          number={index}
          label={title}
          className="text-neutral-500 group-hover:text-neutral-900 transition-colors"
        />
        {icon && (
          <div className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-2">
        <span className="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-950 font-sans">
          {value}
        </span>
        {trend && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 border border-neutral-300 text-neutral-800 bg-neutral-50">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-neutral-500 font-mono tracking-wide truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
