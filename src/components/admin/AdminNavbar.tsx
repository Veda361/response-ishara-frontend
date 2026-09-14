import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/admin.api';
import { BarChart3, Database, Download, LogOut, ArrowLeft, Loader2 } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const { adminKey, logout } = useAuth();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const isActive = (path: string) => location.pathname === path;

  const handleExportCsv = async () => {
    if (!adminKey) return;
    setIsExporting(true);
    try {
      const blob = await adminApi.downloadCsvExport(adminKey);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `isahara_surveys_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV Export failed:', err);
      alert('Failed to download CSV export. Please check connection.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left Side: Brand and Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1">
            <Link
              to="/admin/dashboard"
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                isActive('/admin') || isActive('/admin/dashboard')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Overview & Analytics</span>
            </Link>

            <Link
              to="/admin/surveys"
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                isActive('/admin/surveys')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Survey Responses</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title="Download full survey dataset as CSV"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
