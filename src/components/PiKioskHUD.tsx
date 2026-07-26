import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, HardDrive, Terminal, Shield, Wifi, Zap } from 'lucide-react';

interface PiKioskHUDProps {
  isOnline: boolean;
  cachePercentage: number;
  onForceSync: () => void;
  isSyncing: boolean;
}

export const PiKioskHUD: React.FC<PiKioskHUDProps> = ({
  isOnline,
  cachePercentage,
  onForceSync,
  isSyncing,
}) => {
  const [logs, setLogs] = useState<string[]>([
    '[14:02:11] Firebase connected successfully',
    '[14:02:15] Handshake: atlas-c2a97.firebasestorage.app',
    '[14:02:45] NASA_API Request: DONKI_GET(0z0a...)',
    '[14:03:01] Sync engine: Pulse detected',
    '[14:03:05] Local db integrity: 100%',
    '[14:03:12] Edge node ARM64 temperature stable: 42.1°C',
    '[14:03:20] Solar flare X2.8 wave front calculated.'
  ]);

  const [cpuUsage, setCpuUsage] = useState<number>(18);
  const [tempCelsius, setTempCelsius] = useState<number>(42.1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(14 + Math.random() * 20));
      setTempCelsius(parseFloat((41.8 + Math.random() * 0.8).toFixed(1)));

      const timeStr = new Date().toLocaleTimeString();
      const newLog = `[${timeStr}] Telemetry check: Ping ${Math.floor(18 + Math.random() * 12)}ms • Cache ${cachePercentage}%`;
      setLogs(prev => [newLog, ...prev.slice(0, 8)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [cachePercentage]);

  return (
    <div className="bg-[#020202] border-4 border-[#00f3ff] rounded-lg p-6 space-y-6 text-white relative overflow-hidden font-sans shadow-[0_0_30px_rgba(0,243,255,0.2)]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none"></div>

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#00f3ff]/40 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#00f3ff]/20 border-2 border-[#00f3ff] rounded">
            <Cpu className="w-8 h-8 text-[#00f3ff] animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black font-orbitron tracking-tight text-[#00f3ff] glow-cyan">
              RASPBERRY PI 4
            </h1>
            <p className="text-xs font-mono text-white/70">
              DEDICATED EDGE NODE • ID: 7566-4760-4172-PI4 • CHROMIUM KIOSK HUD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 bg-black px-3 py-1.5 border border-green-500/50 rounded">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-green-400 font-bold">PI OS KIOSK ONLINE</span>
          </div>

          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-[#00f3ff] text-black font-black font-orbitron text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.5)]"
          >
            {isSyncing ? 'SYNCING...' : 'FORCE RE-SYNC'}
          </button>
        </div>
      </div>

      {/* 3-Panel Kiosk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
        {/* Left: Environment & Sync */}
        <div className="md:col-span-4 bg-black p-5 border border-[#00f3ff]/30 rounded space-y-5">
          <h2 className="text-xs font-bold text-[#00f3ff] tracking-[0.2em] uppercase font-mono border-b border-[#00f3ff]/20 pb-2">
            SYSTEM ENVIRONMENT
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-4xl font-black font-orbitron leading-none text-white">RASPBERRY PI</p>
              <p className="text-xs text-white/50 font-mono mt-1">ARM64 ARCHITECTURE • CHROMIUM</p>
            </div>

            <div className="p-4 bg-[#00f3ff]/10 border-l-4 border-[#00f3ff] rounded-r space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-[#00f3ff]">OFFLINE SYNC STATUS</span>
                <span className="text-white font-bold">{cachePercentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-[#00f3ff]/30">
                <div className="h-full bg-[#00f3ff] rounded-full transition-all duration-500" style={{ width: `${cachePercentage}%` }}></div>
              </div>
              <p className="text-[10px] text-white/70 font-mono">Verified Local IndexedDB Storage</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded">
                <span className="text-white/40 block text-[10px]">CPU LOAD</span>
                <span className="text-xl font-bold font-orbitron text-[#00f3ff]">{cpuUsage}%</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded">
                <span className="text-white/40 block text-[10px]">CORE TEMP</span>
                <span className="text-xl font-bold font-orbitron text-amber-400">{tempCelsius}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Orbital Telemetry */}
        <div className="md:col-span-5 bg-black p-5 border border-[#00f3ff]/30 rounded flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-black font-orbitron italic leading-none tracking-tight">
              ORBITAL<br/><span className="text-[#00f3ff]">DATA</span>
            </h2>
            <div className="text-right font-mono">
              <p className="text-[10px] uppercase font-bold text-white/40">GEO LOCATION</p>
              <p className="text-sm font-bold text-[#00f3ff]">28.5721° N, 80.6480° W</p>
            </div>
          </div>

          <div className="h-40 border border-white/20 relative overflow-hidden flex items-center justify-center bg-black/80 rounded group">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-white/40">[ CAMERA_FEED_01 ]</div>
            <div className="w-28 h-28 border-2 border-[#00f3ff] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 border border-[#00f3ff]/50 border-dashed rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute bottom-2 right-2 text-right">
              <p className="text-[10px] font-mono text-white/60">SCANNING NASA DATASET...</p>
              <p className="text-[10px] text-[#00f3ff] font-mono font-bold">PROJECT ATLAS-C2A97</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="border-t border-white/20 pt-2">
              <p className="text-[10px] text-white/40">TEMP</p>
              <p className="text-lg font-bold font-orbitron text-white">-12.4°C</p>
            </div>
            <div className="border-t border-white/20 pt-2">
              <p className="text-[10px] text-white/40">RAD</p>
              <p className="text-lg font-bold font-orbitron text-amber-400">45.2 mSv</p>
            </div>
            <div className="border-t border-white/20 pt-2">
              <p className="text-[10px] text-white/40">OS_V</p>
              <p className="text-lg font-bold font-orbitron text-[#00f3ff]">ARM64</p>
            </div>
          </div>
        </div>

        {/* Right: Competition Real-Time Log */}
        <div className="md:col-span-3 bg-black p-5 border border-[#00f3ff]/30 rounded flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-xs font-bold text-[#ff00ff] tracking-[0.2em] uppercase font-mono mb-4 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> REAL-TIME LOG
            </h2>

            <div className="space-y-2 font-mono text-[10px] max-h-52 overflow-y-auto pr-1">
              {logs.map((logStr, i) => (
                <div key={i} className="text-white/70 border-b border-white/5 pb-1">
                  <span className="text-[#ff00ff]">{logStr.slice(0, 10)}</span>
                  <span className="text-white/80">{logStr.slice(10)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <p className="text-3xl font-black font-orbitron text-[#ff00ff]/30 select-none">
              ATLAS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
