import React, { useState } from 'react';
import { Shield, RefreshCw, Radio, HardDrive, Cpu, Smartphone, Monitor, Github, Copy, Check, Download, ExternalLink, X, Video, User as UserIcon, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';

export type ViewProfile = 'DESKTOP' | 'MOBILE' | 'PI_KIOSK';

interface HeaderProps {
  viewProfile: ViewProfile;
  setViewProfile: (profile: ViewProfile) => void;
  isOnline: boolean;
  cachePercentage: number;
  latencyMs: number;
  isSyncing: boolean;
  onForceSync: () => void;
  pendingLogsCount: number;
  onOpenJudgeVideo?: () => void;
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewProfile,
  setViewProfile,
  isOnline,
  cachePercentage,
  latencyMs,
  isSyncing,
  onForceSync,
  pendingLogsCount,
  onOpenJudgeVideo,
  currentUser,
  onOpenAuthModal,
}) => {
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const gitCommands = `# 1. Initialize local Git repository
git init

# 2. Add all source files
git add .

# 3. Create initial commit
git commit -m "feat: initial release of ATLAS Aerospace Security Platform"

# 4. Link to your GitHub repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ATLAS-Aerospace-Platform.git

# 5. Push to GitHub
git push -u origin main`;

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedCmd(label);
        setTimeout(() => setCopiedCmd(null), 2000);
      }).catch((err) => {
        console.warn("Clipboard write failed:", err);
        setCopiedCmd(label);
        setTimeout(() => setCopiedCmd(null), 2000);
      });
    } else {
      setCopiedCmd(label);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  return (
    <>
      <header className="border-b border-[#00f3ff]/30 bg-black/80 backdrop-blur-md z-30 sticky top-0 px-4 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-baseline gap-3">
            <div className="w-9 h-9 bg-[#00f3ff]/10 border border-[#00f3ff] flex items-center justify-center rounded shadow-[0_0_12px_rgba(0,243,255,0.4)]">
              <Shield className="w-5 h-5 text-[#00f3ff]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-orbitron tracking-tighter text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] leading-none">
                ATLAS
              </h1>
              <p className="text-[9px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                AEROSPACE SECURITY & TELEMETRY PLATFORM
              </p>
            </div>
            <span className="hidden sm:inline-block text-[9px] font-mono bg-[#00f3ff]/20 text-[#00f3ff] px-2 py-0.5 border border-[#00f3ff]/50 rounded">
              V.2.0.4-COMPETITION
            </span>
          </div>

          {/* View Profile Mobile Selector Toggle */}
          <div className="flex md:hidden items-center bg-black/60 border border-[#00f3ff]/30 rounded p-1">
            <button
              onClick={() => setViewProfile('DESKTOP')}
              className={`p-1.5 rounded text-xs ${viewProfile === 'DESKTOP' ? 'bg-[#00f3ff] text-black font-bold' : 'text-white/60'}`}
              title="Desktop Mission Control"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewProfile('MOBILE')}
              className={`p-1.5 rounded text-xs ${viewProfile === 'MOBILE' ? 'bg-[#00f3ff] text-black font-bold' : 'text-white/60'}`}
              title="Field Mobile Sentinel"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewProfile('PI_KIOSK')}
              className={`p-1.5 rounded text-xs ${viewProfile === 'PI_KIOSK' ? 'bg-[#00f3ff] text-black font-bold' : 'text-white/60'}`}
              title="Raspberry Pi 4 Edge Node"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Factor Mode Switcher for Desktop */}
        <div className="hidden md:flex items-center gap-1 bg-black/80 border border-[#00f3ff]/30 p-1 rounded-md">
          <button
            onClick={() => setViewProfile('DESKTOP')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              viewProfile === 'DESKTOP'
                ? 'bg-[#00f3ff] text-black font-bold box-glow-cyan'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Mission Control</span>
          </button>
          <button
            onClick={() => setViewProfile('MOBILE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              viewProfile === 'MOBILE'
                ? 'bg-[#00f3ff] text-black font-bold box-glow-cyan'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Field Sentinel</span>
          </button>
          <button
            onClick={() => setViewProfile('PI_KIOSK')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              viewProfile === 'PI_KIOSK'
                ? 'bg-[#ff00ff] text-black font-bold box-glow-magenta'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Raspberry Pi 4 HUD</span>
          </button>
        </div>

        {/* Live System Status Telemetry & GitHub Export */}
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider flex-wrap justify-end">
          {/* Judge Video Pitch Button */}
          {onOpenJudgeVideo && (
            <button
              onClick={onOpenJudgeVideo}
              className="flex items-center gap-1.5 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff] text-[#00f3ff] px-3 py-1 rounded text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] cursor-pointer animate-pulse"
              title="Open Interactive Video Pitch & Audio Presentation for Judges"
            >
              <Video className="w-4 h-4 text-[#00f3ff]" />
              <span>🎥 PITCH VIDEO FOR JUDGES</span>
            </button>
          )}

          {/* Operator Sign In / Authentication Button */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer border ${
                currentUser 
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/60 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                  : 'bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 border-[#00f3ff]/60 text-[#00f3ff]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.email || 'Operator'}` : "Sign In / Register"}
            >
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-4 h-4 rounded-full" />
              ) : currentUser ? (
                <UserIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <LogIn className="w-4 h-4 text-[#00f3ff]" />
              )}
              <span>{currentUser ? (currentUser.displayName || currentUser.email?.split('@')[0] || 'COMMANDER').toUpperCase() : 'SIGN IN'}</span>
            </button>
          )}

          {/* GitHub Export Helper */}
          <button
            onClick={() => setShowGithubModal(true)}
            className="flex items-center gap-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 px-3 py-1 rounded text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] cursor-pointer"
            title="GitHub Export & Submission Helper"
          >
            <Github className="w-4 h-4 text-purple-400" />
            <span>EXPORT TO GITHUB</span>
          </button>

          {/* Firebase Live Indicator */}
          <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 border border-white/10 rounded">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-green-400 font-bold hidden lg:inline">Firebase Live</span>
          </div>

          {/* Offline Cache & Sync Indicator */}
          <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 border border-[#00f3ff]/20 rounded">
            <HardDrive className="w-3 h-3 text-white/70" />
            <span className="text-white/70">{cachePercentage}% Local Cache</span>
            {pendingLogsCount > 0 && (
              <span className="bg-[#ff00ff] text-black px-1.5 py-0.2 rounded text-[9px] font-bold animate-pulse">
                {pendingLogsCount} Queued
              </span>
            )}
          </div>

          {/* Network & Force Re-Sync */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${isOnline ? 'text-green-400' : 'text-amber-400'}`}>
              {isOnline ? `${latencyMs}ms` : 'OFFLINE MODE'}
            </span>
            <button
              onClick={onForceSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-[#00f3ff]/10 hover:bg-[#00f3ff] text-[#00f3ff] hover:text-black border border-[#00f3ff]/50 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest transition-all cursor-pointer"
              title="Force Re-Sync Firebase & Local Cache"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'SYNCING...' : 'FORCE SYNC'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* GitHub Export Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#05050a] border-2 border-purple-500/80 rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.3)] font-sans relative">
            <button
              onClick={() => setShowGithubModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-purple-500/30 pb-4">
              <Github className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <h2 className="text-xl font-black font-orbitron text-purple-300 tracking-wider">
                  EXPORT PROJECT TO GITHUB
                </h2>
                <p className="text-xs font-mono text-white/60">
                  Step-by-step instructions for competition submission.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-purple-950/40 border border-purple-800/50 p-4 rounded-lg space-y-2 text-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-2">
                    <Download className="w-4 h-4" /> METHOD A: EXPORT ZIP / GITHUB VIA AI STUDIO MENU
                  </span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Look at the top-right corner or Settings menu of the AI Studio workspace. Click <strong>"Export to GitHub"</strong> or <strong>"Download ZIP"</strong> to get the full, clean codebase directly!
                </p>
              </div>

              <div className="bg-black/80 border border-white/20 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-[#00f3ff]" /> METHOD B: GIT TERMINAL COMMANDS
                  </span>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'commands')}
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all"
                  >
                    {copiedCmd === 'commands' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'commands' ? 'COPIED!' : 'COPY ALL'}</span>
                  </button>
                </div>

                <pre className="p-3 bg-black border border-white/10 rounded text-[11px] text-green-400 overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
                  {gitCommands}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGithubModal(false)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

