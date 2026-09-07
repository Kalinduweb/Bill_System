import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA in standalone window
  if (isInstalled) {
    return (
      <div
        id="pwa-installed-badge"
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/80"
        title="Running as installed standalone web application"
      >
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed App</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={async () => {
          setIsInstalling(true);
          try {
            await install();
          } finally {
            setIsInstalling(false);
          }
        }}
        disabled={isInstalling}
        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        title="Install this invoice generator as a standalone desktop or mobile application"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
          title="Install on iOS Safari"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div
            id="ios-install-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-semibold text-slate-900">Install on iPhone & iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-indigo-600 shadow-xs">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold mb-0.5">1. Tap the Share button</strong>
                    <span>In your Safari toolbar at the bottom or top of your screen.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-indigo-600 shadow-xs">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-800 font-semibold mb-0.5">2. Add to Home Screen</strong>
                    <span>Scroll down the action sheet and tap <em>"Add to Home Screen"</em>.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser notice if not yet triggered beforeinstallprompt
  return (
    <button
      id="pwa-install-info-btn"
      onClick={() => {
        alert(
          'To install this web app:\n\n1. In Chrome / Edge: Click the install icon (⊕) in the URL address bar.\n2. Once installed, it works completely offline like native desktop software!'
        );
      }}
      className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition"
      title="Install as offline desktop software"
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>App Software</span>
    </button>
  );
};
