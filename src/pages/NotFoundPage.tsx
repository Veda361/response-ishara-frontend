import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <span className="text-6xl mb-4">🚗💨</span>
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">404 — Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-600 max-w-sm">
        The route you are trying to access does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Isahara Home</span>
      </Link>
    </div>
  );
};
