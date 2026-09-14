import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { surveyApi } from '../../api/survey.api';

export const Navbar: React.FC = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    surveyApi
      .checkHealth()
      .then((res) => {
        if (mounted) setIsBackendHealthy(res.data?.status === 'healthy');
      })
      .catch(() => {
        if (mounted) setIsBackendHealthy(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🚗</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">Isahara</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Student Travel Survey
            </span>
          </div>
        </Link>

        {/* Live Status indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 border border-slate-200"
          title={
            isBackendHealthy === null
              ? 'Checking server status...'
              : isBackendHealthy
              ? 'Connected to Isahara research server'
              : 'Server offline or unavailable'
          }
        >
          <Activity
            className={`w-3.5 h-3.5 ${
              isBackendHealthy === null
                ? 'text-amber-500 animate-pulse'
                : isBackendHealthy
                ? 'text-emerald-500'
                : 'text-rose-500'
            }`}
          />
          <span className="text-slate-600 text-[11px] font-medium">
            {isBackendHealthy === null ? 'Connecting...' : isBackendHealthy ? 'Server Live' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};
