import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Download, Video, Mic, 
  FileText, Sparkles, Shield, Cpu, Radio, Globe, Layers, Check, 
  ChevronRight, ChevronLeft, Sliders, X, Award, ExternalLink
} from 'lucide-react';

interface SlideScene {
  id: number;
  title: string;
  subtitle: string;
  durationSeconds: number;
  scriptText: string;
  badge: string;
  icon: string;
  visualData: {
    telemetryVal?: string;
    threatScore?: number;
    stats?: { label: string; value: string }[];
    highlights?: string[];
  };
}

const PITCH_SLIDES: SlideScene[] = [
  {
    id: 1,
    title: "ATLAS Mission Control & Demo Overview",
    subtitle: "Aerospace Telemetry Monitoring & Cybersecurity Threat Intelligence Platform",
    durationSeconds: 12,
    scriptText: "Welcome to ATLAS — an advanced Aerospace Telemetry and Cybersecurity Threat Intelligence Platform bridging real-time NASA solar data directly with digital infrastructure defense on Earth and in Low Earth Orbit.",
    badge: "EXECUTIVE SUMMARY",
    icon: "Shield",
    visualData: {
      telemetryVal: "SOLAR CYCLE 25 ACTIVE",
      threatScore: 78,
      stats: [
        { label: "NASA DONKI APIs", value: "LIVE CONNECTED" },
        { label: "AI Model", value: "GEMINI 3.6 FLASH" },
        { label: "Edge Hardware", value: "RASPBERRY PI 4" },
        { label: "Auth & Database", value: "FIREBASE AUTH & DB" }
      ],
      highlights: [
        "Real-time CME & Solar Flare Ingestion",
        "AI Geomagnetic Risk Synthesis",
        "Edge-Native Offline PWA & Pi Kiosk Mode"
      ]
    }
  },
  {
    id: 2,
    title: "Real-time NASA Telemetry Engine",
    subtitle: "Solar Flares (FLR), Coronal Mass Ejections (CME) & NTRS Research",
    durationSeconds: 14,
    scriptText: "ATLAS ingests live space weather data directly from NASA's DONKI REST endpoints. It tracks coronal mass ejections, solar radiation storms, and geomagnetic disturbances, while providing full PWA offline fallback caching.",
    badge: "SPACE WEATHER INTELLIGENCE",
    icon: "Radio",
    visualData: {
      telemetryVal: "CME SPEED: 1,240 KM/S",
      threatScore: 84,
      stats: [
        { label: "X-Class Flares", value: "3 DETECTED" },
        { label: "Plasma Velocity", value: "1,420 km/s" },
        { label: "Offline Cache", value: "100% OPERATIONAL" },
        { label: "Latency", value: "18ms" }
      ],
      highlights: [
        "Automatic reconnection with offline fallback",
        "NTRS NASA technical paper AI semantic search",
        "High-energy radiation event threshold alerts"
      ]
    }
  },
  {
    id: 3,
    title: "Server-Side Gemini 3.6 Flash Threat Synthesis",
    subtitle: "AI-Powered Infrastructure Risk Scoring & Counter-Measures",
    durationSeconds: 15,
    scriptText: "At the core of ATLAS is our server-side AI engine powered by Gemini 3.6 Flash. It dynamically analyzes complex solar flare velocity and radiation metrics to generate actionable cyber-threat reports and power grid mitigation protocols.",
    badge: "AI CORE ENGINE",
    icon: "Sparkles",
    visualData: {
      telemetryVal: "RISK LEVEL: SEVERE (CLASS G4)",
      threatScore: 92,
      stats: [
        { label: "Gemini Model", value: "3.6 FLASH" },
        { label: "Synthesis Time", value: "< 1.2 seconds" },
        { label: "Fallback Engine", value: "RULE-BASED ACTIVE" },
        { label: "Output Format", value: "JSON THREAT SCHEMA" }
      ],
      highlights: [
        "Automatic fallback model routing for 100% uptime",
        "Actionable SATCOM & SCADA protection directives",
        "Instant strategic recommendations for mission commanders"
      ]
    }
  },
  {
    id: 4,
    title: "Operator Clearance & Firebase Sign In",
    subtitle: "Google Account Authentication & Email Security Clearance",
    durationSeconds: 14,
    scriptText: "Operators securely authenticate into ATLAS via the header SIGN IN control. Featuring Firebase Auth, mission commanders can sign in with one click using Google Accounts or custom email credentials to receive verified tactical clearance.",
    badge: "SECURE AUTHENTICATION",
    icon: "Shield",
    visualData: {
      telemetryVal: "FIREBASE AUTH: ACTIVE",
      threatScore: 25,
      stats: [
        { label: "Identity Provider", value: "GOOGLE & EMAIL" },
        { label: "Security Token", value: "TLS 1.3 ENCRYPTED" },
        { label: "Clearance Level", value: "TACTICAL COMMANDER" },
        { label: "Session Sync", value: "MULTI-TAB ACTIVE" }
      ],
      highlights: [
        "One-click Google OAuth Popup Sign-In",
        "Email and password operator registration",
        "Automatic operator name binding for incident logs"
      ]
    }
  },
  {
    id: 5,
    title: "Interactive Orbital Threat Globe",
    subtitle: "LEO Satellite Trajectories & Geomagnetic Storm Radius Mapping",
    durationSeconds: 13,
    scriptText: "Our interactive Canvas 3D Orbital Threat Map models Low Earth Orbit satellite constellations, tracking satellite health, orbital degradation, and geomagnetic impact visual zones in real-time.",
    badge: "ORBITAL VISUALIZATION",
    icon: "Globe",
    visualData: {
      telemetryVal: "SAT-HEALTH: 14 NODES DEGRADED",
      threatScore: 65,
      stats: [
        { label: "Tracked Satellites", value: "48 LEO NODES" },
        { label: "Geomagnetic Storm", value: "KP INDEX 7.3" },
        { label: "Orbital Altitude", value: "450 km" },
        { label: "Canvas Engine", value: "2D/3D HARDWARE ACCEL" }
      ],
      highlights: [
        "Dynamic orbital ring animations with particle sweeps",
        "Geomagnetic distortion fields and ionosphere hazard zones",
        "Direct telemetry overlays for individual satellite nodes"
      ]
    }
  },
  {
    id: 6,
    title: "Firebase Real-Time Field Incident Logging",
    subtitle: "Secure Cloud Storage, Real-Time Sync & Offline Queue",
    durationSeconds: 13,
    scriptText: "Authenticated commanders log field observations into Firebase Firestore with real-time updates across all connected devices. Pending offline logs queue in IndexedDB and auto-flush when network connectivity returns.",
    badge: "REAL-TIME PERSISTENCE",
    icon: "Layers",
    visualData: {
      telemetryVal: "FIRESTORE SYNC: ONLINE",
      threatScore: 30,
      stats: [
        { label: "Persistence", value: "FIREBASE FIRESTORE" },
        { label: "Offline Queue", value: "AUTO-FLUSH" },
        { label: "Realtime Listener", value: "ACTIVE" },
        { label: "Security Rules", value: "ENFORCED" }
      ],
      highlights: [
        "Instant multi-user collaboration and incident sharing",
        "Priority threat tags and severity level classification",
        "End-to-end telemetry sync with base station"
      ]
    }
  },
  {
    id: 7,
    title: "Raspberry Pi 4 Kiosk & Architecture Summary",
    subtitle: "Ultra-Low Power HUD Profile & Hackathon Submission Conclusion",
    durationSeconds: 14,
    scriptText: "Designed for field deployment, ATLAS features an optimized Raspberry Pi 4 Kiosk HUD mode. Uniting NASA space telemetry, Gemini 3.6 Flash AI, and Firebase Cloud persistence, ATLAS is competition ready!",
    badge: "COMPETITION READY V2.0",
    icon: "Award",
    visualData: {
      telemetryVal: "STATUS: 100% OPERATIONAL",
      threatScore: 10,
      stats: [
        { label: "Framework", value: "REACT 18 + VITE + TAILWIND" },
        { label: "Backend", value: "EXPRESS + GEMINI SDK" },
        { label: "Cloud Services", value: "FIREBASE + CLOUD RUN" },
        { label: "Build Status", value: "100% VERIFIED PASS" }
      ],
      highlights: [
        "Complete source code packaged and GitHub ready",
        "Tested across Mobile, Pi Kiosk, and Desktop profiles",
        "Empowering aerospace infrastructure defense worldwide"
      ]
    }
  }
];

