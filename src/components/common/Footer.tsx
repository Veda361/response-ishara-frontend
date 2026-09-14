import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-6 text-slate-500 text-xs">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span>🚗</span>
          <span className="font-semibold text-slate-800">Isahara Mobility Initiative</span>
          <span>•</span>
          <span>College Student Transportation Research</span>
        </div>

        <div className="text-slate-400 text-[11px]">
          All responses are strictly confidential & anonymized
        </div>
      </div>
    </footer>
  );
};
