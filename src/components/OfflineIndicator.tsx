import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CloudCheck } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowReconnected(false);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div
        id="offline-banner"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-xl shadow-amber-900/20 border border-amber-400/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        role="status"
        aria-live="polite"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <WifiOff className="w-4 h-4 text-amber-100 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="leading-tight">Offline Mode Enabled</span>
          <span className="text-[10px] font-normal text-amber-100/90 leading-tight">
            All bill edits, calculations, and PDF generation work seamlessly offline.
          </span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div
        id="online-reconnected-banner"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-xl shadow-emerald-900/20 border border-emerald-400/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        role="status"
        aria-live="polite"
      >
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Back Online — System ready for email dispatch</span>
      </div>
    );
  }

  return null;
};
