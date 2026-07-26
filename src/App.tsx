import React, { useState, useEffect } from 'react';
import { Header, ViewProfile } from './components/Header';
import { SatelliteIntelligence } from './components/SatelliteIntelligence';
import { AISynthesis } from './components/AISynthesis';
import { OrbitalThreatMap } from './components/OrbitalThreatMap';
import { ResearchHub } from './components/ResearchHub';
import { FieldIncidentLogger } from './components/FieldIncidentLogger';
import { PiKioskHUD } from './components/PiKioskHUD';

import { fetchSolarFlares, fetchCMEs, fetchNTRSReports, SolarFlare, CoronalMassEjection, NTRSReport } from './services/nasaApi';
import { ThreatReport, generateThreatIntelligenceReport } from './services/geminiSynthesis';
import { useOfflineSyncManager } from './services/offlineSync';
import { FieldLogEntry, subscribeToFieldLogs } from './firebase';

import { Shield, Radio, Cpu, Sparkles, HardDrive, WifiOff } from 'lucide-react';

export default function App() {
  const [viewProfile, setViewProfile] = useState<ViewProfile>('DESKTOP');
  
  // Services & State
  const syncManager = useOfflineSyncManager();
  
  const [flares, setFlares] = useState<SolarFlare[]>([]);
  const [cmes, setCmes] = useState<CoronalMassEjection[]>([]);
  const [ntrsReports, setNtrsReports] = useState<NTRSReport[]>([]);
  const [threatReport, setThreatReport] = useState<ThreatReport | null>(null);
  const [fieldLogs, setFieldLogs] = useState<FieldLogEntry[]>([]);

  const [isLoadingNasa, setIsLoadingNasa] = useState<boolean>(true);
  const [isOfflineNasa, setIsOfflineNasa] = useState<boolean>(false);
  const [isLoadingNtrs, setIsLoadingNtrs] = useState<boolean>(false);

  // Initial Load & Real-time Subscriptions
  const loadNasaTelemetry = async () => {
    setIsLoadingNasa(true);
    try {
      const [flrRes, cmeRes] = await Promise.all([
        fetchSolarFlares(),
        fetchCMEs()
      ]);

      setFlares(flrRes.data);
      setCmes(cmeRes.data);
      setIsOfflineNasa(flrRes.isOffline || cmeRes.isOffline);

      // Auto-synthesize initial threat report
      const initialReport = await generateThreatIntelligenceReport(flrRes.data, cmeRes.data);
      setThreatReport(initialReport);
    } catch (err) {
      console.error('Telemetry load error:', err);
    } finally {
      setIsLoadingNasa(false);
    }
  };

  const loadNTRSData = async (queryStr: string = "satellite cybersecurity") => {
    setIsLoadingNtrs(true);
    try {
      const res = await fetchNTRSReports(queryStr);
      setNtrsReports(res.data);
    } catch (err) {
      console.error('NTRS load error:', err);
    } finally {
      setIsLoadingNtrs(false);
    }
  };

  useEffect(() => {
    loadNasaTelemetry();
    loadNTRSData();

    // Subscribe to Firestore Real-Time Field Logs
    const unsubscribe = subscribeToFieldLogs((logs) => {
      setFieldLogs(logs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-[#00f3ff] selection:text-black flex flex-col relative overflow-x-hidden">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

      {/* Header */}
      <Header
        viewProfile={viewProfile}
        setViewProfile={setViewProfile}
        isOnline={syncManager.isOnline}
        cachePercentage={syncManager.cachePercentage}
        latencyMs={syncManager.latencyMs}
        isSyncing={syncManager.isSyncing}
        onForceSync={syncManager.forceReSync}
        pendingLogsCount={syncManager.pendingLogsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 relative z-10">
        {/* Offline Banner Alert if Network Disconnected */}
        {!syncManager.isOnline && (
          <div className="bg-amber-950/80 border-2 border-amber-500 text-amber-200 p-3 rounded-lg flex items-center justify-between text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                <strong>OFFLINE MODE ACTIVE:</strong> Serving cached NASA space telemetry and local IndexedDB store. Logs queued for Firebase sync.
              </span>
            </div>
            <span className="font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/50">
              {syncManager.cachePercentage}% Local Storage Verified
            </span>
          </div>
        )}

        {/* VIEW PROFILE 1: Raspberry Pi 4 Dedicated Kiosk HUD */}
        {viewProfile === 'PI_KIOSK' && (
          <PiKioskHUD
            isOnline={syncManager.isOnline}
            cachePercentage={syncManager.cachePercentage}
            onForceSync={syncManager.forceReSync}
            isSyncing={syncManager.isSyncing}
          />
        )}

        {/* VIEW PROFILE 2: Field Mobile Sentinel Stream */}
        {viewProfile === 'MOBILE' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="hud-card p-4 rounded-lg border border-[#00f3ff]/40 text-center">
              <h2 className="text-lg font-black font-orbitron text-[#00f3ff] glow-cyan">
                FIELD SENTINEL (MOBILE)
              </h2>
              <p className="text-xs font-mono text-white/60">
                Optimized for Field Mobile Alerts & Incident Reporting
              </p>
            </div>

            <AISynthesis
              report={threatReport}
              flares={flares}
              cmes={cmes}
              onReportGenerated={(newReport) => setThreatReport(newReport)}
            />

            <FieldIncidentLogger
              logs={fieldLogs}
              isOnline={syncManager.isOnline}
              onLogSaved={syncManager.forceReSync}
            />

            <SatelliteIntelligence
              flares={flares}
              cmes={cmes}
              isOfflineData={isOfflineNasa}
              onRefresh={loadNasaTelemetry}
              isLoading={isLoadingNasa}
            />
          </div>
        )}

        {/* VIEW PROFILE 3: Mission Control Workstation (Desktop) */}
        {viewProfile === 'DESKTOP' && (
          <div className="space-y-6">
            {/* Top Grid: Satellite Intelligence + AI Synthesis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <SatelliteIntelligence
                  flares={flares}
                  cmes={cmes}
                  isOfflineData={isOfflineNasa}
                  onRefresh={loadNasaTelemetry}
                  isLoading={isLoadingNasa}
                />
              </div>

              <div className="lg:col-span-5">
                <AISynthesis
                  report={threatReport}
                  flares={flares}
                  cmes={cmes}
                  onReportGenerated={(newReport) => setThreatReport(newReport)}
                />
              </div>
            </div>

            {/* Orbital Interactive Threat Map */}
            <OrbitalThreatMap />

            {/* Bottom Grid: Field Incident Logger + NTRS Research Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <FieldIncidentLogger
                  logs={fieldLogs}
                  isOnline={syncManager.isOnline}
                  onLogSaved={syncManager.forceReSync}
                />
              </div>

              <div className="lg:col-span-7">
                <ResearchHub
                  reports={ntrsReports}
                  onSearch={loadNTRSData}
                  isLoading={isLoadingNtrs}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sci-Fi Footer */}
      <footer className="border-t border-[#00f3ff]/30 bg-black py-3 px-6 text-[10px] font-mono text-white/50 flex flex-col sm:flex-row justify-between items-center gap-2 z-10 mt-auto">
        <div className="flex gap-4 flex-wrap">
          <span>PROJECT: ATLAS-C2A97</span>
          <span>FIREBASE: REALTIME FIRESTORE & AUTH</span>
          <span>NASA DONKI & NTRS OPEN APIS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#00f3ff] font-bold">COMPETITION_READY</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-white">RASPBERRY PI 4 / DESKTOP / MOBILE</span>
        </div>
      </footer>
    </div>
  );
}
