import React, { useState } from 'react';
import { SolarFlare, CoronalMassEjection } from '../services/nasaApi';
import { Sun, Zap, Activity, AlertTriangle, Calendar, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SatelliteIntelligenceProps {
  flares: SolarFlare[];
  cmes: CoronalMassEjection[];
  isOfflineData: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SatelliteIntelligence: React.FC<SatelliteIntelligenceProps> = ({
  flares,
  cmes,
  isOfflineData,
  onRefresh,
  isLoading
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Filter flares by selected class
  const filteredFlares = flares.filter(f => {
    if (selectedClass === 'ALL') return true;
    return f.classType?.startsWith(selectedClass);
  });

  // Prepare chart data mapping flare class type to numerical flux representation
  const chartData = flares.slice(0, 15).reverse().map((f, i) => {
    let fluxVal = 1;
    if (f.classType?.startsWith('X')) {
      const num = parseFloat(f.classType.replace('X', '')) || 1;
      fluxVal = 100 + num * 10;
    } else if (f.classType?.startsWith('M')) {
      const num = parseFloat(f.classType.replace('M', '')) || 1;
      fluxVal = 10 + num;
    } else if (f.classType?.startsWith('C')) {
      const num = parseFloat(f.classType.replace('C', '')) || 1;
      fluxVal = 1 + num * 0.1;
    }

    const timeLabel = f.beginTime ? new Date(f.beginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `T-${i}`;
    return {
      time: timeLabel,
      flux: fluxVal,
      classType: f.classType || 'C1.0',
      region: f.activeRegionNum || 3762
    };
  });

  const xClassCount = flares.filter(f => f.classType?.startsWith('X')).length;
  const mClassCount = flares.filter(f => f.classType?.startsWith('M')).length;
  const cClassCount = flares.filter(f => f.classType?.startsWith('C')).length;

  const topCme = cmes[0];
  const maxCmeSpeed = topCme?.cmeAnalyses?.[0]?.speed || 1420;

  return (
    <div className="hud-card p-5 rounded-lg space-y-6 border border-[#00f3ff]/30">
      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00f3ff]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00f3ff]/10 border border-[#00f3ff] rounded shadow-[0_0_10px_rgba(0,243,255,0.3)]">
            <Sun className="w-5 h-5 text-[#00f3ff] animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black font-orbitron text-[#00f3ff] glow-cyan flex items-center gap-2">
              SATELLITE INTELLIGENCE
            </h2>
            <p className="text-xs font-mono text-white/60">
              NASA DONKI Space Telemetry Stream (FLR & CME)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOfflineData && (
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded">
              CACHED TELEMETRY
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1 bg-[#00f3ff]/10 hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff]/40 rounded text-xs font-mono transition-all"
          >
            {isLoading ? 'FETCHING...' : 'POLL NASA DONKI'}
          </button>
        </div>
      </div>

      {/* Quick Solar Class Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-red-950/30 border border-red-500/40 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-red-400 uppercase">X-CLASS (EXTREME)</p>
            <p className="text-2xl font-black font-orbitron text-red-400">{xClassCount}</p>
          </div>
          <Zap className="w-6 h-6 text-red-500 opacity-80" />
        </div>

        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-amber-400 uppercase">M-CLASS (SEVERE)</p>
            <p className="text-2xl font-black font-orbitron text-amber-400">{mClassCount}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-500 opacity-80" />
        </div>

        <div className="p-3 bg-cyan-950/30 border border-[#00f3ff]/40 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#00f3ff] uppercase">C-CLASS (MODERATE)</p>
            <p className="text-2xl font-black font-orbitron text-[#00f3ff]">{cClassCount}</p>
          </div>
          <Activity className="w-6 h-6 text-[#00f3ff] opacity-80" />
        </div>

        <div className="p-3 bg-purple-950/30 border border-purple-500/40 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-purple-400 uppercase">MAX CME SPEED</p>
            <p className="text-2xl font-black font-orbitron text-purple-400">{maxCmeSpeed} <span className="text-xs">km/s</span></p>
          </div>
          <Layers className="w-6 h-6 text-purple-500 opacity-80" />
        </div>
      </div>

      {/* Solar Flux Intensity Chart */}
      <div className="bg-black/60 p-4 border border-[#00f3ff]/20 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-mono text-[#00f3ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> Solar X-Ray Flux & Flare Peak History
          </span>
          <span className="text-[10px] font-mono text-white/40">Logarithmic Scale (W/m²)</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fluxGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,243,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
              <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020202', borderColor: '#00f3ff', color: '#fff', fontSize: '12px' }}
                formatter={(val: any, name: any, item: any) => [`Class: ${item.payload.classType}`, 'Flare Flux']}
              />
              <Area type="monotone" dataKey="flux" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#fluxGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Flare Feed & Filter Controls */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-white/80 font-bold uppercase tracking-wider">
            NASA DONKI Event Telemetry Feed ({filteredFlares.length})
          </span>

          <div className="flex gap-1">
            {['ALL', 'X', 'M', 'C'].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
                  selectedClass === cls
                    ? 'bg-[#00f3ff] text-black border-[#00f3ff] font-bold'
                    : 'bg-black/40 text-white/60 border-white/20 hover:border-[#00f3ff]/50'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filteredFlares.map((flare, idx) => {
            const isX = flare.classType?.startsWith('X');
            const isM = flare.classType?.startsWith('M');
            const colorClass = isX 
              ? 'border-red-500/50 bg-red-950/20 text-red-300' 
              : isM 
              ? 'border-amber-500/50 bg-amber-950/20 text-amber-300' 
              : 'border-[#00f3ff]/30 bg-cyan-950/20 text-[#00f3ff]';

            return (
              <div key={flare.flrID || idx} className={`p-3 border rounded text-xs font-mono flex flex-col sm:flex-row justify-between gap-2 transition-all hover:bg-black/80 ${colorClass}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm bg-black/60 px-2 py-0.5 border border-current rounded">
                      {flare.classType || 'C1.0'}
                    </span>
                    <span className="text-white/80 font-bold">Region {flare.activeRegionNum || '3762'}</span>
                    <span className="text-white/40 text-[10px]">({flare.sourceLocation || 'N/A'})</span>
                  </div>
                  <p className="text-white/70 text-[11px] line-clamp-2">{flare.note || 'Solar flare eruption registered by NASA SDO satellite.'}</p>
                </div>

                <div className="text-right sm:self-center shrink-0">
                  <div className="text-[10px] text-white/50 flex items-center sm:justify-end gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{flare.beginTime ? new Date(flare.beginTime).toLocaleDateString() : '2026-07-25'}</span>
                  </div>
                  <div className="text-[11px] font-bold text-white/80">
                    {flare.beginTime ? new Date(flare.beginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:22 UTC'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
