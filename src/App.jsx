import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import Landing from "./components/Landing";
import AppShell from "./components/AppShell";
import SettingsModal from "./components/SettingsModal";
import LessonFormModal from "./components/LessonFormModal";
import HelpModal from "./components/HelpModal";
import { Toast } from "./components/Shared";
import { createLesson } from "./lib/data";
import { loadLessons, saveLessons, loadApiKey, saveApiKey } from "./lib/storage";
import { BUILD_TIME_API_KEY } from "./lib/groq";

const SEEN_INTRO_KEY = "tc_seen_intro";

export default function App() {
  // Skip the welcome screen after the very first visit — a returning
  // teacher should land straight on tomorrow's lessons, not a splash page.
  const [screen, setScreen] = useState(() => {
    try { return localStorage.getItem(SEEN_INTRO_KEY) === "true" ? "app" : "landing"; }
    catch { return "landing"; }
  });

  const [lessons, setLessons] = useState(() => loadLessons() || []);
  const [toast, setToast] = useState(null);
  const [apiKey, setApiKey] = useState(() => loadApiKey() || BUILD_TIME_API_KEY);
  const [showSettings, setShowSettings] = useState(false);
  const [lessonForm, setLessonForm] = useState(null); // null | { mode: "add" } | { mode: "edit", lesson }
  const [showHelp, setShowHelp] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissedInstall, setDismissedInstall] = useState(false);

  useEffect(() => { saveLessons(lessons); }, [lessons]);

  useEffect(() => {
    function handler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function showToast(msg) { setToast(msg); }

  function handleStart() {
    try { localStorage.setItem(SEEN_INTRO_KEY, "true"); } catch { /* ignore */ }
    setScreen("app");
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") showToast("Installing…");
    setDeferredPrompt(null);
  }

  function handleSaveLesson(fields) {
    if (lessonForm?.mode === "edit") {
      setLessons((prev) => prev.map((l) => (l.id === lessonForm.lesson.id ? { ...l, ...fields } : l)));
      showToast("Lesson updated");
    } else {
      setLessons((prev) => [...prev, createLesson(fields)]);
      showToast("Lesson added");
    }
    setLessonForm(null);
  }

  function handleDeleteLesson(id) {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    setLessonForm(null);
    showToast("Lesson deleted");
  }

  const installBanner = deferredPrompt && !dismissedInstall ? (
    <div className="tc-install-banner">
      <Download size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13.5, color: "var(--text)" }}>Install for one-tap access, even offline.</div>
      <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={handleInstall}>Install</button>
      <button
        aria-label="Dismiss"
        onClick={() => setDismissedInstall(true)}
        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
      >
        <X size={16} />
      </button>
    </div>
  ) : null;

  return (
    <>
      {screen === "landing" ? (
        <Landing onStart={handleStart} />
      ) : (
        <AppShell
          lessons={lessons}
          setLessons={setLessons}
          onToast={showToast}
          apiKey={apiKey}
          onOpenSettings={() => setShowSettings(true)}
          installBanner={installBanner}
          onAddLesson={() => setLessonForm({ mode: "add" })}
          onEditLesson={(lesson) => setLessonForm({ mode: "edit", lesson })}
          onShowHelp={() => setShowHelp(true)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={(key) => {
            setApiKey(key);
            saveApiKey(key);
            showToast(key ? "AI connected" : "AI key cleared");
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
      {lessonForm && (
        <LessonFormModal
          lesson={lessonForm.mode === "edit" ? lessonForm.lesson : null}
          onSave={handleSaveLesson}
          onDelete={handleDeleteLesson}
          onClose={() => setLessonForm(null)}
        />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
