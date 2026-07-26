import React, { useState } from 'react';
import { NTRSReport, fetchNTRSReports } from '../services/nasaApi';
import { BookOpen, Search, ExternalLink, FileText, Sparkles, User, Calendar, Tag } from 'lucide-react';

interface ResearchHubProps {
  reports: NTRSReport[];
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const ResearchHub: React.FC<ResearchHubProps> = ({
  reports,
  onSearch,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('satellite cybersecurity');
  const [activeReport, setActiveReport] = useState<NTRSReport | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="hud-card p-5 rounded-lg space-y-5 border border-[#00f3ff]/30">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00f3ff]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00f3ff]/10 border border-[#00f3ff] rounded shadow-[0_0_10px_rgba(0,243,255,0.3)]">
            <BookOpen className="w-5 h-5 text-[#00f3ff]" />
          </div>
          <div>
            <h2 className="text-xl font-black font-orbitron text-[#00f3ff] glow-cyan">
              RESEARCH HUB — NASA TECHNICAL REPORTS (NTRS)
            </h2>
            <p className="text-xs font-mono text-white/60">
              Curated Educational Hub for Satellite Vulnerabilities & Aerospace Cyber Defense
            </p>
          </div>
        </div>

        {/* NTRS Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NASA NTRS..."
              className="pl-8 pr-3 py-1 bg-black/80 border border-[#00f3ff]/40 rounded text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#00f3ff] w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-1 bg-[#00f3ff] text-black font-mono font-bold text-xs rounded hover:bg-white transition-all cursor-pointer"
          >
            {isLoading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </form>
      </div>

      {/* Reports List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 bg-black/70 border border-white/10 rounded-lg flex flex-col justify-between space-y-3 hover:border-[#00f3ff]/60 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono bg-[#00f3ff]/20 text-[#00f3ff] px-1.5 py-0.5 border border-[#00f3ff]/40 rounded flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {report.subjectCategory || 'Space Cyber Defense'}
                </span>
                <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {report.publicationDate}
                </span>
              </div>

              <h3 className="text-xs font-bold font-orbitron text-white group-hover:text-[#00f3ff] transition-colors line-clamp-2">
                {report.title}
              </h3>

              <div className="flex items-center gap-1 text-[10px] font-mono text-white/50">
                <User className="w-3 h-3" />
                <span className="truncate">{report.author}</span>
              </div>

              <p className="text-[11px] font-mono text-white/70 line-clamp-3 leading-relaxed">
                {report.abstract}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setActiveReport(report)}
                className="text-[10px] font-mono text-[#ff00ff] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> AI EXECUTIVE BRIEF
              </button>

              <a
                href={report.pdfUrl || `https://ntrs.nasa.gov/citations/${report.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-[#00f3ff] hover:underline flex items-center gap-1"
              >
                <FileText className="w-3 h-3" /> NASA NTRS <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Report Brief Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="hud-card-magenta max-w-2xl w-full p-6 rounded-lg space-y-4 border border-[#ff00ff]/50 relative">
            <button
              onClick={() => setActiveReport(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-mono text-sm cursor-pointer"
            >
              ✕ CLOSE
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff00ff]" />
              <span className="text-xs font-mono font-bold text-[#ff00ff] uppercase">
                AI EXECUTIVE SUMMARY — NASA TECHNICAL PAPER
              </span>
            </div>

            <h3 className="text-base font-bold font-orbitron text-white">
              {activeReport.title}
            </h3>

            <div className="p-4 bg-black/80 border border-[#ff00ff]/30 rounded text-xs font-mono text-white/80 space-y-3">
              <p>
                <strong>NASA Authors:</strong> {activeReport.author}
              </p>
              <p>
                <strong>Publication Reference:</strong> {activeReport.id} ({activeReport.publicationDate})
              </p>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[#ff00ff] font-bold mb-1">[ KEY CYBERSECURITY TAKEAWAYS ]</p>
                <ul className="list-disc pl-5 space-y-1 text-white/70">
                  <li>Detailed vulnerability models for commercial low-cost CubeSat electronics facing high-energy solar particle events.</li>
                  <li>Highlights software-defined radio filtering for mitigating GPS ionospheric signal degradation during G3-G5 storms.</li>
                  <li>Recommends autonomous ARM64 edge nodes (like Raspberry Pi 4) to execute local telemetry checksum validation.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded cursor-pointer"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
