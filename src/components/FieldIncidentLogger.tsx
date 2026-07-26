import React, { useState, useEffect } from 'react';
import { FieldLogEntry, saveFieldLog } from '../firebase';
import { Send, ShieldAlert, CheckCircle, Clock, Smartphone, HardDrive, UserCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface FieldIncidentLoggerProps {
  logs: FieldLogEntry[];
  isOnline: boolean;
  onLogSaved: () => void;
  currentUser?: User | null;
}

export const FieldIncidentLogger: React.FC<FieldIncidentLoggerProps> = ({
  logs,
  isOnline,
  onLogSaved,
  currentUser,
}) => {
  const [operator, setOperator] = useState<string>('Operator-Sentinel-1');

  useEffect(() => {
    if (currentUser) {
      setOperator(currentUser.displayName || currentUser.email?.split('@')[0] || 'COMMANDER');
    }
  }, [currentUser]);
  const [severity, setSeverity] = useState<FieldLogEntry['severity']>('ELEVATED');
  const [category, setCategory] = useState<FieldLogEntry['category']>('CYBER_DEFENSE');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await saveFieldLog({
        deviceNode: isOnline ? 'Mission Control Sentinel' : 'Field Mobile Node (Offline)',
        operator: operator.trim() || 'Operator-01',
        severity,
        category,
        message: message.trim(),
        threatScore: severity === 'CRITICAL' ? 92 : severity === 'ELEVATED' ? 68 : 25
      });

      setMessage('');
      setSubmitSuccess(true);
      onLogSaved();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('Field log creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hud-card p-5 rounded-lg space-y-4 border border-[#00f3ff]/30">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-[#00f3ff]/20 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#ff00ff]" />
          <h2 className="text-lg font-black font-orbitron text-white glow-cyan">
            FIELD INCIDENT & TELEMETRY LOGGER
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <Smartphone className="w-3.5 h-3.5 text-[#00f3ff]" />
          <span className="text-white/60">Cross-Device Sync:</span>
          <span className={isOnline ? 'text-green-400 font-bold' : 'text-amber-400 font-bold'}>
            {isOnline ? 'FIRESTORE ONLINE' : 'LOCAL CACHE QUEUE'}
          </span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/80 border border-[#00f3ff]/30 rounded-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <label className="block text-white/50 text-[10px] mb-1">OPERATOR ID</label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-black border border-white/20 rounded p-1.5 text-white focus:border-[#00f3ff] focus:outline-none"
              placeholder="Operator ID..."
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] mb-1">INCIDENT SEVERITY</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as FieldLogEntry['severity'])}
              className="w-full bg-black border border-white/20 rounded p-1.5 text-white focus:border-[#00f3ff] focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL (Red Alert)</option>
              <option value="ELEVATED">ELEVATED (Warning)</option>
              <option value="NOMINAL">NOMINAL (Standard)</option>
              <option value="INFO">INFO (Telemetry)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/50 text-[10px] mb-1">LOG CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FieldLogEntry['category'])}
              className="w-full bg-black border border-white/20 rounded p-1.5 text-white focus:border-[#00f3ff] focus:outline-none"
            >
              <option value="CYBER_DEFENSE">CYBER DEFENSE</option>
              <option value="SOLAR_FLARE">SOLAR FLARE</option>
              <option value="CME_IMPACT">CME IMPACT</option>
              <option value="SATELLITE_DRIFT">SATELLITE DRIFT</option>
              <option value="EDGE_SYNC">EDGE PI4 SYNC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-[10px] mb-1">FIELD REPORT / LOG MESSAGE</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Record incident report, telemetry anomaly, or field sentinel observation..."
            className="w-full bg-black border border-white/20 rounded p-2 text-xs font-mono text-white focus:border-[#00f3ff] focus:outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          {submitSuccess && (
            <span className="text-xs font-mono text-green-400 flex items-center gap-1 font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> Incident Logged to {isOnline ? 'Firebase' : 'Local Queue'}
            </span>
          )}
          {!submitSuccess && (
            <span className="text-[10px] font-mono text-white/40">
              Auto-syncs across Mission Control, Mobile & Raspberry Pi
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="px-4 py-2 bg-[#00f3ff] text-black font-mono font-bold text-xs rounded hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'TRANSMITTING...' : 'RECORD FIELD LOG'}</span>
          </button>
        </div>
      </form>

      {/* Real-Time Field Incident Stream */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-white/60 font-bold uppercase tracking-wider block">
          REAL-TIME REAL-TIME LOG STREAM ({logs.length})
        </span>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {logs.map((log, idx) => {
            const isCrit = log.severity === 'CRITICAL';
            const isElev = log.severity === 'ELEVATED';

            return (
              <div
                key={log.id || idx}
                className={`p-3 border rounded text-xs font-mono flex flex-col sm:flex-row justify-between gap-2 bg-black/60 ${
                  isCrit
                    ? 'border-red-500/50 text-red-300'
                    : isElev
                    ? 'border-amber-500/50 text-amber-300'
                    : 'border-white/10 text-white/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded border border-current">
                      {log.severity}
                    </span>
                    <span className="text-[#00f3ff] font-bold">[{log.category}]</span>
                    <span className="text-white/40 text-[10px]">Node: {log.deviceNode}</span>
                    {log.offlineCreated && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 rounded flex items-center gap-0.5">
                        <HardDrive className="w-2.5 h-2.5" /> Offline Queued
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-[11px]">{log.message}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-white/40 flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[9px] text-white/50 block">{log.operator}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
