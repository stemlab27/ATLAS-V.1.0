import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

import firebaseConfigJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId
};

const databaseId = firebaseConfigJson.firestoreDatabaseId || undefined;

// Initialize Firebase safely
let app: ReturnType<typeof initializeApp> | undefined;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (err) {
  console.warn('Firebase initializeApp warning:', err);
}

// Initialize Firestore
let db: ReturnType<typeof getFirestore> | null = null;
if (app) {
  try {
    if (databaseId) {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      }, databaseId);
    } else {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    }
  } catch {
    try {
      db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    } catch (e2) {
      console.warn('Firestore initialization fallback:', e2);
      db = null;
    }
  }
}

// Initialize Auth
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

export { db };

// Auth helper functions
export async function loginWithGoogle() {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string) {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function registerWithEmail(email: string, pass: string) {
  if (!auth) throw new Error("Firebase Auth not initialized");
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export interface FieldLogEntry {
  id?: string;
  timestamp: string;
  deviceNode: string; // e.g., 'Raspberry Pi 4 (Edge)', 'Mission Control Workstation', 'Field Mobile'
  operator: string;
  severity: 'CRITICAL' | 'ELEVATED' | 'NOMINAL' | 'INFO';
  category: 'SOLAR_FLARE' | 'CME_IMPACT' | 'SATELLITE_DRIFT' | 'CYBER_DEFENSE' | 'EDGE_SYNC';
  message: string;
  threatScore?: number;
  offlineCreated?: boolean;
}

// Function to save field/incident log to Firebase
export async function saveFieldLog(log: Omit<FieldLogEntry, 'id' | 'timestamp'>): Promise<string> {
  const fullLog = {
    ...log,
    timestamp: new Date().toISOString(),
    createdAt: Timestamp.now()
  };

  try {
    if (!db) throw new Error("Firestore database not initialized");
    const docRef = await addDoc(collection(db, 'atlas_field_logs'), fullLog);
    return docRef.id;
  } catch (error) {
    console.warn('Firebase online save failed, queuing in local storage:', error);
    // Offline queue fallback
    const offlineQueue: FieldLogEntry[] = JSON.parse(localStorage.getItem('atlas_offline_logs') || '[]');
    const newOfflineEntry: FieldLogEntry = {
      ...fullLog,
      id: `local-${Date.now()}`,
      offlineCreated: true
    };
    offlineQueue.push(newOfflineEntry);
    localStorage.setItem('atlas_offline_logs', JSON.stringify(offlineQueue));
    return newOfflineEntry.id!;
  }
}

const DEFAULT_DEMO_LOGS: FieldLogEntry[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    deviceNode: 'Raspberry Pi 4 (Kiosk)',
    operator: 'CADET_ALPHA',
    severity: 'CRITICAL',
    category: 'SOLAR_FLARE',
    message: 'X2.8 Solar Flare ionization detected. Automated satellite safe mode attitude engaged for ISS & Sentinel-6 array.',
    threatScore: 92
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    deviceNode: 'Mission Control (Workstation)',
    operator: 'COMMANDER_RIVERA',
    severity: 'ELEVATED',
    category: 'SATELLITE_DRIFT',
    message: 'Ionospheric drag increase noted in LEO Starlink cluster #402. Orbit height adjustment maneuver scheduled.',
    threatScore: 68
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    deviceNode: 'Field Mobile Sentinel',
    operator: 'FIELD_AGENT_07',
    severity: 'NOMINAL',
    category: 'EDGE_SYNC',
    message: 'Raspberry Pi 4 local SQLite telemetry buffer synced with Firebase Cloud store via encrypted 5G relay.',
    threatScore: 24
  }
];

// Subscribe to real-time field logs from Firestore
export function subscribeToFieldLogs(callback: (logs: FieldLogEntry[]) => void) {
  const getFallbackLogs = (): FieldLogEntry[] => {
    try {
      const localQueue: FieldLogEntry[] = JSON.parse(localStorage.getItem('atlas_offline_logs') || '[]');
      return localQueue.length > 0 ? localQueue : DEFAULT_DEMO_LOGS;
    } catch {
      return DEFAULT_DEMO_LOGS;
    }
  };

  try {
    if (!db) {
      console.warn('Firestore db not available, returning local storage logs');
      callback(getFallbackLogs());
      return () => {};
    }

    const q = query(
      collection(db, 'atlas_field_logs'),
      orderBy('createdAt', 'desc'),
      limit(25)
    );

    return onSnapshot(q, (snapshot) => {
      const logs: FieldLogEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          timestamp: data.timestamp || new Date().toISOString(),
          deviceNode: data.deviceNode || 'Node-Alpha',
          operator: data.operator || 'SYSTEM',
          severity: data.severity || 'INFO',
          category: data.category || 'EDGE_SYNC',
          message: data.message || '',
          threatScore: data.threatScore
        });
      });

      // Merge local offline-queued logs if present
      const localQueue: FieldLogEntry[] = JSON.parse(localStorage.getItem('atlas_offline_logs') || '[]');
      const combined = [...localQueue, ...logs];
      callback(combined.length > 0 ? combined : DEFAULT_DEMO_LOGS);
    }, (error) => {
      console.warn('Firestore subscription error, loading cached/local logs:', error);
      callback(getFallbackLogs());
    });
  } catch (err) {
    console.error('Failed to set up Firestore listener:', err);
    callback(getFallbackLogs());
    return () => {};
  }
}

