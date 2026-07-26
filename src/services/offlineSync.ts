import { useState, useEffect } from 'react';
import { saveFieldLog, FieldLogEntry } from '../firebase';

export interface SyncStatus {
  isOnline: boolean;
  cachePercentage: number;
  pendingOfflineLogsCount: number;
  lastSyncedTime: string;
  latencyMs: number;
}

export function useOfflineSyncManager() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [cachePercentage, setCachePercentage] = useState<number>(88);
  const [pendingLogsCount, setPendingLogsCount] = useState<number>(0);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString());
  const [latencyMs, setLatencyMs] = useState<number>(24);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Check pending offline logs count
  const checkPendingLogs = () => {
    try {
      const offlineLogs: FieldLogEntry[] = JSON.parse(localStorage.getItem('atlas_offline_logs') || '[]');
      setPendingLogsCount(offlineLogs.length);
    } catch {
      setPendingLogsCount(0);
    }
  };

  // Sync offline queued logs to Firebase when network is restored
  const syncOfflineQueue = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);

    try {
      const offlineLogs: FieldLogEntry[] = JSON.parse(localStorage.getItem('atlas_offline_logs') || '[]');
      if (offlineLogs.length > 0) {
        for (const log of offlineLogs) {
          await saveFieldLog({
            deviceNode: log.deviceNode,
            operator: log.operator,
            severity: log.severity,
            category: log.category,
            message: log.message,
            threatScore: log.threatScore
          });
        }
        localStorage.removeItem('atlas_offline_logs');
        setPendingLogsCount(0);
      }
      setLastSyncedTime(new Date().toLocaleTimeString());
      setCachePercentage(100);
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    checkPendingLogs();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setCachePercentage(88); // High cached offline buffer state
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Latency pulse simulation
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setLatencyMs(Math.floor(18 + Math.random() * 14));
      } else {
        setLatencyMs(0);
      }
      checkPendingLogs();
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    cachePercentage,
    pendingLogsCount,
    lastSyncedTime,
    latencyMs,
    isSyncing,
    forceReSync: syncOfflineQueue
  };
}
