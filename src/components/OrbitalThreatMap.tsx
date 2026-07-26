import React, { useState } from 'react';
import { Globe, Radio, Shield, AlertTriangle, Eye } from 'lucide-react';

interface SatelliteNode {
  id: string;
  name: string;
  type: 'LEO' | 'MEO' | 'GEO';
  altitudeKm: number;
  seuRatePerHr: number;
  radiationExposure: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
  status: 'OPERATIONAL' | 'SAFE_MODE' | 'DEGRADED';
  x: number; // percentage offset on map
  y: number;
}

const SATELLITE_NODES: SatelliteNode[] = [
  { id: 'sat-1', name: 'ISS (Zarya)', type: 'LEO', altitudeKm: 420, seuRatePerHr: 12.4, radiationExposure: 'HIGH', status: 'OPERATIONAL', x: 38, y: 35 },
  { id: 'sat-2', name: 'Sentinel-6 Michael Freilich', type: 'LEO', altitudeKm: 1336, seuRatePerHr: 24.8, radiationExposure: 'CRITICAL', status: 'DEGRADED', x: 28, y: 55 },
  { id: 'sat-3', name: 'Starlink Constellation Array #402', type: 'LEO', altitudeKm: 550, seuRatePerHr: 18.2, radiationExposure: 'HIGH', status: 'OPERATIONAL', x: 62, y: 28 },
  { id: 'sat-4', name: 'GPS NAVSTAR IIF-12', type: 'MEO', altitudeKm: 20200, seuRatePerHr: 4.1, radiationExposure: 'MODERATE', status: 'OPERATIONAL', x: 75, y: 68 },
  { id: 'sat-5', name: 'GOES-18 Geostationary', type: 'GEO', altitudeKm: 35786, seuRatePerHr: 2.8, radiationExposure: 'MODERATE', status: 'OPERATIONAL', x: 18, y: 78 }
];

export const OrbitalThreatMap: React.FC = () => {
  const [selectedSat, setSelectedSat] = useState<SatelliteNode>(SATELLITE_NODES[1]);
  const [safeModes, setSafeModes] = useState<Record<string, boolean>>({});

  const toggleSafeMode = (id: string) => {
    setSafeModes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="hud-card p-5 rounded-lg space-y-4 border border-[#00f3ff]/30">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-[#00f3ff]/20 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#00f3ff] animate-spin-slow" />
          <h2 className="text-lg font-black font-orbitron text-[#00f3ff] glow-cyan">
            ORBITAL THREAT MAP & SATELLITE TRACKER
          </h2>
        </div>
        <span className="text-[10px] font-mono text-white/50 bg-black/60 px-2 py-1 border border-white/10 rounded">
          REAL-TIME LEO/GEO CONSTELLATION SIMULATION
        </span>
      </div>

      {/* Main Visual Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Map Canvas */}
        <div className="lg:col-span-8 bg-black/90 border border-[#00f3ff]/30 rounded-lg h-80 relative overflow-hidden flex items-center justify-center p-4">
          {/* Background Space & Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

          {/* Solar Wind Wave Front Animation */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-amber-500/20 via-red-500/10 to-transparent pointer-events-none border-r border-amber-500/40 animate-pulse">
            <span className="absolute top-2 left-2 text-[9px] font-mono text-amber-400">
              [ SOLAR PLASMA WAVE FRONT: 1,420 km/s ]
            </span>
          </div>

          {/* Central Earth Representation */}
          <div className="relative w-44 h-44 rounded-full border-2 border-[#00f3ff]/60 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.2)]">
            {/* Atmosphere Aura */}
            <div className="absolute -inset-2 rounded-full border border-[#00f3ff]/30 border-dashed animate-spin-slow"></div>
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-900/60 via-blue-950/80 to-black border border-[#00f3ff]/40 flex flex-col items-center justify-center text-center p-2">
              <Globe className="w-10 h-10 text-[#00f3ff] mb-1" />
              <span className="text-[10px] font-orbitron font-bold text-white">EARTH L1</span>
              <span className="text-[8px] font-mono text-[#00f3ff]">28.57° N, 80.64° W</span>
            </div>
          </div>

          {/* Orbit Rings */}
          <div className="absolute w-64 h-64 border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute w-80 h-80 border border-white/5 rounded-full pointer-events-none"></div>

          {/* Satellite Interactive Nodes */}
          {SATELLITE_NODES.map((node) => {
            const isSelected = selectedSat.id === node.id;
            const isSafe = safeModes[node.id];
            const colorClass = isSafe
              ? 'bg-blue-500 text-black border-white'
              : node.radiationExposure === 'CRITICAL'
              ? 'bg-red-500 text-black border-red-300 animate-ping-slow'
              : node.radiationExposure === 'HIGH'
              ? 'bg-amber-400 text-black border-amber-200'
              : 'bg-[#00f3ff] text-black border-cyan-200';

            return (
              <button
                key={node.id}
                onClick={() => setSelectedSat(node)}
                style={{ top: `${node.y}%`, left: `${node.x}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border shadow-lg transition-all cursor-pointer group ${colorClass} ${
                  isSelected ? 'ring-4 ring-[#00f3ff] scale-125' : 'hover:scale-110'
                }`}
                title={`${node.name} (${node.type})`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black/90 text-white font-mono text-[9px] px-1.5 py-0.5 border border-white/20 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {node.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Detailed Telemetry */}
        <div className="lg:col-span-4 bg-black/80 border border-[#00f3ff]/30 rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-3">
              <div>
                <span className="text-[9px] font-mono bg-[#00f3ff]/20 text-[#00f3ff] px-1.5 py-0.5 rounded border border-[#00f3ff]/40">
                  {selectedSat.type} ORBIT
                </span>
                <h3 className="text-sm font-bold font-orbitron text-white mt-1">
                  {selectedSat.name}
                </h3>
              </div>
              <Eye className="w-4 h-4 text-[#00f3ff]" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/50">ALTITUDE:</span>
                <span className="font-bold text-white">{selectedSat.altitudeKm.toLocaleString()} km</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/50">RADIATION DOSAGE:</span>
                <span className={`font-bold ${
                  selectedSat.radiationExposure === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {selectedSat.radiationExposure}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-white/50">SEU ERROR RATE:</span>
                <span className="font-bold text-[#ff00ff]">{selectedSat.seuRatePerHr} upsets/hr</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">CURRENT STATE:</span>
                <span className={`font-bold ${
                  safeModes[selectedSat.id] ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {safeModes[selectedSat.id] ? 'SAFE MODE (PROTECTED)' : selectedSat.status}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => toggleSafeMode(selectedSat.id)}
              className={`w-full py-2 rounded font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                safeModes[selectedSat.id]
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-[#00f3ff] text-black hover:bg-white'
              }`}
            >
              {safeModes[selectedSat.id] ? 'RESUME FULL TELEMETRY MODE' : 'ENGAGE SAFE MODE ATTITUDE'}
            </button>
            <p className="text-[9px] font-mono text-white/40 text-center">
              Reconfigures solar arrays & disables sensitive memory sectors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
