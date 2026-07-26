import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, LogIn, LogOut, Shield, Key, Mail, Lock, 
  Check, AlertCircle, Sparkles, X, UserCheck, Smartphone, Cpu 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  subscribeToAuth 
} from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      setSuccessMsg('Successfully authenticated via Google Identity');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setError(err?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email address and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (authMode === 'LOGIN') {
        await loginWithEmail(email, password);
        setSuccessMsg('Commander clearance verified. Access granted.');
      } else {
        await registerWithEmail(email, password);
        setSuccessMsg('New operator credentials registered successfully!');
      }
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Email Auth error:', err);
      let msg = err?.message || 'Authentication failed';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid credentials. Check email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'This email is already registered. Switch to Sign In.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setSuccessMsg('Operator signed out securely');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-[#00f3ff]/40 rounded-xl max-w-md w-full shadow-[0_0_35px_rgba(0,243,255,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black/80 px-6 py-4 border-b border-[#00f3ff]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center text-[#00f3ff]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-white text-sm tracking-wide">
                OPERATOR AUTHENTICATION
              </h3>
              <p className="font-mono text-[10px] text-white/60 uppercase">
                ATLAS Mission Control Security Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Active Logged-In User Profile */}
          {currentUser ? (
            <div className="space-y-4">
              <div className="bg-[#00f3ff]/10 border border-[#00f3ff]/40 rounded-lg p-4 flex items-center gap-4">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Operator'}
                    className="w-12 h-12 rounded-full border border-[#00f3ff]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#00f3ff]/20 border border-[#00f3ff] flex items-center justify-center text-[#00f3ff]">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="font-orbitron font-bold text-white text-sm truncate">
                    {currentUser.displayName || 'MISSION_OPERATOR'}
                  </div>
                  <div className="font-mono text-xs text-[#00f3ff] truncate">
                    {currentUser.email || 'AUTHENTICATED_SESSION'}
                  </div>
                  <div className="font-mono text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <UserCheck className="w-3 h-3" />
                    STATUS: SECURE_CLEARANCE_ACTIVE
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-xs space-y-1 text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/50">UID:</span>
                  <span className="truncate max-w-[180px]">{currentUser.uid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">ROLE:</span>
                  <span className="text-[#00f3ff] font-bold">TACTICAL_COMMANDER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">FIRESTORE SYNC:</span>
                  <span className="text-emerald-400">ENABLED</span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-red-400/30"
              >
                <LogOut className="w-4 h-4" />
                TERMINATE SESSION & SIGN OUT
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div className="space-y-4">
              
              {/* Status Alert Banner */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-3 text-red-400 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {successMsg && (
                <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg p-3 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Fast Google Auth */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md group cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                SIGN IN WITH GOOGLE ACCOUNTS
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-[1px] bg-white/10 flex-1"></div>
                <span className="font-mono text-[10px] text-white/40 uppercase">OR EMAIL CLEARANCE</span>
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-2 gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setAuthMode('LOGIN'); setError(null); }}
                  className={`py-1.5 rounded transition-colors ${
                    authMode === 'LOGIN' 
                      ? 'bg-[#00f3ff] text-black font-bold' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('REGISTER'); setError(null); }}
                  className={`py-1.5 rounded transition-colors ${
                    authMode === 'REGISTER' 
                      ? 'bg-[#00f3ff] text-black font-bold' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  REGISTER
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/70 mb-1">
                    OPERATOR EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="commander@atlas.space"
                      className="w-full bg-black/70 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#00f3ff] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-white/70 mb-1">
                    CLEARANCE PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/70 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#00f3ff] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? 'AUTHENTICATING...' : authMode === 'LOGIN' ? 'VERIFY CLEARANCE' : 'REGISTER NEW OPERATOR'}
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-black/60 px-6 py-3 border-t border-white/10 font-mono text-[10px] text-white/50 flex items-center justify-between">
          <span>FIREBASE AUTH V12</span>
          <span className="text-[#00f3ff]">ENCRYPTED TLS 1.3</span>
        </div>

      </div>
    </div>
  );
};
