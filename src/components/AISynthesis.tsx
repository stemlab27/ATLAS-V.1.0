import React, { useState } from 'react';
import { ThreatReport, generateThreatIntelligenceReport } from '../services/geminiSynthesis';
import { SolarFlare, CoronalMassEjection } from '../services/nasaApi';
import { Cpu, ShieldAlert, Zap, Radio, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';

interface AISynthesisProps {
  report: ThreatReport | null;
  flares: SolarFlare[];
  cmes: CoronalMassEjection[];
  onReportGenerated: (newReport: ThreatReport) => void;
}

export const AISynthesis: React.FC<AISynthesisProps> = ({
  report,
  flares,
  cmes,
  onReportGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRunSynthesis = async () => {
    setIsGenerating(true);
    try {
      const newReport = await generateThreatIntelligenceReport(flares, cmes);
      onReportGenerated(newReport);
    } catch (err) {
      console.error('Gemini synthesis trigger error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }).catch((err) => {
        console.warn("Clipboard write failed:", err);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      });
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (!report) {
    return (
      <div className="hud-card-magenta p-6 rounded-lg border border-[#ff00ff]/30 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-[#ff00ff] mx-auto animate-pulse" />
        <h3 className="text-lg font-black font-orbitron text-[#ff00ff]">GEMINI AI THREAT SYNTHESIS ENGINE</h3>
        <p className="text-xs font-mono text-white/70 max-w-md mx-auto">
          Translating NASA space weather telemetry into actionable aerospace cybersecurity risk scores and defense protocols.
        </p>
        <button
          onClick={handleRunSynthesis}
          disabled={isGenerating}
          className="px-5 py-2.5 bg-[#ff00ff] text-black font-black font-orbitron text-xs rounded uppercase tracking-wider box-glow-magenta hover:bg-white transition-all cursor-pointer"
        >
          {isGenerating ? 'ANALYZING TELEMETRY...' : 'GENERATE AI THREAT REPORT'}
        </button>
      </div>
    );
  }

  const score = report.overallRiskScore || 88;
  const isCritical = score >= 75;
  const isElevated = score >= 50 && score < 75;

  const scoreColor = isCritical ? 'text-red-500' : isElevated ? 'text-amber-400' : 'text-[#00f3ff]';
  const scoreBg = isCritical ? 'bg-red-500' : isElevated ? 'bg-amber-400' : 'bg-[#00f3ff]';

  return (
    <div className="hud-card-magenta p-5 rounded-lg space-y-6 border border-[#ff00ff]/30 relative overflow-hidden">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ff00ff]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ff00ff]/10 border border-[#ff00ff] rounded shadow-[0_0_12px_rgba(255,0,255,0.4)]">
            <Cpu className="w-5 h-5 text-[#ff00ff] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-orbitron text-[#ff00ff] glow-magenta">
                AI SYNTHESIS REPORT
              </h2>
              <span className="text-[9px] font-mono bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/40 px-1.5 py-0.5 rounded">
                GEMINI 3.6 FLASH
              </span>
            </div>
            <p className="text-xs font-mono text-white/60">
              Generative Cyber Threat Intelligence & Satellite Risk Analysis
            </p>
          </div>
        </div>

        <button
          onClick={handleRunSynthesis}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-[#ff00ff]/20 hover:bg-[#ff00ff] text-[#ff00ff] hover:text-black border border-[#ff00ff]/50 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'SYNTHESIZING...' : 'RE-RUN AI ANALYSIS'}</span>
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Score Gauge */}
        <div className="bg-black/70 p-4 border border-[#ff00ff]/30 rounded-lg flex flex-col justify-between relative">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-white/60 font-bold uppercase">CYBER RISK SCORE</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border border-current ${scoreColor}`}>
              {report.threatLevel}
            </span>
          </div>

          <div className="my-4 text-center">
            <div className={`text-5xl font-black font-orbitron ${scoreColor} drop-shadow-[0_0_15px_rgba(255,0,255,0.4)]`}>
              {score}<span className="text-xl text-white/40">/100</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden p-0.5 border border-white/20">
              <div
                className={`h-full rounded-full transition-all duration-700 ${scoreBg}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>

          <p className="text-[10px] font-mono text-white/50 text-center">
            Generated: {new Date(report.generatedAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Geomagnetic & SEU Telemetry */}
        <div className="bg-black/70 p-4 border border-white/10 rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-white/60 uppercase">Geomagnetic Storm</span>
            <span className="text-xs font-mono font-bold text-amber-400">{report.geomagneticStormClass}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-white/60 uppercase">SEU Upset Probability</span>
            <span className="text-xs font-mono font-bold text-[#ff00ff]">{report.seuProbability}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 uppercase">Radio Blackout Level</span>
            <span className="text-xs font-mono font-bold text-red-400">R3 - Strong</span>
          </div>
        </div>

        {/* Executive Summary Brief */}
        <div className="bg-black/70 p-4 border border-white/10 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#ff00ff] font-bold uppercase">
            <AlertCircle className="w-4 h-4" /> Mission Control Threat Brief
          </div>
          <p className="text-xs font-mono text-white/80 leading-relaxed text-[11px]">
            {report.summaryReport}
          </p>
        </div>
      </div>

      {/* Cyber Threat Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-black/60 border border-cyan-500/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f3ff] font-bold uppercase">
            <Radio className="w-4 h-4" /> Orbital Satellite Constellation Risk
          </div>
          <p className="text-xs font-mono text-white/70 leading-relaxed">
            {report.satelliteRiskSummary}
          </p>
        </div>

        <div className="p-4 bg-black/60 border border-red-500/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase">
            <ShieldAlert className="w-4 h-4" /> Digital Infrastructure Threat
          </div>
          <p className="text-xs font-mono text-white/70 leading-relaxed">
            {report.cyberInfrastructureThreat}
          </p>
        </div>
      </div>

      {/* Actionable Defense Protocols */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-[#ff00ff] uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4" /> Actionable Cybersecurity Defense Protocols
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {report.mitigationProtocols.map((protocol, idx) => (
            <div
              key={idx}
              className="p-3 bg-black/80 border border-[#ff00ff]/20 rounded text-xs font-mono flex items-start justify-between gap-3 group hover:border-[#ff00ff]/60 transition-all"
            >
              <div className="flex gap-2">
                <span className="text-[#ff00ff] font-bold">[{idx + 1}]</span>
                <span className="text-white/80">{protocol}</span>
              </div>
              <button
                onClick={() => copyToClipboard(protocol, idx)}
                className="text-white/40 hover:text-[#ff00ff] p-1 shrink-0 transition-colors cursor-pointer"
                title="Copy protocol command"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
