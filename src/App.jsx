import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import Landing from "./components/Landing";
import AppShell from "./components/AppShell";
import SettingsModal from "./components/SettingsModal";
import { Toast } from "./components/Shared";
import { INITIAL_LESSONS } from "./lib/data";
import { BUILD_TIME_API_KEY } from "./lib/groq";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [toast, setToast] = useState(null);
  const [apiKey, setApiKey] = useState(BUILD_TIME_API_KEY);
  const [showSettings, setShowSettings] = useState(false);

  // Standard PWA "Add to Home Screen" flow: the browser fires this event
  // when the app meets installability criteria (manifest + service worker
  // + served over HTTPS). We stash the event and trigger it from our own
  // banner instead of the browser's default mini-infobar.
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissedInstall, setDismissedInstall] = useState(false);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function showToast(msg) { setToast(msg); }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") showToast("Installing Tomorrow's Class…");
    setDeferredPrompt(null);
  }

  const installBanner = deferredPrompt && !dismissedInstall ? (
    <div className="tc-install-banner">
      <Download size={18} color="#E8A659" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13.5 }}>Install Tomorrow's Class for one-tap access, even offline.</div>
      <button className="tc-btn tc-btn-dawn tc-btn-sm" onClick={handleInstall}>Install</button>
      <button
        aria-label="Dismiss"
        onClick={() => setDismissedInstall(true)}
        style={{ background: "none", border: "none", color: "#C7CCE3", cursor: "pointer", padding: 4 }}
      >
        <X size={16} />
      </button>
    </div>
  ) : null;

  return (
    <>
      {screen === "landing" ? (
        <Landing onStart={() => setScreen("app")} />
      ) : (
        <AppShell
          lessons={lessons}
          setLessons={setLessons}
          onToast={showToast}
          apiKey={apiKey}
          onOpenSettings={() => setShowSettings(true)}
          installBanner={installBanner}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={(key) => { setApiKey(key); showToast(key ? "AI connected" : "AI key cleared"); }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
