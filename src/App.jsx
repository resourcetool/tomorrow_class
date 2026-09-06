import React, { useState, useEffect, useMemo } from "react";
import { Download, X } from "lucide-react";
import Landing from "./components/Landing";
import AppShell from "./components/AppShell";
import SettingsModal from "./components/SettingsModal";
import LessonFormModal from "./components/LessonFormModal";
import ManageCoursesModal from "./components/ManageCoursesModal";
import SchemeOfWorkModal from "./components/SchemeOfWorkModal";
import HelpModal from "./components/HelpModal";
import { Toast } from "./components/Shared";
import { createCourse, createLessonInstance, computeWeekNumber, findSowEntry, nextNDates, formatDayLabel, formatShortDayLabel } from "./lib/data";
import {
  loadCourses, saveCourses, loadInstances, saveInstances,
  loadApiKey, saveApiKey, loadTermStart, saveTermStart, loadCurrentTerm, saveCurrentTerm,
  requestPersistentStorage, exportBackup,
} from "./lib/storage";
import { BUILD_TIME_API_KEY } from "./lib/groq";

const SEEN_INTRO_KEY = "tc_seen_intro";

export default function App() {
  // Skip the welcome screen after the very first visit.
  const [screen, setScreen] = useState(() => {
    try { return localStorage.getItem(SEEN_INTRO_KEY) === "true" ? "app" : "landing"; }
    catch { return "landing"; }
  });

  const [courses, setCourses] = useState(() => loadCourses() || []);
  const [lessonInstances, setLessonInstances] = useState(() => loadInstances() || []);
  const [apiKey, setApiKey] = useState(() => loadApiKey() || BUILD_TIME_API_KEY);
  const [termStartDate, setTermStartDate] = useState(() => loadTermStart());
  const [currentTerm, setCurrentTerm] = useState(() => loadCurrentTerm());

  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [courseForm, setCourseForm] = useState(null); // null | { mode: "add" } | { mode: "edit", course }
  const [manageCoursesOpen, setManageCoursesOpen] = useState(false);
  const [sowCourse, setSowCourse] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissedInstall, setDismissedInstall] = useState(false);

  useEffect(() => { requestPersistentStorage(); }, []);
  useEffect(() => { saveCourses(courses); }, [courses]);
  useEffect(() => { saveInstances(lessonInstances); }, [lessonInstances]);
  useEffect(() => { saveTermStart(termStartDate); }, [termStartDate]);
  useEffect(() => { saveCurrentTerm(currentTerm); }, [currentTerm]);

  useEffect(() => {
    function handler(e) { e.preventDefault(); setDeferredPrompt(e); }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const PLAN_AHEAD_DAYS = 7;
  const horizon = useMemo(() => nextNDates(PLAN_AHEAD_DAYS), []);

  // Auto-create a lesson instance for every course scheduled on each of the
  // next 7 days (not just tomorrow), pre-filled from the Scheme of Work if
  // a matching week exists — so a class can be prepared ahead of time, on
  // whichever day the teacher actually has time for it.
  useEffect(() => {
    const additions = [];
    horizon.forEach(({ date, weekday }) => {
      courses.forEach((c) => {
        if (!c.days.includes(weekday)) return;
        const exists = lessonInstances.some((li) => li.courseId === c.id && li.date === date);
        if (exists) return;
        const week = computeWeekNumber(date, termStartDate) || 1;
        const sowEntry = findSowEntry(c, currentTerm, week);
        const instance = createLessonInstance(c, date, sowEntry);
        instance.term = currentTerm;
        instance.week = week;
        additions.push(instance);
      });
    });
    if (additions.length > 0) {
      setLessonInstances((prev) => [...prev, ...additions]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, horizon]);

  // Day 0 is always shown (even empty, for the "no classes tomorrow" state);
  // later days are included only once they actually have a class scheduled.
  const upcomingDays = horizon
    .map(({ date }) => ({
      date,
      label: formatDayLabel(date),
      shortLabel: formatShortDayLabel(date),
      instances: lessonInstances.filter((li) => li.date === date),
    }))
    .filter((day, i) => i === 0 || day.instances.length > 0);

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

  function handleSaveCourse(fields) {
    if (courseForm?.mode === "edit") {
      setCourses((prev) => prev.map((c) => (c.id === courseForm.course.id ? { ...c, ...fields } : c)));
      showToast("Class updated");
    } else {
      setCourses((prev) => [...prev, createCourse(fields)]);
      showToast("Class added");
    }
    setCourseForm(null);
  }

  function handleDeleteCourse(id) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setLessonInstances((prev) => prev.filter((li) => li.courseId !== id));
    setCourseForm(null);
    setManageCoursesOpen(false);
    showToast("Class deleted");
  }

  function handleSaveSow(updatedCourse) {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    showToast("Scheme of Work saved");
  }

  function handleImportBackup(data) {
    setCourses(Array.isArray(data.courses) ? data.courses : []);
    setLessonInstances(Array.isArray(data.lessonInstances) ? data.lessonInstances : []);
    if (data.termStartDate) setTermStartDate(data.termStartDate);
    if (data.currentTerm) setCurrentTerm(data.currentTerm);
    showToast("Backup restored");
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
          courses={courses}
          upcomingDays={upcomingDays}
          setLessonInstances={setLessonInstances}
          onToast={showToast}
          apiKey={apiKey}
          onOpenSettings={() => setShowSettings(true)}
          installBanner={installBanner}
          onAddCourse={() => setCourseForm({ mode: "add" })}
          onManageCourses={() => setManageCoursesOpen(true)}
          onShowHelp={() => setShowHelp(true)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          termStartDate={termStartDate}
          currentTerm={currentTerm}
          onSaveApiKey={(key) => { setApiKey(key); saveApiKey(key); showToast(key ? "AI connected" : "AI key cleared"); }}
          onSaveTerm={(term, startDate) => { setCurrentTerm(term); setTermStartDate(startDate); showToast("Term settings saved"); }}
          onExport={() => { exportBackup({ courses, lessonInstances, termStartDate, currentTerm }); showToast("Backup downloaded"); }}
          onImport={handleImportBackup}
          onToast={showToast}
          onClose={() => setShowSettings(false)}
        />
      )}

      {courseForm && (
        <LessonFormModal
          course={courseForm.mode === "edit" ? courseForm.course : null}
          onSave={handleSaveCourse}
          onDelete={handleDeleteCourse}
          onManageSow={(course) => { setCourseForm(null); setSowCourse(course); }}
          onClose={() => setCourseForm(null)}
        />
      )}

      {manageCoursesOpen && (
        <ManageCoursesModal
          courses={courses}
          onEdit={(course) => { setManageCoursesOpen(false); setCourseForm({ mode: "edit", course }); }}
          onAdd={() => { setManageCoursesOpen(false); setCourseForm({ mode: "add" }); }}
          onClose={() => setManageCoursesOpen(false)}
        />
      )}

      {sowCourse && (
        <SchemeOfWorkModal
          course={sowCourse}
          onSave={handleSaveSow}
          onClose={() => setSowCourse(null)}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
