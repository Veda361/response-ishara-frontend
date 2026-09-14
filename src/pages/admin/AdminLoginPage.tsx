import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Shield, KeyRound, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [keyInput, setKeyInput] = useState<string>('');
  const { login, isVerifying, authError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    const success = await login(keyInput.trim());
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to public survey</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white mb-6 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Founder & Admin Portal
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Enter the admin secret passkey configured on the deployed Render backend to access real-time analytics and student survey responses.
          </p>

          {authError && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Passkey</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter ADMIN_SECRET_KEY..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !keyInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Key with Backend...</span>
                </>
              ) : (
                <span>Authenticate & Enter</span>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-[11px] text-slate-400">
              Protected by lightweight passkey guard on <code className="text-slate-600 font-mono">/api/v1/admin/*</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
