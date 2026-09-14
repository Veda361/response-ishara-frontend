import React from 'react';
import { SectionLabel } from './SectionLabel';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200/80 bg-[#fcfcfc] py-12 text-neutral-600">
      <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              ISHARA MOBILITY SYSTEM
            </span>
            <span className="text-neutral-300">•</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              STUDENT RESEARCH ARCHIVE
            </span>
          </div>
          <p className="text-xs text-neutral-500 max-w-md">
            Dedicated to validating transit frictions, wait-time bottlenecks, and emergency ride signals across campus ecosystems.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <SectionLabel label="ANONYMOUS & CONFIDENTIAL" number="SEC" />
          <div className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
            © {new Date().getFullYear()} ISHARA. ALL DATA ANONYMIZED.
          </div>
        </div>
      </div>
    </footer>
  );
};