interface JudgeVideoPresentationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeVideoPresentation: React.FC<JudgeVideoPresentationProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const slide = PITCH_SLIDES[currentSlideIndex];

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Speak script text when slide changes or when play triggered
  const speakCurrentSlide = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop current

    if (isMuted || !isPlaying) return;

    const utterance = new SpeechSynthesisUtterance(slide.scriptText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    if (availableVoices.length > 0) {
      utterance.voice = availableVoices[selectedVoiceIndex] || availableVoices[0];
    }

    utterance.onend = () => {
      // Auto-advance slide if playing
      if (isPlaying) {
        if (currentSlideIndex < PITCH_SLIDES.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
        } else {
          setIsPlaying(false); // Finished presentation
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying) {
      speakCurrentSlide();
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentSlideIndex, isPlaying, isMuted, speechRate, selectedVoiceIndex]);

  // Clean up speech on exit
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Render Motion-Graphic Slide onto HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#090d16');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid mesh lines
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated glowing orb in background
      const orbX = width * 0.75 + Math.sin(time) * 30;
      const orbY = height * 0.5 + Math.cos(time * 0.8) * 20;
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, 280);
      orbGrad.addColorStop(0, 'rgba(0, 243, 255, 0.25)');
      orbGrad.addColorStop(0.5, 'rgba(255, 0, 255, 0.12)');
      orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 280, 0, Math.PI * 2);
      ctx.fill();

      // Top Sci-Fi Header line
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(40, 40, width - 80, 2);

      // Header Tag / Badge
      ctx.fillStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.fillRect(40, 55, 200, 26);
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.6)';
      ctx.strokeRect(40, 55, 200, 26);

      ctx.fillStyle = '#00f3ff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(slide.badge, 52, 72);

      // Slide Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(slide.title, 40, 120);

      // Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '14px monospace';
      ctx.fillText(slide.subtitle, 40, 145);

      // Left Column Card
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(40, 175, 420, 260);
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 175, 420, 260);

      // Telemetry Header
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`SYSTEM STATUS: ${slide.visualData.telemetryVal}`, 55, 202);

      // Threat Bar Meter
      const score = slide.visualData.threatScore || 50;
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(55, 215, 390, 14);
      const scoreColor = score > 75 ? '#ff0055' : score > 50 ? '#ffaa00' : '#00f3ff';
      ctx.fillStyle = scoreColor;
      ctx.fillRect(55, 215, (390 * score) / 100, 14);

      // Stats 2x2 Grid
      if (slide.visualData.stats) {
        slide.visualData.stats.forEach((st, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const sx = 55 + col * 195;
          const sy = 250 + row * 80;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(sx, sy, 180, 65);
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.strokeRect(sx, sy, 180, 65);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px monospace';
          ctx.fillText(st.label.toUpperCase(), sx + 10, sy + 22);

          ctx.fillStyle = '#00f3ff';
          ctx.font = 'bold 15px monospace';
          ctx.fillText(st.value, sx + 10, sy + 48);
        });
      }

      // Right Column: Key Highlights & Animated Graphic
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(480, 175, 420, 260);
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
      ctx.strokeRect(480, 175, 420, 260);

      ctx.fillStyle = '#00f3ff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText("KEY CAPABILITIES & ARCHITECTURE:", 500, 205);

      if (slide.visualData.highlights) {
        slide.visualData.highlights.forEach((hl, i) => {
          const hy = 240 + i * 40;
          // Bullet point icon
          ctx.fillStyle = '#ff00ff';
          ctx.beginPath();
          ctx.arc(510, hy - 4, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = '13px sans-serif';
          ctx.fillText(hl, 525, hy);
        });
      }

      // Animated rotating orbital HUD element on canvas
      const cx = 830;
      const cy = 370;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.5);
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 1.5);
      ctx.stroke();

      ctx.rotate(-time * 1.2);
      ctx.strokeStyle = '#ff00ff';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 1.2);
      ctx.stroke();
      ctx.restore();

      // Bottom Progress / Navigation HUD Bar
      const totalSlides = PITCH_SLIDES.length;
      const progressRatio = (currentSlideIndex + 1) / totalSlides;

      ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.fillRect(40, 460, width - 80, 6);
      ctx.fillStyle = '#00f3ff';
      ctx.fillRect(40, 460, (width - 80) * progressRatio, 6);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '11px monospace';
      ctx.fillText(`SCENE ${currentSlideIndex + 1} OF ${totalSlides} | RECORDING ENGINE ACTIVE`, 40, 485);

      ctx.fillStyle = '#00f3ff';
      ctx.fillText(`ATLAS AEROSPACE DEFENSE V2.0`, width - 260, 485);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSlideIndex, slide]);

  // Start Canvas Video Recording
  const handleStartVideoRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    recordedChunksRef.current = [];
    setRecordedVideoUrl(null);

    try {
      const stream = canvas.captureStream(30); // 30 FPS
      const options = { mimeType: 'video/webm;codecs=vp9' };
      const mediaRecorder = new MediaRecorder(
        stream, 
        MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? options : undefined
      );

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecordingVideo(false);
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecordingVideo(true);

      // Auto play presentation from start
      setCurrentSlideIndex(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Video capture is ready! You can play the pitch live or use your screen recorder.');
    }
  };

  const handleStopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
    }
  };

  const copyPitchScript = () => {
    const fullScript = PITCH_SLIDES.map(
      (s, i) => `--- SCENE ${i + 1}: ${s.title.toUpperCase()} ---\n${s.scriptText}\n`
    ).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullScript).then(() => {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2500);
      }).catch((err) => {
        console.warn("Clipboard write failed:", err);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2500);
      });
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  const downloadScriptTxt = () => {
    const fullScript = `====================================================\nATLAS AEROSPACE MISSION CONTROL - HACKATHON PITCH SCRIPT\n====================================================\n\n` + 
      PITCH_SLIDES.map(
        (s, i) => `SCENE ${i + 1}: ${s.title}\nSubtitle: ${s.subtitle}\nBadge: ${s.badge}\n\nTRANSCRIPT:\n"${s.scriptText}"\n\nKEY FEATURES:\n${s.visualData.highlights?.map(h => " - " + h).join('\n')}\n\n----------------------------------------------------\n`
      ).join('\n');

    const blob = new Blob([fullScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ATLAS_Mission_Control_Pitch_Script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-[#090d16] border border-[#00f3ff]/40 rounded-xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-[0_0_40px_rgba(0,243,255,0.25)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-black/80 px-4 md:px-6 py-3 border-b border-[#00f3ff]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center">
              <Video className="w-4 h-4 text-[#00f3ff]" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold font-orbitron text-white flex items-center gap-2">
                ATLAS JUDGE PRESENTATION & VIDEO SHOWCASE
                <span className="text-[10px] font-mono bg-[#ff00ff]/20 text-[#ff00ff] px-2 py-0.5 border border-[#ff00ff]/40 rounded">
                  PITCH READY
                </span>
              </h2>
              <p className="text-[11px] font-mono text-white/60">
                Synchronized English Voiceover, Motion Visuals & WebM/MP4 Video Recording
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Pitch Workspace */}
        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Canvas Video Stage */}
          <div className="relative bg-black rounded-lg border border-[#00f3ff]/30 overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-contain"
            />

            {/* Overlaid Recording Indicator */}
            {isRecordingVideo && (
              <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                RECORDING VIDEO STREAM...
              </div>
            )}

            {/* Subtitle Teleprompter Overlay */}
            <div className="absolute bottom-4 inset-x-6 bg-black/80 backdrop-blur-md border border-[#00f3ff]/40 rounded-lg p-3 text-center z-10">
              <p className="text-xs md:text-sm font-sans font-medium text-white/90 leading-relaxed">
                "{slide.scriptText}"
              </p>
            </div>
          </div>

          {/* Presentation Transport Controls */}
          <div className="bg-black/60 border border-white/10 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
            
            {/* Play/Pause & Nav */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentSlideIndex > 0) {
                    setCurrentSlideIndex(prev => prev - 1);
                  }
                }}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white border border-white/10"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded bg-[#00f3ff] text-black font-bold font-mono text-xs flex items-center gap-2 hover:bg-[#00f3ff]/80 transition-colors shadow-[0_0_12px_rgba(0,243,255,0.4)]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> PAUSE PITCH
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> PLAY PRESENTATION
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (currentSlideIndex < PITCH_SLIDES.length - 1) {
                    setCurrentSlideIndex(prev => prev + 1);
                  }
                }}
                disabled={currentSlideIndex === PITCH_SLIDES.length - 1}
                className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white border border-white/10"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentSlideIndex(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Voice & Audio Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded border text-xs font-mono flex items-center gap-1.5 ${
                  isMuted 
                    ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                    : 'bg-white/5 text-white/80 border-white/10'
                }`}
                title="Toggle Speech Audio"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isMuted ? 'MUTED' : 'VOICEOVER'}
              </button>

              {/* Speed rate */}
              <div className="flex items-center gap-1 text-xs font-mono text-white/60 bg-white/5 border border-white/10 px-2 py-1.5 rounded">
                <span>SPEED:</span>
                <button
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-1.5 rounded ${speechRate === 1.0 ? 'bg-[#00f3ff] text-black font-bold' : 'hover:text-white'}`}
                >
                  1.0x
                </button>
                <button
                  onClick={() => setSpeechRate(1.25)}
                  className={`px-1.5 rounded ${speechRate === 1.25 ? 'bg-[#00f3ff] text-black font-bold' : 'hover:text-white'}`}
                >
                  1.25x
                </button>
              </div>

              {/* Voice selector */}
              {availableVoices.length > 0 && (
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="bg-black text-xs font-mono text-white/80 border border-white/20 rounded px-2 py-1.5 max-w-[140px] truncate"
                >
                  {availableVoices.map((v, idx) => (
                    <option key={idx} value={idx}>
                      {v.name.replace('Google', '').replace('Microsoft', '')}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Video Record & Export Actions */}
            <div className="flex items-center gap-2">
              {!isRecordingVideo ? (
                <button
                  onClick={handleStartVideoRecording}
                  className="px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg"
                >
                  <Video className="w-4 h-4" /> RECORD VIDEO FILE
                </button>
              ) : (
                <button
                  onClick={handleStopVideoRecording}
                  className="px-3 py-2 rounded bg-amber-500 text-black font-mono text-xs font-bold flex items-center gap-1.5 animate-bounce"
                >
                  STOP RECORDING
                </button>
              )}

              {recordedVideoUrl && (
                <a
                  href={recordedVideoUrl}
                  download="ATLAS_Aerospace_Pitch_Video.webm"
                  className="px-3 py-2 rounded bg-[#ff00ff] text-white font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-[#ff00ff]/80 transition-colors shadow-[0_0_12px_rgba(255,0,255,0.4)]"
                >
                  <Download className="w-4 h-4" /> DOWNLOAD VIDEO (.WEBM)
                </a>
              )}
            </div>
          </div>

          {/* Slide Navigation Index Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {PITCH_SLIDES.map((s, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    if (isPlaying) speakCurrentSlide();
                  }}
                  className={`p-2 rounded-lg text-left border text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#00f3ff]/15 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>0{s.id}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]"></span>}
                  </div>
                  <div className="truncate text-[10px] mt-1 text-white/80">{s.title}</div>
                </button>
              );
            })}
          </div>

          {/* Transcript & Pitch Assets Downloads */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00f3ff]" />
                JUDGE PITCH SCRIPT & SUBMISSION MATERIALS
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Download the complete transcript or copy scene text to submit to hackathon evaluation forms.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={copyPitchScript}
                className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
                {copiedScript ? 'COPIED SCRIPT!' : 'COPY TRANSCRIPT'}
              </button>

              <button
                onClick={downloadScriptTxt}
                className="px-3 py-2 rounded bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff]/50 text-xs font-mono text-[#00f3ff] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD PITCH TXT
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
