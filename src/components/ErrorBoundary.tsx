import React, { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal, Shield } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Captured runtime window error:', event.error);
      if (event.error) {
        setError(event.error);
      } else if (event.message) {
        setError(new Error(event.message));
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.warn('Captured unhandled promise rejection (handled by ATLAS resilience layer):', event.reason);
      // Prevent browser default error banner / crash for benign background promises (e.g. popup closed, speech cancel)
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#020202] text-white p-6 flex items-center justify-center font-sans">
        <div className="max-w-2xl w-full bg-black/90 border border-red-500/50 rounded-xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] space-y-6">
          <div className="flex items-center gap-3 border-b border-red-500/30 pb-4">
            <Shield className="w-8 h-8 text-red-500 animate-pulse" />
            <div>
              <h1 className="text-xl font-black font-orbitron text-red-500 tracking-wider">
                SYSTEM DIAGNOSTIC FAULT
              </h1>
              <p className="text-xs font-mono text-white/60">
                ATLAS Mission Control caught an unhandled runtime exception.
              </p>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 font-mono text-xs text-red-300 space-y-2 overflow-x-auto">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>FAULT DETAIL: {error.name || 'Runtime Exception'}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">
              {error.message || 'An unexpected rendering error occurred.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> REBOOT MISSION CONTROL
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded flex items-center gap-2 transition-all cursor-pointer border border-white/20"
            >
              <Terminal className="w-4 h-4" /> CLEAR CACHE & REBOOT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
