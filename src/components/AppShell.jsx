import React, { useState } from "react";
import { Home as HomeIcon, Wrench, Star } from "lucide-react";
import Home from "./Home";
import LessonWorkspace from "./LessonWorkspace";
import Tools from "./Tools";
import Premium from "./Premium";

export default function AppShell({ lessons, setLessons, onToast, apiKey, onOpenSettings, installBanner }) {
  const [tab, setTab] = useState("home");
  const [openLessonId, setOpenLessonId] = useState(null);
  const openLesson = lessons.find((l) => l.id === openLessonId);

  function updateLesson(next) {
    setLessons((prev) => prev.map((l) => (l.id === next.id ? next : l)));
  }

  let content;
  if (openLesson) {
    content = (
      <LessonWorkspace
        lesson={openLesson}
        onChange={updateLesson}
        onBack={() => setOpenLessonId(null)}
        onToast={onToast}
        apiKey={apiKey}
        onOpenSettings={onOpenSettings}
      />
    );
  } else if (tab === "home") {
    content = <Home lessons={lessons} onOpenLesson={setOpenLessonId} installBanner={installBanner} />;
  } else if (tab === "tools") {
    content = <Tools onToast={onToast} />;
  } else {
    content = <Premium onToast={onToast} />;
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 70, background: "var(--bg-muted)" }}>
      {content}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--border)", display: "flex", padding: "8px 10px calc(8px + env(safe-area-inset-bottom))", zIndex: 30 }}>
        <button className={`tc-nav-item ${tab === "home" && !openLesson ? "active" : ""}`} onClick={() => { setTab("home"); setOpenLessonId(null); }}>
          <HomeIcon size={20} /> Tomorrow
        </button>
        <button className={`tc-nav-item ${tab === "tools" && !openLesson ? "active" : ""}`} onClick={() => { setTab("tools"); setOpenLessonId(null); }}>
          <Wrench size={20} /> Tools
        </button>
        <button className={`tc-nav-item ${tab === "premium" && !openLesson ? "active" : ""}`} onClick={() => { setTab("premium"); setOpenLessonId(null); }}>
          <Star size={20} /> Premium
        </button>
      </nav>
    </div>
  );
}
